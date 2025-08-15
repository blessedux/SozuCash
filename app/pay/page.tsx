'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Wifi, Camera, ArrowLeft, CheckCircle } from 'lucide-react';

export default function PayScreen() {
  const [currentStep, setCurrentStep] = useState<'nfc-ready' | 'success'>('nfc-ready');
  const [amount] = useState('9.99'); // Fixed amount for demo
  const router = useRouter();

  const handleNFCConfirm = () => {
    console.log('NFC button clicked!'); // Debug log
    
    // Add payment to local storage for demo purposes
    const paymentHistory = JSON.parse(localStorage.getItem('paymentHistory') || '[]');
    const newPayment = {
      id: Date.now(),
      amount: parseFloat(amount),
      type: 'sent',
      status: 'completed',
      date: new Date().toISOString().split('T')[0],
      hash: `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    };
    paymentHistory.unshift(newPayment);
    localStorage.setItem('paymentHistory', JSON.stringify(paymentHistory));
    
    setCurrentStep('success');
    // Auto return to app after 3 seconds
    setTimeout(() => {
      router.push('/app-navigation');
    }, 3000);
  };

  const handleBack = () => {
    router.back();
  };

  const formatAmount = (value: string) => {
    const num = parseFloat(value);
    return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <button
          onClick={handleBack}
          className="p-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold text-white">Send Payment</h1>
        <div className="w-10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-6 -mt-16">
        <AnimatePresence mode="wait">
          {currentStep === 'nfc-ready' && (
            <motion.div
              key="nfc-ready"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-full max-w-sm text-center"
            >
              <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl">
                {/* NFC Icon - Clickable */}
                <motion.button
                  onClick={handleNFCConfirm}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    boxShadow: [
                      "0 0 0 0 rgba(59, 130, 246, 0.4)",
                      "0 0 0 10px rgba(59, 130, 246, 0)",
                      "0 0 0 0 rgba(59, 130, 246, 0)"
                    ]
                  }}
                  transition={{ 
                    boxShadow: { duration: 2, repeat: Infinity },
                    scale: { duration: 0.1 }
                  }}
                  className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border-2 border-blue-400/30 hover:border-blue-400/60 transition-all cursor-pointer shadow-lg hover:shadow-blue-400/20"
                >
                  <Wifi size={48} className="text-blue-400" />
                </motion.button>

                <h2 className="text-2xl font-bold text-white mb-4">Ready for NFC</h2>
                <p className="text-white/70 mb-6">Tap the blue NFC icon above to confirm payment</p>

                {/* Amount Display */}
                <div className="bg-white/10 rounded-2xl p-4 mb-6">
                  <p className="text-white/50 text-sm">Sending</p>
                  <p className="text-3xl font-bold text-white">{formatAmount(amount)}</p>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-full max-w-sm text-center"
            >
              <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl">
                {/* Success Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-400/30"
                >
                  <CheckCircle size={40} className="text-green-400" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-white mb-4"
                >
                  Payment Successful!
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/70 mb-6"
                >
                  Your payment has been sent successfully
                </motion.p>

                {/* Transaction Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/10 rounded-2xl p-4 mb-6"
                >
                  <p className="text-white/50 text-sm">Amount Sent</p>
                  <p className="text-2xl font-bold text-white">{formatAmount(amount)}</p>
                  <p className="text-white/50 text-xs mt-2">Transaction ID: 0x1234...5678</p>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  className="text-white/50 text-sm"
                >
                  Returning to app...
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
