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
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'border border-white/20 text-white backdrop-blur-[15px] bg-white/10 hover:bg-white/20',
    secondary: 'border border-white/20 text-white hover:bg-white/20 backdrop-blur-[15px] bg-white/10',
    ghost: 'text-white hover:bg-white/10',
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