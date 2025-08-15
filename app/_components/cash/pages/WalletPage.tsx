'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../../../_context/WalletContext';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { AnimatedTransition } from '../../shared/AnimatedTransition';

export function WalletPage() {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const { userProfile, walletData, isConnectedToX, setIsConnectedToX } = useWallet();

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

  const handleConnectX = () => {
    // TODO: Implement X (Twitter) OAuth
    console.log('Connect with X');
    setIsConnectedToX(true);
  };

  return (
    <AnimatedTransition className="h-full flex flex-col overflow-hidden">
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
        <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center overflow-hidden">
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
              className="w-full px-2 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-200 flex items-center justify-center space-x-2 pointer-events-auto backdrop-blur-[20px] bg-gray-800/60"
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
            <Button 
              variant="secondary"
              size="sm"
              onClick={() => console.log('Create new wallet')}
              className="w-full"
            >
              Create New Wallet
            </Button>
            
            <Button 
              variant="secondary"
              size="sm"
              onClick={() => console.log('Import wallet')}
              className="w-full"
            >
              Import Wallet
            </Button>

            {/* Connect with X */}
            {!isConnectedToX ? (
              <Button 
                variant="secondary"
                size="sm"
                onClick={handleConnectX}
                className="w-full"
                leftIcon={<span className="text-xs">𝕏</span>}
              >
                Connect with X
              </Button>
            ) : (
              <Card className="p-1.5 flex items-center space-x-2">
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
              </Card>
            )}
          </div>
        </div>
      </div>
    </AnimatedTransition>
  );
}
