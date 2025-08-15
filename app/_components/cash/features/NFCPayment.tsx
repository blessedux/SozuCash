'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NFCPaymentProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function NFCPayment({ onSuccess, onError }: NFCPaymentProps) {
  const [isScanning, setIsScanning] = useState(false);
  const router = useRouter();

  const handleNFCTap = async () => {
    setIsScanning(true);
    
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
            router.push('/pay');
            onSuccess?.();
          });
          
        } catch (error) {
          console.error(`Error scanning: ${error}`);
          onError?.(error as Error);
        }
      } else {
        // Fallback for devices without NFC
        console.log('NFC not supported - redirecting to QR code payment');
        router.push('/pay');
      }
    } catch (error) {
      console.error('NFC error:', error);
      onError?.(error as Error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <motion.button
      onClick={handleNFCTap}
      className={`
        w-20 h-20 
        border border-white/20 
        rounded-full 
        flex items-center justify-center 
        hover:bg-white/5 
        hover:scale-105 
        transition-all 
        cursor-pointer 
        pointer-events-auto 
        bg-transparent
        relative
        ${isScanning ? 'animate-pulse' : ''}
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
          ${isScanning ? 'text-green-400' : 'text-white'} 
          transition-colors
        `} 
      />

      {/* Scanning Animation */}
      {isScanning && (
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
