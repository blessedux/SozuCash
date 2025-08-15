'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import SplineBackground from '@/components/SplineBackground';

export default function LockedScreen() {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const router = useRouter();

  const handleUnlock = async () => {
    setIsUnlocking(true);
    
    // Simulate authentication process with better timing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Navigate to the main app
    router.push('/app-navigation');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Spline Background Animation */}
      <SplineBackground scale={1.2} />

      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full flex items-center justify-center px-4">
        <div className="text-center max-w-sm mx-auto">
          {/* Glassmorphism Card */}
          <div className="bg-black/60 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <img 
              src="/sozu-logo.png" 
              alt="Sozu Cash" 
              className="h-16 mx-auto mb-6"
            />
          </motion.div>



          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-2xl font-bold text-white mb-3"
          >
            Wallet Locked
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg text-white/70 mb-8"
          >
            Use Face ID or Touch ID to unlock
          </motion.p>

          {/* Unlock Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <button
              onClick={handleUnlock}
              disabled={isUnlocking}
              className={`w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 ${
                isUnlocking 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-white/20 active:scale-95'
              }`}
            >
              {isUnlocking ? (
                <div className="flex items-center justify-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span>Unlocking...</span>
                </div>
              ) : (
                'Unlock with Face ID'
              )}
            </button>
          </motion.div>

          {/* Alternative Options */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-6 space-y-3"
          >
            <button className="w-full text-white/50 hover:text-white/70 transition-colors text-sm">
              Use Passcode
            </button>
            <button className="w-full text-white/50 hover:text-white/70 transition-colors text-sm">
              Forgot Passcode?
                         </button>
           </motion.div>
          </div>
        </div>
       </div>

      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-6 py-4">
        <div className="text-white/70 text-sm">9:41</div>
        <div className="flex items-center space-x-1">
          <div className="w-6 h-3 border border-white/70 rounded-sm">
            <div className="w-4 h-1 bg-white/70 rounded-sm m-0.5"></div>
          </div>
          <div className="text-white/70 text-xs">100%</div>
        </div>
      </div>

      {/* Back to Landing */}
      <button 
        onClick={() => router.push('/')}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-white/50 hover:text-white/70 transition-colors text-sm"
      >
        ← Back to Landing
      </button>
    </div>
  );
}
