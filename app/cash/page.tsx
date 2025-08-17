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
import { useAuth } from '../_context/AuthContext';
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

  return (
    <div className="w-full h-full">
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
  const { isAuthenticated, isLoading, logout } = useAuth();
  useSessionTimeout(); // Add session timeout
  const { setCurrentVerticalPage, currentPage, currentVerticalPage, navigateHorizontal, navigateVertical } = useNavigation();
  const { handleDragStart, handleDragEnd } = useSwipe();

  // Check authentication and redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/app');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

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

  // Enhanced swipe gesture handling - Hybrid touch/mouse system
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const [touchActive, setTouchActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [lastGestureTime, setLastGestureTime] = useState(0);
  const [hasNavigatedThisGesture, setHasNavigatedThisGesture] = useState(false);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;
  const gestureCooldown = 800; // Same cooldown as trackpad

  // Detect if we're on desktop (for trackpad gestures)
  useEffect(() => {
    const checkDesktop = () => {
      const isDesktopDevice = window.innerWidth >= 768 && !navigator.userAgent.includes('Mobile');
      setIsDesktop(isDesktopDevice);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Trackpad gesture detection for desktop
  useEffect(() => {
    if (!isDesktop) return;

    let lastGestureTime = 0;
    let gestureCooldown = 800; // Increased cooldown significantly
    let isProcessingGesture = false;
    let gestureQueue: Array<{ deltaX: number; deltaY: number; timestamp: number }> = [];
    let hasNavigatedThisGesture = false;
    let gestureStartTime = 0;

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      
      // Prevent default scrolling for trackpad gestures
      e.preventDefault();
      
      // If this is the first event of a new gesture, reset flags
      if (!isProcessingGesture) {
        gestureStartTime = now;
        hasNavigatedThisGesture = false;
        gestureQueue = [];
      }
      
      // Add gesture to queue
      gestureQueue.push({
        deltaX: e.deltaX,
        deltaY: e.deltaY,
        timestamp: now
      });

      // If we're already processing a gesture, just queue the event
      if (isProcessingGesture) {
        return;
      }

      // Process gesture queue
      const processGestureQueue = () => {
        if (gestureQueue.length === 0) {
          isProcessingGesture = false;
          hasNavigatedThisGesture = false;
          return;
        }

        isProcessingGesture = true;

        // Calculate total gesture from all queued events
        const totalDeltaX = gestureQueue.reduce((sum, gesture) => sum + gesture.deltaX, 0);
        const totalDeltaY = gestureQueue.reduce((sum, gesture) => sum + gesture.deltaY, 0);
        const gestureDuration = now - gestureStartTime;

        // Clear the queue
        gestureQueue = [];

        // Check cooldown from last successful navigation
        if (now - lastGestureTime < gestureCooldown) {
          console.log('Gesture blocked - too soon after last navigation');
          isProcessingGesture = false;
          hasNavigatedThisGesture = false;
          return;
        }

        // Only navigate if we haven't already navigated for this gesture
        if (!hasNavigatedThisGesture) {
          // Determine if this is a significant gesture
          const isHorizontal = Math.abs(totalDeltaX) > Math.abs(totalDeltaY);
          const threshold = 25; // Higher threshold

          if (isHorizontal && Math.abs(totalDeltaX) > threshold) {
            // Horizontal gesture
            console.log('Processing horizontal gesture:', totalDeltaX);
            if (totalDeltaX > 0) {
              navigateHorizontal('right');
            } else {
              navigateHorizontal('left');
            }
            lastGestureTime = now;
            hasNavigatedThisGesture = true;
          } else if (!isHorizontal && Math.abs(totalDeltaY) > threshold) {
            // Vertical gesture
            console.log('Processing vertical gesture:', totalDeltaY);
            if (totalDeltaY > 0) {
              navigateVertical('down');
            } else {
              navigateVertical('up');
            }
            lastGestureTime = now;
            hasNavigatedThisGesture = true;
          }
        }

        // Reset after a longer delay to ensure gesture is completely finished
        setTimeout(() => {
          isProcessingGesture = false;
          hasNavigatedThisGesture = false;
        }, 200);
      };

      // Process the gesture queue after a longer delay to collect all events
      setTimeout(processGestureQueue, 100);
    };

    // Add event listener with passive: false to allow preventDefault
    document.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, [isDesktop, navigateHorizontal, navigateVertical]);

  // Hybrid touch/mouse handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchActive(true);
    setTouchEnd(null);
    setHasNavigatedThisGesture(false); // Reset navigation flag
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    setTouchActive(false);
    handleGestureEnd();
  };

  // Mouse handlers for mobile/tablet simulation (not desktop)
  const onMouseDown = (e: React.MouseEvent) => {
    if (isDesktop) return; // Skip on desktop - use trackpad gestures instead
    
    setTouchActive(true);
    setIsDragging(true);
    setTouchEnd(null);
    setHasNavigatedThisGesture(false); // Reset navigation flag
    setTouchStart({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDesktop || !isDragging) return; // Skip on desktop or if not dragging
    
    setTouchEnd({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (isDesktop) return; // Skip on desktop
    
    setTouchActive(false);
    setIsDragging(false);
    handleGestureEnd();
  };

  // Handle gesture end (works for both touch and mouse)
  const handleGestureEnd = () => {
    if (!touchStart || !touchEnd) {
      return;
    }

    const now = Date.now();
    
    // Check cooldown from last successful navigation
    if (now - lastGestureTime < gestureCooldown) {
      console.log('Touch/Mouse gesture blocked - too soon after last navigation');
      setTouchStart(null);
      setTouchEnd(null);
      return;
    }

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
    const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX);

    // Only process one navigation per gesture
    if (!hasNavigatedThisGesture) {
      if (isHorizontalSwipe && Math.abs(distanceX) > minSwipeDistance) {
        // Horizontal swipe detected
        console.log('Processing touch/mouse horizontal gesture:', distanceX);
        if (distanceX > 0) {
          // Swipe left (right to left) - go right in carousel
          navigateHorizontal('right');
        } else {
          // Swipe right (left to right) - go left in carousel
          navigateHorizontal('left');
        }
        setLastGestureTime(now);
        setHasNavigatedThisGesture(true);
      } else if (isVerticalSwipe && Math.abs(distanceY) > minSwipeDistance) {
        // Vertical swipe detected
        console.log('Processing touch/mouse vertical gesture:', distanceY);
        if (distanceY > 0) {
          // Swipe up (bottom to top) - go to sub-screen
          navigateVertical('down');
        } else {
          // Swipe down (top to bottom) - go back to main screen
          navigateVertical('up');
        }
        setLastGestureTime(now);
        setHasNavigatedThisGesture(true);
      }
    }

    // Reset touch positions
    setTouchStart(null);
    setTouchEnd(null);
  };

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
            try {
              logout();
            } catch (error) {
              console.error('Error during logout:', error);
              // Fallback: navigate to app page
              router.push('/app');
            }
          }
          break;

        // Horizontal navigation (A/D keys and arrow keys)
        case 'a':
        case 'A':
        case 'ArrowLeft':
          event.preventDefault();
          navigateHorizontal('left');
          break;

        case 'd':
        case 'D':
        case 'ArrowRight':
          event.preventDefault();
          navigateHorizontal('right');
          break;

        // Vertical navigation (W/S keys and up/down arrows)
        case 'w':
        case 'W':
        case 'ArrowUp':
          event.preventDefault();
          navigateVertical('up');
          break;

        case 's':
        case 'S':
        case 'ArrowDown':
          event.preventDefault();
          navigateVertical('down');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [logout, navigateHorizontal, navigateVertical, router]);

  // Debug navigation changes
  useEffect(() => {
    // Navigation state changes are now handled silently
  }, [currentPage, currentVerticalPage]);

  return (
    <WalletProvider>
      <BalanceProvider>
      <div className="relative w-full h-screen overflow-hidden no-scroll cash-page"
           onTouchStart={onTouchStart}
           onTouchMove={onTouchMove}
           onTouchEnd={onTouchEnd}
           onMouseDown={onMouseDown}
           onMouseMove={onMouseMove}
           onMouseUp={onMouseUp}>
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
        
        {/* Mobile Exit Button - Top Left */}
        <button
          onClick={logout}
          className="absolute top-8 left-4 z-15 text-white/70 hover:text-white transition-colors pointer-events-auto md:hidden"
          aria-label="Exit wallet"
          title="Exit Wallet"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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

        {/* Main Content */}
        <div className="relative z-10 w-full h-full flex items-center justify-center px-4 pointer-events-none"
             onTouchStart={onTouchStart}
             onTouchMove={onTouchMove}
             onTouchEnd={onTouchEnd}
             onMouseDown={onMouseDown}
             onMouseMove={onMouseMove}
             onMouseUp={onMouseUp}>
          <div className="text-center w-80 mx-auto pointer-events-none"
               onTouchStart={onTouchStart}
               onTouchMove={onTouchMove}
               onTouchEnd={onTouchEnd}
               onMouseDown={onMouseDown}
               onMouseMove={onMouseMove}
               onMouseUp={onMouseUp}>
            {/* Glassmorphic Card Container - Apply swipe gestures here */}
            <div 
              className="border border-white/40 rounded-3xl p-8 shadow-2xl h-96 flex items-center justify-center shadow-white/20 debug-card glassmorphic-card"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseEnter={(e) => {
                // Only capture events when mouse is over the card
                e.currentTarget.style.pointerEvents = 'auto';
              }}
              onMouseLeave={(e) => {
                // Allow events to pass through when mouse leaves the card
                e.currentTarget.style.pointerEvents = 'none';
              }}
              style={{
                // Start with pointer events disabled to allow Spline interactions
                pointerEvents: 'auto', // Changed to auto to capture touch events
                isolation: 'isolate',
                // Ensure proper contrast and visibility with much more transparency
                boxShadow: '0 25px 50px -12px rgba(255, 255, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.3)'
              }}
            >
              <SmoothTransition key={`${currentPage}-${currentVerticalPage}`} className="w-full h-full">
                <CashContent />
              </SmoothTransition>
            </div>
          </div>
        </div>

        {/* Navigation Instructions */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-15 text-center">
        <p className="text-white text-sm font-medium">
            ESC key to lock wallet
          </p>
          <p className="text-white text-sm font-medium">
            awsd or swiping to navigate
          </p>
        </div>
      </div>
      </BalanceProvider>
    </WalletProvider>
  );
}