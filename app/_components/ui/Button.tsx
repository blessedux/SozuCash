'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'whileTap'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center pointer-events-auto';
  
  const variantStyles = {
    primary: 'border border-white/20 text-white backdrop-blur-[10px] hover:bg-white/5',
    secondary: 'border border-white/20 text-white hover:bg-white/5 backdrop-blur-[10px]',
    ghost: 'text-white hover:bg-white/5',
  };

  const sizeStyles = {
    sm: 'text-xs py-1.5 px-2',
    md: 'text-sm py-3 px-4',
    lg: 'text-base py-4 px-6',
  };

  const disabledStyles = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '';

  const content = isLoading ? (
    <div className="flex items-center space-x-2">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      <span>Loading...</span>
    </div>
  ) : (
    <div className="flex items-center space-x-2">
      {leftIcon && <span>{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span>{rightIcon}</span>}
    </div>
  );

  return (
    <motion.button
      whileTap={disabled || isLoading ? undefined : { scale: 0.98 }}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabledStyles}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {content}
    </motion.button>
  );
}