'use client'

import React from 'react';
import { useState } from 'react';
import { WalletDashboard } from '@/components/WalletDashboard';
import { LoginScreen } from '@/components/LoginScreen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <main className="w-[400px] h-[600px] overflow-hidden">
      {isLoggedIn ? (
        <WalletDashboard />
      ) : (
        <LoginScreen onLogin={() => setIsLoggedIn(true)} />
      )}
    </main>
  );
} 