/// <reference types="chrome"/>import { ethers } from 'ethers';
import { HDNodeWallet } from 'ethers';
import { encrypt, decrypt } from '@metamask/browser-passworder';
import { MantleService } from '../services/MantleService';
import { PasswordService } from '../services/PasswordService';

export interface WalletData {
  address: string;
  privateKey: string;
  mnemonic: string;
}

export async function createOrLoadWallet(userId: string) {
  try {
    // Check if wallet exists in storage
    const { wallets } = await chrome.storage.local.get('wallets');
    if (wallets && wallets.length > 0) {
      return wallets[0]; // Return existing wallet
    }

    // Generate new wallet
    const wallet = await generateWallet();
    
    // Store wallet securely
    await storeWallet(wallet);
    
    return {
      publicKey: wallet.address,
      balance: "0.00",
      address: wallet.address, // EVM address
      chainId: 5000, // Mantle Mainnet
      network: 'mantle',
      user: {
        id: userId,
        username: 'user',
        profile_image_url: ''
      }
    };
  } catch (error) {
    console.error('Failed to create/load wallet:', error);
    throw new Error('Failed to initialize wallet');
  }
}

export async function generateWallet(): Promise<WalletData> {
  // In ethers v6, we use HDNodeWallet.createRandom() instead of Wallet.createRandom()
  const wallet = HDNodeWallet.createRandom();
  
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase || ''
  };
}

export async function encryptWallet(wallet: WalletData, password: string): Promise<string> {
  return encrypt(password, JSON.stringify(wallet));
}

export async function decryptWallet(encryptedWallet: string, password: string): Promise<WalletData> {
  const decryptedString = await decrypt(password, encryptedWallet);
  if (typeof decryptedString !== 'string') {
    throw new Error('Decrypted data is not a string');
  }
  
  const parsed = JSON.parse(decryptedString) as WalletData;
  
  if (!isWalletData(parsed)) {
    throw new Error('Invalid wallet data format');
  }
  
  return parsed;
}

// Type guard to validate WalletData shape
function isWalletData(data: any): data is WalletData {
  return (
    typeof data === 'object' &&
    typeof data.address === 'string' &&
    typeof data.privateKey === 'string' &&
    typeof data.mnemonic === 'string'
  );
}

export async function importWallet(mnemonic: string): Promise<WalletData> {
  // In ethers v6, we use HDNodeWallet.fromPhrase() instead of Wallet.fromMnemonic()
  const wallet = HDNodeWallet.fromPhrase(mnemonic);
  
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase || ''
  };
}

export async function validateMnemonic(mnemonic: string): Promise<boolean> {
  try {
    await importWallet(mnemonic);
    return true;
  } catch (error) {
    return false;
  }
}

async function storeWallet(wallet: WalletData) {
  try {
    // Encrypt sensitive data
    const encryptedPrivateKey = await encryptWallet(wallet, 'your-secure-password');
    const encryptedMnemonic = await encryptWallet(wallet, 'your-secure-password');
    
    await chrome.storage.local.set({
      wallets: [{
        address: wallet.address,
        encryptedPrivateKey,
        encryptedMnemonic,
        network: 'mantle',
        chainId: 5000
      }]
    });
  } catch (error) {
    console.error('Error storing wallet:', error);
    throw new Error('Failed to store wallet');
  }
}

// Add utility functions for Mantle network
export const MANTLE_NETWORK = {
  chainId: '0x1388', // 5000 in hex
  chainName: 'Mantle Network',
  nativeCurrency: {
    name: 'MNT',
    symbol: 'MNT',
    decimals: 18
  },
  rpcUrls: ['https://rpc.mantle.xyz'],
  blockExplorerUrls: ['https://explorer.mantle.xyz']
};

export async function getWalletBalance(address: string): Promise<string> {
  const mantleService = MantleService.getInstance();
  return mantleService.getBalance(address);
}

export async function sendMNT(
  fromAddress: string,
  toAddress: string,
  amount: string
): Promise<string> {
  try {
    const passwordService = PasswordService.getInstance();
    const mantleService = MantleService.getInstance();

    // Get wallet from storage
    const { wallets } = await chrome.storage.local.get('wallets');
    const wallet = wallets.find((w: any) => w.address === fromAddress);
    if (!wallet) throw new Error('Wallet not found');

    // Decrypt private key
    const privateKey = await passwordService.decryptData(wallet.encryptedPrivateKey);

    // Send transaction
    const tx = await mantleService.sendTransaction(
      fromAddress,
      toAddress,
      amount,
      privateKey
    );

    return tx.hash;
  } catch (error) {
    console.error('Error sending MNT:', error);
    throw error;
  }
}

export async function estimateTransactionFee(
  fromAddress: string,
  toAddress: string,
  amount: string
): Promise<{
  gasPrice: string;
  estimatedGas: string;
  totalFee: string;
}> {
  const mantleService = MantleService.getInstance();
  
  const [gasPrice, estimatedGas] = await Promise.all([
    mantleService.getGasPrice(),
    mantleService.estimateGas(fromAddress, toAddress, amount)
  ]);

  const totalFee = (
    parseFloat(gasPrice) * parseFloat(estimatedGas) / 1e9
  ).toString();

  return {
    gasPrice,
    estimatedGas,
    totalFee
  };
}

// Add to package.json:
// "@ethersproject/hdnode": "^5.7.0",
// "ethers": "^5.7.2",
// "@metamask/browser-passworder": "^4.1.0" 