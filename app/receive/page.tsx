'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AnimatedTransition } from '../_components/shared/AnimatedTransition';
import { Input } from '../_components/ui/Input';
import { Button } from '../_components/ui/Button';
import { useBalance } from '../_context/BalanceContext';
import { useNavigation } from '../_context/NavigationContext';
import HybridBackground from '../_components/HybridBackground';
import { Wifi, QrCode, CheckCircle, Lock } from 'lucide-react';
import QRCodeDisplay from '../_components/QRCodeDisplay';

export default function ReceiveScreen() {
  const [amount, setAmount] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [receivedAmount, setReceivedAmount] = useState('');
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [sendMode, setSendMode] = useState(false);
  const [sendToHandle, setSendToHandle] = useState('');
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
  const { setCurrentVerticalPage } = useNavigation();
  const { processDepositFromURL } = useBalance();

  // Set current vertical page to receive (2) when page mounts
  useEffect(() => {
    setCurrentVerticalPage(2);
  }, [setCurrentVerticalPage]);

  // Check for amount parameter in URL
  // Handle URL parameters and payment simulation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const amountParam = urlParams.get('amount');
      const modeParam = urlParams.get('mode');
      const toParam = urlParams.get('to');
      
      if (amountParam) {
        console.log('URL parameter detected:', amountParam);
        setAmount(amountParam);
        
        // Process the deposit amount from URL to add to balance
        processDepositFromURL(amountParam);
        console.log(`Deposit amount $${amountParam} processed and added to balance`);
        
        // Check if this is send mode
        if (modeParam === 'send' && toParam) {
          console.log('Send mode detected:', { amount: amountParam, to: toParam });
          setSendMode(true);
          setSendToHandle(toParam);
          setShowQR(true); // Automatically show the confirmation screen
        } else {
          setShowQR(true); // Automatically show the ready to receive screen
        }
      }
    }
  }, []);

  // Simulate payment received (for demo purposes) - triggers after 4 seconds on any receive page with amount
  useEffect(() => {
    if (amount && !paymentReceived && !sendMode) {
      console.log('Setting up payment simulation for amount:', amount);
      // Simulate payment received after 4 seconds
      const timer = setTimeout(() => {
        console.log('Payment simulation triggered for amount:', amount);
        setReceivedAmount(amount);
        setPaymentReceived(true);
        setShowPaymentConfirmation(true);
        
        // Add the confirmed deposit amount to the balance
        const depositAmount = parseFloat(amount);
        if (!isNaN(depositAmount) && depositAmount > 0) {
          processDepositFromURL(amount);
          console.log(`Confirmed deposit: $${depositAmount} added to balance`);
        }
      }, 4000);
      return () => {
        console.log('Clearing payment simulation timer');
        clearTimeout(timer);
      };
    }
  }, [amount, paymentReceived, sendMode, processDepositFromURL]);

  // For send mode, immediately show confirmation
  useEffect(() => {
    if (sendMode && amount && !paymentReceived) {
      console.log('Send mode - immediately showing confirmation for amount:', amount);
      setReceivedAmount(amount);
      setPaymentReceived(true);
      setShowPaymentConfirmation(true);
    }
  }, [sendMode, amount, paymentReceived]);

  // Auto-confirm pending invoices after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setInvoices(prevInvoices => 
        prevInvoices.map(invoice => 
          invoice.status === 'pending' 
            ? { ...invoice, status: 'completed', hash: `0x${Math.random().toString(36).substring(2, 15)}` }
            : invoice
        )
      );
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Add payment to invoice history when payment is received
  useEffect(() => {
    if (paymentReceived && receivedAmount) {
      console.log('Adding payment to invoice history:', receivedAmount);
      const newInvoice = {
        id: Date.now(),
        amount: parseFloat(receivedAmount),
        status: 'completed' as const,
        date: new Date().toISOString().split('T')[0],
        hash: `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
      };
      
      setInvoices(prevInvoices => [newInvoice, ...prevInvoices]);
    }
  }, [paymentReceived, receivedAmount]);

  // Debug state changes
  useEffect(() => {
    console.log('State debug:', {
      showQR,
      showQRCode,
      amount,
      paymentReceived,
      receivedAmount,
      showPaymentConfirmation
    });
  }, [showQR, showQRCode, amount, paymentReceived, receivedAmount, showPaymentConfirmation]);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('Enter key pressed, calling handleDeposit');
      handleDeposit();
    }
  };

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyboardNavigation = (event: KeyboardEvent) => {
      // Don't handle keyboard events if user is typing in an input field
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
          event.preventDefault();
          handleBackNavigation();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyboardNavigation);
    return () => window.removeEventListener('keydown', handleKeyboardNavigation);
  }, [showQR, showQRCode, paymentReceived]);

  const handleBackNavigation = () => {
    if (paymentReceived) {
      // If payment is received, go back to main cash interface
      router.push('/cash');
    } else if (showQRCode) {
      // If on QR code screen, go back to ready to receive screen
      setShowQRCode(false);
    } else if (showQR) {
      // If on ready to receive screen, go back to amount input
      setShowQR(false);
    } else {
      // If on amount input screen, go back to main cash interface
      router.push('/cash');
    }
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
        // If on amount input screen, go back to main cash interface
        router.push('/cash');
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

  const truncateText = (text: string, maxLength: number = 20) => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden no-scroll">
      {/* Hybrid Background - Same beautiful effect as demo */}
      <HybridBackground 
        scale={1.2} 
        enableInteractions={true}
        lavaOpacity={0.3}
        showLavaBubbles={true}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30 z-[1] pointer-events-none" />

      {/* Sozu Cash Logo */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
        <img 
          src="/sozu-logo.png" 
          alt="Sozu Cash" 
          className="w-20"
        />
      </div>

      {/* Mobile Lock Button - Top Left */}
      <button
        onClick={() => router.push('/app')}
        className="absolute top-8 left-4 z-20 text-white/70 hover:text-white transition-colors pointer-events-auto md:hidden"
        aria-label="Lock wallet"
        title="Lock Wallet"
      >
        <Lock size={24} />
      </button>





      {/* Main Content */}
      <motion.div
        className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 py-8 pointer-events-none"
        style={{ backgroundColor: 'transparent' }}
      >

        
        <div className="relative z-20 text-center w-80 mx-auto pt-20 pointer-events-auto" style={{ backgroundColor: 'transparent' }}>
                      {/* Glassmorphism Card */}
            <div className="border border-white/10 rounded-3xl p-8 shadow-2xl w-full h-96 flex items-center justify-center pointer-events-none backdrop-blur-[10px]">
            
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
                    onKeyDown={handleKeyDown}
                    placeholder="0.00"
                    className="w-full border border-white/20 text-white text-4xl font-bold text-center py-8 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/30 pointer-events-auto"
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
                                      className="w-full border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl hover:bg-white/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto"
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
                className="w-full h-full flex flex-col overflow-hidden"
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
                    <div className="relative z-10 w-16 h-16 border border-white/20 rounded-full flex items-center justify-center">
                      <Wifi size={32} className="rotate-45" />
                    </div>
                  </div>
                </div>

                {/* Show QR Code Button */}
                <button 
                  onClick={handleShowQRCode}
                                      className="w-full border border-white/20 text-white font-semibold py-3 px-4 rounded-xl hover:bg-white/5 transition-all duration-200 flex items-center justify-center space-x-3 text-sm pointer-events-auto"
                >
                  <QrCode size={20} />
                  <span>Show QR Code</span>
                </button>


              </motion.div>
            ) : showPaymentConfirmation ? (
              /* Payment Confirmation Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex flex-col overflow-hidden"
              >
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto space-y-6 pr-1">
                  {/* Success Animation */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                    className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-400/30"
                  >
                    <CheckCircle size={40} className="text-green-400" />
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold text-white mb-4 text-center"
                  >
                    {sendMode ? 'Payment Sent!' : 'Payment Received!'}
                  </motion.h2>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-white/70 mb-6 text-center"
                  >
                    {sendMode 
                      ? `Payment sent to @${sendToHandle} successfully`
                      : 'You\'ve received a payment successfully'
                    }
                  </motion.p>

                  {/* Payment Details */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="rounded-2xl p-4 mb-6"
                  >
                    <p className="text-white/50 text-sm text-center">
                      {sendMode ? 'Amount Sent' : 'Amount Received'}
                    </p>
                    <p className="text-3xl font-bold text-white text-center">{formatAmount(receivedAmount)}</p>
                    <p className="text-white/50 text-xs mt-2 text-center">Transaction ID: 0xabcd...efgh</p>
                    {sendMode && (
                      <p className="text-white/50 text-xs mt-1 text-center">To: @{sendToHandle}</p>
                    )}
                  </motion.div>
                </div>

                {/* Fixed Bottom Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  onClick={() => {
                    setShowPaymentConfirmation(false);
                    setPaymentReceived(false);
                    setReceivedAmount('');
                    // Navigate back to the main cash interface instead of locked screen
                    router.push('/cash');
                  }}
                  className="w-full bg-white text-black py-3 rounded-2xl font-semibold text-base hover:bg-gray-100 active:scale-95 transition-all pointer-events-auto flex-shrink-0"
                >
                  Done
                </motion.button>
              </motion.div>
            ) : (
              /* QR Code Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-4 w-full h-full flex flex-col"
              >
                {/* Title */}
                <h1 className="text-xl font-bold text-white mb-2">
                  QR Code for {formatAmount(amount)}
                </h1>

                {/* QR Code with Zoom Animation */}
                <div className="mb-4">
                  <QRCodeDisplay 
                    amount={amount} 
                    size="sm" 
                    showAmount={true}
                  />
                </div>

                {/* Payment URL inside card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="p-3 border border-white/10 rounded-xl"
                >
                  <p className="text-white/50 text-xs mb-1">Payment Link</p>
                  <div className="flex items-center justify-between">
                    <code className="text-white/70 text-xs truncate flex-1 mr-2">{truncateText(paymentUrl, 25)}</code>
                    <button 
                      onClick={() => copyToClipboard(paymentUrl)}
                      className="text-white/50 hover:text-white transition-colors pointer-events-auto text-xs flex-shrink-0"
                    >
                      📋
                    </button>
                  </div>
                </motion.div>

                {/* Wallet Address below card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="p-3 border border-white/10 rounded-lg"
                >
                  <p className="text-white/50 text-xs mb-1">Wallet Address</p>
                  <div className="flex items-center justify-between">
                    <code className="text-white/70 text-xs truncate flex-1 mr-2">{truncateText(walletAddress, 25)}</code>
                    <button 
                      onClick={() => copyToClipboard(walletAddress)}
                      className="text-white/50 hover:text-white transition-colors pointer-events-auto text-xs flex-shrink-0"
                    >
                      📋
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>


        </div>
      </motion.div>



    </div>
  );
}
