'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateQRCode, QRCodeOptions } from '../../utils/qrCode';

interface QRCodeDisplayProps {
  amount?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showAmount?: boolean;
  data?: string;
  useActualQR?: boolean;
  qrOptions?: QRCodeOptions;
}

export default function QRCodeDisplay({ 
  amount, 
  size = 'md', 
  className = '',
  showAmount = true,
  data,
  useActualQR = false,
  qrOptions = {}
}: QRCodeDisplayProps) {
  const [qrImageSrc, setQrImageSrc] = useState('/icons/mntqr.png');
  const [isLoading, setIsLoading] = useState(false);

  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-64 h-64',
    lg: 'w-80 h-80'
  };

  const formatAmount = (value: string) => {
    if (!value) return '';
    const num = parseFloat(value);
    return isNaN(num) ? '' : `$${num.toFixed(2)}`;
  };

  // Generate QR code when data is provided and useActualQR is true
  useEffect(() => {
    if (data && useActualQR) {
      setIsLoading(true);
      generateQRCode(data, { ...qrOptions, usePlaceholder: false })
        .then((qrDataURL) => {
          setQrImageSrc(qrDataURL);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error generating QR code:', error);
          setQrImageSrc('/icons/mntqr.png');
          setIsLoading(false);
        });
    } else {
      setQrImageSrc('/icons/mntqr.png');
    }
  }, [data, useActualQR, qrOptions]);

  return (
    <motion.div 
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      className={`${sizeClasses[size]} mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl flex items-center justify-center overflow-hidden ${className}`}
    >
      <div className="relative w-full h-full">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/30"></div>
          </div>
        ) : (
          <img 
            src={qrImageSrc} 
            alt={`QR Code${amount ? ` for ${formatAmount(amount)}` : ''}`}
            className="w-full h-full object-contain p-4"
          />
        )}
        {showAmount && amount && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
              <span className="text-white text-xs font-semibold">
                {formatAmount(amount)}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
