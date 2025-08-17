'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface BalanceContextType {
  balance: number;
  addToBalance: (amount: number) => void;
  formatBalance: (amount: number) => string;
  pendingDeposit: number | null;
  setPendingDeposit: (amount: number | null) => void;
  confirmDeposit: () => void;
  processDepositFromURL: (amount: string) => void;
  resetBalance: () => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

// Local storage key for balance
const BALANCE_STORAGE_KEY = 'sozu-cash-balance';

export function BalanceProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(0);
  const [pendingDeposit, setPendingDeposit] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load balance from local storage on mount
  useEffect(() => {
    if (mounted) {
      const storedBalance = localStorage.getItem(BALANCE_STORAGE_KEY);
      if (storedBalance) {
        const parsedBalance = parseFloat(storedBalance);
        if (!isNaN(parsedBalance)) {
          setBalance(parsedBalance);
        }
      }
    }
  }, [mounted]);

  // Save balance to local storage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(BALANCE_STORAGE_KEY, balance.toString());
    }
  }, [balance, mounted]);

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

  // Process deposit from URL parameters (for mock integration)
  const processDepositFromURL = useCallback((amount: string) => {
    const depositAmount = parseFloat(amount);
    if (!isNaN(depositAmount) && depositAmount > 0) {
      // Add the deposit amount directly to balance
      addToBalance(depositAmount);
      console.log(`Deposit processed: $${depositAmount} added to balance`);
      return true;
    }
    return false;
  }, [addToBalance]);

  // Reset balance (for testing purposes)
  const resetBalance = useCallback(() => {
    setBalance(0);
    if (mounted) {
      localStorage.removeItem(BALANCE_STORAGE_KEY);
    }
  }, [mounted]);

  return (
    <BalanceContext.Provider 
      value={{ 
        balance, 
        addToBalance, 
        formatBalance,
        pendingDeposit,
        setPendingDeposit,
        confirmDeposit,
        processDepositFromURL,
        resetBalance
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
