/// <reference types="chrome"/>

import { MantleService } from '../services/MantleService';

// Simplified wallet utils for mock functionality
export async function getBalance(address: string): Promise<string> {
  const mantleService = MantleService.getInstance();
  return mantleService.getBalance(address);
}

export async function sendTransaction(
  to: string, 
  amount: string
): Promise<string> {
  try {
    const mantleService = MantleService.getInstance();
    const tx = await mantleService.sendTransaction(to, amount);
    return tx.hash;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw new Error('Failed to send transaction');
  }
}

// Get token balance for a token address
export async function getTokenBalance(
  address: string,
  tokenAddress: string
): Promise<string> {
  const mantleService = MantleService.getInstance();
  return mantleService.getTokenBalance(address, tokenAddress);
}

// Get network information
export function getNetworkInfo() {
  const mantleService = MantleService.getInstance();
  return mantleService.getNetworkInfo();
} 