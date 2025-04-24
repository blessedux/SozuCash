/// <reference types="chrome"/>

import { AuthService } from '../services/AuthService';
import '../utils/polyfills';

// Initialize services
const authService = AuthService.getInstance();

// Set up message listeners
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle messages from UI or content scripts
  console.log('Background received message:', message);
  
  if (message.type === 'AUTH_LOGIN') {
    authService.initiateTwitterAuth()
      .then(() => sendResponse({ success: true }))
      .catch(error => {
        console.error('Auth error:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Indicates async response
  }
  
  if (message.type === 'AUTH_LOGOUT') {
    authService.logout()
      .then(() => sendResponse({ success: true }))
      .catch(error => {
        console.error('Logout error:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Indicates async response
  }
  
  if (message.type === 'GET_AUTH_STATE') {
    authService.getCurrentAuthState()
      .then(state => sendResponse({ success: true, state }))
      .catch(error => {
        console.error('Error fetching auth state:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Indicates async response
  }
});

console.log('Background script loaded'); 