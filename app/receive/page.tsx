'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { QrCode, Wifi } from 'lucide-react';

export default function ReceiveScreen() {
  const [amount, setAmount] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      amount: 100,
      status: 'completed',
      date: '2024-01-15',
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    },
    {
      id: 2,
      amount: 50,
      status: 'expired',
      date: '2024-01-10',
      hash: null
    },
    {
      id: 3,
      amount: 25,
      status: 'pending',
      date: '2024-01-20',
      hash: null
    },
    {
      id: 4,
      amount: 75,
      status: 'completed',
      date: '2024-01-18',
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
    },
    {
      id: 5,
      amount: 200,
      status: 'pending',
      date: '2024-01-22',
      hash: null
    },
    {
      id: 6,
      amount: 150,
      status: 'completed',
      date: '2024-01-16',
      hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456'
    },
    {
      id: 7,
      amount: 300,
      status: 'expired',
      date: '2024-01-08',
      hash: null
    },
    {
      id: 8,
      amount: 125,
      status: 'pending',
      date: '2024-01-25',
      hash: null
    }
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Check for amount parameter in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const amountParam = urlParams.get('amount');
      if (amountParam) {
        setAmount(amountParam);
        setShowQR(true); // Automatically show the ready to receive screen
      }
    }
  }, []);

  // Mock wallet address and payment URL
  const walletAddress = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6";
  
  // Generate unique payment URL
  const generatePaymentUrl = (amount: string) => {
    if (typeof window !== 'undefined') {
      const baseUrl = window.location.origin;
      const paymentId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      return `${baseUrl}/pay/${paymentId}?amount=${amount}&wallet=${walletAddress}`;
    }
    return '';
  };
  
  const paymentUrl = generatePaymentUrl(amount);

  // Auto-focus the input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 50;
    
    // Navigate back on any swipe (left or right)
    if (Math.abs(info.offset.x) > threshold) {
      if (showQRCode) {
        // If on QR code screen, go back to ready to receive screen
        setShowQRCode(false);
      } else if (showQR) {
        // If on ready to receive screen, go back to amount input
        setShowQR(false);
      } else {
        // If on amount input screen, go back to app navigation
        router.push('/app-navigation');
      }
    }
  };

  const handleDeposit = () => {
    if (amount && parseFloat(amount) > 0) {
      setShowQR(true);
      // Add new invoice to the list
      const newInvoice = {
        id: Date.now(),
        amount: parseFloat(amount),
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        hash: null
      };
      setInvoices(prev => [newInvoice, ...prev]);
    }
  };

  const handleShowQRCode = () => {
    setShowQRCode(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const formatAmount = (value: string) => {
    if (!value) return '';
    const num = parseFloat(value);
    return isNaN(num) ? '' : `$${num.toFixed(2)}`;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Spline Background Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <iframe 
          src='https://my.spline.design/animatedshapeblend-vPAPkDf3zXbvMSVXAIjlDWIm/' 
          frameBorder='0' 
          width='100%' 
          height='100%'
          className="w-full h-full scale-120"
          style={{ transform: 'scale(1.2)' }}
        />
      </div>

      {/* Sozu Cash Logo */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
        <img 
          src="/sozu-logo.png" 
          alt="Sozu Cash" 
          className="w-20"
        />
      </div>





      {/* Main Content */}
      <motion.div
        className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 py-8"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Dark Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        
        <div className="relative z-20 text-center max-w-sm mx-auto w-full pt-20">
          {/* Glassmorphism Card */}
          <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl w-full h-96 flex items-center justify-center">
            
            {!showQR && !showQRCode ? (
              /* Amount Input Screen */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 w-full"
              >
                {/* USD Title */}
                <div className="text-center mb-2">
                  <h2 className="text-white/70 text-lg font-medium">USD</h2>
                </div>

                {/* Amount Input Field */}
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0.00"
                    className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white text-4xl font-bold text-center py-8 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/30"
                  />
                  {amount && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 text-lg">
                      USD
                    </div>
                  )}
                </div>

                {/* Deposit Button */}
                <button 
                  onClick={handleDeposit}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Deposit
                </button>
              </motion.div>
            ) : showQR && !showQRCode ? (
              /* Ready to Receive Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 w-full h-full flex flex-col"
              >
                {/* Amount Display */}
                <div className="text-center mb-4">
                  <h1 className="text-3xl font-bold text-white">
                    {formatAmount(amount)}
                  </h1>
                </div>

                {/* NFC Radar Animation */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    {/* Radar circles */}
                    <div className="absolute inset-0 rounded-full border border-white/20 animate-ping"></div>
                    <div className="absolute inset-0 rounded-full border border-white/20 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute inset-0 rounded-full border border-white/20 animate-ping" style={{ animationDelay: '1s' }}></div>
                    
                    {/* NFC Icon */}
                    <div className="relative z-10 w-16 h-16 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center">
                      <Wifi size={32} className="rotate-45" />
                    </div>
                  </div>
                </div>

                {/* Show QR Code Button */}
                <button 
                  onClick={handleShowQRCode}
                  className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-3 px-4 rounded-xl hover:bg-white/20 transition-all duration-200 flex items-center justify-center space-x-3 text-sm"
                >
                  <QrCode size={20} />
                  <span>Show QR Code</span>
                </button>

                {/* Wallet Address */}
                <div className="p-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg">
                  <p className="text-white/50 text-xs mb-1">Wallet Address</p>
                  <div className="flex items-center justify-between">
                    <code className="text-white/70 text-xs break-all">{walletAddress}</code>
                    <button 
                      onClick={() => copyToClipboard(walletAddress)}
                      className="ml-2 text-white/50 hover:text-white transition-colors"
                    >
                      📋
                    </button>
                  </div>
                </div>


              </motion.div>
            ) : (
              /* QR Code Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-6 w-full h-full flex flex-col"
              >
                {/* Title */}
                <h1 className="text-2xl font-bold text-white mb-2">
                  QR Code for {formatAmount(amount)}
                </h1>

                {/* QR Code with Zoom Animation */}
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                  className="w-64 h-64 mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl flex items-center justify-center mb-6"
                >
                  <div className="text-white/30 text-sm text-center">
                    QR Code<br />
                    {formatAmount(amount)}
                  </div>
                </motion.div>

                {/* Payment URL */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="p-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl"
                >
                  <p className="text-white/50 text-sm mb-2">Payment Link</p>
                  <div className="flex items-center justify-between">
                    <code className="text-white/70 text-xs break-all">{paymentUrl}</code>
                    <button 
                      onClick={() => copyToClipboard(paymentUrl)}
                      className="ml-2 text-white/50 hover:text-white transition-colors"
                    >
                      📋
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Invoice History - Below the main card, scrollable */}
          {showQR && !showQRCode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-8 w-full max-w-sm mx-auto"
            >
              <h3 className="text-white/70 text-sm font-medium mb-3 text-center">Recent Invoices</h3>
              <div className="relative max-h-48 overflow-hidden">
                <div className="max-h-48 overflow-y-auto space-y-2 pr-2 scrollbar-hide">
                  {/* Top fade overlay */}
                  <div className="sticky top-0 left-0 right-0 h-6 bg-gradient-to-b from-black via-black/50 to-transparent pointer-events-none z-20"></div>
                  
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          invoice.status === 'completed' ? 'bg-green-400' :
                          invoice.status === 'expired' ? 'bg-red-400' :
                          'bg-yellow-400'
                        }`}></div>
                        <div>
                          <p className="text-white text-sm font-medium">${invoice.amount}</p>
                          <p className="text-white/50 text-xs">{invoice.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          invoice.status === 'completed' ? 'text-green-400' :
                          invoice.status === 'expired' ? 'text-red-400' :
                          'text-yellow-400'
                        }`}>
                          {invoice.status === 'completed' ? 'Paid' :
                           invoice.status === 'expired' ? 'Expired' :
                           'Pending'}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Bottom fade overlay */}
                  <div className="sticky bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-20"></div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>


    </div>
  );
}
