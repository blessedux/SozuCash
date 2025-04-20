/**
 * WalletManager.ts
 * Coordinating service for wallet operations
 */

import { walletState, Wallet } from './WalletState';
import { blockchainService } from './BlockchainService';
import { secureStorage } from './SecureStorage';

/**
 * Wallet manager service
 * Coordinates between state, blockchain, and secure storage
 */
class WalletManager {
  private password: string | null = null;
  
  /**
   * Initialize the wallet manager
   */
  async initialize(twitterUsername: string): Promise<void> {
    try {
      // Check if we need to setup a password first
      const hasWallets = await secureStorage.hasWallets();
      
      if (!hasWallets) {
        // First-time setup - we'll prompt for password later
        walletState.setAuthenticated(false);
        walletState.setWallets([]);
        return;
      }
      
      // Load wallets if we already have the password
      if (this.password) {
        await this.loadWallets(twitterUsername);
      } else {
        // We need a password, but will ask for it when needed
        walletState.setAuthenticated(false);
      }
    } catch (error) {
      console.error('Error initializing wallet manager:', error);
      walletState.setError(error instanceof Error ? error.message : 'Failed to initialize wallet manager');
    }
  }
  
  /**
   * Set password and load wallets
   */
  async unlock(password: string, twitterUsername: string): Promise<boolean> {
    try {
      walletState.setLoading(true);
      
      // Check if password is correct by trying to decrypt
      await secureStorage.decryptWallets(password);
      
      // Password is correct, store it in memory
      this.password = password;
      
      // Load wallets
      await this.loadWallets(twitterUsername);
      
      return true;
    } catch (error) {
      console.error('Error unlocking wallets:', error);
      walletState.setError('Incorrect password');
      return false;
    } finally {
      walletState.setLoading(false);
    }
  }
  
  /**
   * Create a new wallet
   */
  async createWallet(twitterUsername: string, walletName?: string): Promise<Wallet> {
    try {
      walletState.setLoading(true);
      
      // Ensure we have a password
      if (!this.password) {
        throw new Error('Password not set. Please unlock the wallet first.');
      }
      
      // Create a new wallet
      const { wallet, privateKey } = blockchainService.createWallet(twitterUsername);
      
      // Customize name if provided
      if (walletName) {
        wallet.name = walletName;
      }
      
      // Save to secure storage
      await secureStorage.saveWallet(twitterUsername, {
        ...wallet,
        privateKey
      }, this.password);
      
      // Add to state
      walletState.addWallet(wallet);
      
      return wallet;
    } catch (error) {
      console.error('Error creating wallet:', error);
      walletState.setError(error instanceof Error ? error.message : 'Failed to create wallet');
      throw error;
    } finally {
      walletState.setLoading(false);
    }
  }
  
