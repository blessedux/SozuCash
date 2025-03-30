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
      margin: 4px 0 4px 0px;
      box-sizing: border-box;
      width: auto;
      position: relative;
      left: -5px; /* Adjusted */
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
      position: fixed;   /* Keep fixed */
      /* Remove static top/right - will be set dynamically */
      /* top: 70px; */
      /* right: 15px; */
      z-index: 1000;     /* Keep high z-index */
      
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

      button.innerHTML = `
        <div class="sozu-wallet-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="${walletIconPath}"></path>
          </svg>
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

      // Find a suitable container to inject into/replace content within.
      // Often the first direct child div holds the main content (search, trends, etc.)
      // This selector might need adjustment based on Twitter's structure changes.
      const targetParentContainer = sidebarColumn.querySelector(':scope > div > div') as HTMLElement;
      if (!targetParentContainer) {
           console.error("Sozu: Could not find target container within sidebar column. Injecting directly into column.");
           // Fallback: Use sidebarColumn itself, but this might have unintended layout consequences.
           // It's better to find a more specific container.
           // For now, let's prevent injection if the specific container isn't found.
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
      
      // --- Measure positions BEFORE hiding --- 
      const alignmentRect = alignmentElement?.getBoundingClientRect(); // Use optional chaining
      const parentRect = targetParentContainer.getBoundingClientRect(); // For calculating right edge
      
      // Use alignmentRect top if available, otherwise fallback (e.g., parentRect.top or a default)
      const calculatedTop = alignmentRect ? alignmentRect.top : parentRect.top; 
      const calculatedRight = window.innerWidth - parentRect.right;
      console.log(`Sozu: Alignment Element Top: ${alignmentRect?.top}px, Parent Right Edge: ${parentRect.right}px`);
      console.log(`Sozu: Calculated Fixed Position - Top: ${calculatedTop}px, Right: ${calculatedRight}px`);
      // --- End Measurement ---

      // --- Hide specific children (Explicit Selectors, Skip Search Bar) ---
      originalSidebarContent = []; // Clear previous list
      const elementsToHide = sidebarColumn.querySelectorAll(elementsToHideSelector); 

      elementsToHide.forEach((node) => {
          if (node instanceof HTMLElement) { 
              // Double check it's not somehow the search bar (unlikely with specific selectors, but safe)
              if (!node.matches(searchBarSelector)) { 
                  originalSidebarContent.push(node); // Store node reference
                  
                  // --- Apply inline styles for fade-out and transition ---
                  node.style.transition = 'opacity 0.5s ease-in-out, filter 0.5s ease-in-out';
                  node.style.opacity = '0';
                  node.style.pointerEvents = 'none';
                  
                  // --- End inline styles ---
              }
          }
      });
      console.log(`Sozu: Attempted to hide ${originalSidebarContent.length} specific elements.`);
      // --- End Hiding Logic ---
      
      // Create the wallet container div
      injectedContainer = document.createElement('div');
      injectedContainer.id = INJECTED_CONTAINER_ID;

      // --- Apply dynamic position --- 
      injectedContainer.style.top = `${calculatedTop}px`;
      injectedContainer.style.right = `${calculatedRight}px`;
      // --- End dynamic position ---

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
          // Still append the container with the error message
          if (targetParentContainer.firstChild) {
              targetParentContainer.insertBefore(injectedContainer, targetParentContainer.firstChild);
          } else {
              targetParentContainer.appendChild(injectedContainer);
          }
          isSozuUiInjected = true; // Mark as injected (even with error) to allow removal
          return; // Stop further execution for this injection attempt
      }

      // Append iframe to the container
      injectedContainer.appendChild(iframe);

      // Append the new container to the target area in the sidebar
      if (targetParentContainer.firstChild) {
          targetParentContainer.insertBefore(injectedContainer, targetParentContainer.firstChild);
      } else {
          targetParentContainer.appendChild(injectedContainer);
      }
      
      // Add 'visible' class shortly after insertion to trigger transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { // Double RAF for robustness in some cases
            if (injectedContainer) {
                injectedContainer.classList.add('visible');
            }
        });
      });

      isSozuUiInjected = true;
      console.log('Sozu: Wallet UI Injected');
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

       // Restore original content (elements hidden below search)
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
    }


    // --- Start Process ---
    main();

})();

// Ensure this file is treated as a module if not already done by bundler/tsconfig
export {};