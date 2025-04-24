/// <reference types="chrome"/>import { SessionManager } from '../utils/SessionManager';
import { AuthService } from '../services/AuthService';
// Initialize session manager and auth service
const sessionManager = SessionManager.getInstance();
const authService = AuthService.getInstance();
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'LOGOUT') {
        sessionManager.clearSession();
        authService.logout().then(() => {
            sendResponse({ success: true });
        });
        return true;
    }
    if (message.type === 'AUTH_CALLBACK') {
        // Handle the OAuth callback from the redirect page
        if (message.url) {
            authService.handleRedirect(message.url)
                .then(() => {
                sendResponse({ success: true });
            })
                .catch(error => {
                console.error('Auth callback error:', error);
                sendResponse({ success: false, error: error.message });
            });
        }
        return true;
    }
    if (message.type === 'INITIATE_AUTH') {
        // Initiate the Twitter OAuth flow
        authService.initiateTwitterAuth()
            .then(() => {
            sendResponse({ success: true });
        })
            .catch(error => {
            console.error('Auth initiation error:', error);
            sendResponse({ success: false, error: error.message });
        });
        return true;
    }
    if (message.type === 'GET_AUTH_STATE') {
        // Get current authentication state
        authService.getCurrentAuthState()
            .then(authState => {
            sendResponse({ success: true, data: authState });
        })
            .catch(error => {
            console.error('Get auth state error:', error);
            sendResponse({ success: false, error: error.message });
        });
        return true;
    }
    return true;
});
console.log('Background script loaded');
