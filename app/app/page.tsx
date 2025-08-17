'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AnimatedTransition } from '../_components/shared/AnimatedTransition';

export default function LockedScreen() {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const router = useRouter();

  // Debug logging
  useEffect(() => {
    console.log('🔍 LockedScreen component mounted');
    console.log('🔍 Component state:', { isUnlocking });
    return () => {
      console.log('🔍 LockedScreen component unmounting');
    };
  }, []);

  useEffect(() => {
    console.log('🔍 isUnlocking changed:', isUnlocking);
  }, [isUnlocking]);

  const handleUnlock = async () => {
    console.log('🔍 Unlock button clicked');
    setIsUnlocking(true);
    
    // Simulate authentication process with better timing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Navigate to the main app
    router.push('/cash');
  };

  // Add app-route class to body for CSS styling (but not no-scroll)
  React.useEffect(() => {
    console.log('🔍 Adding app-route class to body');
    document.body.classList.add('app-route');
    console.log('🔍 Body classes after adding app-route:', document.body.className);
    return () => {
      console.log('🔍 Removing app-route class from body');
      document.body.classList.remove('app-route');
    };
  }, []);

  console.log('🔍 LockedScreen rendering, isUnlocking:', isUnlocking);

  return (
    <div className="relative w-full h-screen overflow-hidden no-scroll">
      {/* Gradient Overlay - Ensure it doesn't block pointer events */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30 z-[1] pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-20 w-full h-full flex items-center justify-center px-4 pointer-events-none">
        <div className="text-center w-80 mx-auto pointer-events-auto">
          {/* Glassmorphic Card - Fully transparent, no blur */}
          <div 
            className={`glassmorphic-card border border-white/20 rounded-3xl p-8 shadow-2xl h-96 flex flex-col w-full transition-opacity duration-500 ${
              isMinimized ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
            }`}
          >
            {/* Logo - Top section */}
            <div className="flex-shrink-0 mb-8">
              <img src="/sozu-logo.png" alt="Sozu Cash" className="h-24 mx-auto" />
            </div>
            
            {/* Unlock Button - Perfectly centered */}
            <div className="flex-1 flex items-center justify-center mb-8">
              <button
                onClick={handleUnlock}
                disabled={isUnlocking}
                className={`border border-white/30 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 pointer-events-auto backdrop-blur-[20px] bg-white/20 min-h-[56px] flex items-center justify-center ${
                  isUnlocking ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30 active:scale-95'
                }`}
              >
                <div className="flex items-center justify-center space-x-3 min-w-[200px] bg-transparent">
                  {isUnlocking && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin bg-transparent" />
                  )}
                  <span className="text-lg bg-transparent text-white">{isUnlocking ? 'Unlocking...' : 'Unlock with Passkeys'}</span>
                </div>
              </button>
            </div>

            {/* Get Support Link - Bottom of card */}
            <div className="flex-shrink-0 text-center">
              <a 
                href="https://t.me/blessedux" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-black font-medium text-sm hover:text-gray-700 transition-colors"
              >
                Get Support
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Landing - Bottom Left */}
      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => router.push('/')}
        className="absolute bottom-8 left-8 z-20 text-white/50 hover:text-white/70 transition-colors text-sm pointer-events-auto"
      >
        ← Back to Landing
      </motion.button>

      {/* Wallet Toggle Button - Bottom Right */}
      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        onClick={() => setIsMinimized(!isMinimized)}
        className="absolute bottom-8 right-8 z-20 text-white/50 hover:text-white/70 transition-colors text-sm pointer-events-auto p-2 rounded-full hover:bg-white/10"
        title={isMinimized ? "Show wallet" : "Minimize wallet"}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      </motion.button>
    </div>
  );
}
