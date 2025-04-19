/// <reference types="chrome"/>interface WalletState {
  isAuthenticated: boolean;
  user?: {
    id: string;
    username: string;
    profile_image_url: string;
  };
  currentWallet?: string;
  wallets: Array<{
    publicKey: string;
    label: string;
    balance: number;
  }>;
}

interface AuthResult {
  success: boolean;
  user?: any;
  error?: string;
} 