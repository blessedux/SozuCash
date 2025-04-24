/// <reference types="chrome"/>

// Simplified imports
import TwitterConfig from '../config/twitter';
import { User, AuthState } from '../types/auth';

// Define the base API URL
const API_URL = 'https://api.twitter.com/2/';

export class AuthService {
  private static instance: AuthService;

  private constructor() {
    // Simplified constructor
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async initiateTwitterAuth(): Promise<void> {
    try {
      // Generate a random state value for security
      const state = Math.random().toString(36).substring(2, 15);
      
      // Store state in local storage to verify later
      await chrome.storage.local.set({ oauth_state: state });
      
      // Create the OAuth URL
      const authUrl = new URL(TwitterConfig.authUrl);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('client_id', TwitterConfig.clientId);
      authUrl.searchParams.append('redirect_uri', TwitterConfig.redirectUri);
      authUrl.searchParams.append('scope', TwitterConfig.scopes.join(' '));
      authUrl.searchParams.append('state', state);
      
      // Launch the OAuth popup
      chrome.identity.launchWebAuthFlow({
        url: authUrl.toString(),
        interactive: true
      }, (redirectUrl) => {
        if (chrome.runtime.lastError) {
          console.error('OAuth error:', chrome.runtime.lastError);
          return;
        }
        
        if (redirectUrl) {
          this.handleRedirect(redirectUrl);
        }
      });
    } catch (error) {
      console.error('Error initiating Twitter auth:', error);
    }
  }

  async handleRedirect(redirectUrl: string): Promise<void> {
    try {
      const url = new URL(redirectUrl);
      const code = url.searchParams.get('code');
      
      // Simple authentication flow for testing
      if (code) {
        // Mock successful login for testing
        const mockUser = {
          id: 'test123',
          username: 'testuser',
          profile_image_url: 'https://example.com/profile.jpg'
        };
        
        await chrome.storage.local.set({ 
          user: mockUser,
          isAuthenticated: true
        });
        
        // Notify any listeners
        chrome.runtime.sendMessage({
          type: 'AUTH_STATE_CHANGED',
          data: {
            isAuthenticated: true,
            user: mockUser
          }
        });
      }
    } catch (error) {
      console.error('Error handling redirect:', error);
    }
  }

  async getCurrentAuthState(): Promise<AuthState> {
    try {
      const { isAuthenticated, user } = await chrome.storage.local.get([
        'isAuthenticated',
        'user'
      ]);
      
      return {
        isAuthenticated: !!isAuthenticated,
        user: user || null
      };
    } catch (error) {
      console.error('Error getting current auth state:', error);
      return { isAuthenticated: false };
    }
  }

  async logout(): Promise<void> {
    try {
      // Clear auth data
      await chrome.storage.local.remove([
        'access_token',
        'user',
        'isAuthenticated',
        'oauth_state'
      ]);
      
      // Notify any listeners
      chrome.runtime.sendMessage({
        type: 'AUTH_STATE_CHANGED',
        data: {
          isAuthenticated: false
        }
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
} 