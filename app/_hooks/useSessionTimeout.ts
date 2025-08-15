'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

const SESSION_TIMEOUT = 60 * 1000; // 60 seconds

export function useSessionTimeout() {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    lastActivityRef.current = Date.now();
    
    timeoutRef.current = setTimeout(() => {
      // Only lock if the app has been inactive for the full duration
      if (Date.now() - lastActivityRef.current >= SESSION_TIMEOUT) {
        router.push('/app');
      }
    }, SESSION_TIMEOUT);
  }, [router]);

  // Reset timeout on user activity
  const handleActivity = useCallback(() => {
    resetTimeout();
  }, [resetTimeout]);

  useEffect(() => {
    // Initial timeout setup
    resetTimeout();

    // Add event listeners for user activity
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [handleActivity, resetTimeout]);

  return {
    resetTimeout,
    handleActivity
  };
}
