/// <reference types="chrome"/>export interface WalletState {
address: string;
balance: string;
network: 'mantle';
chainId: number;
encryptedPrivateKey: string;
encryptedMnemonic: string;
derivationPath: string;
export {};
