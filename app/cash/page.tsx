'use client';

import { NavigationProvider } from '../_context/NavigationContext';
import { WalletProvider } from '../_context/WalletContext';
import { BalanceProvider } from '../_context/BalanceContext';
import { SwipeNavigation } from '../_components/shared/SwipeNavigation';
import { AnimatePresence } from 'framer-motion';
import { SmoothTransition } from '../_components/shared/SmoothTransition';
import { WalletPage } from '../_components/cash/pages/WalletPage';
import { PayPage } from '../_components/cash/pages/PayPage';
import { SendPage } from '../_components/cash/pages/SendPage';
import { DepositPage } from '../_components/cash/pages/DepositPage';
import { InvestPage } from '../_components/cash/pages/InvestPage';
import { SettingsPage } from '../_components/cash/pages/SettingsPage';
import { useNavigation } from '../_context/NavigationContext';
import { useKeyboardNavigation } from '../_hooks/useKeyboardNavigation';
import { useSessionTimeout } from '../_hooks/useSessionTimeout';
import { Camera, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSwipe } from '../_hooks/useSwipe';

// Client-only wrapper to prevent hydration issues
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}

function CashContent() {
  const { currentPage, currentVerticalPage } = useNavigation();

  // Render different content based on currentPage (horizontal navigation)
  const renderMainContent = () => {
    switch (currentPage) {
      case 0: // Pay
        return <PayPage />;
      case 1: // Deposit
        return <DepositPage />;
      case 2: // Wallet
        return <WalletPage />;
      default:
        return <PayPage />;
    }
  };

  // Render vertical sub-content when needed
  const renderVerticalContent = () => {
    switch (currentVerticalPage) {
      case 0: // Main (no sub-screen)
        return null;
      case 1: // Send (sub-screen of Pay)
        return currentPage === 0 ? <SendPage /> : null;
      case 2: // Invest (sub-screen of Deposit)
        return currentPage === 1 ? <InvestPage /> : null;
      case 3: // Settings (sub-screen of Wallet)
        return currentPage === 2 ? <SettingsPage /> : null;
      default:
        return null;
    }
  };

  console.log('CashContent rendering:', { currentPage, currentVerticalPage });

  return (
    <div className="w-full h-full border border-green-500 bg-red-500/20">
      {/* Debug info */}
      <div className="absolute top-2 left-2 text-white text-xs bg-black/50 p-1 rounded">
        Page: {currentPage} | Vertical: {currentVerticalPage}
      </div>
      
      {/* Main horizontal navigation content - hidden when showing vertical content */}
      {currentVerticalPage === 0 && (
        <SmoothTransition key={`main-${currentPage}`} className="w-full h-full">
          {renderMainContent()}
        </SmoothTransition>
      )}
      
      {/* Vertical sub-navigation content (overlays on main content) */}
      {currentVerticalPage !== 0 && (
        <SmoothTransition key={`vertical-${currentVerticalPage}`} className="absolute inset-0 z-30">
          {renderVerticalContent()}
        </SmoothTransition>
      )}
    </div>
  );
}

// Layout handles all content and navigation
export default function CashPage() {
  return (
    <ClientOnly>
      <CashPageContent />
    </ClientOnly>
  );
}

