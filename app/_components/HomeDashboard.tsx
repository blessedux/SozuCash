'use client'

import { useState } from 'react'
import { 
  Send, 
  Download, 
  Settings, 
  LogOut, 
  Wallet,
  Zap,
  Shield,
  QrCode,
  Smartphone
} from 'lucide-react'
import WaveOverlay from './WaveOverlay'
import Toast from './Toast'

interface HomeDashboardProps {
  walletAddress: string
  onLogout: () => void
}

export default function HomeDashboard({ walletAddress, onLogout }: HomeDashboardProps) {
  const [showWave, setShowWave] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Mock data for demo
  const balance = "125.50"
  const isQuickWindowActive = false

  const handleSend = () => {
    setToast({ type: 'success', message: 'Send feature coming soon!' })
  }

  const handleReceive = () => {
    setToast({ type: 'success', message: 'Receive feature coming soon!' })
  }

  const handleQuickWindow = () => {
    setToast({ type: 'success', message: 'Quick Window feature coming soon!' })
  }

  const handleLogout = () => {
    onLogout()
  }

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance)
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-mantle-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Sozu Cash
              </h1>
              <p className="text-sm text-white/70">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Balance
          </h2>
          <Wallet className="w-5 h-5 text-primary-400" />
        </div>
        
        <div>
          <div className="text-3xl font-bold text-white mb-1">
            ${formatBalance(balance)}
          </div>
          <p className="text-sm text-white/70">
            USDC on Mantle Network
          </p>
        </div>
      </div>

      {/* Quick Window Status */}
      {isQuickWindowActive && (
        <div className="bg-green-500/20 backdrop-blur-lg border border-green-500/30 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-200">
                Quick Window Active
              </span>
            </div>
            <span className="text-xs text-green-400">
              60s
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={handleSend}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-200"
        >
          <Send className="w-8 h-8 text-primary-400 mx-auto mb-3" />
          <h3 className="font-semibold text-white mb-1">
            Send
          </h3>
          <p className="text-sm text-white/70">
            Tap NFC or scan QR
          </p>
        </button>

        <button
          onClick={handleReceive}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-200"
        >
          <Download className="w-8 h-8 text-mantle-400 mx-auto mb-3" />
          <h3 className="font-semibold text-white mb-1">
            Receive
          </h3>
          <p className="text-sm text-white/70">
            Create invoice
          </p>
        </button>
      </div>

      {/* Quick Window Button */}
      <button
        onClick={handleQuickWindow}
        disabled={isQuickWindowActive}
        className={`w-full py-4 rounded-2xl font-medium transition-all duration-200 mb-8 ${
          isQuickWindowActive
            ? 'bg-white/5 text-white/50 cursor-not-allowed'
            : 'bg-gradient-to-r from-primary-600 to-mantle-600 hover:from-primary-700 hover:to-mantle-700 text-white'
        }`}
      >
        {isQuickWindowActive ? 'Quick Window Active' : 'Activate Quick Window (60s)'}
      </button>

      {/* Feature Preview */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          Features Coming Soon
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <QrCode className="w-5 h-5 text-primary-400" />
            <span className="text-white/80">QR Code Scanning</span>
          </div>
          <div className="flex items-center space-x-3">
            <Smartphone className="w-5 h-5 text-mantle-400" />
            <span className="text-white/80">NFC Tag Reading</span>
          </div>
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-white/80">Biometric Authentication</span>
          </div>
        </div>
      </div>

      {/* Settings */}
      <button
        onClick={() => setToast({ type: 'success', message: 'Settings coming soon!' })}
        className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 flex items-center justify-between hover:bg-white/20 transition-all duration-200"
      >
        <div className="flex items-center space-x-3">
          <Settings className="w-5 h-5 text-white/70" />
          <span className="font-medium text-white">
            Settings
          </span>
        </div>
        <span className="text-white/50">→</span>
      </button>

      {/* Wave Overlay */}
      {showWave && <WaveOverlay onComplete={() => setShowWave(false)} />}

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
