'use client';

import React from 'react';

interface SimpleBackgroundProps {
  className?: string;
}

export default function SimpleBackground({ className = "" }: SimpleBackgroundProps) {
  return (
    <div 
      className={`fixed inset-0 z-0 ${className}`}
      style={{
        backgroundColor: 'transparent',
        zIndex: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      {/* Simple animated gradient background */}
      <div 
        className="absolute inset-0 animate-pulse"
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #1d4ed8, #3730a3)',
          zIndex: 0
        }}
      />
      
      {/* Animated circles */}
      <div 
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full animate-bounce"
        style={{
          backgroundColor: 'rgba(236, 72, 153, 0.2)',
          zIndex: 1
        }}
      />
      <div 
        className="absolute top-3/4 right-1/4 w-24 h-24 rounded-full animate-bounce"
        style={{
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          zIndex: 1,
          animationDelay: '0.5s'
        }}
      />
      <div 
        className="absolute bottom-1/4 left-1/2 w-20 h-20 rounded-full animate-bounce"
        style={{
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          zIndex: 1,
          animationDelay: '1s'
        }}
      />
      
      {/* Debug border */}
      <div 
        className="absolute inset-0 border-2 border-yellow-500 pointer-events-none"
        style={{ zIndex: 999 }}
      >
        <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-1 rounded font-bold">
          SimpleBackground
        </div>
      </div>
    </div>
  );
}