function CashPageContent() {
  const router = useRouter();
  useSessionTimeout(); // Add session timeout
  const { setCurrentVerticalPage, currentPage, currentVerticalPage, navigateHorizontal, navigateVertical } = useNavigation();
  const { handleDragStart, handleDragEnd } = useSwipe();

  // Set app-route class on body for consistent background styling
  useEffect(() => {
    document.body.classList.add('app-route');
    return () => {
      document.body.classList.remove('app-route');
    };
  }, []);

  // Set current vertical page to main (0) when cash layout mounts
  useEffect(() => {
    // Ensure we start at Pay screen (page 0) with no sub-screen (vertical 0)
    setCurrentVerticalPage(0);
    // Don't set currentPage here - let it use the default from NavigationContext (0 = Pay)
  }, [setCurrentVerticalPage]);

  // Handle ESC key for locking wallet
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent navigation when typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'Escape':
          if (window.innerWidth >= 768) {
            event.preventDefault();
            router.push('/app');
          }
          break;

        // Horizontal navigation (A/D keys and arrow keys)
        case 'a':
        case 'A':
        case 'ArrowLeft':
          event.preventDefault();
          console.log('Left arrow/A key pressed - navigating left');
          navigateHorizontal('left');
          break;

        case 'd':
        case 'D':
        case 'ArrowRight':
          event.preventDefault();
          console.log('Right arrow/D key pressed - navigating right');
          navigateHorizontal('right');
          break;

        // Vertical navigation (W/S keys and up/down arrows)
        case 'w':
        case 'W':
        case 'ArrowUp':
          event.preventDefault();
          console.log('Up arrow/W key pressed - navigating up');
          navigateVertical('up');
          break;

        case 's':
        case 'S':
        case 'ArrowDown':
          event.preventDefault();
          console.log('Down arrow/S key pressed - navigating down');
          navigateVertical('down');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [router, navigateHorizontal, navigateVertical]);

  // Debug navigation changes
  useEffect(() => {
    console.log('Navigation state:', { currentPage, currentVerticalPage });
  }, [currentPage, currentVerticalPage]);

  return (
    <WalletProvider>
      <BalanceProvider>
      <div className="relative w-full h-screen overflow-hidden no-scroll">
        {/* Gradient Overlay - Ensure it doesn't block pointer events */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30 z-[1] pointer-events-none" />

        {/* Sozu Cash Logo */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-15">
          <img 
            src="/sozu-logo.png" 
            alt="Sozu Cash" 
            className="w-20"
          />
        </div>
        
        {/* Mobile Lock Button - Top Left */}
        <button
          onClick={() => router.push('/app')}
          className="absolute top-8 left-4 z-15 text-white/70 hover:text-white transition-colors pointer-events-auto md:hidden"
          aria-label="Disconnect wallet"
          title="Disconnect Wallet"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M7 12h11M3 17h18M7 12l-4-4m0 8l4-4" />
          </svg>
        </button>
        
        {/* Camera Button - Top Right */}
        <button
          onClick={() => router.push('/pay')}
          className="absolute top-8 right-4 z-15 text-white/70 hover:text-white transition-colors pointer-events-auto"
          aria-label="Open camera for QR scanning"
          title="Scan QR Code"
        >
          <Camera size={24} />
        </button>

        {/* Current Screen Indicator - Top Center */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-15 text-center">
          <div className="text-white/50 text-sm font-medium">
            {currentPage === 0 ? 'Pay' : currentPage === 1 ? 'Deposit' : 'Wallet'}
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-5 w-full h-full flex items-center justify-center px-4 pointer-events-none">
          <div className="text-center w-80 mx-auto pointer-events-auto">
            {/* Glassmorphic Card Container - Apply swipe gestures here */}
            <div 
              className="border-2 border-red-500 rounded-3xl p-8 shadow-2xl h-96 flex items-center justify-center backdrop-blur-[25px] bg-white/30 shadow-white/20"
              onTouchStart={(e) => {
                console.log('Touch start detected');
                const touch = e.touches[0];
                const startX = touch.clientX;
                const startY = touch.clientY;
                
                const handleTouchEnd = (e: TouchEvent) => {
                  console.log('Touch end detected');
                  const touch = e.changedTouches[0];
                  const endX = touch.clientX;
                  const endY = touch.clientY;
                  const deltaX = endX - startX;
                  const deltaY = endY - startY;
                  const threshold = 50;
                  
                  console.log('Swipe delta:', { deltaX, deltaY, threshold });
                  
                  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
                    // Horizontal swipe
                    if (deltaX > 0) {
                      console.log('Swipe right - navigating left');
                      // Swipe right - go left in carousel
                      navigateHorizontal('left');
                    } else {
                      console.log('Swipe left - navigating right');
                      // Swipe left - go right in carousel
                      navigateHorizontal('right');
                    }
                  } else if (Math.abs(deltaY) > threshold) {
                    // Vertical swipe
                    if (deltaY > 0) {
                      console.log('Swipe down - navigating to sub-screen');
                      // Swipe down - go to sub-screen
                      navigateVertical('down');
                    } else {
                      console.log('Swipe up - navigating to main screen');
                      // Swipe up - go back to main screen
                      navigateVertical('up');
                    }
                  }
                  
                  document.removeEventListener('touchend', handleTouchEnd);
                };
                
                document.addEventListener('touchend', handleTouchEnd);
              }}
              style={{
                // Allow pointer events to pass through to background when not actively interacting
                pointerEvents: 'auto',
                isolation: 'isolate',
                // Ensure proper contrast and visibility
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                boxShadow: '0 25px 50px -12px rgba(255, 255, 255, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.5)'
              }}
            >
              <div className="w-full h-full border border-blue-500 flex items-center justify-center">
                <SmoothTransition key={`${currentPage}-${currentVerticalPage}`} className="w-full h-full">
                  <CashContent />
                </SmoothTransition>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Instructions - Desktop Only */}
        {window.innerWidth >= 768 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-15 text-center">
            <p className="text-white/50 text-sm mb-1">
              Press ESC to lock wallet
            </p>
            <p className="text-white/50 text-sm">
              Use arrow keys or AWSD to navigate
            </p>
          </div>
        )}
      </div>
      </BalanceProvider>
    </WalletProvider>
  );
}
