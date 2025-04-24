/// <reference types="chrome"/>

import { AuthState } from '../types/auth';

/**
 * A simplified session manager for handling authentication state
 */
export class SessionManager {
  private static instance: SessionManager;

  // Make constructor accessible
  constructor() {
    // Initialize
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  // Simplified session management
  async getAuthState(): Promise<AuthState> {
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
      console.error('Error getting auth state:', error);
      return { isAuthenticated: false };
    }
  }

  async setAuthState(state: AuthState): Promise<void> {
    try {
      await chrome.storage.local.set({
        isAuthenticated: state.isAuthenticated,
        user: state.user
      });
    } catch (error) {
      console.error('Error setting auth state:', error);
    }
  }

  async clearSession(): Promise<void> {
    try {
      await chrome.storage.local.remove([
        'isAuthenticated',
        'user',
        'access_token'
      ]);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }
} 