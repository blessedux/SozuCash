/// <reference types="chrome"/>

/**
 * Mock Twitter Injection Script
 * This is a simplified version that doesn't do any actual Twitter page injections
 * It's just included to satisfy the build process requirements
 */

console.log('Twitter injection mock loaded');

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CHECK_TWITTER_INJECTION') {
    sendResponse({ success: true, status: 'Twitter injection mock is active' });
  }
  return true;
});

// Mock observer for Twitter UI
const observeTwitter = () => {
  console.log('Mock Twitter observer initialized');
};

// Initialize
observeTwitter();

export {}; 