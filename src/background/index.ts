import { SessionManager } from '../utils/SessionManager';

// Initialize session manager
const sessionManager = SessionManager.getInstance();

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'LOGOUT') {
    sessionManager.clearSession();
    sendResponse({ success: true });
  }
  return true;
});

console.log('Background script loaded'); 