'use client';

import React, { useEffect, useRef } from 'react';

interface SplineBackgroundProps {
  className?: string;
  scale?: number;
}

export default function SplineBackground({ 
  className = "", 
  scale = 1.2 
}: SplineBackgroundProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = iframe.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Send mouse position to Spline iframe
      iframe.contentWindow?.postMessage({
        type: 'mouseMove',
        x: x,
        y: y
      }, '*');
    };

    const handleMouseEnter = () => {
      iframe.style.pointerEvents = 'auto';
    };

    const handleMouseLeave = () => {
      iframe.style.pointerEvents = 'none';
    };

    // Add event listeners to the parent container
    const container = iframe.parentElement;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    // Cleanup
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${className}`}>
      <iframe 
        ref={iframeRef}
        src='https://my.spline.design/animatedshapeblend-vPAPkDf3zXbvMSVXAIjlDWIm/' 
        frameBorder='0' 
        width='100%' 
        height='100%'
        className="w-full h-full pointer-events-none"
        style={{ 
          transform: `scale(${scale})`,
          pointerEvents: 'none'
        }}
        allow="autoplay; fullscreen"
        allowFullScreen
        title="Spline Background Animation"
      />
    </div>
  );
}
