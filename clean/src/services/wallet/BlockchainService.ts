/**
 * BlockchainService.ts
 * Service for blockchain interactions using ethers.js
 */

import { ethers } from 'ethers';
import { walletState, Wallet } from './WalletState';

// Network configuration
interface NetworkConfig {
  name: string;
  rpcUrl: string;
  chainId: number;
  symbol: string;
  explorerUrl: string;
  isTestnet: boolean;
}

// Network configurations
const NETWORKS: Record<string, NetworkConfig> = {
  mantle: {
    name: 'Mantle Network',
    rpcUrl: 'https://rpc.mantle.xyz',
    chainId: 5000,
    symbol: 'MNT',
    explorerUrl: 'https://explorer.mantle.xyz',
    isTestnet: false
  },
  mantleTestnet: {
    name: 'Mantle Testnet',
    rpcUrl: 'https://rpc.testnet.mantle.xyz',
    chainId: 5001,
    symbol: 'MNT',
    explorerUrl: 'https://explorer.testnet.mantle.xyz',
    isTestnet: true
  }
};

/**
 * Blockchain service for wallet operations
 */
class BlockchainService {
  private providers: Record<string, ethers.JsonRpcProvider> = {};
  
  constructor() {
    // Initialize providers for each network
    Object.entries(NETWORKS).forEach(([networkId, config]) => {
      this.providers[networkId] = new ethers.JsonRpcProvider(config.rpcUrl);
    });
  }
  
  /**
   * Get provider for specified network
   */
  getProvider(networkId: string = 'mantle'): ethers.JsonRpcProvider {
    if (!this.providers[networkId]) {
      throw new Error(`Network ${networkId} not supported`);
    }
    return this.providers[networkId];
  }
  
  /**
   * Get network configuration
   */
  getNetworkConfig(networkId: string = 'mantle'): NetworkConfig {
    if (!NETWORKS[networkId]) {
      throw new Error(`Network ${networkId} not supported`);
    }
    return NETWORKS[networkId];
  }
  
  /**
   * Get balance for an address
   */
  async getBalance(address: string, networkId: string = 'mantle'): Promise<string> {
    try {
      const provider = this.getProvider(networkId);
      const balance = await provider.getBalance(address);
      
      // Format balance to ETH units with 4 decimals
      return ethers.formatEther(balance).slice(0, 10);
    } catch (error) {
      console.error(`Error getting balance for ${address}:`, error);
      throw error;
    }
  }
  
  /**
   * Update balance for a wallet in state
   */
  async updateWalletBalance(wallet: Wallet, networkId: string = 'mantle'): Promise<void> {
    try {
      const balance = await this.getBalance(wallet.address, networkId);
      
      // Update wallet in state with new balance
      walletState.updateWallet(wallet.address, { 
        balance,
        networkId
      });
    } catch (error) {
      console.error(`Error updating balance for wallet ${wallet.address}:`, error);
    }
  }
  
  /**
   * Send a transaction
   */
  async sendTransaction(
    fromPrivateKey: string,
    toAddress: string,
    amount: string,
    networkId: string = 'mantle'
  ): Promise<ethers.TransactionResponse> {
    try {
      // Validate inputs
      if (!ethers.isAddress(toAddress)) {
        throw new Error('Invalid recipient address');
      }
      
      if (!fromPrivateKey || fromPrivateKey.length < 32) {
        throw new Error('Invalid private key');
      }
      
      const provider = this.getProvider(networkId);
      const wallet = new ethers.Wallet(fromPrivateKey, provider);
      
      // Get network config for gas
      const networkConfig = this.getNetworkConfig(networkId);
      
      // Convert amount to wei
      const amountWei = ethers.parseEther(amount);
      
      // Create transaction
      const tx = await wallet.sendTransaction({
        to: toAddress,
        value: amountWei,
        chainId: networkConfig.chainId
      });
      
      return tx;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }
  
  /**
   * Get transaction receipt
   */
  async getTransactionReceipt(
    txHash: string,
    networkId: string = 'mantle'
  ): Promise<ethers.TransactionReceipt | null> {
    try {
      const provider = this.getProvider(networkId);
      return await provider.getTransactionReceipt(txHash);
    } catch (error) {
      console.error(`Error getting transaction receipt for ${txHash}:`, error);
      return null;
    }
  }
  
  /**
   * Create a new wallet
   */
  createWallet(twitterUsername: string): { wallet: Wallet, privateKey: string } {
    try {
      // Generate a new random wallet
      const ethersWallet = ethers.Wallet.createRandom();
      
      const wallet: Wallet = {
        address: ethersWallet.address,
        name: `${twitterUsername}'s Wallet`,
        twitterUsername,
        balance: '0',
        created: Date.now(),
        networkId: 'mantle',
        isImported: false
      };
      
      return {
        wallet,
        privateKey: ethersWallet.privateKey
      };
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  }
  
  /**
   * Get explorrer URL for a transaction
   */
  getExplorerUrl(txHash: string, networkId: string = 'mantle'): string {
    const config = this.getNetworkConfig(networkId);
    return `${config.explorerUrl}/tx/${txHash}`;
  }
  
  /**
   * Get explorrer URL for an address
   */
  getAddressExplorerUrl(address: string, networkId: string = 'mantle'): string {
    const config = this.getNetworkConfig(networkId);
    return `${config.explorerUrl}/address/${address}`;
  }
}

// Create singleton instance
export const blockchainService = new BlockchainService();

// Export default for convenience
export default blockchainService; 