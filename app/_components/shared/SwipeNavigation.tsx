'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useNavigation } from '../../_context/NavigationContext';
import { useSwipe } from '../../_hooks/useSwipe';
import { GlassmorphicCard } from './GlassmorphicCard';

interface SwipeNavigationProps {
  children: React.ReactNode;
  blurLevel?: 0 | 1 | 2 | 3;
  className?: string;
}

export function SwipeNavigation({ 
  children, 
  blurLevel = 1,
  className = '' 
}: SwipeNavigationProps) {
  const { currentPage } = useNavigation();
  const { handleDragStart, handleDragEnd } = useSwipe();

  return (
    <div className="relative z-20 text-center w-80 mx-auto pointer-events-none flex justify-center">
      <AnimatePresence mode="wait">
        <GlassmorphicCard
          blurLevel={blurLevel}
          className={className}
        >
          {children}
        </GlassmorphicCard>
      </AnimatePresence>
    </div>
  );
}
