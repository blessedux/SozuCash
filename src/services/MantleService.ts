import { ethers } from 'ethers';
import { MANTLE_NETWORK } from '../utils/wallet';

export class MantleService {
  private static instance: MantleService;
  private provider: ethers.providers.JsonRpcProvider;
  
  private constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(MANTLE_NETWORK.rpcUrls[0]);
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
      return ethers.utils.formatEther(balance);
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
  ): Promise<ethers.providers.TransactionResponse> {
    try {
      const wallet = new ethers.Wallet(privateKey, this.provider);
      const tx = await wallet.sendTransaction({
        to,
        value: ethers.utils.parseEther(amount),
        gasLimit: 21000,
      });
      return tx;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw new Error('Failed to send transaction');
    }
  }

  async getGasPrice(): Promise<string> {
    const gasPrice = await this.provider.getGasPrice();
    return ethers.utils.formatUnits(gasPrice, 'gwei');
  }

  async estimateGas(
    from: string,
    to: string,
    amount: string
  ): Promise<string> {
    const estimate = await this.provider.estimateGas({
      from,
      to,
      value: ethers.utils.parseEther(amount)
    });
    return estimate.toString();
  }
} 