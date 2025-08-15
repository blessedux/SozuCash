'use client';

import { useState } from 'react';
import { GlassmorphicModal } from '../../shared/GlassmorphicModal';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { useWallet } from '../../../_context/WalletContext';

interface DepositModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const { walletData } = useWallet();

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
    <GlassmorphicModal
      isOpen={isOpen}
      onClose={onClose}
      title="Deposit Funds"
    >
      <div className="space-y-6">
        {/* Description */}
        <p className="text-white/70 text-sm text-center">
          Send MNT or USDC to your wallet on Mantle Network
        </p>

        {/* Wallet Address */}
        <div className="space-y-2">
          <p className="text-white/50 text-sm">Your Wallet Address</p>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <code className="text-white/70 text-xs break-all">
                {truncateAddress(walletData.address)}
              </code>
              <button 
                onClick={handleCopyAddress}
                className="ml-2 text-white/50 hover:text-white transition-colors pointer-events-auto"
              >
                {copiedAddress ? '✓' : '📋'}
              </button>
            </div>
          </Card>
        </div>

        {/* Supported Tokens */}
        <div className="space-y-2">
          <p className="text-white/50 text-sm">Supported Tokens</p>
          <Button
            variant="secondary"
            onClick={() => window.open('https://coinmarketcap.com/currencies/mantle/', '_blank')}
            className="w-full justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src="/icons/tokens/mantle-mnt-logo (1).png" 
                  alt="MNT" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="font-semibold">Mantle Token</p>
                <p className="text-white/50 text-xs">Native token</p>
              </div>
            </div>
            <span className="text-white/50 text-xs">View Price</span>
          </Button>

          <Button
            variant="secondary"
            onClick={() => window.open('https://app.uniswap.org/swap?outputCurrency=0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8C8C8C&chain=mantle', '_blank')}
            className="w-full justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src="/icons/tokens/usdc 1.png" 
                  alt="USDC" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="font-semibold">USD Coin</p>
                <p className="text-white/50 text-xs">Stablecoin</p>
              </div>
            </div>
            <span className="text-white/50 text-xs">Swap MNT</span>
          </Button>
        </div>

        {/* Network Info */}
        <p className="text-white/40 text-xs text-center">
          Mantle Network • Fast, low-cost L2 blockchain
        </p>
      </div>
    </GlassmorphicModal>
  );
}
