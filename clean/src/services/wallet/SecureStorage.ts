/**
 * SecureStorage.ts
 * Secure storage service for wallet information
 */

import * as browserPassworder from '@metamask/browser-passworder';
import { Wallet } from './WalletState';

// Interface for encrypted wallet data
interface EncryptedWalletData {
  encryptedData: string;
  salt: string;
  iv: string;
}

// Interface for wallet with private key
interface WalletWithPrivateKey extends Wallet {
  privateKey: string;
}

// Interface for wallet storage
interface WalletStorage {
  wallets: Record<string, WalletWithPrivateKey[]>;
  version: string;
  lastUpdated: number;
}

/**
 * Secure storage service for wallets
 */
class SecureStorageService {
  private storageKey = 'sozucash_encrypted_wallets';
  private version = '1.0.0';
  
  /**
   * Encrypt wallet data with password
   */
  async encryptWallets(password: string, wallets: Record<string, WalletWithPrivateKey[]>): Promise<void> {
    try {
      const data: WalletStorage = {
        wallets,
        version: this.version,
        lastUpdated: Date.now()
      };
      
      // Encrypt the data with the password
      const encryptedData = await browserPassworder.encrypt(password, data);
      
      // Store the encrypted data
      await chrome.storage.local.set({ [this.storageKey]: encryptedData });
    } catch (error) {
      console.error('Error encrypting wallets:', error);
      throw error;
    }
  }
  
  /**
   * Decrypt wallet data with password
   */
  async decryptWallets(password: string): Promise<Record<string, WalletWithPrivateKey[]>> {
    try {
      // Get encrypted data from storage
      const result = await chrome.storage.local.get(this.storageKey);
      const encryptedData = result[this.storageKey];
      
      if (!encryptedData) {
        return {}; // No wallets stored yet
      }
      
      // Decrypt the data
      const decrypted = await browserPassworder.decrypt(password, encryptedData) as WalletStorage;
      
      return decrypted.wallets;
    } catch (error) {
      console.error('Error decrypting wallets:', error);
      throw new Error('Incorrect password or corrupted wallet data');
    }
  }
  
  /**
   * Check if wallet data exists
   */
  async hasWallets(): Promise<boolean> {
    const result = await chrome.storage.local.get(this.storageKey);
    return !!result[this.storageKey];
  }
  
  /**
   * Save a new wallet for a user
   */
  async saveWallet(
    username: string,
    wallet: WalletWithPrivateKey,
    password: string
  ): Promise<void> {
    try {
      // Get existing wallets
      let wallets: Record<string, WalletWithPrivateKey[]> = {};
      try {
        wallets = await this.decryptWallets(password);
      } catch (error) {
        // If we can't decrypt, start with an empty wallets object
        console.warn('Creating new wallet storage');
      }
      
      // Add or update user's wallets
      wallets[username] = wallets[username] || [];
      
      // Check if wallet already exists
      const existingIndex = wallets[username].findIndex(w => w.address === wallet.address);
      if (existingIndex >= 0) {
        // Update existing wallet
        wallets[username][existingIndex] = { ...wallets[username][existingIndex], ...wallet };
      } else {
        // Add new wallet
        wallets[username].push(wallet);
      }
      
      // Encrypt and save all wallets
      await this.encryptWallets(password, wallets);
    } catch (error) {
      console.error('Error saving wallet:', error);
      throw error;
    }
  }
  
  /**
   * Get wallets for a specific user
   */
  async getWallets(
    username: string,
    password: string
  ): Promise<WalletWithPrivateKey[]> {
    try {
      const wallets = await this.decryptWallets(password);
      return wallets[username] || [];
    } catch (error) {
      console.error(`Error getting wallets for ${username}:`, error);
      throw error;
    }
  }
  
  /**
   * Remove a wallet
   */
  async removeWallet(
    username: string,
    address: string,
    password: string
  ): Promise<void> {
    try {
      const wallets = await this.decryptWallets(password);
      
      if (wallets[username]) {
        // Filter out the wallet to remove
        wallets[username] = wallets[username].filter(w => w.address !== address);
        
        // If no more wallets for this user, remove the user entry
        if (wallets[username].length === 0) {
          delete wallets[username];
        }
        
        // Save updated wallets
        await this.encryptWallets(password, wallets);
      }
    } catch (error) {
      console.error(`Error removing wallet ${address} for ${username}:`, error);
      throw error;
    }
  }
  
  /**
   * Change the password for wallet encryption
   */
  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      // Decrypt with old password
      const wallets = await this.decryptWallets(oldPassword);
      
      // Encrypt with new password
      await this.encryptWallets(newPassword, wallets);
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
  
  /**
   * Clear all wallet data
   */
  async clearAllWallets(): Promise<void> {
    await chrome.storage.local.remove(this.storageKey);
  }
}

// Create singleton instance
export const secureStorage = new SecureStorageService();

// Export default for convenience
export default secureStorage; 