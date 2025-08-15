'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { AnimatedTransition } from '../../shared/AnimatedTransition';
import { useBalance } from '../../../_context/BalanceContext';
import { CheckCircle } from 'lucide-react';

export function ReceivePage() {
  const [receiveAmount, setReceiveAmount] = useState('');
  const [showInvestScreen, setShowInvestScreen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const router = useRouter();
  const { formatBalance, setPendingDeposit, confirmDeposit } = useBalance();

  const handleReceiveAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setReceiveAmount(value);
  };

  const handleReceiveSubmit = () => {
    if (receiveAmount && parseFloat(receiveAmount) > 0) {
      setPendingDeposit(parseFloat(receiveAmount));
      setIsConfirming(true);

      // Auto-confirm after 4 seconds
      setTimeout(() => {
        confirmDeposit();
        router.push('/cash');
      }, 4000);
    }
  };

  // Clear state when unmounting
  useEffect(() => {
    return () => {
      if (!isConfirming) {
        setPendingDeposit(null);
      }
    };
  }, [setPendingDeposit, isConfirming]);

  if (isConfirming) {
    return (
      <AnimatedTransition>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="w-20 h-20 mx-auto border-2 border-white/20 rounded-full flex items-center justify-center"
          >
            <CheckCircle size={40} className="text-white" />
          </motion.div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">
              {formatBalance(parseFloat(receiveAmount))}
            </h2>
            <p className="text-white/70">
              Deposit confirmed
            </p>
          </div>

          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 4, ease: "linear" }}
            className="h-1 bg-white/20 rounded-full mx-auto max-w-[200px]"
          />
        </motion.div>
      </AnimatedTransition>
    );
  }

  return (
    <AnimatedTransition>
      {!showInvestScreen ? (
        <>
          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-lg font-bold text-white mb-8 text-center drop-shadow-2xl"
          >
            Deposit
          </motion.h1>
          
          {/* Amount Input Field */}
          <div className="relative mb-6 bg-transparent">
            <Input
              type="text"
              inputMode="decimal"
              value={receiveAmount}
              onChange={handleReceiveAmountChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleReceiveSubmit();
                }
              }}
              placeholder="0.00"
              className="text-4xl font-bold text-center py-8"
              rightIcon={receiveAmount ? <span className="text-lg">USD</span> : undefined}
            />
          </div>

          {/* Enter Button */}
          <Button 
            onClick={handleReceiveSubmit}
            disabled={!receiveAmount || parseFloat(receiveAmount) <= 0}
            className="w-full"
          >
            Confirm
          </Button>

          {/* Invest Option */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setShowInvestScreen(true)}
            className="mt-6 text-white/70 text-sm hover:text-white transition-colors"
          >
            Or invest your funds →
          </motion.button>
        </>
      ) : (
        /* Invest Screen */
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full h-full flex flex-col justify-center"
        >
          {/* Invest content... */}
        </motion.div>
      )}
    </AnimatedTransition>
  );
}