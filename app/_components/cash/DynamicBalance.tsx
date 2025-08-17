'use client';

import { useEffect, useState, useCallback } from 'react';
import { useBalance } from '../../_context/BalanceContext';

interface DynamicBalanceProps {
  className?: string;
  onClick?: () => void;
  title?: string;
  showLabel?: boolean;
  showSubtext?: boolean;
}

export function DynamicBalance({ 
  className = "", 
  onClick, 
  title = "Click to view investment options",
  showLabel = true,
  showSubtext = true
}: DynamicBalanceProps) {
  const { balance, formatBalance, updateTrigger, forceUpdate, refreshBalance } = useBalance();
  const [displayBalance, setDisplayBalance] = useState(balance);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  // Smart balance refresh system
  const updateDisplayBalance = useCallback(() => {
    const now = Date.now();
    console.log('DynamicBalance - Updating display balance:', balance, 'at', now);
    setDisplayBalance(balance);
    setLastUpdateTime(now);
  }, [balance]);

  // Refresh on mount
  useEffect(() => {
    console.log('DynamicBalance - Component mounted, initial balance:', balance);
    updateDisplayBalance();
  }, []);

  // Refresh when balance context triggers change
  useEffect(() => {
    console.log('DynamicBalance - Balance context updated:', balance, 'trigger:', updateTrigger);
    updateDisplayBalance();
  }, [balance, updateTrigger, updateDisplayBalance]);

  // Refresh when force update triggers
  useEffect(() => {
    console.log('DynamicBalance - Force update triggered:', forceUpdate);
    updateDisplayBalance();
  }, [forceUpdate, updateDisplayBalance]);

  // Call manual refresh from context when needed
  useEffect(() => {
    if (displayBalance !== balance) {
      console.log('DynamicBalance - Balance mismatch detected, calling manual refresh');
      refreshBalance();
    }
  }, [displayBalance, balance, refreshBalance]);

  // Periodic refresh check (every 1 second) to catch any missed updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (displayBalance !== balance) {
        console.log('DynamicBalance - Periodic check: balance mismatch detected');
        console.log('Display balance:', displayBalance, 'Actual balance:', balance);
        updateDisplayBalance();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [displayBalance, balance, updateDisplayBalance]);

  // Force refresh on window focus (in case user returns from another tab)
  useEffect(() => {
    const handleFocus = () => {
      console.log('DynamicBalance - Window focused, checking balance');
      if (displayBalance !== balance) {
        updateDisplayBalance();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [displayBalance, balance, updateDisplayBalance]);

  return (
    <div className="text-center">
      {showLabel && (
        <p className="text-white/70 text-sm mb-2">USD</p>
      )}
      <button
        onClick={onClick}
        className={`text-5xl font-bold text-white hover:text-blue-400 transition-colors cursor-pointer pointer-events-auto drop-shadow-lg ${className}`}
        title={title}
        key={`dynamic-balance-${displayBalance}-${lastUpdateTime}`} // Force re-render when balance changes
      >
        {formatBalance(displayBalance)}
      </button>
      {showSubtext && (
        <>
          <p className="text-white/50 text-xs mt-1">
            Total Balance
          </p>
          <p className="text-white/40 text-xs mt-1 italic">
            Tap balance to invest
          </p>
        </>
      )}
    </div>
  );
}
