'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppBackground from '@/components/AppBackground'
import PassKeyAuth from '@/components/PassKeyAuth'
import SwipeNavigation from '@/components/SwipeNavigation'

export default function AppPage() {
  const router = useRouter()
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAuthSuccess = (address: string) => {
    setWalletAddress(address)
    setError(null)
  }

  const handleAuthError = (errorMessage: string) => {
    setError(errorMessage)
  }

  const handleBackToLanding = () => {
    router.push('/')
  }

  const handleLogout = () => {
    setWalletAddress(null)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* App Background */}
      <AppBackground />
      
      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen">
        {/* Back Button - Only show during authentication */}
        {!walletAddress && (
          <div className="absolute top-6 left-6 z-20">
            <button
              onClick={handleBackToLanding}
              className="bg-white/10 backdrop-blur-lg border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-200"
            >
              ← Back to Landing
            </button>
          </div>
        )}

        {/* Main Content */}
        {!walletAddress ? (
          <PassKeyAuth 
            onSuccess={handleAuthSuccess}
            onError={handleAuthError}
          />
        ) : (
          <SwipeNavigation 
            walletAddress={walletAddress}
            balance="125.50"
            onLogout={handleLogout}
          />
        )}

        {/* Error Display */}
        {error && (
          <div className="fixed bottom-6 left-6 right-6 z-30">
            <div className="bg-red-500/90 backdrop-blur-lg border border-red-400/30 text-white p-4 rounded-lg">
              <p className="text-center">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
