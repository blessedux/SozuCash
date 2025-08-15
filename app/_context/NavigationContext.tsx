'use client';

import { createContext, useContext, useState } from 'react';
import type { NavigationState, NavigationProps, SlideDirection } from '../_types/navigation';

const NavigationContext = createContext<NavigationState | undefined>(undefined);

export function NavigationProvider({ children }: NavigationProps) {
  const [currentPage, setCurrentPage] = useState(1); // Start on pay page (index 1)
  const [slideDirection, setSlideDirection] = useState<SlideDirection>('up');
  const [isDragging, setIsDragging] = useState(false);

  return (
    <NavigationContext.Provider 
      value={{
        currentPage,
        setCurrentPage,
        slideDirection,
        setSlideDirection,
        isDragging,
        setIsDragging,
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
