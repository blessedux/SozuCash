// Background script for Sozu Wallet Chrome extension

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message);
  
  if (message.action === 'openWallet') {
    // In a real extension, this would open the wallet UI
    // For now, we'll just open a new tab with a placeholder
    chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') });
  }
});

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Sozu Wallet extension installed:', details);
});

// Handle toolbar icon click
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') });
}); 