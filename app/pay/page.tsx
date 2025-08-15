'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Wifi, Camera, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

export default function PayScreen() {
  const [currentStep, setCurrentStep] = useState<'input' | 'nfc-ready' | 'processing' | 'success' | 'error'>('input');
  const [amount, setAmount] = useState('');
  const [isNFCReady, setIsNFCReady] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const router = useRouter();

  // Mock NFC detection
  useEffect(() => {
    if (currentStep === 'nfc-ready') {
      const timer = setTimeout(() => {
        setIsNFCReady(true);
        setTimeout(() => {
          setCurrentStep('processing');
          // Simulate payment processing
          setTimeout(() => {
            setPaymentStatus('success');
            setCurrentStep('success');
          }, 2000);
        }, 1500);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handlePay = () => {
    if (amount && parseFloat(amount) > 0) {
      setCurrentStep('nfc-ready');
    }
  };

  const handleBack = () => {
    if (currentStep === 'input') {
      router.back();
    } else {
      setCurrentStep('input');
      setAmount('');
      setIsNFCReady(false);
      setPaymentStatus('pending');
    }
  };

  const handleDone = () => {
    router.push('/app-navigation');
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
          {currentStep === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm"
            >
              <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Send USDC</h2>
                
                {/* Amount Input */}
                <div className="mb-6">
                  <label className="block text-white/70 text-sm mb-2">Amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-4 text-white text-2xl font-semibold text-center placeholder-white/30 focus:outline-none focus:border-white/40 transition-all"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 text-sm">
                      USDC
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Wifi size={20} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">NFC Payment</p>
                        <p className="text-white/50 text-sm">Tap to pay instantly</p>
                      </div>
                    </div>
                    <div className="text-white/30">→</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <Camera size={20} className="text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">QR Code</p>
                        <p className="text-white/50 text-sm">Scan to pay</p>
                      </div>
                    </div>
                    <div className="text-white/30">→</div>
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handlePay}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
                    amount && parseFloat(amount) > 0
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 active:scale-95'
                      : 'bg-white/10 text-white/50 cursor-not-allowed'
                  }`}
                >
                  Pay {formatAmount(amount)}
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 'nfc-ready' && (
            <motion.div
              key="nfc-ready"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-full max-w-sm text-center"
            >
              <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl">
                {/* NFC Animation */}
                <motion.div
                  animate={{ 
                    scale: isNFCReady ? [1, 1.2, 1] : [1, 1.1, 1],
                    opacity: isNFCReady ? [0.5, 1, 0.5] : [0.3, 0.7, 0.3]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border-2 border-blue-400/30"
                >
                  <Wifi size={48} className="text-blue-400" />
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-4">
                  {isNFCReady ? 'NFC Detected!' : 'Ready for NFC'}
                </h2>
                <p className="text-white/70 mb-6">
                  {isNFCReady 
                    ? 'Processing payment...' 
                    : 'Hold your device near the payment terminal'
                  }
                </p>

                {/* Amount Display */}
                <div className="bg-white/10 rounded-2xl p-4 mb-6">
                  <p className="text-white/50 text-sm">Sending</p>
                  <p className="text-3xl font-bold text-white">{formatAmount(amount)}</p>
                </div>

                {/* Loading Animation */}
                <div className="flex justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-full max-w-sm text-center"
            >
              <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl">
                {/* Processing Animation */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border-2 border-blue-400/30"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-8 h-8 bg-blue-400 rounded-full"
                  />
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-4">Processing Payment</h2>
                <p className="text-white/70 mb-6">Please wait while we confirm your transaction</p>

                {/* Amount Display */}
                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-white/50 text-sm">Amount</p>
                  <p className="text-2xl font-bold text-white">{formatAmount(amount)}</p>
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

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  onClick={handleDone}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-2xl font-semibold text-lg hover:from-green-600 hover:to-blue-600 active:scale-95 transition-all"
                >
                  Done
                </motion.button>
              </div>
            </motion.div>
          )}

          {currentStep === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-full max-w-sm text-center"
            >
              <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl">
                {/* Error Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-400/30"
                >
                  <XCircle size={40} className="text-red-400" />
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-4">Payment Failed</h2>
                <p className="text-white/70 mb-6">Something went wrong. Please try again.</p>

                <button
                  onClick={handleBack}
                  className="w-full bg-white/10 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 active:scale-95 transition-all"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
