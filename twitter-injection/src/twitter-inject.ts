// ==UserScript==
// @name         SozuCash Twitter Integration (Extension)
// @namespace    SozuCash
// @version      1.1.0
// @description  Integrates SozuCash Wallet into Twitter, injecting UI into the right sidebar via iframe.
// @author       SozuCash Team
// @match        https://twitter.com/*
// @match        https://x.com/*
// @run-at       document-idle
// @icon         https://abs.twimg.com/favicons/twitter.2.ico
// ==/UserScript==

(function() {
    'use strict';

    // --- State Variables ---
    let injectionAttempts = 0;
    const MAX_INJECTION_ATTEMPTS = 10;
    let isSozuUiInjected = false;
    let injectedContainer: HTMLElement | null = null;
    let originalSidebarContent: HTMLElement[] = []; // To store original elements
    let hiddenElementsByClass: HTMLElement[] = []; // NEW: Store elements hidden by specific class
    let overlayElements: HTMLElement[] = []; // Store multiple overlay elements
    let resizeTimeoutId: number | null = null; // Restore for debouncing resize
    
    // Store initial position to maintain it during scroll
    let initialWalletPosition: { top: number; left: number } | null = null;
    let scrollTimeoutId: number | null = null;

    // --- Constants ---
    const walletIconPath = 'M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8zm-7-8.5c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zm0 5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z';
    const INJECTED_CONTAINER_ID = 'sozucash-injected-container';
    const INJECTED_IFRAME_ID = 'sozucash-injected-iframe';
    const HIDE_ORIGINAL_CLASS = 'sozu-hide-original';

    // --- CSS Styles ---
    const componentStyles = `
    /* Button Styles (Keep as before) */
    .sozu-wallet-button {
      display: inline-flex;
      align-items: center;
      height: 50px;
      padding: 0 16px;
      border-radius: 9999px;
      transition: background-color 0.2s;
      text-decoration: none;
      cursor: pointer;
      margin: 4px 0 4px 6px;
      box-sizing: border-box;
      width: auto;
      position: relative;
      color: rgb(231, 233, 234); /* Ensure text color is set */
    }

    .sozu-wallet-button:hover {
      background-color: rgba(231, 233, 234, 0.1);
    }

    .sozu-wallet-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      margin-right: 12px;
    }

    .sozu-wallet-icon img {
      border-radius: 6px; /* Make the icon image rounded */
    }

    .sozu-wallet-icon svg {
      width: 26px;
      height: 26px;
      fill: rgb(231, 233, 234);
      stroke: rgb(231, 233, 234);
      stroke-width: 0.2;
    }

    .sozu-wallet-text {
      font-family: "Segoe UI", Helvetica, Arial, sans-serif;
      color: rgb(231, 233, 234);
      font-size: 20px;
      font-weight: 400;
      letter-spacing: normal;
      margin-right: 0;
      white-space: nowrap;
    }

    /* NEW: Styles for the injected UI container and iframe */
    #${INJECTED_CONTAINER_ID} {
      width: 350px; /* Reduced width */
      height: 600px; /* Fixed height */
      /* max-height: calc(100vh - 80px); */ /* Optional: Limit height based on viewport */
      margin-top: 0; /* Remove margin-top */
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      overflow: hidden;
      position: fixed; /* Restore fixed positioning */
      width: 350px; /* Restore fixed width */
      /* Remove static top/right - position is now relative */
      /* top: 70px; */
      /* right: 15px; */
      z-index: 1000;     /* Keep high z-index */
      pointer-events: auto !important; /* Ensure container is interactive */
      
      /* --- Transition Styles --- */
      opacity: 0;
      filter: blur(8px);
      visibility: hidden;
      transition: opacity 0.5s ease-in-out, filter 0.5s ease-in-out, visibility 0s linear 0.5s;
    }
    
    /* Add visible class for fade-in effect */
    #${INJECTED_CONTAINER_ID}.visible {
        opacity: 1;
        filter: blur(0);
        visibility: visible;
        transition: opacity 0.5s ease-in-out, filter 0.5s ease-in-out, visibility 0s linear 0s;
    }

    #${INJECTED_IFRAME_ID} {
      display: block; /* Remove potential bottom space */
      width: 350px;   /* Reduced width */
      height: 600px;  /* Match popup height */
      border: none;   /* Remove iframe border */
      pointer-events: auto !important; /* Ensure iframe is interactive */
    }

    /* Class to hide original sidebar content - RENAME/REPURPOSE for fade */
    /* .${HIDE_ORIGINAL_CLASS} { display: none !important; } */
    
    /* NEW: Class for fading out original elements - REMOVING, will use inline styles */
    /*
    .sozu-fade-out-original {
        opacity: 0 !important; 
        filter: blur(8px) !important;
        visibility: hidden !important;
        transition: opacity 0.5s ease-in-out, filter 0.5s ease-in-out, visibility 0s linear 0.5s !important;
        pointer-events: none !important; 
    }
    */

    /* NEW: Active state for the button icon */
    .sozu-wallet-button.active .sozu-wallet-icon img {
        filter: invert(1);
    }
    .sozu-wallet-button.active {
        /* REMOVED background and border from active state */
        /* background-color: rgba(231, 233, 234, 0.1); */
        /* border: 1px solid rgba(231, 233, 234, 0.2);  */ 
    }
    
    /* NEW: Media Query for smaller screens */
    @media (max-width: 1280px) { /* Adjust breakpoint as needed */
        .sozu-wallet-button .sozu-wallet-text {
            display: none;
        }
        .sozu-wallet-button .sozu-wallet-icon {
            margin-right: 0; /* Remove margin when text is hidden */
        }
        .sozu-wallet-button {
             padding: 0 12px; /* Adjust padding */
             width: 50px; /* Make it more square */
        }
    }
    `;

    // --- Main Injection Logic ---
    function main() {
      console.log('Sozu: Starting injection process');
      if (document.body) {
        console.log('Sozu: Document body ready, injecting styles');
        injectStyles();
        waitForSidebar();
      } else {
        console.log('Sozu: Waiting for DOMContentLoaded');
        document.addEventListener('DOMContentLoaded', () => {
          console.log('Sozu: DOMContentLoaded fired, injecting styles');
          injectStyles();
          waitForSidebar();
        });
      }

      const observer = new MutationObserver(() => {
        if (!document.querySelector('.sozu-wallet-button')) {
          console.log('Sozu: DOM changed, checking for button injection');
          checkAndInjectButton();
        }
         // If UI was injected but target sidebar/container disappeared, attempt re-injection check
        if (isSozuUiInjected && !document.getElementById(INJECTED_CONTAINER_ID)) {
            console.log("Sozu: Injected UI container not found, attempting to re-inject.");
            // Reset state and try again - might need more sophisticated handling
            isSozuUiInjected = false;
            injectWalletUI();
        }
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    }

    function injectStyles() {
      const styleElement = document.createElement('style');
      styleElement.textContent = componentStyles;
      document.head.appendChild(styleElement);
      console.log('Sozu: Styles injected');
    }

    function waitForSidebar() {
      checkAndInjectButton();
      const interval = setInterval(() => {
        if (checkAndInjectButton() || injectionAttempts >= MAX_INJECTION_ATTEMPTS) {
          clearInterval(interval);
          if (injectionAttempts >= MAX_INJECTION_ATTEMPTS) {
            console.log('Sozu: Max button injection attempts reached');
          }
        }
        injectionAttempts++;
        // console.log(`Sozu: Button injection attempt ${injectionAttempts}`); // Reduce noise
      }, 1000);
    }

    function checkAndInjectButton(): boolean {
      // console.log('Sozu: Checking for button injection'); // Reduce noise
      if (document.querySelector('.sozu-wallet-button')) {
        // console.log('Sozu: Button already exists');
        return true;
      }

      const sidebarNav = document.querySelector('nav[aria-label="Primary"]');
      if (!sidebarNav) {
        // console.log('Sozu: Sidebar navigation not found');
        return false;
      }

      const referenceButton = findReferenceButton(sidebarNav);
      if (!referenceButton) {
        // console.log('Sozu: Reference button not found');
        return false;
      }

      const walletButton = createWalletButton();
      if (referenceButton.parentNode) {
        referenceButton.parentNode.insertBefore(walletButton, referenceButton.nextSibling);
        const otherButtonStyles = window.getComputedStyle(referenceButton);
        walletButton.style.minWidth = otherButtonStyles.minWidth || "auto";
        walletButton.style.left = "-10px"; // Re-apply position adjustment
        console.log('Sozu: Button successfully injected');
        return true;
      }

      // console.log('Sozu: Failed to inject button'); // Reduce noise
      return false;
    }

    function findReferenceButton(navElement: Element): Element | null {
      let refButton = navElement.querySelector('a[aria-label="Grok"], a[aria-label="AI"]');
      if (!refButton) refButton = navElement.querySelector('a[aria-label="Premium"]');
      if (!refButton) {
        const links = navElement.querySelectorAll('a');
        refButton = links.length > 1 ? links[links.length - 2] : links[0]; // Avoid "More" or handle single link case
      }
      return refButton;
    }

    function createWalletButton(): HTMLElement {
      const button = document.createElement('a');
      button.className = 'sozu-wallet-button';
      button.setAttribute('aria-label', 'SozuCash');
      button.href = '#'; // Make it behave like a link for accessibility/styling consistency
      button.addEventListener('click', handleWalletClick);

      // --- Use IMG tag for the icon --- 
      const iconUrl = chrome.runtime.getURL('assets/icons/mantle-mnt-logo.svg');
      
      button.innerHTML = `
        <div class="sozu-wallet-icon">
          <img src="${iconUrl}" alt="SozuCash Icon" style="width: 26px; height: 26px;">
          </img>
        </div>
        <span class="sozu-wallet-text">SozuCash</span>
      `;
      return button;
    }

    // --- Wallet UI Injection/Removal ---

    function handleWalletClick(event: Event) {
      event.preventDefault();
      event.stopPropagation();
      console.log('SozuCash button clicked');

      if (isSozuUiInjected) {
          removeWalletUI();
      } else {
          injectWalletUI();
      }
    }

    function injectWalletUI() {
      console.log('Sozu: Attempting to inject Wallet UI');
      if (isSozuUiInjected) {
          console.log('Sozu: UI already injected.');
          return;
      }

      const sidebarColumn = document.querySelector('div[data-testid="sidebarColumn"]');
      if (!sidebarColumn) {
          console.error("Sozu: Could not find target sidebar column.");
          return;
      }

      // Find the container that holds the sidebar content (search, trends, etc.)
      const sidebarContentContainer = sidebarColumn.querySelector(':scope > div > div') as HTMLElement;
      if (!sidebarContentContainer) {
           console.error("Sozu: Could not find sidebar content container.");
           // Fallback or prevent injection?
           return; 
      }

      // --- Define Specific Selectors ---
      const searchBarSelector = '.css-175oi2r.r-1awozwy.r-aqfbo4.r-kemksi.r-18u37iz.r-1h3ijdo.r-6gpygo.r-15ysp7h.r-1xcajam.r-ipm5af.r-136ojw6.r-1jocfgc';
      // Use the specific element below search ALSO as an alignment target
      const alignmentTargetSelector = '.css-175oi2r.r-kemksi.r-1kqtdi0.r-1867qdf.r-1phboty.r-rs99b7.r-1ifxtd0.r-1udh08x'; 
      const otherElementSelector = '.css-175oi2r.r-1kqtdi0.r-1867qdf.r-1phboty.r-1ifxtd0.r-1udh08x.r-1niwhzg.r-1yadl64';
      // Combine selectors for elements to hide
      const elementsToHideSelector = `${alignmentTargetSelector}, ${otherElementSelector}`;
      // --- End Selectors ---

      // --- Find alignment target and search bar ---
      const alignmentElement = sidebarColumn.querySelector(alignmentTargetSelector) as HTMLElement;
      const searchBarElement = sidebarColumn.querySelector(searchBarSelector) as HTMLElement;
      
      if (!alignmentElement) {
          console.warn('Sozu: Could not find alignment target element using specific selector. Wallet position might be incorrect.');
      }
      if (!searchBarElement) {
            console.warn('Sozu: Could not find search bar element using specific selector. It might get hidden.');
      }
      // --- End Finding Elements --- 
      
      // --- Find the potential overlay elements --- 
      const overlaySelector1 = '.css-175oi2r.r-vacyoi.r-ttdzmv'; // Original overlay
      const overlaySelector2 = '.css-175oi2r.r-1hycxz.r-gtdqiz'; // Newly identified overlay
      overlayElements = []; // Clear previous
      const potentialOverlays = sidebarColumn.querySelectorAll(`${overlaySelector1}, ${overlaySelector2}`);
      
      potentialOverlays.forEach(node => {
          if (node instanceof HTMLElement) {
                console.log(`Sozu: Found potential overlay element (${node.className}), disabling pointer events.`);
                node.style.pointerEvents = 'none'; // Disable pointer events on overlay
                overlayElements.push(node); // Store reference
          }
      });
      if (overlayElements.length === 0) {
           console.warn('Sozu: Could not find any known overlay elements.');
      }
      // --- End Overlay Handling ---
      
      // --- REMOVED Initial position calculation ---
      /*
      let calculatedTop: number;
      let calculatedRight: number;
      const verticalMargin = 12; // Margin below search bar if alignment target fails

      if (alignmentElement) {
          calculatedTop = alignmentElement.getBoundingClientRect().top;
      } else if (searchBarElement) {
          calculatedTop = searchBarElement.getBoundingClientRect().bottom + verticalMargin;
          console.warn('Sozu (inject): Alignment target not found, using search bar bottom for initial top.');
      } else {
          calculatedTop = 65; // Absolute fallback
          console.error('Sozu (inject): Cannot find alignment target OR search bar for initial top positioning!');
      }

      if (searchBarElement) {
          calculatedRight = window.innerWidth - searchBarElement.getBoundingClientRect().right;
      } else {
          calculatedRight = 15; // Absolute fallback
          console.error('Sozu (inject): Cannot find search bar for initial right positioning!');
      }
      console.log(`Sozu (inject): Initial Calculated Top: ${calculatedTop}px, Right: ${calculatedRight}px`);
      */
      // --- End Initial Position Calculation ---

      // Create the wallet container div
      injectedContainer = document.createElement('div');
      injectedContainer.id = INJECTED_CONTAINER_ID;
      // Add direct style offset for left positioning
      injectedContainer.style.marginLeft = '-60px';

      // Create the iframe
      const iframe = document.createElement('iframe');
      iframe.id = INJECTED_IFRAME_ID;

      try {
          // Use chrome.runtime.getURL to get the correct path within the extension
           if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
               // IMPORTANT: Ensure path matches the file location in the BUILT extension (dist folder)
               iframe.src = chrome.runtime.getURL('popup.html');
               console.log(`Sozu: Setting iframe source to: ${iframe.src}`);
           } else {
               throw new Error("`chrome.runtime.getURL` is not available. Cannot load extension page.");
           }
      } catch (e) {
          console.error("Sozu: Error setting iframe source.", e);
          // Display error message instead of iframe
          injectedContainer.innerHTML = '<p style="color: red; padding: 15px;">Error loading SozuCash wallet UI. Check console and ensure `popup/index.html` is in `web_accessible_resources`.</p>';
          // Still append the container with the error message TO BODY
          document.body.appendChild(injectedContainer); 
          console.log('Sozu: Appended error container to document.body');
          
          isSozuUiInjected = true; // Mark as injected (even with error) to allow removal
          // Add active class to button even on error to allow toggle off
          document.querySelector('.sozu-wallet-button')?.classList.add('active');
          return; // Stop further execution for this injection attempt
      }

      // Append iframe to the container
      injectedContainer.appendChild(iframe);

      // --- REMOVED Apply Initial Position BEFORE appending --- 
      /*
      injectedContainer.style.top = `${calculatedTop}px`;
      injectedContainer.style.right = `${calculatedRight}px`;
      */
      // --- End Initial Position Application ---

      // --- Find search bar to insert after --- 
      const searchBarForInsertion = sidebarContentContainer.querySelector(searchBarSelector) as HTMLElement;
      if (!searchBarForInsertion) {
            console.error('Sozu: Cannot find search bar to insert wallet after.');
            // Fallback: Append to end of container?
            sidebarContentContainer.appendChild(injectedContainer);
      } else {
            // Insert the wallet container AFTER the search bar
            searchBarForInsertion.parentNode?.insertBefore(injectedContainer, searchBarForInsertion.nextSibling);
      }
      console.log('Sozu: Appended injected container into sidebar flow.');
      
      // --- Re-enable Hiding specific children NOW --- 
      originalSidebarContent = []; // Clear previous list
      const elementsToHide = sidebarColumn.querySelectorAll(elementsToHideSelector); 

      elementsToHide.forEach((node) => {
          if (node instanceof HTMLElement) { 
              // Double check it's not somehow the search bar
              if (!node.matches(searchBarSelector)) { 
                  originalSidebarContent.push(node); // Store node reference
                  
                  // --- Apply inline styles for fade-out and transition ---
                  console.log(`Sozu: Applying fade-out to: ${node.tagName}.${node.className.split(' ').join('.')}`); // More specific logging
                  node.style.transition = 'opacity 0.5s ease-in-out, filter 0.5s ease-in-out';
                  node.style.opacity = '0';
                  node.style.pointerEvents = 'none';
                  // --- End inline styles ---
              }
          }
      });
      console.log(`Sozu: Applied fade-out to ${originalSidebarContent.length} specific elements.`);
      // --- End Hiding Logic ---
      
      // Add 'visible' class shortly after insertion/hiding to trigger transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { // Double RAF for robustness in some cases
            updateWalletPosition(true); // Calculate and set initial position with 'isInitial' flag
            if (injectedContainer) {
                console.log('Sozu: RAF - Before adding .visible class');
                injectedContainer.classList.add('visible');
                // Log computed styles AFTER adding visible class
                const styles = window.getComputedStyle(injectedContainer);
                console.log(`Sozu: RAF - After adding .visible. Computed - Top: ${styles.top}, Left: ${styles.left}, Opacity: ${styles.opacity}, Visibility: ${styles.visibility}`);
            }
        });
      });

      isSozuUiInjected = true;
      console.log('Sozu: Wallet UI Injected');
      // Add active class to button
      document.querySelector('.sozu-wallet-button')?.classList.add('active');
      
      // Add resize and scroll listeners
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    function removeWalletUI() {
      console.log('Sozu: Attempting to remove Wallet UI');
      if (!isSozuUiInjected || !injectedContainer) {
          console.log('Sozu: UI not injected or container lost.');
          return;
      }

      // Function to actually remove the element from DOM
      const removeElement = () => {
          if (injectedContainer && injectedContainer.parentNode) {
              injectedContainer.parentNode.removeChild(injectedContainer);
              console.log('Sozu: Injected container removed from DOM after transition.');
          } else if (injectedContainer) {
               console.log('Sozu: Injected container parent node not found during removal.');
          }
          injectedContainer = null; // Clear reference
      };

      // Remove the visible class to trigger fade-out
      if (injectedContainer) {
            injectedContainer.classList.remove('visible');
            
            // Wait for transition to end before removing from DOM
            injectedContainer.addEventListener('transitionend', removeElement, { once: true });

            // Fallback timer in case transitionend doesn't fire (e.g., element removed prematurely)
            setTimeout(() => {
                if (document.getElementById(INJECTED_CONTAINER_ID)) {
                    console.warn('Sozu: transitionend did not fire, removing element via timeout.');
                    removeElement();
                }
            }, 600); // Slightly longer than transition duration
            
      } else {
          // If container is somehow already null, just clean up other things
           injectedContainer = null; 
      }

       // --- Re-enable pointer events on overlays ---
       console.log(`Sozu: Re-enabling pointer events on ${overlayElements.length} overlay elements.`);
       overlayElements.forEach(overlay => {
           if (overlay) { // Check if reference is still valid
                overlay.style.pointerEvents = ''; // Reset to default
           }
       });
       overlayElements = []; // Clear references
       // --- End Overlay Handling ---

       // Restore original content (elements hidden below search)
       // --- Re-enable restoring original content --- 
       console.log(`Sozu: Restoring ${originalSidebarContent.length} original elements below search.`);
       originalSidebarContent.forEach(node => {
           // Check if node still exists and has the hiding class before removing
           // Remove the fade-out class to restore visibility/opacity
           if (node instanceof HTMLElement) { // Simplified check
               // Need a tiny delay for display change to register before transition starts
               requestAnimationFrame(() => { 
                 // THEN, trigger the fade-in by resetting inline styles
                 // The transition property should still be set from the fade-out
                 node.style.opacity = ''; // Reset to default (usually 1)
                 node.style.pointerEvents = ''; // Reset pointer events
               });
               
               // Optional: Clean up inline transition style after fade-in
               setTimeout(() => {
                 if(node) { // Check if node still exists
                    node.style.transition = ''; // Clear the transition style
                 }
               }, 500); // Matches transition duration
           }
       });
       originalSidebarContent = []; // Clear the stored nodes

       // ** REMOVED redundant restore logic for hiddenElementsByClass **

      isSozuUiInjected = false;
      console.log('Sozu: Wallet UI Removed');
      // Remove active class from button
      document.querySelector('.sozu-wallet-button')?.classList.remove('active');
      
      // Reset stored position
      initialWalletPosition = null;
      
      // Remove event listeners
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (resizeTimeoutId) {
          clearTimeout(resizeTimeoutId);
          resizeTimeoutId = null;
      }
      if (scrollTimeoutId) {
          clearTimeout(scrollTimeoutId);
          scrollTimeoutId = null;
      }
    }

    // --- Updated Function to calculate and update wallet position --- 
    function updateWalletPosition(isInitial = false) {
        if (!isSozuUiInjected || !injectedContainer) return;
        
        // If we already have a position and this isn't initial calculation or resize,
        // just maintain the existing position
        if (initialWalletPosition && !isInitial) {
            injectedContainer.style.top = `${initialWalletPosition.top}px`;
            injectedContainer.style.left = `${initialWalletPosition.left}px`;
            injectedContainer.style.right = ''; // Ensure right is cleared
            injectedContainer.style.display = 'block'; // Always ensure visibility
            return;
        }
        
        const sidebarColumn = document.querySelector('div[data-testid="sidebarColumn"]');
        if (!sidebarColumn) {
            console.warn('Sozu (updatePosition): Could not find sidebar column.');
            return;
        }
        
        // Find the main content column as reference only (not used for primary alignment)
        const mainContentColumn = document.querySelector('div[data-testid="primaryColumn"]') as HTMLElement;
        
        // Use search bar selector as the reference element for exact alignment
        const searchBarSelector = '.css-175oi2r.r-1awozwy.r-aqfbo4.r-kemksi.r-18u37iz.r-1h3ijdo.r-6gpygo.r-15ysp7h.r-1xcajam.r-ipm5af.r-136ojw6.r-1jocfgc';
        // We're also looking for search bar's parent container for better reference
        const searchBarParentSelector = '.r-1hycxz.r-aqfbo4.r-1l8l4mf.css-175oi2r'; 
        
        const searchBarElement = sidebarColumn.querySelector(searchBarSelector) as HTMLElement;
        const searchBarParent = sidebarColumn.querySelector(searchBarParentSelector) as HTMLElement;
        
        // Small horizontal offset for micro adjustments if needed
        const horizontalOffset = -100; // Increased negative offset to move further left
        
        // Default fallback values
        let fallbackTop = 80;
        let fallbackLeft = 0; // Will be set based on available search elements
        
        // ALIGNMENT STRATEGY:
        // 1. First try to use search bar's exact left position
        // 2. If not available, try parent's exact left
        // 3. If neither is available, use fallback from window width
        
        if (searchBarElement) {
            const searchBarRect = searchBarElement.getBoundingClientRect();
            fallbackLeft = searchBarRect.left + horizontalOffset;
            console.log(`Sozu (updatePosition): Using search bar left: ${fallbackLeft}px`);
        } 
        else if (searchBarParent) {
            const parentRect = searchBarParent.getBoundingClientRect();
            fallbackLeft = parentRect.left + horizontalOffset;
            console.log(`Sozu (updatePosition): Using search bar parent left: ${fallbackLeft}px`);
        }
        else {
            // Last resort fallback
            fallbackLeft = window.innerWidth - 400;
            console.log(`Sozu (updatePosition): Using window-based fallback: ${fallbackLeft}px`);
        }

        if (!searchBarElement) {
            console.warn('Sozu (updatePosition): Could not find reference search bar. Using fallback position.');
            
            injectedContainer.style.top = `${fallbackTop}px`;
            injectedContainer.style.left = `${fallbackLeft}px`;
            
            // Still store position as initial if this is the first calculation
            if (isInitial) {
                initialWalletPosition = { top: fallbackTop, left: fallbackLeft };
                console.log(`Sozu (updatePosition): Stored fallback initial position - Top: ${fallbackTop}px, Left: ${fallbackLeft}px`);
            }
            return;
        }
        
        const searchBarRect = searchBarElement.getBoundingClientRect();
        
        // If search bar exists but has no dimensions, use fallback
        if (searchBarRect.width === 0 || searchBarRect.height === 0) {
            console.warn('Sozu (updatePosition): Reference search bar found but has no dimensions. Using fallback position.');
            
            injectedContainer.style.top = `${fallbackTop}px`;
            injectedContainer.style.left = `${fallbackLeft}px`;
            
            // Store position as initial if this is the first calculation
            if (isInitial) {
                initialWalletPosition = { top: fallbackTop, left: fallbackLeft };
                console.log(`Sozu (updatePosition): Stored fallback initial position - Top: ${fallbackTop}px, Left: ${fallbackLeft}px`);
            }
            return;
        }
        
        // Always ensure wallet is visible
        injectedContainer.style.display = 'block';
        
        // Calculate top based on reference bottom + margin
        const verticalMargin = 20; // Space below search bar
        const calculatedTop = searchBarRect.bottom + verticalMargin;
        
        // DIRECT HORIZONTAL ALIGNMENT:
        // Use the exact left edge of the search bar for horizontal alignment
        const calculatedLeft = searchBarRect.left + horizontalOffset;
        
        // Log calculated values for debugging
        console.log(`Sozu (updatePosition): Search Bar Left Edge: ${searchBarRect.left}px`);
        console.log(`Sozu (updatePosition): Final calculation - Top: ${calculatedTop}px, Left: ${calculatedLeft}px`);

        // Apply styles if values are sane
        if (calculatedTop > 0 && calculatedLeft >= -20) { // Allow slightly negative left
            injectedContainer.style.top = `${calculatedTop}px`;
            injectedContainer.style.left = `${calculatedLeft}px`;
            injectedContainer.style.right = ''; // Ensure right is cleared
            
            // Store the position if this is the initial calculation
            if (isInitial) {
                initialWalletPosition = { top: calculatedTop, left: calculatedLeft };
                console.log(`Sozu (updatePosition): Stored initial position - Top: ${calculatedTop}px, Left: ${calculatedLeft}px`);
            }
        } else {
            console.warn(`Sozu (updatePosition): Calculated position invalid (Top: ${calculatedTop}, Left: ${calculatedLeft}). Using fallback.`);
            // Use fallback values
            injectedContainer.style.top = `${fallbackTop}px`;
            injectedContainer.style.left = `${fallbackLeft}px`;
            
            // Store position as initial if this is the first calculation
            if (isInitial) {
                initialWalletPosition = { top: fallbackTop, left: fallbackLeft };
                console.log(`Sozu (updatePosition): Stored fallback initial position - Top: ${fallbackTop}px, Left: ${fallbackLeft}px`);
            }
        }
    }
    
    // --- Updated Debounced resize handler ---
    function handleResize() {
        if (resizeTimeoutId) {
            clearTimeout(resizeTimeoutId);
        }
        resizeTimeoutId = window.setTimeout(() => {
            console.log('Sozu: Window resized, recalculating wallet position.');
            // On resize, we DO want to recalculate position from reference elements
            initialWalletPosition = null; // Reset stored position to force recalculation
            updateWalletPosition(true); // true = treat as initial position calculation
            resizeTimeoutId = null; // Clear ID after execution
        }, 150); // Debounce timeout in ms
    }
    
    // --- New scroll handler to ensure visibility during scroll ---
    function handleScroll() {
        if (!isSozuUiInjected || !injectedContainer) return;
        
        // Ensure wallet is visible during scroll
        if (injectedContainer.style.display === 'none') {
            injectedContainer.style.display = 'block';
        }
        
        // Debounce scroll handling
        if (scrollTimeoutId) {
            clearTimeout(scrollTimeoutId);
        }
        
        // After scroll stops, make sure position is maintained
        scrollTimeoutId = window.setTimeout(() => {
            if (initialWalletPosition) {
                // Reapply stored position to ensure wallet stays fixed
                injectedContainer!.style.top = `${initialWalletPosition.top}px`;
                injectedContainer!.style.left = `${initialWalletPosition.left}px`;
            }
            scrollTimeoutId = null;
        }, 100);
    }

    // --- Start Process ---
    main();

})();

// Ensure this file is treated as a module if not already done by bundler/tsconfig
export {};