'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Wifi, Camera, ArrowLeft, CheckCircle } from 'lucide-react';
import SplineBackground from '../_components/SplineBackground';

export default function PayScreen() {
  const [currentStep, setCurrentStep] = useState<'success'>('success');
  const [amount] = useState('9.99'); // Fixed amount for demo
  const router = useRouter();

  // Add payment to tracking and auto return to app after 3 seconds
  useEffect(() => {
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
    
    // Auto return to app after 3 seconds
    const timer = setTimeout(() => {
      router.push('/app-navigation');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router, amount]);

  const handleBack = () => {
    router.back();
  };

  const formatAmount = (value: string) => {
    const num = parseFloat(value);
    return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Spline Background Animation */}
      <SplineBackground scale={1.2} />

      {/* Sozu Cash Logo */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
        <img 
          src="/sozu-logo.png" 
          alt="Sozu Cash" 
          className="w-20"
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 py-8 pointer-events-none"
        style={{ cursor: 'default' }}
      >

        
        <div className="relative z-20 text-center max-w-sm mx-auto w-full pt-20 pointer-events-auto">
          {/* Glassmorphism Card */}
          <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl w-full h-96 flex items-center justify-center pointer-events-none">
            
            {currentStep === 'success' && (
              /* Payment Success Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 w-full h-full flex flex-col"
              >
                {/* Success Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                  className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-400/30"
                >
                  <CheckCircle size={40} className="text-green-400" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold text-white mb-4 text-center"
                >
                  Payment Successful!
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-white/70 mb-6 text-center"
                >
                  Your payment has been sent successfully
                </motion.p>

                {/* Transaction Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white/10 rounded-2xl p-4 mb-6"
                >
                  <p className="text-white/50 text-sm text-center">Amount Sent</p>
                  <p className="text-3xl font-bold text-white text-center">{formatAmount(amount)}</p>
                  <p className="text-white/50 text-xs mt-2 text-center">Transaction ID: 0x1234...5678</p>
                </motion.div>


              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
