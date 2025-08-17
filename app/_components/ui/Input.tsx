'use client';

import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  label?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  leftIcon,
  rightIcon,
  error,
  label,
  helperText,
  className = '',
  disabled,
  ...props
}, ref) => {
  const baseStyles = `
    w-full 
    border 
    border-white/20 
    text-white 
    font-semibold 
    rounded-2xl 
    focus:outline-none 
    focus:ring-2 
    focus:ring-white/30 
    placeholder-white/30 
    pointer-events-auto 
    transition-all 
    duration-200
    backdrop-blur-[25px]
  `;

  const sizeStyles = 'py-4 px-6';
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const errorStyles = error ? 'border-red-500 focus:ring-red-500/30' : '';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-white/70 text-sm mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/30">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full 
            px-4 
            py-3 
            text-white 
            placeholder-white/50 
            bg-white/10 
            border 
            border-white/20 
            rounded-xl 
            backdrop-blur-[25px]
            focus:outline-none 
            focus:ring-2 
            focus:ring-white/30 
            transition-all 
            duration-200
            ${className || ''}
          `}
          disabled={disabled}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/30">
            {rightIcon}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-500' : 'text-white/50'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
