'use client';

import { PanInfo } from 'framer-motion';
import { useNavigation } from '../_context/NavigationContext';

export function useSwipe() {
  const { 
    currentPage, 
    setCurrentPage, 
    setSlideDirection, 
    setIsDragging 
  } = useNavigation();

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 30; // Reduced threshold for more sensitive swipes
    
    // Check for right-to-left swipe (next page)
    if (info.offset.x < -threshold) {
      setSlideDirection('left');
      if (currentPage === 3) {
        setCurrentPage(0);
      } else {
        setCurrentPage(currentPage + 1);
      }
      return;
    }
    
    // Check for left-to-right swipe (previous page)
    if (info.offset.x > threshold) {
      setSlideDirection('right');
      if (currentPage === 0) {
        setCurrentPage(3);
      } else {
        setCurrentPage(currentPage - 1);
      }
      return;
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  return {
    handleDragEnd,
    handleDragStart,
  };
}
