'use client';

import { motion } from 'framer-motion';
import { useSwipe } from '../../_hooks/useSwipe';

type GlassmorphicCardProps = {
  children: React.ReactNode;
  className?: string;
  blurLevel?: 0 | 1 | 2 | 3;
  isDraggable?: boolean;
};

export function GlassmorphicCard({ 
  children, 
  className = '', 
  blurLevel = 1,
  isDraggable = true,
}: GlassmorphicCardProps) {
  const { handleDragStart, handleDragEnd } = useSwipe();

  const getBlurClass = (blurLevel: number) => {
    switch (blurLevel) {
      case 1: return 'backdrop-blur-[15px]'; // 15px blur
      case 2: return 'backdrop-blur-[15px]'; // 15px blur
      case 3: return 'backdrop-blur-[15px]'; // 15px blur
      default: return 'backdrop-blur-[15px]'; // Default to 15px
    }
  };

  return (
    <motion.div
      initial={{ width: "320px" }}
      animate={{ width: "384px" }}
      transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      drag={isDraggable ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 0.98 }}
      className={`
        border border-white/10 
        rounded-3xl 
        p-8 
        shadow-2xl 
        h-96 
        flex 
        items-center 
        justify-center 
        cursor-grab 
        active:cursor-grabbing 
        ${getBlurClass(blurLevel)} 
        pointer-events-auto 
        transition-all 
        duration-500 
        ease-in-out
        ${className}
      `}
      style={{ transformOrigin: "center" }}
    >
      {children}
    </motion.div>
  );
}