  /**
   * Import a wallet by address
   */
  async importWallet(
    twitterUsername: string,
    address: string,
    walletName?: string
  ): Promise<Wallet> {
    try {
      walletState.setLoading(true);
      
      // Ensure we have a password
      if (!this.password) {
        throw new Error('Password not set. Please unlock the wallet first.');
      }
      
      // Validate address
      if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
        throw new Error('Invalid Ethereum address format');
      }
      
      // Create wallet object
      const wallet: Wallet = {
        address,
        name: walletName || `${twitterUsername}'s Imported Wallet`,
        twitterUsername,
        created: Date.now(),
        networkId: 'mantle',
        isImported: true
      };
      
      // Get initial balance
      try {
        const balance = await blockchainService.getBalance(address);
        wallet.balance = balance;
      } catch (error) {
        console.warn('Error getting initial balance for imported wallet:', error);
        wallet.balance = '0';
      }
      
      // Save to secure storage (without private key for imported wallets)
      await secureStorage.saveWallet(twitterUsername, {
        ...wallet,
        privateKey: '' // No private key for imported wallets
      }, this.password);
      
      // Add to state
      walletState.addWallet(wallet);
      
      return wallet;
    } catch (error) {
      console.error('Error importing wallet:', error);
      walletState.setError(error instanceof Error ? error.message : 'Failed to import wallet');
      throw error;
    } finally {
      walletState.setLoading(false);
    }
  }
  
  /**
   * Load wallets for a user
   */
  async loadWallets(twitterUsername: string): Promise<void> {
    try {
      walletState.setLoading(true);
      
      // Ensure we have a password
      if (!this.password) {
        throw new Error('Password not set. Please unlock the wallet first.');
      }
      
      // Get wallets from secure storage
      const fullWallets = await secureStorage.getWallets(twitterUsername, this.password);
      
      // Convert to public wallet objects (without private keys)
      const wallets: Wallet[] = fullWallets.map(w => ({
        address: w.address,
        name: w.name,
        balance: w.balance,
        twitterUsername: w.twitterUsername,
        networkId: w.networkId,
        isImported: w.isImported,
        created: w.created
      }));
      
      // Update state
      walletState.setWallets(wallets);
      walletState.setAuthenticated(true);
      
      // Update balances in the background
      this.updateAllBalances();
    } catch (error) {
      console.error('Error loading wallets:', error);
      walletState.setError(error instanceof Error ? error.message : 'Failed to load wallets');
      walletState.setAuthenticated(false);
    } finally {
      walletState.setLoading(false);
    }
  }
  
  /**
   * Update balances for all wallets
   */
  async updateAllBalances(): Promise<void> {
    const { wallets, currentNetwork } = walletState.getState();
    
    // Update each wallet balance
    for (const wallet of wallets) {
      try {
        await blockchainService.updateWalletBalance(wallet, currentNetwork);
      } catch (error) {
        console.error(`Error updating balance for wallet ${wallet.address}:`, error);
      }
    }
  }
  
  /**
   * Send a transaction
   */
  async sendTransaction(
    fromAddress: string,
    toAddress: string,
    amount: string
  ): Promise<string> {
    try {
      walletState.setLoading(true);
      
      // Ensure we have a password
      if (!this.password) {
        throw new Error('Password not set. Please unlock the wallet first.');
      }
      
      const { currentNetwork, wallets } = walletState.getState();
      
      // Find the wallet
      const wallet = wallets.find(w => w.address === fromAddress);
      if (!wallet) {
        throw new Error('Wallet not found');
      }
      
      // Get full wallet with private key
      const fullWallets = await secureStorage.getWallets(wallet.twitterUsername!, this.password);
      const fullWallet = fullWallets.find(w => w.address === fromAddress);
      
      if (!fullWallet || !fullWallet.privateKey) {
        throw new Error('Cannot send from an imported wallet without private key');
      }
      
      // Send transaction
      const tx = await blockchainService.sendTransaction(
        fullWallet.privateKey,
        toAddress,
        amount,
        currentNetwork
      );
      
      // Update balance after a short delay
      setTimeout(async () => {
        try {
          await blockchainService.updateWalletBalance(wallet, currentNetwork);
        } catch (error) {
          console.error('Error updating balance after transaction:', error);
        }
      }, 3000);
      
      return tx.hash;
    } catch (error) {
      console.error('Error sending transaction:', error);
      walletState.setError(error instanceof Error ? error.message : 'Failed to send transaction');
      throw error;
    } finally {
      walletState.setLoading(false);
    }
  }
  
  /**
   * Change the current network
   */
  async changeNetwork(networkId: string): Promise<void> {
    try {
      // Validate network ID
      blockchainService.getNetworkConfig(networkId);
      
      // Update state
      walletState.setNetwork(networkId);
      
      // Refresh balances for the new network
      await this.updateAllBalances();
    } catch (error) {
      console.error('Error changing network:', error);
      walletState.setError(error instanceof Error ? error.message : 'Failed to change network');
    }
  }
  
  /**
   * Remove a wallet
   */
  async removeWallet(twitterUsername: string, address: string): Promise<void> {
    try {
      walletState.setLoading(true);
      
      // Ensure we have a password
      if (!this.password) {
        throw new Error('Password not set. Please unlock the wallet first.');
      }
      
      // Remove from secure storage
      await secureStorage.removeWallet(twitterUsername, address, this.password);
      
      // Update state
      const { wallets, currentWallet } = walletState.getState();
      const updatedWallets = wallets.filter(w => w.address !== address);
      walletState.setWallets(updatedWallets);
      
      // If we removed the current wallet, select another one
      if (currentWallet && currentWallet.address === address) {
        walletState.setCurrentWallet(updatedWallets.length > 0 ? updatedWallets[0] : null);
      }
    } catch (error) {
      console.error('Error removing wallet:', error);
      walletState.setError(error instanceof Error ? error.message : 'Failed to remove wallet');
    } finally {
      walletState.setLoading(false);
    }
  }
  
  /**
   * Lock the wallet (clear password)
   */
  lock(): void {
    this.password = null;
    walletState.setAuthenticated(false);
  }
  
  /**
   * Clear all wallet data
   */
  async clearAllData(): Promise<void> {
    try {
      await secureStorage.clearAllWallets();
      this.password = null;
      walletState.resetState();
    } catch (error) {
      console.error('Error clearing all data:', error);
      walletState.setError(error instanceof Error ? error.message : 'Failed to clear wallet data');
    }
  }
}

// Create singleton instance
export const walletManager = new WalletManager();

// Export default for convenience
export default walletManager; 