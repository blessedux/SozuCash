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
    <div className="relative z-20 text-center w-80 mx-auto pointer-events-auto flex justify-center">
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{ touchAction: 'none' }}
        className="w-full"
      >
        <AnimatePresence mode="wait">
          <GlassmorphicCard
            blurLevel={blurLevel}
            className={className}
          >
            {children}
          </GlassmorphicCard>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
