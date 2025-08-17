'use client';

import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isHoverable?: boolean;
  isClickable?: boolean;
  blurLevel?: 0 | 1 | 2 | 3;
}

export function Card({
  children,
  className = '',
  onClick,
  isHoverable = false,
  isClickable = false,
  blurLevel = 1,
}: CardProps) {
  const getBlurClass = (blurLevel: number) => {
    switch (blurLevel) {
      case 1: return 'backdrop-blur-[25px]'; // 25px blur - matches main card
      case 2: return 'backdrop-blur-[25px]'; // 25px blur - matches main card
      case 3: return 'backdrop-blur-[25px]'; // 25px blur - matches main card
      default: return 'backdrop-blur-[25px]'; // Default to 25px - matches main card
    }
  };

  const baseStyles = `
    border 
    border-white/10 
    rounded-3xl 
    shadow-2xl 
    bg-white/10
    ${getBlurClass(blurLevel)}
    transition-all 
    duration-200
  `;

  const hoverStyles = isHoverable ? 'hover:bg-white/10' : '';
  const clickStyles = isClickable ? 'cursor-pointer active:scale-98' : '';

  return (
    <motion.div
      onClick={onClick}
      whileHover={isHoverable ? { scale: 1.02 } : {}}
      whileTap={isClickable ? { scale: 0.98 } : {}}
      className={`
        ${baseStyles}
        ${hoverStyles}
        ${clickStyles}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
