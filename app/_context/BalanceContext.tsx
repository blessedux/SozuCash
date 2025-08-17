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
  const [updateTrigger, setUpdateTrigger] = useState(0); // Force re-renders

  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load balance from local storage on mount
  useEffect(() => {
    if (mounted) {
      const storedBalance = localStorage.getItem(BALANCE_STORAGE_KEY);
      console.log('Loading balance from storage:', storedBalance);
      if (storedBalance) {
        const parsedBalance = parseFloat(storedBalance);
        if (!isNaN(parsedBalance)) {
          console.log('Setting initial balance to:', parsedBalance);
          setBalance(parsedBalance);
        }
      } else {
        console.log('No stored balance found, using default: 0');
      }
    }
  }, [mounted]);

  // Save balance to local storage whenever it changes
  useEffect(() => {
    if (mounted) {
      console.log('Saving balance to storage:', balance);
      localStorage.setItem(BALANCE_STORAGE_KEY, balance.toString());
      // Force a re-render of all components using this context
      setUpdateTrigger(prev => prev + 1);
    }
  }, [balance, mounted]);

  // Debug balance changes
  useEffect(() => {
    console.log('BalanceContext - Balance changed to:', balance);
  }, [balance]);

  const addToBalance = useCallback((amount: number) => {
    console.log('Adding to balance:', amount, 'Current balance:', balance);
    setBalance(prev => {
      const newBalance = prev + amount;
      console.log('New balance will be:', newBalance);
      return newBalance;
    });
  }, [balance]);

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
      console.log('Confirming deposit:', pendingDeposit);
      console.log('Current balance before deposit:', balance);
      addToBalance(pendingDeposit);
      setPendingDeposit(null);
      // Force immediate update
      setUpdateTrigger(prev => prev + 1);
      console.log('Deposit confirmed, updateTrigger incremented');
    }
  }, [pendingDeposit, addToBalance, balance]);

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
