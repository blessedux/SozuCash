export interface WalletState {
  address: string;
  balance: string;
  network: 'mantle';
  chainId: number;
  encryptedPrivateKey: string;
  encryptedMnemonic: string;
  derivationPath: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
} 