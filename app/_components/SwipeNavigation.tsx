'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion'
import { Camera, Download, Settings, Copy, Check, Wallet } from 'lucide-react'
import Toast from './Toast'

interface SwipeNavigationProps {
  walletAddress: string
  balance: string
  onLogout: () => void
}

type Page = 'pay' | 'receive' | 'settings'

export default function SwipeNavigation({ walletAddress, balance, onLogout }: SwipeNavigationProps) {
  const [currentPage, setCurrentPage] = useState<Page>('pay')
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [copied, setCopied] = useState(false)
  
  const x = useMotionValue(0)
  const xInput = [-100, 0, 100]
  const background = useTransform(x, xInput, [
    "linear-gradient(180deg, #1e40af 0%, #3b82f6 100%)", // Receive - Blue
    "linear-gradient(180deg, #059669 0%, #10b981 100%)", // Pay - Green
    "linear-gradient(180deg, #7c3aed 0%, #8b5cf6 100%)"  // Settings - Purple
  ])

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50
    const velocity = info.velocity.x

    if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 500) {
      if (info.offset.x > 0 || velocity > 0) {
        // Swipe right
        if (currentPage === 'pay') {
          setCurrentPage('settings')
        } else if (currentPage === 'receive') {
          setCurrentPage('pay')
        }
      } else {
        // Swipe left
        if (currentPage === 'pay') {
          setCurrentPage('receive')
        } else if (currentPage === 'settings') {
          setCurrentPage('pay')
        }
      }
    }
  }

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setToast({ type: 'success', message: 'Wallet address copied!' })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to copy address' })
    }
  }

  const handleScan = () => {
    setToast({ type: 'success', message: 'Camera scanning coming soon!' })
  }

  const handleReceive = () => {
    setToast({ type: 'success', message: 'Receive feature coming soon!' })
  }

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance)
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return (
    <motion.div 
      className="min-h-screen relative overflow-hidden"
      style={{ background }}
    >
      {/* Page Indicators */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
            currentPage === 'receive' ? 'bg-white' : 'bg-white/30'
          }`} />
          <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
            currentPage === 'pay' ? 'bg-white' : 'bg-white/30'
          }`} />
          <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
            currentPage === 'settings' ? 'bg-white' : 'bg-white/30'
          }`} />
        </div>
      </div>

      {/* Swipeable Container */}
      <motion.div
        className="flex w-[300%] h-full"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={{
          x: currentPage === 'receive' ? 0 : currentPage === 'pay' ? -100 : -200
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Receive Page */}
        <div className="w-1/3 h-full flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Download className="w-10 h-10 text-white" />
            </div>
            <h1 
              className="text-3xl font-bold text-white mb-4 mix-blend-difference"
              style={{
                mixBlendMode: 'difference',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                textShadow: 'none',
                fontFamily: "'Helvetica', sans-serif",
                fontWeight: 600,
                isolation: 'isolate'
              }}
            >
              Receive
            </h1>
            <p 
              className="text-white/80 mb-8 mix-blend-difference"
              style={{
                mixBlendMode: 'difference',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                textShadow: 'none',
                fontFamily: "'Helvetica', sans-serif",
                fontWeight: 400,
                isolation: 'isolate'
              }}
            >
              Create an invoice to receive payments
            </p>
            
            <button
              onClick={handleReceive}
              className="bg-white/20 backdrop-blur-lg border border-white/30 text-white font-semibold py-4 px-8 rounded-2xl text-lg hover:bg-white/30 transition-all duration-200"
            >
              Create Invoice
            </button>
          </div>
        </div>

        {/* Pay Page (Center) */}
        <div className="w-1/3 h-full flex flex-col items-center justify-center p-6">
          <div className="text-center w-full max-w-sm">
            {/* Balance */}
            <div className="mb-8">
              <h2 
                className="text-white/80 text-lg mb-2 mix-blend-difference"
                style={{
                  mixBlendMode: 'difference',
                  color: '#ffffff',
                  WebkitTextFillColor: '#ffffff',
                  textShadow: 'none',
                  fontFamily: "'Helvetica', sans-serif",
                  fontWeight: 400,
                  isolation: 'isolate'
                }}
              >
                Balance
              </h2>
              <div 
                className="text-4xl font-bold text-white mb-1 mix-blend-difference"
                style={{
                  mixBlendMode: 'difference',
                  color: '#ffffff',
                  WebkitTextFillColor: '#ffffff',
                  textShadow: 'none',
                  fontFamily: "'Helvetica', sans-serif",
                  fontWeight: 600,
                  isolation: 'isolate'
                }}
              >
                ${formatBalance(balance)}
              </div>
              <p 
                className="text-white/60 text-sm mix-blend-difference"
                style={{
                  mixBlendMode: 'difference',
                  color: '#ffffff',
                  WebkitTextFillColor: '#ffffff',
                  textShadow: 'none',
                  fontFamily: "'Helvetica', sans-serif",
                  fontWeight: 400,
                  isolation: 'isolate'
                }}
              >
                USDC on Mantle
              </p>
            </div>

            {/* Main Action */}
            <div className="mb-8">
              <h1 
                className="text-3xl font-bold text-white mb-4 mix-blend-difference"
                style={{
                  mixBlendMode: 'difference',
                  color: '#ffffff',
                  WebkitTextFillColor: '#ffffff',
                  textShadow: 'none',
                  fontFamily: "'Helvetica', sans-serif",
                  fontWeight: 600,
                  isolation: 'isolate'
                }}
              >
                Ready to Pay
              </h1>
              <p 
                className="text-white/80 mb-6 mix-blend-difference"
                style={{
                  mixBlendMode: 'difference',
                  color: '#ffffff',
                  WebkitTextFillColor: '#ffffff',
                  textShadow: 'none',
                  fontFamily: "'Helvetica', sans-serif",
                  fontWeight: 400,
                  isolation: 'isolate'
                }}
              >
                Tap to scan or bring device close
              </p>
              
              <button
                onClick={handleScan}
                className="w-full bg-white/20 backdrop-blur-lg border border-white/30 text-white font-semibold py-6 px-8 rounded-3xl text-xl hover:bg-white/30 transition-all duration-200 flex items-center justify-center space-x-3"
              >
                <Camera className="w-6 h-6" />
                <span>Open Camera</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setToast({ type: 'success', message: 'NFC tap coming soon!' })}
                className="bg-white/10 backdrop-blur-lg border border-white/20 text-white py-3 px-4 rounded-xl text-sm hover:bg-white/20 transition-all duration-200"
              >
                Tap NFC
              </button>
              <button
                onClick={() => setToast({ type: 'success', message: 'Quick pay coming soon!' })}
                className="bg-white/10 backdrop-blur-lg border border-white/20 text-white py-3 px-4 rounded-xl text-sm hover:bg-white/20 transition-all duration-200"
              >
                Quick Pay
              </button>
            </div>
          </div>
        </div>

        {/* Settings Page */}
        <div className="w-1/3 h-full flex items-center justify-center p-6">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Settings className="w-10 h-10 text-white" />
              </div>
              <h1 
                className="text-3xl font-bold text-white mb-4 mix-blend-difference"
                style={{
                  mixBlendMode: 'difference',
                  color: '#ffffff',
                  WebkitTextFillColor: '#ffffff',
                  textShadow: 'none',
                  fontFamily: "'Helvetica', sans-serif",
                  fontWeight: 600,
                  isolation: 'isolate'
                }}
              >
                Settings
              </h1>
            </div>

            {/* Wallet Address */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 
                  className="text-white font-semibold mix-blend-difference"
                  style={{
                    mixBlendMode: 'difference',
                    color: '#ffffff',
                    WebkitTextFillColor: '#ffffff',
                    textShadow: 'none',
                    fontFamily: "'Helvetica', sans-serif",
                    fontWeight: 600,
                    isolation: 'isolate'
                  }}
                >
                  Wallet Address
                </h3>
                <Wallet className="w-4 h-4 text-white/60" />
              </div>
              <div className="flex items-center space-x-2">
                <code 
                  className="text-white/80 text-sm font-mono flex-1 break-all mix-blend-difference"
                  style={{
                    mixBlendMode: 'difference',
                    color: '#ffffff',
                    WebkitTextFillColor: '#ffffff',
                    textShadow: 'none',
                    fontFamily: "'Helvetica', sans-serif",
                    fontWeight: 400,
                    isolation: 'isolate'
                  }}
                >
                  {walletAddress}
                </code>
                <button
                  onClick={copyAddress}
                  className="p-2 text-white/60 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Settings Options */}
            <div className="space-y-3">
              <button
                onClick={() => setToast({ type: 'success', message: 'Security settings coming soon!' })}
                className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white py-4 px-4 rounded-xl text-left hover:bg-white/20 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span 
                    className="mix-blend-difference"
                    style={{
                      mixBlendMode: 'difference',
                      color: '#ffffff',
                      WebkitTextFillColor: '#ffffff',
                      textShadow: 'none',
                      fontFamily: "'Helvetica', sans-serif",
                      fontWeight: 400,
                      isolation: 'isolate'
                    }}
                  >
                    Security
                  </span>
                  <span className="text-white/50">→</span>
                </div>
              </button>
              
              <button
                onClick={() => setToast({ type: 'success', message: 'Network settings coming soon!' })}
                className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white py-4 px-4 rounded-xl text-left hover:bg-white/20 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span 
                    className="mix-blend-difference"
                    style={{
                      mixBlendMode: 'difference',
                      color: '#ffffff',
                      WebkitTextFillColor: '#ffffff',
                      textShadow: 'none',
                      fontFamily: "'Helvetica', sans-serif",
                      fontWeight: 400,
                      isolation: 'isolate'
                    }}
                  >
                    Network
                  </span>
                  <span className="text-white/50">→</span>
                </div>
              </button>
              
              <button
                onClick={onLogout}
                className="w-full bg-red-500/20 backdrop-blur-lg border border-red-500/30 text-red-200 py-4 px-4 rounded-xl text-left hover:bg-red-500/30 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span 
                    className="mix-blend-difference"
                    style={{
                      mixBlendMode: 'difference',
                      color: '#ffffff',
                      WebkitTextFillColor: '#ffffff',
                      textShadow: 'none',
                      fontFamily: "'Helvetica', sans-serif",
                      fontWeight: 400,
                      isolation: 'isolate'
                    }}
                  >
                    Logout
                  </span>
                  <span className="text-red-300">→</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Swipe Hints */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4 text-white/60 text-sm">
          <span 
            className="mix-blend-difference"
            style={{
              mixBlendMode: 'difference',
              color: '#ffffff',
              WebkitTextFillColor: '#ffffff',
              textShadow: 'none',
              fontFamily: "'Helvetica', sans-serif",
              fontWeight: 400,
              isolation: 'isolate'
            }}
          >
            ← Swipe to navigate
          </span>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </motion.div>
  )
}
