export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD';
export type Language = 'English' | 'Spanish' | 'French' | 'German' | 'Chinese' | 'Japanese';

export type UserProfile = {
  name: string;
  image: string;
  username: string;
};

export type WalletData = {
  address: string;
  balance: string;
  qrCode: string;
};

export type WalletState = {
  userProfile: UserProfile;
  walletData: WalletData;
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  selectedLanguage: Language;
  setSelectedLanguage: (language: Language) => void;
  isConnectedToX: boolean;
  setIsConnectedToX: (connected: boolean) => void;
};

export type WalletProps = {
  children: React.ReactNode;
};
