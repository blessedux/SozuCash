/**
 * Wallet services index
 * Export all wallet-related services
 */

// Export wallet services
export { walletState } from './WalletState';
export type { Wallet, WalletStateData } from './WalletState';
export { blockchainService } from './BlockchainService';
export { secureStorage } from './SecureStorage';
export { walletManager } from './WalletManager';

// Export default as wallet manager for convenience
import { walletManager } from './WalletManager';
export default walletManager; 