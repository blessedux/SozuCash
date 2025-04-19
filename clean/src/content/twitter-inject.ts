/// <reference types="chrome"/>/// <reference types="chrome"/>

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

import { getComponentStyles } from './styles/styles';
import { injectStyles, waitForElement, findReferenceButton } from './utils/dom';
import { createWalletButton, createWalletButtonHandler } from './components/WalletButton';
import { 
  toggleWalletUI, 
  removeWalletUI, 
  updateWalletPosition 
} from './components/WalletUI';
import { setupEventListeners, removeEventListeners } from './utils/events';

// Main execution context
(function() {
  'use strict';
  
  // --- State Variables ---
  let injectionAttempts = 0;
  const MAX_INJECTION_ATTEMPTS = 10;
  
  /**
   * Main entry point for the extension
   */
  function main() {
    console.log('SozuCash: Starting injection process');
    
    // Inject styles as soon as document is ready
    if (document.body) {
      injectStyles(getComponentStyles());
      waitForSidebar();
    } else {
      // Wait for DOM to be ready
      document.addEventListener('DOMContentLoaded', () => {
        injectStyles(getComponentStyles());
        waitForSidebar();
      });
    }
    
    // Set up observer to handle DOM changes
    setupMutationObserver();
  }
  
  /**
   * Wait for Twitter's sidebar to be ready
   */
  function waitForSidebar() {
    // Look for the primary navigation element
    waitForElement('nav[role="navigation"]').then(navElement => {
      if (navElement) {
        checkAndInjectButton();
      } else {
        console.log('SozuCash: Navigation element not found');
      }
    });
  }
  
  /**
   * Set up mutation observer to handle dynamic content changes
   */
  function setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      // Check if button needs to be injected
      if (!document.querySelector('.sozu-wallet-button')) {
        checkAndInjectButton();
      }
    });
    
    // Start observing the document body
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  /**
   * Attempt to inject the button into the navigation
   * @returns true if button was injected, false otherwise
   */
  function checkAndInjectButton(): boolean {
    injectionAttempts++;
    
    if (injectionAttempts > MAX_INJECTION_ATTEMPTS) {
      console.log('SozuCash: Max injection attempts reached');
      return false;
    }
    
    // Find navigation element
    const navElement = document.querySelector('nav[role="navigation"]');
    if (!navElement) {
      console.log('SozuCash: Navigation element not found, will retry');
      return false;
    }
    
    // Check if button already exists
    if (navElement.querySelector('.sozu-wallet-button')) {
      console.log('SozuCash: Button already exists');
      return true;
    }
    
    // Find a reference element to insert our button after
    const referenceElement = findReferenceButton(navElement);
    if (!referenceElement) {
      console.log('SozuCash: Reference element not found, will retry');
      return false;
    }
    
    try {
      // Create the wallet button
      const walletButton = createWalletButton();
      
      // Attach event listener
      walletButton.addEventListener('click', createWalletButtonHandler(toggleWalletUI));
      
      // Insert the button after the reference element
      referenceElement.parentNode?.insertBefore(walletButton, referenceElement.nextSibling);
      
      // Set up event listeners for window events
      setupEventListeners();
      
      console.log('SozuCash: Button injected successfully');
      return true;
    } catch (error) {
      console.error('SozuCash: Error injecting button', error);
      return false;
    }
  }
  
  // Start the injection process
  main();
})();

// Ensure this file is treated as a module if not already done by bundler/tsconfig
export {};