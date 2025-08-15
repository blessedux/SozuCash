'use client';

import { NavigationProvider } from '../_context/NavigationContext';
import { WalletProvider } from '../_context/WalletContext';
import { SwipeNavigation } from '../_components/shared/SwipeNavigation';
import { AnimatePresence } from 'framer-motion';
import { WalletPage } from '../_components/cash/pages/WalletPage';
import { PayPage } from '../_components/cash/pages/PayPage';
import { ReceivePage } from '../_components/cash/pages/ReceivePage';
import { SettingsPage } from '../_components/cash/pages/SettingsPage';
import { useNavigation } from '../_context/NavigationContext';
import { useKeyboardNavigation } from '../_hooks/useKeyboardNavigation';
import { useSessionTimeout } from '../_hooks/useSessionTimeout';
import SplineBackground from '../_components/SplineBackground';
import { Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';

function CashContent() {
  const { currentPage } = useNavigation();
  const router = useRouter();

  // Setup keyboard navigation (only for desktop)
  useKeyboardNavigation({
    onEscape: () => {
      // Only allow ESC key to lock on desktop
      if (typeof window !== 'undefined' && window.innerWidth >= 768) {
        router.push('/app');
      }
    },
    onEnter: () => {
      switch (currentPage) {
        case 1: // Pay
          router.push('/pay');
          break;
        case 2: // Receive
          router.push('/receive');
          break;
      }
    }
  });

  return (
    <SwipeNavigation>
      <AnimatePresence mode="wait">
        {currentPage === 0 && <WalletPage />}
        {currentPage === 1 && <PayPage />}
        {currentPage === 2 && <ReceivePage />}
        {currentPage === 3 && <SettingsPage />}
      </AnimatePresence>
    </SwipeNavigation>
  );
}

export default function CashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useSessionTimeout(); // Add session timeout

  return (
    <NavigationProvider>
      <WalletProvider>
        <div className="relative w-full h-screen overflow-hidden no-scroll">
          {/* Persistent Background */}
          <div className="fixed inset-0 z-0">
            <SplineBackground scale={1.2} enableInteractions={true} />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30 z-[1]" />

          {/* Sozu Cash Logo */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
            <img 
              src="/sozu-logo.png" 
              alt="Sozu Cash" 
              className="w-20"
            />
          </div>

          {/* Camera Icon for QR Scanning */}
          <button 
            onClick={() => router.push('/pay')}
            className="absolute top-8 right-4 z-20 text-white/70 hover:text-white transition-colors pointer-events-auto"
          >
            <Camera size={24} />
          </button>

          {/* Main Content */}
          <div className="relative z-10 w-full h-full flex items-center justify-center px-4 pointer-events-none">
            <CashContent />
          </div>

          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-6 py-4">
            <div className="text-white/70 text-sm">
              {new Date().toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: false 
              })}
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-6 h-3 border border-white/70 rounded-sm">
                <div className="w-4 h-1 bg-white/70 rounded-sm m-0.5"></div>
              </div>
              <div className="text-white/70 text-xs">100%</div>
            </div>
          </div>

          {/* Lock Screen Hint - Only show on desktop */}
          {typeof window !== 'undefined' && window.innerWidth >= 768 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
              <p className="text-white/50 text-sm">
                Press ESC to lock
              </p>
            </div>
          )}
        </div>
      </WalletProvider>
    </NavigationProvider>
  );
}