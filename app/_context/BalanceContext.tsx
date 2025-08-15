'use client';

import { createContext, useContext, useState, useCallback } from 'react';

interface BalanceContextType {
  balance: number;
  addToBalance: (amount: number) => void;
  formatBalance: (amount: number) => string;
  pendingDeposit: number | null;
  setPendingDeposit: (amount: number | null) => void;
  confirmDeposit: () => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export function BalanceProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(0);
  const [pendingDeposit, setPendingDeposit] = useState<number | null>(null);

  const addToBalance = useCallback((amount: number) => {
    setBalance(prev => prev + amount);
  }, []);

  const formatBalance = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  const confirmDeposit = useCallback(() => {
    if (pendingDeposit !== null) {
      addToBalance(pendingDeposit);
      setPendingDeposit(null);
    }
  }, [pendingDeposit, addToBalance]);

  return (
    <BalanceContext.Provider 
      value={{ 
        balance, 
        addToBalance, 
        formatBalance,
        pendingDeposit,
        setPendingDeposit,
        confirmDeposit
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
}
