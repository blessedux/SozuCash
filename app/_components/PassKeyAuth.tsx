'use client'

import { useState } from 'react'
import { Fingerprint, Shield, Zap, Loader2 } from 'lucide-react'

interface PassKeyAuthProps {
  onSuccess: (walletAddress: string) => void
  onError: (error: string) => void
}

export default function PassKeyAuth({ onSuccess, onError }: PassKeyAuthProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [step, setStep] = useState<'initial' | 'creating' | 'success'>('initial')

  const handleCreateWallet = async () => {
    setIsAuthenticating(true)
    setStep('creating')

    try {
      // Simulate PassKey authentication and wallet creation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate a mock wallet address
      const mockAddress = '0x' + Math.random().toString(16).substring(2, 42)
      
      setStep('success')
      onSuccess(mockAddress)
    } catch (error) {
      onError('Failed to create wallet. Please try again.')
    } finally {
      setIsAuthenticating(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-mantle-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Create Your Wallet
          </h1>
          <p className="text-white/70">
            Secure your wallet with biometric authentication
          </p>
        </div>

        {/* Authentication Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-5 h-5 text-primary-400" />
            <h2 className="text-lg font-semibold text-white">
              Secure Authentication
            </h2>
          </div>
          
          <div className="space-y-3 text-sm text-white/80">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Biometric verification (Face ID / Touch ID)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Private keys stored securely on device</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>No passwords or recovery phrases needed</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleCreateWallet}
          disabled={isAuthenticating}
          className="w-full bg-gradient-to-r from-primary-600 to-mantle-600 hover:from-primary-700 hover:to-mantle-700 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {isAuthenticating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Creating Wallet...</span>
            </>
          ) : (
            <>
              <Fingerprint className="w-5 h-5" />
              <span>Create Wallet with PassKey</span>
            </>
          )}
        </button>

        {/* Status Messages */}
        {step === 'creating' && (
          <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <p className="text-blue-200 text-sm text-center">
              Please authenticate with your biometric credentials...
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
            <p className="text-green-200 text-sm text-center">
              Wallet created successfully! Redirecting...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
