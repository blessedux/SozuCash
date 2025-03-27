/**
 * Background script for Sozu Wallet extension
 * Handles authentication, message passing, and background operations
 */

import { authService } from './services/AuthService';

// Initialize the auth service when the background script starts
authService.init().then((state) => {
  console.log('Auth service initialized:', state.isAuthenticated ? 'authenticated' : 'not authenticated');
});

// Listen for messages from content scripts and the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);
  
  // Handle different message types
  switch (message.type) {
    // Handle OAuth callback from the oauth-callback.html page
    case 'AUTH_CALLBACK':
      handleAuthCallback(message.url).then(response => {
        sendResponse({ success: true, ...response });
      }).catch(error => {
        console.error('Auth callback error:', error);
        sendResponse({ success: false, error: error.message });
      });
      return true; // Keep the message channel open for async response
      
    // Handle login request from the popup
    case 'LOGIN':
      authService.login().then(() => {
        sendResponse({ success: true });
      }).catch(error => {
        console.error('Login error:', error);
        sendResponse({ success: false, error: error.message });
      });
      return true; // Keep the message channel open for async response
      
    // Handle logout request from the popup
    case 'LOGOUT':
      authService.logout().then(() => {
        sendResponse({ success: true });
      }).catch(error => {
        console.error('Logout error:', error);
        sendResponse({ success: false, error: error.message });
      });
      return true; // Keep the message channel open for async response
      
    // Handle request to get the current auth state
    case 'GET_AUTH_STATE':
      authService.init().then(state => {
        sendResponse({ success: true, state });
      }).catch(error => {
        console.error('Get auth state error:', error);
        sendResponse({ success: false, error: error.message });
      });
      return true; // Keep the message channel open for async response
    
    // Handle other message types
    default:
      sendResponse({ success: false, error: 'Unknown message type' });
      return false;
  }
});

/**
 * Handle the OAuth callback from the oauth-callback.html page
 */
async function handleAuthCallback(url: string) {
  try {
    // Process the callback and get the auth state
    const authState = await authService.handleCallback(url);
    
    // Send a message to the popup to update the UI
    chrome.runtime.sendMessage({ 
      type: 'AUTH_STATE_CHANGED',
      state: authState
    }).catch(error => {
      console.log('Error sending auth state message to popup:', error);
      // The popup might not be open, which is okay
    });
    
    return { state: authState };
  } catch (error) {
    console.error('Error handling auth callback:', error);
    throw error;
  }
}

// Listen for installation events
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    console.log('Extension installed');
    
    // Open the welcome page on install
    chrome.tabs.create({
      url: chrome.runtime.getURL('popup.html?welcome=true')
    });
  } else if (details.reason === 'update') {
    console.log('Extension updated');
  }
});

// Export empty for TypeScript
export {}; 