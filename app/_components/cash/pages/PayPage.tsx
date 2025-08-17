'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBalance } from '../../../_context/BalanceContext';
import { useNavigation } from '../../../_context/NavigationContext';
import { UserSearch } from '../features/UserSearch';
import { DynamicBalance } from '../DynamicBalance';
import { Wifi } from 'lucide-react';

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
  const { balance, formatBalance, addToBalance, updateTrigger, forceUpdate } = useBalance();
  const { setCurrentVerticalPage, currentPage } = useNavigation();

  // Debug balance updates
  useEffect(() => {
    console.log('PayPage - Balance updated:', balance);
  }, [balance]);

  // Force re-render when balance changes
  useEffect(() => {
    console.log('PayPage - Re-rendering due to balance change:', balance);
  }, [balance]);

  // Force re-render when update triggers change
  useEffect(() => {
    console.log('PayPage - Force update triggered:', updateTrigger);
  }, [updateTrigger]);

  useEffect(() => {
    console.log('PayPage - Additional force update triggered:', forceUpdate);
  }, [forceUpdate]);

  // Debug component mount/unmount
  useEffect(() => {
    console.log('PayPage - Component mounted with balance:', balance);
    return () => {
      console.log('PayPage - Component unmounting with balance:', balance);
    };
  }, [balance]);

  // Force balance refresh when component mounts or when returning from deposit
  useEffect(() => {
    console.log('PayPage - Component mounted/updated, current balance:', balance);
    // Force a re-render to ensure we have the latest balance
  }, [balance, updateTrigger, forceUpdate]);

  const handleUserSelect = (user: UserProfile) => { setSelectedUser(user); };

  const handleSendPayment = () => {
    setSendPaymentSuccess(true);
    setTimeout(() => {
      setSendPaymentSuccess(false);
      setShowSendScreen(false);
      setSelectedUser(null);
    }, 2000);
  };

  const handleBalanceClick = () => {
    setCurrentVerticalPage(1); // Navigate to Invest page
  };

  const handleNFCButtonClick = () => {
    router.push('/pay');
    setTimeout(() => {
      router.push('/cash');
    }, 5000);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {!showSendScreen ? (
        /* Pay Content - Restructured for better positioning */
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full h-full flex flex-col justify-center items-center rounded-3xl"
        >
          {/* Main Content Container - Positioned in bottom half */}
          <div className="flex flex-col items-center space-y-8 w-full max-w-xs">
            {/* Title - Centered */}
            <motion.h1 
              initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-xl font-bold text-white text-center drop-shadow-lg mt-4"
            >
              Pay
            </motion.h1>
            
            {/* Dynamic Balance Display */}
            <DynamicBalance 
              onClick={handleBalanceClick}
              title="Click to view investment options"
            />

            {/* NFC Payment Icon */}
            <div className="flex justify-center">
              <button
                onClick={handleNFCButtonClick}
                className="w-20 h-20 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 hover:scale-105 transition-all cursor-pointer pointer-events-auto bg-transparent"
                title="Tap to go to payment page"
              >
                <Wifi size={32} className="rotate-45 text-white transition-colors" />
              </button>
            </div>

            {/* Send Money Button - Positioned near bottom */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => setShowSendScreen(true)}
              className="text-white text-sm hover:text-white mt-4"
            >
              Or send money to a user ↓
            </motion.button>
          </div>
        </motion.div>
      ) : (
        /* Send Content */
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full h-full flex flex-col justify-center rounded-3xl"
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
                <div className="space-y-6">
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white text-xl font-bold">
                        {selectedUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{selectedUser.name}</h3>
                    <p className="text-white/60 text-sm">@{selectedUser.handle}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <button
                      onClick={handleSendPayment}
                      className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg"
                    >
                      Send Payment
                    </button>
                  </motion.div>

                  {sendPaymentSuccess && (
                    <motion.div
                      className="text-center p-4 bg-green-500/20 border border-green-500/30 rounded-lg"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-green-400 font-semibold">Payment sent successfully!</p>
                    </motion.div>
                  )}

                  <motion.button
                    onClick={() => setSelectedUser(null)}
                    className="w-full py-3 px-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Choose Different User
                  </motion.button>
                </div>
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
                className="w-20 h-20 mx-auto border-2 border-white/20 rounded-full flex items-center justify-center"
              >
                <span className="text-white text-4xl">✓</span>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => {
                  setShowSendScreen(false);
                  setSelectedUser(null);
                  setSendPaymentSuccess(false);
                }}
                className="text-white/70 hover:text-white transition-colors"
              >
                Send another payment →
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}