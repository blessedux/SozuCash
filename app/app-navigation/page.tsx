'use client';

import React, { useState, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Wifi, Camera } from 'lucide-react';

export default function AppNavigation() {
  const [currentPage, setCurrentPage] = useState(1); // Start on pay page (index 1)
  const [isDragging, setIsDragging] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | 'up'>('up');
  const [isConnectedToX, setIsConnectedToX] = useState(false);
  const [receiveAmount, setReceiveAmount] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);
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
    qrCode: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ3aGl0ZSIvPgo8dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9Ik1vbmFjbyIgZm9udC1zaXplPSIxMiIgZmlsbD0iYmxhY2siIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5XQUxMRVQgUVJ8L3RleHQ+Cjwvc3ZnPgo="
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

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 50;
    
    if (info.offset.x > threshold) {
      // Swipe right - go to previous page (with infinite loop)
      setSlideDirection('right');
      if (currentPage === 0) {
        // If at first page, go to last page
        setCurrentPage(pages.length - 1);
      } else {
        setCurrentPage(currentPage - 1);
      }
    } else if (info.offset.x < -threshold) {
      // Swipe left - go to next page (with infinite loop)
      setSlideDirection('left');
      if (currentPage === pages.length - 1) {
        // If at last page, go to first page
        setCurrentPage(0);
      } else {
        setCurrentPage(currentPage + 1);
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
        // TODO: Navigate to pay screen
        console.log('Navigate to pay screen');
        break;
      case 'settings':
        // TODO: Navigate to settings screen
        console.log('Navigate to settings screen');
        break;
    }
  };

  const handleConnectX = () => {
    // TODO: Implement X (Twitter) OAuth
    console.log('Connect with X');
    setIsConnectedToX(true);
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

      {/* Camera Icon for QR Scanning */}
      <button 
        onClick={() => console.log('Open camera for QR scan')}
        className="absolute top-8 right-4 z-20 text-white/70 hover:text-white transition-colors"
      >
        <Camera size={24} />
      </button>

      {/* Main Content */}
      <motion.div
        className="relative z-10 w-full h-full flex items-center justify-center px-4"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Dark Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        
        <div className="relative z-20 text-center max-w-sm mx-auto w-full">
          {/* Fixed Glassmorphism Card */}
          <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl w-full h-96 flex items-center justify-center">
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
                {/* Profile Picture */}
                <div className="flex justify-center mb-4 flex-shrink-0">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center overflow-hidden">
                    <img 
                      src={userProfile.image} 
                      alt={userProfile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto pr-1 min-h-0">
                  <div className="space-y-3 pb-4">
                    {/* Wallet Address */}
                    <div className="text-center">
                      <p className="text-white/50 text-xs mb-2">Wallet Address</p>
                      <button 
                        onClick={handleCopyAddress}
                        className="w-full bg-white/5 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <code className="text-white/70 text-xs break-all">
                          {truncateAddress(walletData.address)}
                        </code>
                        <span className="text-white/50 text-xs">
                          {copiedAddress ? '✓' : '📋'}
                        </span>
                      </button>
                    </div>

                    {/* QR Code */}
                    <div className="flex justify-center">
                      <div className="w-28 h-28 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl flex items-center justify-center">
                        <img 
                          src={walletData.qrCode} 
                          alt="Wallet QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>

                    {/* Wallet Actions */}
                    <div className="space-y-2">
                      <button 
                        onClick={() => console.log('Add new wallet')}
                        className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-2 px-3 rounded-lg hover:bg-white/20 transition-all duration-200 text-xs"
                      >
                        Add New Wallet
                      </button>
                      
                      <button 
                        onClick={() => console.log('Import wallet')}
                        className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-2 px-3 rounded-lg hover:bg-white/20 transition-all duration-200 text-xs"
                      >
                        Import Wallet
                      </button>
                      
                      <button 
                        onClick={() => console.log('Create wallet')}
                        className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-2 px-3 rounded-lg hover:bg-white/20 transition-all duration-200 text-xs"
                      >
                        Create Wallet
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentPage === 1 && (
              /* Pay Screen */
              <>
                {/* USD Balance Display */}
                <div className="mb-6">
                  <p className="text-white/50 text-sm mb-1">USD</p>
                  <h2 className="text-4xl font-bold text-white">
                    $1,234.56
                  </h2>
                </div>

                {/* NFC Icon */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center">
                    <Wifi size={32} className="rotate-45" />
                  </div>
                </div>
              </>
            )}

            {currentPage === 2 && (
              /* Receive Screen */
              <>
                {/* Amount Input Field */}
                <div className="relative mb-6">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={receiveAmount}
                    onChange={handleReceiveAmountChange}
                    placeholder="0.00"
                    className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white text-4xl font-bold text-center py-8 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/30"
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
                  className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Enter
                </button>
              </>
            )}

            {currentPage === 3 && (
              /* Settings Screen */
              <div className="h-full flex flex-col overflow-hidden">
                {/* Title */}
                <h1 className="text-xl font-bold text-white mb-2 flex-shrink-0">
                  {pages[currentPage].title}
                </h1>

                {/* Scrollable Settings Content */}
                <div className="flex-1 overflow-y-auto pr-1 min-h-0">
                  <div className="space-y-2 pb-4">
                    {/* X Connection Section */}
                    <div className="space-y-1">
                      <h3 className="text-white/50 text-xs font-medium uppercase tracking-wide">Account</h3>
                      
                      {!isConnectedToX ? (
                        <button 
                          onClick={handleConnectX}
                          className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-1.5 px-2 rounded-lg hover:bg-white/20 transition-all duration-200 text-left flex items-center space-x-2"
                        >
                          <span className="text-sm">𝕏</span>
                          <span className="text-xs">Connect with X</span>
                        </button>
                      ) : (
                        <div className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-2 flex items-center space-x-2">
                          <img 
                            src={userProfile.image} 
                            alt={userProfile.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <div className="flex-1 text-left">
                            <p className="text-white font-semibold text-xs">{userProfile.name}</p>
                            <p className="text-white/60 text-xs">{userProfile.username}</p>
                          </div>
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        </div>
                      )}
                    </div>

                    {/* Preferences Section */}
                    <div className="space-y-1">
                      <h3 className="text-white/50 text-xs font-medium uppercase tracking-wide">Preferences</h3>
                      <button 
                        onClick={() => console.log('Display currency')}
                        className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-1.5 px-2 rounded-lg hover:bg-white/20 transition-all duration-200 text-left text-xs"
                      >
                        💱 Display Currency
                      </button>
                      
                      <button 
                        onClick={() => console.log('Language settings')}
                        className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-1.5 px-2 rounded-lg hover:bg-white/20 transition-all duration-200 text-left text-xs"
                      >
                        🌐 Language
                      </button>
                    </div>

                    {/* Support Section */}
                    <div className="space-y-1">
                      <h3 className="text-white/50 text-xs font-medium uppercase tracking-wide">Support</h3>
                      <button 
                        onClick={() => console.log('More information')}
                        className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-1.5 px-2 rounded-lg hover:bg-white/20 transition-all duration-200 text-left text-xs"
                      >
                        ℹ️ More Information
                      </button>
                      
                      <button 
                        onClick={() => console.log('Customer support')}
                        className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-1.5 px-2 rounded-lg hover:bg-white/20 transition-all duration-200 text-left text-xs"
                      >
                        🆘 Customer Support
                      </button>
                    </div>

                    {/* Rewards Section */}
                    <div className="space-y-1">
                      <h3 className="text-white/50 text-xs font-medium uppercase tracking-wide">Rewards</h3>
                      <button 
                        onClick={() => console.log('Rewards program')}
                        className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-1.5 px-2 rounded-lg hover:bg-white/20 transition-all duration-200 text-left text-xs"
                      >
                        🎁 Rewards Program
                      </button>
                      
                      {/* Rewards Info */}
                      <div className="p-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg">
                        <p className="text-white/70 text-xs">
                          <span className="font-semibold text-white">Earn rewards!</span> Get cash back for each user you onboard. New accounts receive rewards for their first payment or transfer.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
          </div>
        </div>
      </motion.div>


    </div>
  );
}
