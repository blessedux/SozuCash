'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AnimatedTransition } from '../../shared/AnimatedTransition';
import { NFCPayment } from '../features/NFCPayment';
import { UserSearch } from '../features/UserSearch';
import { PaymentForm } from '../features/PaymentForm';

interface UserProfile {
  pfp: string;
  name: string;
  handle: string;
}

export function PayPage() {
  const [showSendScreen, setShowSendScreen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [sendPaymentSuccess, setSendPaymentSuccess] = useState(false);
  const router = useRouter();

  const handleUserSelect = (user: UserProfile) => {
    setSelectedUser(user);
  };

  const handlePaymentComplete = (amount: string) => {
    setSendPaymentSuccess(true);
    // In a real app, this would trigger a blockchain transaction
    console.log('Payment completed:', { amount, recipient: selectedUser?.handle });
  };

  const resetPayment = () => {
    setShowSendScreen(false);
    setSelectedUser(null);
    setSendPaymentSuccess(false);
  };

  return (
    <AnimatedTransition className="w-full h-full flex flex-col">
      {!showSendScreen ? (
        /* Pay Content */
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full h-full flex flex-col"
        >
          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-lg font-bold text-white text-center -mt-6 drop-shadow-lg"
          >
            Pay
          </motion.h1>
          
          {/* USD Balance Display */}
          <div className="mb-6">
            <p className="text-white/50 text-sm mb-1">USD</p>
            <button 
              onClick={() => router.push('/receive')}
              className="text-4xl font-bold text-white hover:text-blue-400 transition-colors cursor-pointer pointer-events-auto"
            >
              $0.00
            </button>
          </div>

          {/* NFC Payment */}
          <div className="flex justify-center relative">
            <NFCPayment
              onSuccess={() => console.log('NFC payment successful')}
              onError={(error) => console.error('NFC error:', error)}
            />
          </div>

          {/* Send Money Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setShowSendScreen(true)}
            className="mt-6 text-white/70 text-sm hover:text-white transition-colors"
          >
            Or send money to a user →
          </motion.button>
        </motion.div>
      ) : (
        /* Send Content */
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full h-full flex flex-col justify-center"
        >
          {!sendPaymentSuccess ? (
            <>
              {/* Title */}
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-lg font-bold text-white mb-4 text-center drop-shadow-lg"
              >
                Send to User
              </motion.h1>
              
              {/* User Search */}
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
                className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-400/30"
              >
                <span className="text-green-400 text-4xl">✓</span>
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
        </motion.div>
      )}
    </AnimatedTransition>
  );
}
