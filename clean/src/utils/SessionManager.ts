/// <reference types="chrome"/>import { AuthState, Wallet, User } from "../types/auth";

export class SessionManager {
  private static instance: SessionManager;

  private constructor() {}

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }
  
  async getSessionData<T>(key: string): Promise<T | null> {
    try {
      const data = await chrome.storage.local.get(key);
      return data[key] || null;
    } catch (error) {
      console.error(`Error retrieving ${key} from session:`, error);
      return null;
    }
  }
  
  async setSessionData(key: string, value: any): Promise<void> {
    try {
      await chrome.storage.local.set({ [key]: value });
    } catch (error) {
      console.error(`Error setting ${key} in session:`, error);
    }
  }
  
  async removeSessionData(keys: string[]): Promise<void> {
    try {
      await chrome.storage.local.remove(keys);
    } catch (error) {
      console.error(`Error removing data from session:`, error);
    }
  }

  async getAuthState(): Promise<AuthState> {
    try {
      const { isAuthenticated, currentWallet } = await chrome.storage.local.get([
        'isAuthenticated',
        'currentWallet'
      ]);
      
      return {
        isAuthenticated: !!isAuthenticated,
        currentWallet: currentWallet || undefined
      };
    } catch (error) {
      console.error('Error getting auth state:', error);
      return { isAuthenticated: false };
    }
  }
  
  async getWalletsForUser(userId: string): Promise<Wallet[]> {
    try {
      const { wallets } = await chrome.storage.local.get('wallets');
      return wallets && wallets[userId] ? wallets[userId] : [];
    } catch (error) {
      console.error(`Error getting wallets for user ${userId}:`, error);
      return [];
    }
  }
  
  async getCurrentUser(): Promise<User | null> {
    return this.getSessionData<User>('user');
  }
  
  async getCurrentWallet(): Promise<Wallet | null> {
    return this.getSessionData<Wallet>('currentWallet');
  }

  async clearSession(): Promise<void> {
    try {
      // Clear authentication data but preserve wallet data
      await chrome.storage.local.remove([
        'access_token', 
        'refresh_token', 
        'expires_at',
        'user',
        'currentWallet',
        'isAuthenticated',
        'oauth_state',
        'code_verifier'
      ]);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }
  
  async clearAllData(): Promise<void> {
    try {
      await chrome.storage.local.clear();
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }
} 