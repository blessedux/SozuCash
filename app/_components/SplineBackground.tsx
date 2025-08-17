'use client';

import React, { useEffect, useRef, useState } from 'react';

interface SplineBackgroundProps {
  className?: string;
  scale?: number;
  enableInteractions?: boolean;
}

export default function SplineBackground({ 
  className = "", 
  scale = 1.2,
  enableInteractions = true
}: SplineBackgroundProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    const container = containerRef.current;
    if (!iframe || !container || !enableInteractions) return;

    let isMouseDown = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate mouse velocity for more dynamic interactions
      const deltaX = x - lastMouseX;
      const deltaY = y - lastMouseY;
      
      // Send enhanced mouse data to Spline iframe
      iframe.contentWindow?.postMessage({
        type: 'mouseMove',
        x: x / rect.width,  // Normalize coordinates
        y: y / rect.height,
        deltaX: deltaX / rect.width,
        deltaY: deltaY / rect.height,
        isHovered: isHovered,
        isMouseDown: isMouseDown
      }, '*');
      
      lastMouseX = x;
      lastMouseY = y;
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      iframe.contentWindow?.postMessage({
        type: 'mouseEnter',
        isHovered: true
      }, '*');
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      iframe.contentWindow?.postMessage({
        type: 'mouseLeave',
        isHovered: false
      }, '*');
    };

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      const rect = container.getBoundingClientRect();
      iframe.contentWindow?.postMessage({
        type: 'mouseDown',
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height
      }, '*');
    };

    const handleMouseUp = (e: MouseEvent) => {
      isMouseDown = false;
      const rect = container.getBoundingClientRect();
      iframe.contentWindow?.postMessage({
        type: 'mouseUp',
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height
      }, '*');
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      iframe.contentWindow?.postMessage({
        type: 'touchStart',
        x: (touch.clientX - rect.left) / rect.width,
        y: (touch.clientY - rect.top) / rect.height
      }, '*');
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      iframe.contentWindow?.postMessage({
        type: 'touchMove',
        x: (touch.clientX - rect.left) / rect.width,
        y: (touch.clientY - rect.top) / rect.height
      }, '*');
    };

    // Add event listeners to the container
    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Cleanup
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isHovered, enableInteractions]);

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-0 overflow-hidden spline-background ${className}`}
      style={{ 
        cursor: enableInteractions ? 'default' : 'none',
        pointerEvents: 'auto',
        zIndex: 0
      }}
    >
      <iframe 
        ref={iframeRef}
        src='https://my.spline.design/animatedshapeblend-vPAPkDf3zXbvMSVXAIjlDWIm/' 
        frameBorder='0' 
        width='100%' 
        height='100%'
        className="w-full h-full"
        style={{ 
          transform: `scale(${scale})`,
          pointerEvents: 'auto',
          transition: 'opacity 0.3s ease-in-out',
          border: 'none',
          outline: 'none'
        }}
        allow="autoplay; fullscreen"
        allowFullScreen
        title="Spline Background Animation"
        onLoad={() => {
          // Ensure iframe is ready for interactions
          if (iframeRef.current) {
            iframeRef.current.style.pointerEvents = 'auto';
          }
        }}
      />
    </div>
  );
}