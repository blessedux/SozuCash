'use client';

import { useEffect } from 'react';
import { useNavigation } from '../_context/NavigationContext';
import { useRouter } from 'next/navigation';
import { SCREEN_NAVIGATION } from '../_types/navigation';

interface KeyboardNavigationConfig {
  onEscape?: () => void;
  onEnter?: () => void;
  enableVerticalNavigation?: boolean;
  enableHorizontalNavigation?: boolean;
}

export function useKeyboardNavigation({
  onEscape,
  onEnter,
  enableVerticalNavigation = true,
  enableHorizontalNavigation = true
}: KeyboardNavigationConfig) {
  const { 
    currentPage, 
    setCurrentPage, 
    currentVerticalPage, 
    setCurrentVerticalPage,
    navigateHorizontal,
    navigateVertical
  } = useNavigation();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent navigation when typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          onEscape?.();
          break;

        case 'Enter':
          event.preventDefault();
          onEnter?.();
          break;

        // Horizontal navigation (A/D keys and arrow keys)
        case 'a':
        case 'A':
        case 'ArrowLeft':
          if (enableHorizontalNavigation) {
            event.preventDefault();
            navigateHorizontal('left');
          }
          break;

        case 'd':
        case 'D':
        case 'ArrowRight':
          if (enableHorizontalNavigation) {
            event.preventDefault();
            navigateHorizontal('right');
          }
          break;

        // Vertical navigation (W/S keys and up/down arrows)
        case 'w':
        case 'W':
        case 'ArrowUp':
          if (enableVerticalNavigation) {
            event.preventDefault();
            navigateVertical('up');
          }
          break;

        case 's':
        case 'S':
        case 'ArrowDown':
          if (enableVerticalNavigation) {
            event.preventDefault();
            navigateVertical('down');
          }
          break;

        // Special case: S key for locking wallet (when not in vertical navigation)
        case 'S':
          if (!enableVerticalNavigation) {
            event.preventDefault();
            // This will be handled by the parent component
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, onEnter, enableVerticalNavigation, enableHorizontalNavigation, navigateHorizontal, navigateVertical]);
}
