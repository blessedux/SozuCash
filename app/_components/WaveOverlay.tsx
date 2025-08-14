'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface WaveOverlayProps {
  onComplete: () => void
}

export default function WaveOverlay({ onComplete }: WaveOverlayProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 700) // Match animation duration

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Background wave */}
      <motion.div
        initial={{ scale: 0, opacity: 0.8 }}
        animate={{ scale: 4, opacity: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="absolute w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
      />
      
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3, type: 'spring' }}
        className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg"
      >
        <Check className="w-10 h-10 text-green-600" />
      </motion.div>
      
      {/* Success text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 text-center"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl px-6 py-3 shadow-lg">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Paid ✓
          </p>
        </div>
      </motion.div>
    </div>
  )
}
