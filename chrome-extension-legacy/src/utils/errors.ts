/// <reference types="chrome"/>

import { AuthErrorCode } from '../types/auth';

export const AuthErrors = {
  UNAUTHORIZED: 'unauthorized' as AuthErrorCode,
  USER_CANCELLED: 'user_cancelled' as AuthErrorCode,
  POPUP_BLOCKED: 'popup_blocked' as AuthErrorCode,
  NETWORK_ERROR: 'network_error' as AuthErrorCode,
  CONSENT_REQUIRED: 'consent_required' as AuthErrorCode
};

export class AuthError extends Error {
  code: AuthErrorCode;
  
  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

export function handleAuthError(error: any): string {
  if (error instanceof AuthError) {
    return error.message;
  }
  return 'An unexpected error occurred';
} 