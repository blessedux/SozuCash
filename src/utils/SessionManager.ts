/**
 * SessionManager.ts
 * Manages user session and state persistence
 */

import { AuthState, UserProfile } from '../services/AuthService';

// Keys for storage
const SESSION_KEY = 'sozu_session';
const AUTH_STATE_KEY = 'sozu_auth_state';

export class SessionManager {
  /**
   * Store session data
   */
  static async saveSession(data: Record<string, any>): Promise<void> {
    try {
      await chrome.storage.local.set({ [SESSION_KEY]: data });
      console.log('Session saved successfully');
    } catch (error) {
      console.error('Error saving session:', error);
      throw error;
    }
  }

  /**
   * Get session data
   */
  static async getSession(): Promise<Record<string, any> | null> {
    try {
      const data = await chrome.storage.local.get([SESSION_KEY]);
      return data[SESSION_KEY] || null;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  /**
   * Clear session data
   */
  static async clearSession(): Promise<void> {
    try {
      await chrome.storage.local.remove([SESSION_KEY]);
      console.log('Session cleared successfully');
    } catch (error) {
      console.error('Error clearing session:', error);
      throw error;
    }
  }

  /**
   * Store auth state
   */
  static async saveAuthState(authState: AuthState): Promise<void> {
    try {
      await chrome.storage.local.set({ [AUTH_STATE_KEY]: authState });
      console.log('Auth state saved successfully');
    } catch (error) {
      console.error('Error saving auth state:', error);
      throw error;
    }
  }

  /**
   * Get auth state
   */
  static async getAuthState(): Promise<AuthState | null> {
    try {
      const data = await chrome.storage.local.get([AUTH_STATE_KEY]);
      return data[AUTH_STATE_KEY] || null;
    } catch (error) {
      console.error('Error getting auth state:', error);
      return null;
    }
  }

  /**
   * Clear auth state
   */
  static async clearAuthState(): Promise<void> {
    try {
      await chrome.storage.local.remove([AUTH_STATE_KEY]);
      console.log('Auth state cleared successfully');
    } catch (error) {
      console.error('Error clearing auth state:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    const authState = await this.getAuthState();
    return !!authState?.isAuthenticated;
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<UserProfile | null> {
    const authState = await this.getAuthState();
    return authState?.user || null;
  }
} 