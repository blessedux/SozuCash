'use client';

import { motion } from 'framer-motion';
import { useNavigation } from '../../_context/NavigationContext';

interface AnimatedTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedTransition({ children, className = '' }: AnimatedTransitionProps) {
  const { slideDirection } = useNavigation();

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        x: slideDirection === 'left' ? 50 : slideDirection === 'right' ? -50 : 0,
        y: slideDirection === 'up' ? 20 : slideDirection === 'down' ? -20 : 0
      }}
      animate={{ 
        opacity: 1, 
        x: 0,
        y: 0
      }}
      exit={{ 
        opacity: 0, 
        x: slideDirection === 'left' ? -50 : slideDirection === 'right' ? 50 : 0,
        y: slideDirection === 'up' ? -20 : slideDirection === 'down' ? 20 : 0
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
