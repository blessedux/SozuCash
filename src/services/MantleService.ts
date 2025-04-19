/// <reference types="chrome"/>import { JsonRpcProvider, Wallet, formatEther, parseEther, formatUnits } from 'ethers';
import { MANTLE_NETWORK } from '../config/networks';

export class MantleService {
  private static instance: MantleService;
  private provider: JsonRpcProvider;
  
  private constructor() {
    this.provider = new JsonRpcProvider(MANTLE_NETWORK.rpcUrls[0]);
  }

  static getInstance(): MantleService {
    if (!MantleService.instance) {
      MantleService.instance = new MantleService();
    }
    return MantleService.instance;
  }

  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.provider.getBalance(address);
      return formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      throw new Error('Failed to fetch balance');
    }
  }

  async sendTransaction(
    from: string,
    to: string,
    amount: string,
    privateKey: string
  ): Promise<any> {
    try {
      const wallet = new Wallet(privateKey, this.provider);
      const tx = await wallet.sendTransaction({
        to,
        value: parseEther(amount),
        gasLimit: 21000,
      });
      return tx;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw new Error('Failed to send transaction');
    }
  }

  async getGasPrice(): Promise<string> {
    const feeData = await this.provider.getFeeData();
    return formatUnits(feeData.gasPrice || 0, 'gwei');
  }

  async estimateGas(
    from: string,
    to: string,
    amount: string
  ): Promise<string> {
    const estimate = await this.provider.estimateGas({
      from,
      to,
      value: parseEther(amount)
    });
    return estimate.toString();
  }
} 