'use client';

import { PanInfo } from 'framer-motion';
import { useNavigation } from '../_context/NavigationContext';
import { useRouter } from 'next/navigation';
import { SCREEN_NAVIGATION } from '../_types/navigation';

export function useSwipe() {
  const {
    currentPage,
    setCurrentPage,
    currentVerticalPage,
    setCurrentVerticalPage,
    setSlideDirection,
    setIsDragging,
    navigateHorizontal,
    navigateVertical
  } = useNavigation();
  const router = useRouter();

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 30;

    // Horizontal navigation (left/right) - infinite carousel between Pay, Deposit, Wallet
    if (info.offset.x < -threshold) { // Right-to-left swipe
      setSlideDirection('left');
      navigateHorizontal('right'); // Swipe left = go right in carousel
      return;
    }

    if (info.offset.x > threshold) { // Left-to-right swipe
      setSlideDirection('right');
      navigateHorizontal('left'); // Swipe right = go left in carousel
      return;
    }

    // Vertical navigation (up/down) - only when on main screens
    if (currentVerticalPage === 0) { // Only allow vertical navigation from main screens
      if (info.offset.y > threshold) { // Downward swipe
        setSlideDirection('up');
        navigateVertical('down'); // Go to sub-screen
        return;
      }
    } else { // On sub-screen, allow going back up
      if (info.offset.y < -threshold) { // Upward swipe
        setSlideDirection('down');
        navigateVertical('up'); // Go back to main screen
        return;
      }
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  return { handleDragEnd, handleDragStart };
}
