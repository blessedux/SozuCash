'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { AnimatedTransition } from '../../shared/AnimatedTransition';
import { useWallet } from '../../../_context/WalletContext';

export function ReceivePage() {
  const [receiveAmount, setReceiveAmount] = useState('');
  const [showInvestScreen, setShowInvestScreen] = useState(false);
  const router = useRouter();
  const { walletData } = useWallet();

  const handleReceiveAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setReceiveAmount(value);
  };

  const handleReceiveSubmit = () => {
    if (receiveAmount && parseFloat(receiveAmount) > 0) {
      // Navigate to receive page with the amount
      router.push(`/receive?amount=${receiveAmount}`);
    }
  };

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
            Enter
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
          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-lg font-bold text-white mb-4 text-center"
          >
            Invest
          </motion.h1>
          
          {/* Balance Display */}
          <div className="mb-6 text-center">
            <p className="text-white/50 text-sm mb-1">Available to Invest</p>
            <p className="text-3xl font-bold text-white mb-2">{walletData.balance}</p>
            <p className="text-white/70 text-sm">Earn up to 18.7% APY</p>
          </div>

          {/* Investment Options */}
          <div className="space-y-3 mb-6">
            {[
              {
                title: "Mantle Yield Fund",
                description: "High-yield DeFi strategies",
                apy: "12.5%"
              },
              {
                title: "Stable Growth Fund",
                description: "Conservative strategies",
                apy: "8.2%"
              },
              {
                title: "DeFi Accelerator",
                description: "Aggressive optimization",
                apy: "18.7%"
              }
            ].map((fund) => (
              <Button
                key={fund.title}
                variant="secondary"
                onClick={() => router.push('/invest')}
                className="w-full justify-between p-4"
              >
                <div className="text-left">
                  <h3 className="font-semibold text-sm">{fund.title}</h3>
                  <p className="text-white/70 text-xs">{fund.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-lg">{fund.apy}</p>
                  <p className="text-white/50 text-xs">APY</p>
                </div>
              </Button>
            ))}
          </div>

          {/* View All Funds Button */}
          <Button 
            onClick={() => router.push('/invest')}
            className="w-full"
          >
            View All Funds
          </Button>

          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setShowInvestScreen(false)}
            className="mt-6 text-white/70 text-sm hover:text-white transition-colors"
          >
            ← Back to deposit
          </motion.button>
        </motion.div>
      )}
    </AnimatedTransition>
  );
}
