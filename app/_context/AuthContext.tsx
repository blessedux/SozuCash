'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  authenticate: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage key for authentication state
const AUTH_STORAGE_KEY = 'sozu-cash-auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load authentication state from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        // Check if the authentication is still valid (not expired)
        if (authData.timestamp && Date.now() - authData.timestamp < 24 * 60 * 60 * 1000) {
          setIsAuthenticated(true);
        } else {
          // Authentication expired, clear it
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } catch (error) {
        console.warn('Error parsing stored auth data:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const authenticate = async () => {
    setIsLoading(true);
    
    // Simulate authentication process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Store authentication state with timestamp
    const authData = {
      isAuthenticated: true,
      timestamp: Date.now()
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const logout = () => {
    try {
      // Clear authentication state from localStorage
      localStorage.removeItem(AUTH_STORAGE_KEY);
      
      // Update state
      setIsAuthenticated(false);
      
      // Navigate to authentication screen
      router.push('/app');
    } catch (error) {
      console.error('Error during logout:', error);
      
      // Fallback: try to navigate anyway
      try {
        router.push('/app');
      } catch (navError) {
        console.error('Navigation error during logout:', navError);
        // Last resort: force page reload
        window.location.href = '/app';
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      authenticate,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
