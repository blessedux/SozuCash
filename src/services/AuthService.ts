/**
 * AuthService.ts
 * Handles OAuth authentication with X (Twitter) for the Sozu Wallet extension.
 */

import { SessionManager } from '../utils/SessionManager';

// Define the structure of the user profile
export interface UserProfile {
  id: string;
  username: string;
  name: string;
  profile_image_url: string;
}

// Define the structure of auth state
export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  user: UserProfile | null;
}

// Constants for storage keys
const AUTH_STATE_KEY = 'sozu_auth_state';
const AUTH_NONCE_KEY = 'sozu_auth_nonce';

export class AuthService {
  // Twitter OAuth configuration
  private clientId: string;
  private redirectUri: string;
  private scopes: string[];
  
  constructor() {
    // Get the Twitter client ID from environment variables
    this.clientId = process.env.TWITTER_CLIENT_ID || '';
    
    // Set the redirect URI to the OAuth callback page
    this.redirectUri = chrome.runtime.getURL('oauth-callback.html');
    
    // Define the required scopes for Twitter
    this.scopes = [
      'tweet.read',
      'users.read',
      'offline.access'
    ];
    
    console.log('AuthService initialized with redirectUri:', this.redirectUri);
  }

  /**
   * Initialize the auth state from storage
   */
  async init(): Promise<AuthState> {
    const state = await this.getAuthState();
    console.log('Auth state initialized:', state.isAuthenticated ? 'authenticated' : 'not authenticated');
    
    // Check if the token is expired and needs refresh
    if (state.isAuthenticated && state.expiresAt && state.expiresAt < Date.now() && state.refreshToken) {
      try {
        return await this.refreshAccessToken(state.refreshToken);
      } catch (error) {
        console.error('Failed to refresh token:', error);
        return this.clearAuthState();
      }
    }
    
    return state;
  }

  /**
   * Start the OAuth flow by opening the Twitter authorization page
   */
  async login(): Promise<void> {
    // Generate a random nonce for security
    const nonce = this.generateNonce();
    await chrome.storage.local.set({ [AUTH_NONCE_KEY]: nonce });
    
    // Build the authorization URL
    const authUrl = this.buildAuthorizationUrl(nonce);
    console.log('Opening auth URL:', authUrl);
    
    // Open the authorization page in a new tab
    chrome.tabs.create({ url: authUrl });
  }

  /**
   * Handle the OAuth callback by exchanging the code for an access token
   */
  async handleCallback(url: string): Promise<AuthState> {
    // Parse the callback URL
    const urlObj = new URL(url);
    const code = urlObj.searchParams.get('code');
    const state = urlObj.searchParams.get('state');
    
    // Validate the state parameter to prevent CSRF attacks
    const storedNonce = await chrome.storage.local.get(AUTH_NONCE_KEY);
    if (!code || !state || state !== storedNonce[AUTH_NONCE_KEY]) {
      console.error('Invalid state or missing code');
      return this.clearAuthState();
    }
    
    try {
      // Exchange the code for an access token
      const tokenResponse = await this.exchangeCodeForToken(code);
      
      // Get the user profile using the access token
      const userProfile = await this.getUserProfile(tokenResponse.access_token);
      
      // Calculate token expiration time
      const expiresAt = Date.now() + (tokenResponse.expires_in * 1000);
      
      // Create the auth state
      const authState: AuthState = {
        isAuthenticated: true,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresAt: expiresAt,
        user: userProfile
      };
      
      // Save the auth state to storage using SessionManager
      await SessionManager.saveAuthState(authState);
      
      return authState;
    } catch (error) {
      console.error('Error in handleCallback:', error);
      return this.clearAuthState();
    }
  }

  /**
   * Log out the user by clearing the auth state
   */
  async logout(): Promise<void> {
    await this.clearAuthState();
  }

  /**
   * Get the current user's profile
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    const state = await this.getAuthState();
    return state.user;
  }

  /**
   * Check if the user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const state = await this.getAuthState();
    
    // Check if the token is expired
    if (state.expiresAt && state.expiresAt < Date.now()) {
      // If we have a refresh token, try to refresh the access token
      if (state.refreshToken) {
        try {
          const newState = await this.refreshAccessToken(state.refreshToken);
          return newState.isAuthenticated;
        } catch (error) {
          console.error('Failed to refresh token:', error);
          return false;
        }
      }
      return false;
    }
    
    return state.isAuthenticated;
  }

  /**
   * Get the auth state from storage
   */
  private async getAuthState(): Promise<AuthState> {
    const authState = await SessionManager.getAuthState();
    
    if (!authState) {
      return {
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
        user: null
      };
    }
    
    return authState;
  }

  /**
   * Clear the auth state and return a new empty state
   */
  private async clearAuthState(): Promise<AuthState> {
    await SessionManager.clearAuthState();
    
    return {
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      user: null
    };
  }

  /**
   * Generate a random nonce for CSRF protection
   */
  private generateNonce(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Build the Twitter authorization URL
   */
  private buildAuthorizationUrl(nonce: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scopes.join(' '),
      state: nonce,
      code_challenge_method: 'S256',
      code_challenge: this.generateCodeChallenge()
    });
    
    return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
  }

  /**
   * Generate a code challenge for PKCE
   */
  private generateCodeChallenge(): string {
    // In a real implementation, this would use crypto APIs to generate
    // a proper code challenge. For simplicity, we're using a placeholder.
    return 'challenge_' + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Exchange the authorization code for an access token
   */
  private async exchangeCodeForToken(code: string): Promise<any> {
    // In a real implementation, this would make a POST request to 
    // Twitter's token endpoint. For simplicity, we're using a mock response.
    
    // For demo purposes, we're simulating a successful token response
    return {
      access_token: 'mock_access_token_' + Math.random().toString(36).substring(2, 10),
      refresh_token: 'mock_refresh_token_' + Math.random().toString(36).substring(2, 10),
      expires_in: 7200 // 2 hours
    };
  }

  /**
   * Refresh the access token using the refresh token
   */
  private async refreshAccessToken(refreshToken: string): Promise<AuthState> {
    // In a real implementation, this would make a POST request to 
    // Twitter's token endpoint. For simplicity, we're using a mock response.
    
    try {
      // Simulate a successful token refresh
      const tokenResponse = {
        access_token: 'refreshed_token_' + Math.random().toString(36).substring(2, 10),
        refresh_token: refreshToken,
        expires_in: 7200 // 2 hours
      };
      
      // Calculate new expiration time
      const expiresAt = Date.now() + (tokenResponse.expires_in * 1000);
      
      // Get the current state to preserve user info
      const currentState = await this.getAuthState();
      
      // Create the new auth state
      const newState: AuthState = {
        isAuthenticated: true,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresAt: expiresAt,
        user: currentState.user
      };
      
      // Save the new state with SessionManager
      await SessionManager.saveAuthState(newState);
      
      return newState;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return this.clearAuthState();
    }
  }

  /**
   * Get the user profile using the access token
   */
  private async getUserProfile(accessToken: string): Promise<UserProfile> {
    // In a real implementation, this would make a GET request to 
    // Twitter's user API. For simplicity, we're using a mock response.
    
    return {
      id: 'user_' + Math.random().toString(36).substring(2, 10),
      username: 'sozu_user',
      name: 'Sozu User',
      profile_image_url: 'https://via.placeholder.com/100'
    };
  }
}

// Export a singleton instance of the AuthService
export const authService = new AuthService(); 