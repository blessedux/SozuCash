/// <reference types="chrome"/>

export interface User {
  id: string;
  username: string;
  profile_image_url?: string;
}

export interface Wallet {
  id: string;
  address: string;
  user?: User;
  balance: number;
}

export enum AuthErrorCode {
  UNAUTHORIZED = 'unauthorized',
  USER_CANCELLED = 'user_cancelled',
  POPUP_BLOCKED = 'popup_blocked',
  NETWORK_ERROR = 'network_error',
  CONSENT_REQUIRED = 'consent_required'
}

export interface AuthState {
  isAuthenticated: boolean;
  user?: User | null;
  wallet?: Wallet | null;
  lastError?: string | null;
} 