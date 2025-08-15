'use client';

import { useEffect } from 'react';
import { useNavigation } from '../_context/NavigationContext';
import { useRouter } from 'next/navigation';

interface UseKeyboardNavigationProps {
  onEscape?: () => void;
  onEnter?: () => void;
  disableNavigation?: boolean;
}

export function useKeyboardNavigation({
  onEscape,
  onEnter,
  disableNavigation = false
}: UseKeyboardNavigationProps = {}) {
  const { 
    currentPage, 
    setCurrentPage, 
    setSlideDirection 
  } = useNavigation();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle keyboard events if user is typing in an input field
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'arrowright':
        case 'd':
          if (!disableNavigation) {
            event.preventDefault();
            setSlideDirection('left');
            setCurrentPage(currentPage === 3 ? 0 : currentPage + 1);
          }
          break;

        case 'arrowleft':
        case 'a':
          if (!disableNavigation) {
            event.preventDefault();
            setSlideDirection('right');
            setCurrentPage(currentPage === 0 ? 3 : currentPage - 1);
          }
          break;

        case 'escape':
        case 'esc':
          event.preventDefault();
          if (onEscape) {
            onEscape();
          } else {
            // Default escape behavior: return to app screen
            router.push('/app');
          }
          break;

        case 'enter':
        case ' ':
          event.preventDefault();
          if (onEnter) {
            onEnter();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentPage, 
    setCurrentPage, 
    setSlideDirection, 
    disableNavigation, 
    onEscape, 
    onEnter,
    router
  ]);
}
