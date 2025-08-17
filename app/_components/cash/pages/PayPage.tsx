'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { UserSearch } from '../features/UserSearch';
import { PaymentForm } from '../features/PaymentForm';
import { useBalance } from '../../../_context/BalanceContext';
import { useNavigation } from '../../../_context/NavigationContext';
import { Wifi } from 'lucide-react'; // Added missing import for Wifi icon

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
  const { balance, formatBalance } = useBalance();
  const { setCurrentVerticalPage, currentPage } = useNavigation();

  const handleUserSelect = (user: UserProfile) => { setSelectedUser(user); };
  const handlePaymentComplete = (amount: string) => {
    setSendPaymentSuccess(true);
    console.log('Payment completed:', { amount, recipient: selectedUser?.handle });
  };
  const resetPayment = () => {
    setShowSendScreen(false);
    setSelectedUser(null);
    setSendPaymentSuccess(false);
  };

  // Handle balance click - navigate to Invest page
  const handleBalanceClick = () => {
    // Navigate to Invest page (vertical page 2) if we're on Deposit page (currentPage 1)
    // Otherwise, navigate to Deposit page first, then to Invest
    if (currentPage === 1) {
      // We're on Deposit page, go to Invest
      setCurrentVerticalPage(2);
    } else {
      // We're on Pay page, first go to Deposit, then to Invest
      setCurrentVerticalPage(1); // Go to Deposit
      setTimeout(() => {
        setCurrentVerticalPage(2); // Then go to Invest
      }, 100);
    }
  };

  // Handle NFC button click - navigate to /pay and then back to /cash
  const handleNFCClick = async () => {
    // Navigate to /pay
    router.push('/pay');
    
    // Wait a moment, then navigate back to /cash
    setTimeout(() => {
      router.push('/cash');
    }, 500);
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
          className="w-full h-full flex flex-col justify-center items-center"
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
            
            {/* USD Balance Display */}
            <div className="text-center">
              <p className="text-white/70 text-sm mb-2">USD</p>
              <button
                onClick={handleBalanceClick} // Navigate to Invest page
                className="text-5xl font-bold text-white hover:text-blue-400 transition-colors cursor-pointer pointer-events-auto drop-shadow-lg"
                title="Click to view investment options"
              >
                {formatBalance(balance)}
              </button>
              <p className="text-white/50 text-xs mt-1">
                Total Balance
              </p>
              <p className="text-white/40 text-xs mt-1 italic">
                Tap balance to invest
              </p>
            </div>

            {/* NFC Payment Icon */}
            <div className="flex justify-center">
              <button
                onClick={handleNFCClick}
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
              className="text-white/70 text-sm hover:text-white transition-colors mt-4"
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
        </motion.div>
      )}
    </div>
  );
}