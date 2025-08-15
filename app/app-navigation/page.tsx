'use client';

import React, { useState, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Wifi, Camera, CheckCircle } from 'lucide-react';
import SplineBackground from '@/components/SplineBackground';

export default function AppNavigation() {
  const [currentPage, setCurrentPage] = useState(1); // Start on pay page (index 1)
  const [isDragging, setIsDragging] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | 'up' | 'down'>('up');
  const [isConnectedToX, setIsConnectedToX] = useState(false);
  const [showSendScreen, setShowSendScreen] = useState(false);
  const [sendToHandle, setSendToHandle] = useState('');
  const [isSearchingUser, setIsSearchingUser] = useState(false);
  const [userFound, setUserFound] = useState(false);
  const [targetUserProfile, setTargetUserProfile] = useState<{ pfp: string; name: string; handle: string } | null>(null);
  const [isUserConfirmed, setIsUserConfirmed] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [sendPaymentSuccess, setSendPaymentSuccess] = useState(false);
  const [receiveAmount, setReceiveAmount] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const router = useRouter();

  // Mock user data - in real app this would come from auth state
  const userProfile = {
    name: "John Doe",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    username: "@johndoe"
  };

  // Mock wallet data
  const walletData = {
    address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    balance: "$1,234.56",
    qrCode: "/icons/mntqr.png"
  };

  const pages = [
    {
      id: 'wallet',
      title: 'Wallet',
      subtitle: 'Your wallet profile',
      action: 'View Details'
    },
    {
      id: 'pay',
      title: 'Pay',
      subtitle: 'Send USDC instantly',
      action: 'Scan QR or Tap NFC'
    },
    {
      id: 'receive',
      title: 'Receive',
      subtitle: 'Get paid in seconds',
      action: 'Show QR Code'
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'Manage your wallet',
      action: 'View Options'
    }
  ];

  // Keyboard navigation functions
  const navigateToNextPage = () => {
    setSlideDirection('left');
    if (currentPage === pages.length - 1) {
      setCurrentPage(0);
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  const navigateToPreviousPage = () => {
    setSlideDirection('right');
    if (currentPage === 0) {
      setCurrentPage(pages.length - 1);
    } else {
      setCurrentPage(currentPage - 1);
    }
  };

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle keyboard events if any modal is open
      if (showDepositModal || showCurrencyModal || showLanguageModal || showSupportModal || showRewardsModal) {
        return;
      }

      // Don't handle keyboard events if user is typing in an input field
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'arrowright':
        case 'd':
          event.preventDefault();
          navigateToNextPage();
          break;
        case 'arrowleft':
        case 'a':
          event.preventDefault();
          navigateToPreviousPage();
          break;
        case 'arrowdown':
        case 's':
          event.preventDefault();
          if (currentPage === 1) { // Pay screen
            setShowSendScreen(true);
            setSlideDirection('down');
          }
          break;
        case 'arrowup':
        case 'w':
          event.preventDefault();
          if (currentPage === 1 && showSendScreen) { // Pay screen with send screen open
            setShowSendScreen(false);
            setSlideDirection('up');
          }
          break;
        case 'enter':
        case ' ':
          event.preventDefault();
          handleEnterKey();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, showDepositModal, showCurrencyModal, showLanguageModal, showSupportModal, showRewardsModal, showSendScreen]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 30; // Reduced threshold for more sensitive swipes
    
    // Horizontal swiping for page navigation only
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        // Swipe right - go to previous page (with infinite loop)
        navigateToPreviousPage();
      } else {
        // Swipe left - go to next page (with infinite loop)
        navigateToNextPage();
      }
    }
  };

  const goToPage = (pageIndex: number) => {
    setSlideDirection('up');
    setCurrentPage(pageIndex);
  };

  const handleActionClick = () => {
    const currentPageData = pages[currentPage];
    
    switch (currentPageData.id) {
      case 'receive':
        router.push('/receive');
        break;
      case 'pay':
        router.push('/pay');
        break;
      case 'settings':
        // TODO: Navigate to settings screen
        console.log('Navigate to settings screen');
        break;
    }
  };

  const handleEnterKey = () => {
    // Handle Enter key based on current page
    if (currentPage === 2) {
      // Deposit screen - submit the amount
      handleReceiveSubmit();
    } else {
      // Other pages - use the regular action
      handleActionClick();
    }
  };

  const searchTwitterUser = async (handle: string) => {
    if (!handle.trim()) {
      setTargetUserProfile(null);
      setUserFound(false);
      setIsUserConfirmed(false);
      return;
    }

    setIsSearchingUser(true);
    setUserFound(false);
    setIsUserConfirmed(false);

    try {
      // Simulate API call to search Twitter user
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user data - in real app this would come from Twitter API
      const mockUser = {
        pfp: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
        name: "John Doe",
        handle: handle.toLowerCase()
      };
      
      setTargetUserProfile(mockUser);
      setUserFound(true);
    } catch (error) {
      console.error('Error searching user:', error);
      setUserFound(false);
      setTargetUserProfile(null);
    } finally {
      setIsSearchingUser(false);
    }
  };

  const handleUserConfirmation = () => {
    setIsUserConfirmed(!isUserConfirmed);
    if (!isUserConfirmed) {
      setSendAmount(''); // Reset amount when confirming user
    }
  };

  const handleSendPayment = () => {
    if (sendToHandle.trim() && isUserConfirmed && sendAmount.trim()) {
      console.log('Sending payment:', { to: sendToHandle, amount: sendAmount });
      // Show success message within the same card
      setSendPaymentSuccess(true);
    }
  };

  const handleConnectX = () => {
    // TODO: Implement X (Twitter) OAuth
    console.log('Connect with X');
    setIsConnectedToX(true);
  };

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
    setShowCurrencyModal(false);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setShowLanguageModal(false);
  };

  const handleReceiveAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setReceiveAmount(value);
  };

  const handleReceiveSubmit = () => {
    if (receiveAmount && parseFloat(receiveAmount) > 0) {
      // Navigate to receive page with the amount
      router.push(`/receive?amount=${receiveAmount}`);
    }
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletData.address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Spline Background Animation */}
      <SplineBackground scale={1.2} />

      {/* Sozu Cash Logo */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
        <img 
          src="/sozu-logo.png" 
          alt="Sozu Cash" 
          className="w-20"
        />
      </div>

      {/* Camera Icon for QR Scanning */}
      <button 
        onClick={() => console.log('Open camera for QR scan')}
        className="absolute top-8 right-4 z-20 text-white/70 hover:text-white transition-colors pointer-events-auto"
      >
        <Camera size={24} />
      </button>

      {/* Main Content */}
      <motion.div
        className="relative z-10 w-full h-full flex items-center justify-center px-4 pointer-events-none"
      >
        {/* Dark Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-none"></div>
        

        
        <div className="relative z-20 text-center max-w-sm mx-auto w-full pointer-events-auto">
          {/* Fixed Glassmorphism Card */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 0.98 }}
            onPanEnd={(event, info) => {
              // Handle vertical swiping for pay screen
              if (currentPage === 1 && Math.abs(info.offset.y) > 30) {
                if (info.offset.y > 0) {
                  // Swipe down - show send screen
                  setShowSendScreen(true);
                } else {
                  // Swipe up - hide send screen
                  if (showSendScreen) {
                    setShowSendScreen(false);
                  }
                }
              }
            }}
            className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl w-full h-96 flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            {/* Animated Page Content */}
            <motion.div
              key={currentPage}
              initial={{ 
                opacity: 0, 
                x: slideDirection === 'left' ? 50 : slideDirection === 'right' ? -50 : 0,
                y: slideDirection === 'up' ? 20 : 0
              }}
              animate={{ 
                opacity: 1, 
                x: 0,
                y: 0
              }}
              exit={{ 
                opacity: 0, 
                x: slideDirection === 'left' ? -50 : slideDirection === 'right' ? 50 : 0,
                y: slideDirection === 'up' ? -20 : 0
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-6 w-full"
            >
            {currentPage === 0 && (
              /* Wallet Profile Screen */
              <div className="h-full flex flex-col overflow-hidden">
                {/* Title */}
                <motion.h1 
                  initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="text-lg font-bold text-white mb-4 text-center flex-shrink-0"
                >
                  Wallet
                </motion.h1>
                
                {/* Profile Picture */}
                <div className="flex justify-center mb-3 flex-shrink-0">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center overflow-hidden">
                    <img 
                      src={userProfile.image} 
                      alt={userProfile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto pr-1 min-h-0">
                  <div className="space-y-2 pb-2">
                    {/* Wallet Address */}
                    <div className="text-center">
                      <p className="text-white/50 text-xs mb-1">Wallet Address</p>
                      <button 
                        onClick={handleCopyAddress}
                        className="w-full bg-white/5 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-200 flex items-center justify-center space-x-2 pointer-events-auto"
                      >
                        <code className="text-white/70 text-xs break-all">
                          {truncateAddress(walletData.address)}
                        </code>
                        <span className="text-white/50 text-xs">
                          {copiedAddress ? '✓' : '📋'}
                        </span>
                      </button>
                    </div>

                    {/* Wallet Actions */}
                    <div className="space-y-1.5">
                      <button 
                        onClick={() => console.log('Create new wallet')}
                        className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-1.5 px-2 rounded-lg hover:bg-white/20 transition-all duration-200 text-xs pointer-events-auto"
                      >
                        Create New Wallet
                      </button>
                      
                      <button 
                        onClick={() => console.log('Import wallet')}
                        className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-1.5 px-2 rounded-lg hover:bg-white/20 transition-all duration-200 text-xs pointer-events-auto"
                      >
                        Import Wallet
                      </button>

                      {/* Connect with X */}
                      {!isConnectedToX ? (
                        <button 
                          onClick={handleConnectX}
                          className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-1.5 px-2 rounded-lg hover:bg-white/20 transition-all duration-200 text-xs pointer-events-auto flex items-center justify-center space-x-2"
                        >
                          <span className="text-xs">𝕏</span>
                          <span className="text-xs">Connect with X</span>
                        </button>
                      ) : (
                        <div className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-1.5 flex items-center space-x-2">
                          <img 
                            src={userProfile.image} 
                            alt={userProfile.name}
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <div className="flex-1 text-left">
                            <p className="text-white font-semibold text-xs">{userProfile.name}</p>
                            <p className="text-white/60 text-xs">{userProfile.username}</p>
                          </div>
                          <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentPage === 1 && (
              /* Pay Screen */
              <>
                {!showSendScreen ? (
                  /* Pay Content */
                  <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full h-full flex flex-col"
                  >
                    {/* Title */}
                    <motion.h1 
                      initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="text-lg font-bold text-white mb-4 text-center"
                    >
                      Pay
                    </motion.h1>
                    
                    {/* USD Balance Display */}
                    <div className="mb-6">
                      <p className="text-white/50 text-sm mb-1">USD</p>
                      <button 
                        onClick={() => {
                          console.log('Balance clicked!');
                          setShowDepositModal(true);
                        }}
                        className="text-4xl font-bold text-white hover:text-blue-400 transition-colors cursor-pointer pointer-events-auto"
                      >
                        $0.00
                      </button>
                    </div>

                    {/* NFC Icon */}
                    <div className="flex justify-center">
                      <button 
                        onClick={() => {
                          console.log('NFC icon clicked!');
                          // For demo: navigate to pay screen
                          router.push('/pay');
                        }}
                        className="w-20 h-20 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 hover:scale-105 transition-all cursor-pointer pointer-events-auto"
                      >
                        <Wifi size={32} className="rotate-45" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* Send Content */
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full h-full flex flex-col justify-center"
                  >
                    {!sendPaymentSuccess ? (
                      <>
                        {/* Title */}
                        <motion.h1 
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="text-lg font-bold text-white mb-4 text-center"
                        >
                          Send to User
                        </motion.h1>
                        
                        {/* Twitter Handle Input */}
                        <div className="mb-4">
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/30 text-lg">@</span>
                            <input
                              type="text"
                              value={sendToHandle}
                              onChange={(e) => {
                                const newHandle = e.target.value.replace('@', '');
                                setSendToHandle(newHandle);
                                searchTwitterUser(newHandle);
                              }}
                              placeholder="username"
                              className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white text-lg font-semibold text-center py-4 pl-8 pr-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/30 pointer-events-auto"
                            />
                          </div>
                        </div>

                        {/* User Search Status */}
                        {isSearchingUser && (
                          <div className="mb-4 text-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white/30 mx-auto mb-2"></div>
                            <p className="text-white/50 text-sm">Searching for user...</p>
                          </div>
                        )}

                        {/* User Profile Display */}
                        {userFound && targetUserProfile && (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4"
                          >
                            <div className="text-center">
                              <button
                                onClick={handleUserConfirmation}
                                className={`w-16 h-16 rounded-full overflow-hidden mx-auto mb-2 transition-all duration-200 ${
                                  isUserConfirmed 
                                    ? 'ring-2 ring-green-400 scale-110' 
                                    : 'ring-2 ring-white/20 hover:ring-white/40'
                                }`}
                              >
                                <img 
                                  src={targetUserProfile.pfp} 
                                  alt={targetUserProfile.name}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                              <p className="text-white font-semibold text-sm">{targetUserProfile.name}</p>
                              <p className="text-white/50 text-xs">@{targetUserProfile.handle}</p>
                              <p className="text-white/30 text-xs mt-1">
                                {isUserConfirmed ? '✓ Confirmed' : 'Tap to confirm'}
                              </p>
                            </div>
                          </motion.div>
                        )}

                                                 {/* Amount Input - Only show after user confirmation */}
                         {isUserConfirmed && (
                           <motion.div
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             className="mb-4"
                           >
                             <div className="relative">
                               <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/30 text-lg">$</span>
                               <input
                                 type="number"
                                 value={sendAmount}
                                 onChange={(e) => setSendAmount(e.target.value)}
                                 placeholder="0.00"
                                 step="0.01"
                                 min="0"
                                 className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white text-lg font-semibold text-center py-3 pl-8 pr-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/30 pointer-events-auto"
                               />
                             </div>
                           </motion.div>
                         )}

                         {/* Send Button - Always positioned at bottom */}
                         <div className="mt-auto pt-4">
                           <button 
                             onClick={handleSendPayment}
                             disabled={!sendToHandle.trim() || !isUserConfirmed || !sendAmount.trim()}
                             className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto"
                           >
                             {isSearchingUser ? 'Searching...' : 'Send Payment'}
                           </button>
                         </div>
                      </>
                    ) : (
                      /* Payment Success Screen */
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6 w-full text-center"
                      >
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
                          className="text-2xl font-bold text-white mb-4"
                        >
                          Payment Sent!
                        </motion.h2>
                        
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          className="text-white/70 mb-6"
                        >
                          Payment sent to @{sendToHandle} successfully
                        </motion.p>

                        {/* Payment Details */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                          className="bg-white/10 rounded-2xl p-4 mb-6"
                        >
                          <p className="text-white/50 text-sm">Amount Sent</p>
                          <p className="text-3xl font-bold text-white">${sendAmount}</p>
                          <p className="text-white/50 text-xs mt-2">Transaction ID: 0xabcd...efgh</p>
                          <p className="text-white/50 text-xs mt-1">To: @{sendToHandle}</p>
                        </motion.div>

                        <motion.button
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.0 }}
                          onClick={() => {
                            setSendPaymentSuccess(false);
                            setSendToHandle('');
                            setSendAmount('');
                            setTargetUserProfile(null);
                            setUserFound(false);
                            setIsUserConfirmed(false);
                            setShowSendScreen(false);
                          }}
                          className="w-full bg-white text-black py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 active:scale-95 transition-all pointer-events-auto"
                        >
                          Done
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </>
            )}



            {currentPage === 2 && (
              /* Receive Screen */
              <>
                {/* Title */}
                <motion.h1 
                  initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="text-lg font-bold text-white mb-4 text-center"
                >
                  Deposit
                </motion.h1>
                
                {/* Amount Input Field */}
                <div className="relative mb-6">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={receiveAmount}
                    onChange={handleReceiveAmountChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleReceiveSubmit();
                      }
                    }}
                    placeholder="0.00"
                    className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white text-4xl font-bold text-center py-8 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/30 pointer-events-auto"
                  />
                  {receiveAmount && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 text-lg">
                      USD
                    </div>
                  )}
                </div>

                {/* Enter Button */}
                <button 
                  onClick={handleReceiveSubmit}
                  disabled={!receiveAmount || parseFloat(receiveAmount) <= 0}
                  className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto"
                >
                  Enter
                </button>
              </>
            )}

            {currentPage === 3 && (
              /* Settings Screen */
              <div className="h-full flex flex-col overflow-hidden">
                {/* Title */}
                <motion.h1 
                  initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="text-lg font-bold text-white mb-4 flex-shrink-0 text-center"
                >
                  {pages[currentPage].title}
                </motion.h1>

                {/* Scrollable Settings Content */}
                <div className="flex-1 overflow-y-auto pr-1 min-h-0">
                  <div className="space-y-1.5 pb-2">


                    {/* Preferences Section */}
                    <div className="space-y-1">
                      <h3 className="text-white/50 text-xs font-medium uppercase tracking-wide">Preferences</h3>
                      <button 
                        onClick={() => setShowCurrencyModal(true)}
                        className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-1 px-2 rounded-lg hover:bg-white/20 transition-all duration-200 text-left text-xs pointer-events-auto"
                      >
                        💱 Display Currency: {selectedCurrency}
                      </button>
                      
                      <button 
                        onClick={() => setShowLanguageModal(true)}
                        className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-1 px-2 rounded-lg hover:bg-white/20 transition-all duration-200 text-left text-xs pointer-events-auto"
                      >
                        🌐 Language: {selectedLanguage}
                      </button>
                    </div>

                    {/* Support Section */}
                    <div className="space-y-1">
                      <h3 className="text-white/50 text-xs font-medium uppercase tracking-wide">Support</h3>
                      <button 
                        onClick={() => setShowSupportModal(true)}
                        className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-1 px-2 rounded-lg hover:bg-white/20 transition-all duration-200 text-left text-xs pointer-events-auto"
                      >
                        ℹ️ More Information
                      </button>
                      
                      <button 
                        onClick={() => window.open('https://t.me/blessedux', '_blank')}
                        className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-1 px-2 rounded-lg hover:bg-white/20 transition-all duration-200 text-left text-xs pointer-events-auto"
                      >
                        🆘 Customer Support
                      </button>
                    </div>

                    {/* Rewards Section */}
                    <div className="space-y-1">
                      <h3 className="text-white/50 text-xs font-medium uppercase tracking-wide">Rewards</h3>
                      <button 
                        onClick={() => setShowRewardsModal(true)}
                        className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-1 px-2 rounded-lg hover:bg-white/20 transition-all duration-200 text-left text-xs pointer-events-auto"
                      >
                        🎁 Rewards Program
                      </button>
                      
                      {/* Rewards Info */}
                      <div className="p-1.5 bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg">
                        <p className="text-white/70 text-xs">
                          <span className="font-semibold text-white">Earn rewards!</span> Get cash back for each user you onboard.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
        </div>
      </motion.div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl w-full max-w-sm pointer-events-auto"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Deposit Funds</h2>
              <p className="text-white/70 text-sm">Send MNT or USDC to your wallet on Mantle Network</p>
            </div>

            {/* Wallet Address */}
            <div className="mb-6">
              <p className="text-white/50 text-sm mb-2">Your Wallet Address</p>
              <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <code className="text-white/70 text-xs break-all">{walletData.address}</code>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(walletData.address);
                      setCopiedAddress(true);
                      setTimeout(() => setCopiedAddress(false), 2000);
                    }}
                    className="ml-2 text-white/50 hover:text-white transition-colors pointer-events-auto"
                  >
                    {copiedAddress ? '✓' : '📋'}
                  </button>
                </div>
              </div>
            </div>

            {/* Supported Tokens */}
            <div className="mb-6">
              <p className="text-white/50 text-sm mb-3">Supported Tokens</p>
              <div className="space-y-2">
                <button 
                  onClick={() => window.open('https://coinmarketcap.com/currencies/mantle/', '_blank')}
                  className="w-full flex items-center justify-between p-3 bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 pointer-events-auto"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                      <img 
                        src="/icons/tokens/mantle-mnt-logo (1).png" 
                        alt="MNT" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Mantle Token</p>
                      <p className="text-white/50 text-xs">Native token</p>
                    </div>
                  </div>
                  <span className="text-white/50 text-xs">View Price</span>
                </button>
                <button 
                  onClick={() => window.open('https://app.uniswap.org/swap?outputCurrency=0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8C8C&chain=mantle', '_blank')}
                  className="w-full flex items-center justify-between p-3 bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 pointer-events-auto"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                      <img 
                        src="/icons/tokens/usdc 1.png" 
                        alt="USDC" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white font-semibold">USD Coin</p>
                      <p className="text-white/50 text-xs">Stablecoin</p>
                    </div>
                  </div>
                  <span className="text-white/50 text-xs">Swap MNT</span>
                </button>
              </div>
            </div>

            {/* Network Info */}
            <div className="mb-6">
              <p className="text-white/40 text-xs text-center">Mantle Network • Fast, low-cost L2 blockchain</p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowDepositModal(false)}
              className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl hover:bg-white/20 transition-all duration-200 pointer-events-auto"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Currency Selection Modal */}
      {showCurrencyModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl w-full max-w-sm pointer-events-auto"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Select Currency</h2>
            <div className="space-y-3">
              {['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'].map((currency) => (
                <button
                  key={currency}
                  onClick={() => handleCurrencyChange(currency)}
                  className={`w-full p-4 rounded-2xl border transition-all duration-200 pointer-events-auto ${
                    selectedCurrency === currency
                      ? 'bg-white/20 border-white/40 text-white'
                      : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {currency}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowCurrencyModal(false)}
              className="w-full mt-6 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl hover:bg-white/20 transition-all duration-200 pointer-events-auto"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl w-full max-w-sm pointer-events-auto"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Select Language</h2>
            <div className="space-y-3">
              {['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'].map((language) => (
                <button
                  key={language}
                  onClick={() => handleLanguageChange(language)}
                  className={`w-full p-4 rounded-2xl border transition-all duration-200 pointer-events-auto ${
                    selectedLanguage === language
                      ? 'bg-white/20 border-white/40 text-white'
                      : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowLanguageModal(false)}
              className="w-full mt-6 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl hover:bg-white/20 transition-all duration-200 pointer-events-auto"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Support Information Modal */}
      {showSupportModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl w-full max-w-sm pointer-events-auto"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">About Sozu Cash</h2>
            <div className="space-y-4 text-white/70 text-sm">
              <p>Sozu Cash is a DeFi-powered payment app built on Mantle Network.</p>
              <p>Features:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>1-tap NFC payments</li>
                <li>QR code transactions</li>
                <li>10% instant cashback</li>
                <li>Passkey security</li>
              </ul>
              <p className="text-xs text-white/50 mt-4">
                Version 1.0.0 • Built on Mantle Network
              </p>
            </div>
            <button
              onClick={() => setShowSupportModal(false)}
              className="w-full mt-6 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl hover:bg-white/20 transition-all duration-200 pointer-events-auto"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Rewards Program Modal */}
      {showRewardsModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl w-full max-w-sm pointer-events-auto"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">🎁 Rewards Program</h2>
            <div className="space-y-4 text-white/70 text-sm">
              <div className="bg-white/10 rounded-2xl p-4">
                <h3 className="text-white font-semibold mb-2">Referral Rewards</h3>
                <p>Earn 10% cashback for each user you onboard to Sozu Cash.</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <h3 className="text-white font-semibold mb-2">Transaction Rewards</h3>
                <p>Get 10% instant cashback on every payment you make.</p>
              </div>
            </div>
            <button
              onClick={() => setShowRewardsModal(false)}
              className="w-full mt-6 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl hover:bg-white/20 transition-all duration-200 pointer-events-auto"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}

    </div>
  );
}
