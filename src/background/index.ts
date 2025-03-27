import { SessionManager } from '../utils/SessionManager';
import { authService } from '../services/AuthService';

// Initialize auth service
authService.init().then((state) => {
  console.log('Auth service initialized in background/index.ts:', state.isAuthenticated ? 'authenticated' : 'not authenticated');
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Background received message:', message);
  
  if (message.type === 'LOGOUT') {
    SessionManager.clearSession().then(() => {
      sendResponse({ success: true });
    }).catch(error => {
      console.error('Error during logout:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true; // Keep the message channel open for async response
  }
  
  return true;
});

console.log('Background script loaded'); 