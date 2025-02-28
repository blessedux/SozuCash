import { ethers } from 'ethers';
import { HDNode } from '@ethersproject/hdnode';
import { encrypt } from '@metamask/browser-passworder';
import { MantleService } from '../services/MantleService';
import { PasswordService } from '../services/PasswordService';

export async function createOrLoadWallet(userId: string) {
  try {
    // Check if wallet exists in storage
    const { wallets } = await chrome.storage.local.get('wallets');
    if (wallets && wallets.length > 0) {
      return wallets[0]; // Return existing wallet
    }

    // Generate new wallet
    const wallet = await generateNewEVMWallet(userId);
    
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

async function generateNewEVMWallet(userId: string) {
  try {
    // Generate random mnemonic
    const mnemonic = ethers.Wallet.createRandom().mnemonic?.phrase;
    if (!mnemonic) throw new Error('Failed to generate mnemonic');

    // Create HD wallet
    const hdNode = HDNode.fromMnemonic(mnemonic);
    
    // Derive path for Mantle (using standard Ethereum path)
    // m/44'/60'/0'/0/0 is the standard Ethereum derivation path
    const derivationPath = `m/44'/60'/0'/0/${userId}`;
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, derivationPath);

    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: mnemonic,
      derivationPath
    };
  } catch (error) {
    console.error('Error generating wallet:', error);
    throw new Error('Failed to generate wallet');
  }
}

async function storeWallet(wallet: any) {
  try {
    // Encrypt sensitive data
    const encryptedPrivateKey = await encryptData(wallet.privateKey);
    const encryptedMnemonic = await encryptData(wallet.mnemonic);
    
    await chrome.storage.local.set({
      wallets: [{
        address: wallet.address,
        encryptedPrivateKey,
        encryptedMnemonic,
        derivationPath: wallet.derivationPath,
        network: 'mantle',
        chainId: 5000
      }]
    });
  } catch (error) {
    console.error('Error storing wallet:', error);
    throw new Error('Failed to store wallet');
  }
}

async function encryptData(data: any): Promise<string> {
  try {
    // Use MetaMask's browser-passworder for proper encryption
    // This is a secure way to store sensitive data in the browser
    const password = 'your-secure-password'; // TODO: Implement proper password management
    return await encrypt(password, data);
  } catch (error) {
    console.error('Error encrypting data:', error);
    throw new Error('Failed to encrypt wallet data');
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