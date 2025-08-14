'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import WaveOverlay from '@/components/WaveOverlay'
import Toast from '@/components/Toast'
import { Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'

interface Invoice {
  v: number
  net: string
  token: string
  dec: number
  to: string
  amt: string
  memo: string
  nonce: string
  exp: number
  sig: string
}

export default function InvoicePage() {
  const params = useParams()
  const router = useRouter()
  
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed' | null>(null)
  const [showWave, setShowWave] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const invoiceId = params.id as string

  useEffect(() => {
    fetchInvoice()
  }, [invoiceId])

  const fetchInvoice = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/i/${invoiceId}`)
      
      if (!response.ok) {
        throw new Error('Invoice not found')
      }

      const data = await response.json()
      
      // Verify invoice
      if (!verifyInvoice(data)) {
        throw new Error('Invalid invoice')
      }

      setInvoice(data)
      
    } catch (err) {
      console.error('Error fetching invoice:', err)
      setError(err instanceof Error ? err.message : 'Failed to load invoice')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyInvoice = (inv: Invoice): boolean => {
    // Basic validation
    if (!inv.to || !inv.amt || !inv.exp || !inv.sig) {
      return false
    }

    // Check expiration
    if (Date.now() / 1000 > inv.exp) {
      return false
    }

    // TODO: Verify EIP-712 signature
    // This would be implemented with actual signature verification

    return true
  }

  const handlePay = async () => {
    if (!invoice) return
    
    try {
      setPaymentStatus('pending')
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Show success
      setPaymentStatus('success')
      setShowWave(true)
      setToast({ type: 'success', message: 'Payment successful! (Demo mode)' })
      
      // Redirect after delay
      setTimeout(() => {
        router.push('/app')
      }, 2000)
      
    } catch (err) {
      console.error('Payment failed:', err)
      setPaymentStatus('failed')
      setToast({ type: 'error', message: 'Payment failed. Please try again.' })
    }
  }

  const handleBack = () => {
    router.push('/app')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-mantle-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading invoice...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-mantle-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center max-w-md mx-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Invoice Error
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <button
            onClick={handleBack}
            className="btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!invoice) {
    return null
  }

  const amount = parseFloat(invoice.amt) / Math.pow(10, invoice.dec)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-mantle-50 dark:from-gray-900 dark:to-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white ml-4">
          Payment Request
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        {/* Invoice Details */}
        <div className="card p-6 mb-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Amount</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ${amount.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">To</span>
              <span className="text-sm font-mono text-gray-900 dark:text-white">
                {invoice.to.slice(0, 6)}...{invoice.to.slice(-4)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Network</span>
              <span className="text-sm text-gray-900 dark:text-white capitalize">
                {invoice.net}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Token</span>
              <span className="text-sm text-gray-900 dark:text-white">
                {invoice.token}
              </span>
            </div>

            {invoice.memo && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Memo</span>
                <p className="text-sm text-gray-900 dark:text-white mt-1">
                  {invoice.memo}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Status */}
        {paymentStatus && (
          <div className="card p-4 mb-6">
            <div className="flex items-center space-x-3">
              {paymentStatus === 'pending' && (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                  <span className="text-primary-600">Processing payment...</span>
                </>
              )}
              {paymentStatus === 'success' && (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-600">Payment successful!</span>
                </>
              )}
              {paymentStatus === 'failed' && (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-600">Payment failed</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!paymentStatus && (
          <div className="space-y-4">
            <button
              onClick={handlePay}
              className="w-full btn-primary py-4 text-lg"
            >
              Pay ${amount.toFixed(2)} (Demo)
            </button>
            
            <button
              onClick={handleBack}
              className="w-full btn-secondary py-4"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Demo Notice */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800 dark:text-blue-200">
              Demo Mode - No real payments will be processed
            </span>
          </div>
        </div>
      </motion.div>

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
