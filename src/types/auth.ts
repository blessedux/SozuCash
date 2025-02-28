export interface User {
  id: string;
  username: string;
  profile_image_url: string;
}

export interface Wallet {
  address: string;
  balance: string;
  user?: User;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentWallet?: Wallet;
} 