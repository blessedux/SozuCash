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
  const getBlurClass = () => {
    switch (blurLevel) {
      case 0: return ''; // No blur
      case 1: return 'backdrop-blur-[5px]'; // 5% blur
      case 2: return 'backdrop-blur-[10px]'; // 10% blur
      case 3: return 'backdrop-blur-[15px]'; // 15% blur
      default: return 'backdrop-blur-[5px]'; // Default to 5%
    }
  };

  const baseStyles = `
    border 
    border-white/10 
    rounded-3xl 
    shadow-2xl 
    ${getBlurClass()}
    transition-all 
    duration-200
  `;

  const hoverStyles = isHoverable ? 'hover:bg-white/5' : '';
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
