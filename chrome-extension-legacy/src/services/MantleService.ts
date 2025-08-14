/// <reference types="chrome"/>

import NetworksConfig from '../config/networks';

/**
 * Simplified mock MantleService - for testing purposes only
 * No real blockchain interactions are performed
 */
export class MantleService {
  private static instance: MantleService;
  
  private constructor() {
    // Initialize
  }
  
  static getInstance(): MantleService {
    if (!MantleService.instance) {
      MantleService.instance = new MantleService();
    }
    return MantleService.instance;
  }
  
  // Mock methods
  async getBalance(address: string): Promise<string> {
    console.log(`Mock: Getting balance for ${address}`);
    // Return mock balance
    return "0.5";
  }
  
  async sendTransaction(to: string, amount: string): Promise<{ hash: string }> {
    console.log(`Mock: Sending ${amount} to ${to}`);
    // Return mock transaction hash
    return {
      hash: "0x" + Math.random().toString(16).substring(2, 42)
    };
  }
  
  async getTokenBalance(address: string, tokenAddress: string): Promise<string> {
    console.log(`Mock: Getting token balance for ${address} of token ${tokenAddress}`);
    // Return mock token balance
    return "100.0";
  }
  
  // Mock network info
  getNetworkInfo() {
    return {
      name: "Mantle",
      rpc: NetworksConfig.mantle.rpcUrls[0],
      explorer: NetworksConfig.mantle.blockExplorerUrls[0],
      currency: NetworksConfig.mantle.nativeCurrency
    };
  }
} 