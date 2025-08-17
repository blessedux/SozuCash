'use client';

import { createContext, useContext, useState } from 'react';
import type { NavigationState, NavigationProps, SlideDirection } from '../_types/navigation';

const NavigationContext = createContext<NavigationState | undefined>(undefined);

export function NavigationProvider({ children }: NavigationProps) {
  // Horizontal navigation (main app screens: pay, deposit, wallet) - infinite carousel
  const [currentPage, setCurrentPage] = useState(0); // Start on pay page (index 0)
  
  // Vertical navigation (sub-screens: main, send, invest, settings)
  const [currentVerticalPage, setCurrentVerticalPage] = useState(0); // 0 = main, 1 = send, 2 = invest, 3 = settings
  
  const [slideDirection, setSlideDirection] = useState<SlideDirection>('up');
  const [isDragging, setIsDragging] = useState(false);

  // Helper function for infinite carousel navigation
  const navigateHorizontal = (direction: 'left' | 'right') => {
    console.log('navigateHorizontal called with direction:', direction);
    if (direction === 'left') {
      // Go left: Pay -> Wallet -> Deposit -> Pay
      setCurrentPage(prev => {
        const newPage = prev === 0 ? 2 : prev === 1 ? 0 : 1;
        console.log('Navigating left from page', prev, 'to page', newPage);
        return newPage;
      });
    } else {
      // Go right: Pay -> Deposit -> Wallet -> Pay
      setCurrentPage(prev => {
        const newPage = prev === 0 ? 1 : prev === 1 ? 2 : 0;
        console.log('Navigating right from page', prev, 'to page', newPage);
        return newPage;
      });
    }
  };

  // Helper function for vertical navigation
  const navigateVertical = (direction: 'up' | 'down') => {
    console.log('navigateVertical called with direction:', direction);
    if (direction === 'down') {
      // Go down to sub-screen
      switch (currentPage) {
        case 0: // Pay -> Send
          console.log('Going from Pay to Send (vertical page 1)');
          setCurrentVerticalPage(1);
          break;
        case 1: // Deposit -> Invest
          console.log('Going from Deposit to Invest (vertical page 2)');
          setCurrentVerticalPage(2);
          break;
        case 2: // Wallet -> Settings
          console.log('Going from Wallet to Settings (vertical page 3)');
          setCurrentVerticalPage(3);
          break;
      }
    } else {
      // Go up to main screen
      console.log('Going back to main screen (vertical page 0)');
      setCurrentVerticalPage(0);
    }
  };

  return (
    <NavigationContext.Provider 
      value={{
        currentPage,
        setCurrentPage,
        currentVerticalPage,
        setCurrentVerticalPage,
        slideDirection,
        setSlideDirection,
        isDragging,
        setIsDragging,
        navigateHorizontal,
        navigateVertical,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
