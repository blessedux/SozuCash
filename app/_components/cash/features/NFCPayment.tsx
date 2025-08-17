'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi } from 'lucide-react';

interface NFCPaymentProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function NFCPayment({ onSuccess, onError }: NFCPaymentProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');

  const handleNFCTap = async () => {
    if (paymentStatus === 'scanning') return; // Prevent multiple clicks
    
    setIsScanning(true);
    setPaymentStatus('scanning');
    
    try {
      // Check if NFC is available
      if ('NDEFReader' in window) {
        const ndef = new (window as any).NDEFReader();
        
        try {
          await ndef.scan();
          
          ndef.addEventListener("reading", ({ message, serialNumber }: any) => {
            console.log(`> Serial Number: ${serialNumber}`);
            console.log(`> Records: (${message.records.length})`);
            
            // Process the NFC payment
            // This would integrate with your payment processing system
            console.log('NFC payment successful - calling onSuccess');
            setPaymentStatus('success');
            onSuccess?.();
          });
          
        } catch (error) {
          console.error(`Error scanning: ${error}`);
          setPaymentStatus('error');
          onError?.(error as Error);
        }
      } else {
        // Fallback for devices without NFC - mock payment for testing
        console.log('NFC not supported - using mock payment for testing');
        
        // Simulate NFC payment processing
        setTimeout(() => {
          console.log('Mock NFC payment successful - calling onSuccess');
          setPaymentStatus('success');
          onSuccess?.();
        }, 2000); // 2 second delay to simulate processing
      }
    } catch (error) {
      console.error('NFC error:', error);
      setPaymentStatus('error');
      onError?.(error as Error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <motion.button
      onClick={handleNFCTap}
      disabled={paymentStatus === 'scanning'}
      className={`
        w-20 h-20 
        border border-white/20 
        rounded-full 
        flex items-center justify-center 
        hover:bg-white/10 
        hover:scale-105 
        transition-all 
        cursor-pointer 
        pointer-events-auto 
        bg-transparent
        relative
        ${paymentStatus === 'scanning' ? 'animate-pulse' : ''}
        ${paymentStatus === 'success' ? 'border-green-400 bg-green-400/10' : ''}
        ${paymentStatus === 'error' ? 'border-red-400 bg-red-400/10' : ''}
      `}
      style={{
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        backgroundColor: 'transparent'
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* NFC Icon */}
      <Wifi 
        size={32} 
        className={`
          rotate-45 
          ${paymentStatus === 'scanning' ? 'text-green-400' : ''} 
          ${paymentStatus === 'success' ? 'text-green-400' : ''} 
          ${paymentStatus === 'error' ? 'text-red-400' : ''} 
          ${paymentStatus === 'idle' ? 'text-white' : ''} 
          transition-colors
        `} 
      />

      {/* Scanning Animation */}
      {paymentStatus === 'scanning' && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-green-400/50"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeOut" 
          }}
        />
      )}
    </motion.button>
  );
}
