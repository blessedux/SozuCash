/// <reference types="chrome"/>export enum AuthErrorCode {
  UNAUTHORIZED = 'unauthorized',
  USER_CANCELLED = 'user_cancelled',
  POPUP_BLOCKED = 'popup_blocked',
  NETWORK_ERROR = 'network_error',
  CONSENT_REQUIRED = 'consent_required'
}

export class AuthError extends Error {
  constructor(message: string, public code: AuthErrorCode) {
    super(message);
    this.name = 'AuthError';
  }
}

export function handleAuthError(error: any): string {
  if (error instanceof AuthError) {
    return error.message;
  }
  return 'An unexpected error occurred';
} 