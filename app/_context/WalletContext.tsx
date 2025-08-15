'use client';

import { createContext, useContext, useState } from 'react';
import type { WalletState, WalletProps, Currency, Language, UserProfile, WalletData } from '../_types/wallet';

const WalletContext = createContext<WalletState | undefined>(undefined);

// Mock data - in real app this would come from your backend/blockchain
const mockUserProfile: UserProfile = {
  name: "John Doe",
  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  username: "@johndoe"
};

const mockWalletData: WalletData = {
  address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  balance: "$1,234.56",
  qrCode: "/icons/mntqr.png"
};

export function WalletProvider({ children }: WalletProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('English');
  const [isConnectedToX, setIsConnectedToX] = useState(false);
  
  // In a real app, these would be fetched from your backend
  const userProfile = mockUserProfile;
  const walletData = mockWalletData;

  return (
    <WalletContext.Provider 
      value={{
        userProfile,
        walletData,
        selectedCurrency,
        setSelectedCurrency,
        selectedLanguage,
        setSelectedLanguage,
        isConnectedToX,
        setIsConnectedToX,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
