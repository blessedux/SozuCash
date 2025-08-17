'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { useBalance } from '../../../_context/BalanceContext';

export function DepositPage() {
  const [depositAmount, setDepositAmount] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmedAmount, setConfirmedAmount] = useState<number | null>(null);
  const { confirmDeposit, formatBalance, setPendingDeposit, balance } = useBalance();

  // Debug balance updates
  useEffect(() => {
    console.log('DepositPage - Balance updated:', balance);
  }, [balance]);

  const handleDepositAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setDepositAmount(value);
  };

  const handleDepositSubmit = () => {
    const amount = parseFloat(depositAmount);
    if (depositAmount && amount > 0) {
      console.log('DepositPage - Starting deposit process:', amount);
      setPendingDeposit(amount);
      setConfirmedAmount(amount);
      setIsConfirming(true);

      // Auto-confirm after 2 seconds
      setTimeout(() => {
        console.log('DepositPage - Auto-confirming deposit:', amount);
        confirmDeposit();
        
        // Add a small delay to ensure balance update is visible
        setTimeout(() => {
          setIsConfirming(false);
          setDepositAmount('');
          setConfirmedAmount(null);
        }, 500); // Show confirmation for 500ms more
      }, 2000);
    }
  };

  // Clear state when unmounting
  useEffect(() => {
    return () => {
      setDepositAmount('');
      setIsConfirming(false);
      setConfirmedAmount(null);
    };
  }, []);

  // Calculate the new balance that will be shown after confirmation
  const newBalance = confirmedAmount ? balance + confirmedAmount : balance;

  return (
    <div className="w-full h-full flex flex-col justify-center">
      {!isConfirming ? (
        <>
          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-lg font-bold text-white mb-2 text-center drop-shadow-lg"
          >
            Deposit
          </motion.h1>

          {/* Current Balance Display */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-center mb-4"
          >
            <p className="text-white/50 text-sm mb-1">Current Balance</p>
            <p className="text-white/80 text-lg font-semibold">{formatBalance(balance)}</p>
          </motion.div>

          {/* Amount Input Field */}
          <div className="relative mb-6 bg-transparent">
            <Input
              type="text"
              inputMode="decimal"
              value={depositAmount}
              onChange={handleDepositAmountChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleDepositSubmit();
                }
              }}
              placeholder="0.00"
              className="w-full border border-white/20 text-white text-4xl font-bold text-center py-8 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/30 pointer-events-auto shadow-lg"
            />
            {depositAmount && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 text-lg">
                USD
              </div>
            )}
          </div>

          {/* Enter Button */}
          <Button
            onClick={handleDepositSubmit}
            disabled={!depositAmount || parseFloat(depositAmount) <= 0}
            className="w-full font-semibold py-4 px-6 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 shadow-lg"
          >
            Enter
          </Button>
        </>
      ) : (
        /* Confirmation Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full flex flex-col justify-center items-center text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-400/30"
          >
            <span className="text-green-400 text-4xl">✓</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-white mb-3"
          >
            Deposit Confirmed!
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center space-y-2 mb-4"
          >
            <p className="text-white/70">
              <span className="text-green-400 font-semibold">+{formatBalance(confirmedAmount || 0)}</span> added
            </p>
            <p className="text-white/50 text-sm">
              New Balance: <span className="text-white font-semibold">{formatBalance(newBalance)}</span>
            </p>
          </motion.div>
          <button
                onClick={handleDepositSubmit}
                disabled={isConfirming}
                className="w-full font-semibold py-4 px-6 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 shadow-lg"
              >
                Confirm
              </button>
        </motion.div>
      )}
    </div>
  );
}
