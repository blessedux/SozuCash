'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useBalance } from '../../../_context/BalanceContext';
import { UserSearch } from '../features/UserSearch';
import { PaymentForm } from '../features/PaymentForm';
import { useWallet } from '../../../_context/WalletContext';

interface UserProfile {
  pfp: string;
  name: string;
  handle: string;
}

export function SendPage() {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [sendPaymentSuccess, setSendPaymentSuccess] = useState(false);
  const { isConnectedToX, setIsConnectedToX } = useWallet();

  const handleUserSelect = (user: UserProfile) => {
    setSelectedUser(user);
  };

  const handlePaymentComplete = (amount: string) => {
    setSendPaymentSuccess(true);
    // In a real app, this would trigger a blockchain transaction
    console.log('Payment completed:', { amount, recipient: selectedUser?.handle });
  };

  const resetPayment = () => {
    setSelectedUser(null);
    setSendPaymentSuccess(false);
  };

  const handleConnectX = () => {
    // Mock X connection - in real app this would open OAuth flow
    setIsConnectedToX(true);
    console.log('Mock X connection established');
  };

  return (
    <div className="w-full h-full flex flex-col justify-center">
      {!sendPaymentSuccess ? (
        <>
          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-lg font-bold text-white mb-4 text-center drop-shadow-lg"
          >
            Send
          </motion.h1>
          
          {/* X Connection Status */}
          {!isConnectedToX ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-center space-y-4"
            >
              <div className="text-white/70 mb-4">
                <p className="text-sm mb-2">Connect your X account to send money to users</p>
                <p className="text-xs text-white/50">Search for users by their X handle</p>
              </div>
              <button
                onClick={handleConnectX}
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-400/30 rounded-lg py-3 px-6 text-sm transition-colors"
              >
                Connect X Account
              </button>
            </motion.div>
          ) : (
            /* User Search or Payment Form */
            <>
              {!selectedUser ? (
                <UserSearch
                  onUserSelect={handleUserSelect}
                />
              ) : (
                /* Payment Form */
                <PaymentForm
                  recipient={selectedUser}
                  onPaymentComplete={handlePaymentComplete}
                  onCancel={() => setSelectedUser(null)}
                />
              )}
            </>
          )}

          {/* Navigation Instructions - Bottom */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
          >
            <p className="text-white/50 text-sm">
              Pay on the Go
            </p>
          </motion.div>
        </>
      ) : (
        /* Success Screen */
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
            <span className="text-white text-4xl">✓</span>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={resetPayment}
            className="text-white/70 hover:text-white transition-colors"
          >
            Send another payment →
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
