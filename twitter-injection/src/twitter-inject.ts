// ==UserScript==
// @name         SozuCash Twitter Integration
// @namespace    SozuCash
// @version      1.0.0
// @description  Integrates SozuCash Wallet into Twitter with a sidebar button
// @author       SozuCash Team
// @match        https://twitter.com/*
// @match        https://x.com/*
// @run-at       document-idle
// @icon         https://abs.twimg.com/favicons/twitter.2.ico
// ==/UserScript==

(function() {
    'use strict';

    // Updated SVG path for a clearer, bolder wallet icon
    const walletIconPath = 'M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8zm-7-8.5c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zm0 5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z';

    // CSS styles for the button and icon - increased left shift to 10px
    const sozuButtonStyles = `
    .sozu-wallet-button {
      display: inline-flex;
      align-items: center;
      height: 50px;
      padding: 0 16px;
      border-radius: 9999px;
      transition: background-color 0.2s;
      text-decoration: none;
      cursor: pointer;
      margin: 4px 0 4px 0px; /* Removed left margin as we're using positioning */
      box-sizing: border-box;
      width: auto;
      position: relative;
      left: -5px;
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

    .sozu-wallet-text {
      font-family: "Segoe UI", Helvetica, Arial, sans-serif;
      color: rgb(231, 233, 234);
      font-size: 20px;
      font-weight: 400;
      letter-spacing: normal;
      margin-right: 0;
      white-space: nowrap;
    }

    .sozu-wallet-icon svg {
      width: 26px;
      height: 26px;
      fill: rgb(231, 233, 234);
      stroke: rgb(231, 233, 234);
      stroke-width: 0.2;
    }
    `;

    // Main function to inject the button
    function main() {
      // Wait for document body to be ready
      if (document.body) {
        injectStyles();
        waitForSidebar();
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          injectStyles();
          waitForSidebar();
        });
      }

      // Also observe for dynamic changes in the DOM
      const observer = new MutationObserver(() => {
        checkAndInjectButton();
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    }

    // Inject CSS styles into the page
    function injectStyles() {
      const styleElement = document.createElement('style');
      styleElement.textContent = sozuButtonStyles;
      document.head.appendChild(styleElement);
    }

    // Wait for sidebar to be available in the DOM
    function waitForSidebar() {
      checkAndInjectButton();
      // Keep checking until we find it
      const interval = setInterval(() => {
        if (checkAndInjectButton()) {
          clearInterval(interval);
        }
      }, 1000);
    }

    // Check for the sidebar and inject button if needed
    function checkAndInjectButton() {
      // First check if our button is already injected
      if (document.querySelector('.sozu-wallet-button')) {
        return true;
      }

      // Try to find the sidebar navigation
      const sidebarNav = document.querySelector('nav[aria-label="Primary"]');
      if (!sidebarNav) return false;

      // Find the Grok or Premium button to insert after
      const referenceButton = findReferenceButton(sidebarNav);
      if (!referenceButton) return false;

      // Insert our wallet button
      const walletButton = createWalletButton();
      if (referenceButton.parentNode) {
        referenceButton.parentNode.insertBefore(walletButton, referenceButton.nextSibling);
        // Match the min-width of other buttons, without making it full width
        const otherButtonStyles = window.getComputedStyle(referenceButton);
        walletButton.style.minWidth = otherButtonStyles.minWidth || "auto";
        
        // Apply additional inline style for left positioning to ensure it works
        walletButton.style.left = "-10px";
        
        return true;
      }

      return false;
    }

    // Find the best reference button to insert our wallet button after
    function findReferenceButton(navElement) {
      // Look for Grok button first (might be labeled as "AI" or have aria-label="AI")
      let grokButton = navElement.querySelector('a[aria-label="Grok"], a[aria-label="AI"]');
      
      // If Grok isn't found, try to find Premium
      if (!grokButton) {
        grokButton = navElement.querySelector('a[aria-label="Premium"]');
      }

      // If neither is found, try to get the last link in the navigation
      if (!grokButton) {
        const links = navElement.querySelectorAll('a');
        grokButton = links[links.length - 2]; // -2 to avoid "More" at the end
      }

      return grokButton;
    }

    // Create the wallet button element
    function createWalletButton() {
      const button = document.createElement('a');
      button.className = 'sozu-wallet-button';
      button.setAttribute('aria-label', 'SozuCash');
      button.addEventListener('click', handleWalletClick);

      const iconContainer = document.createElement('div');
      iconContainer.className = 'sozu-wallet-icon';
      
      const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      iconSvg.setAttribute('viewBox', '0 0 24 24');
      iconSvg.setAttribute('aria-hidden', 'true');
      
      const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      iconPath.setAttribute('d', walletIconPath);
      
      iconSvg.appendChild(iconPath);
      iconContainer.appendChild(iconSvg);
      
      const textSpan = document.createElement('span');
      textSpan.className = 'sozu-wallet-text';
      textSpan.textContent = 'SozuCash';
      
      button.appendChild(iconContainer);
      button.appendChild(textSpan);
      
      return button;
    }

    // Handle wallet button click
    function handleWalletClick(event) {
      event.preventDefault();
      event.stopPropagation();
      
      // Remove the search element (similar to clicking the extension button)
      removeSearchElement();
      
      // Show wallet message for the userscript version
      showWalletMessage();
      
      console.log('SozuCash button clicked');
    }
    
    // Remove the search element when wallet button is clicked
    function removeSearchElement() {
      // Find and remove the search box element
      const searchElements = document.querySelectorAll('.css-175oi2r.r-kemksi.r-1kqtdi0.r-1867qdf.r-1phboty.r-rs99b7.r-1ifxtd0.r-1udh08x');
      searchElements.forEach(element => {
        if (element) {
          element.style.display = 'none';
        }
      });
    }
    
    // Show wallet message (placeholder for extension functionality)
    function showWalletMessage() {
      const messageContainer = document.createElement('div');
      messageContainer.style.position = 'fixed';
      messageContainer.style.top = '50%';
      messageContainer.style.left = '50%';
      messageContainer.style.transform = 'translate(-50%, -50%)';
      messageContainer.style.background = 'rgba(0, 0, 0, 0.8)';
      messageContainer.style.color = 'white';
      messageContainer.style.padding = '20px';
      messageContainer.style.borderRadius = '10px';
      messageContainer.style.zIndex = '9999';
      messageContainer.style.maxWidth = '400px';
      messageContainer.style.textAlign = 'center';
      messageContainer.style.fontFamily = '"Segoe UI", Helvetica, Arial, sans-serif';
      
      messageContainer.textContent = 'SozuCash wallet will open here once implemented';
      
      document.body.appendChild(messageContainer);
      
      // Remove after 3 seconds
      setTimeout(() => {
        document.body.removeChild(messageContainer);
      }, 3000);
    }

    // Start the injection process
    main();
})();