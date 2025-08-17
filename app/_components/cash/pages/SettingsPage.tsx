'use client';

import { useState } from 'react';
import { AnimatedTransition } from '../../shared/AnimatedTransition';
import { SettingsMenu } from '../features/SettingsMenu';
import { CurrencyModal } from '../modals/CurrencyModal';
import { LanguageModal } from '../modals/LanguageModal';
import { SupportModal } from '../modals/SupportModal';
import { RewardsModal } from '../modals/RewardsModal';
import { useBalance } from '../../../_context/BalanceContext';

export function SettingsPage() {
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const { balance, formatBalance, resetBalance } = useBalance();

  const handleResetBalance = () => {
    if (window.confirm('Are you sure you want to reset your balance to $0? This is for testing purposes only.')) {
      resetBalance();
      alert('Balance reset to $0.00');
    }
  };

  return (
    <>
      <AnimatedTransition className="h-full flex flex-col overflow-hidden">
        <SettingsMenu onClose={() => {}} />
        
        {/* Balance Display and Reset (for testing) */}
        <div className="p-4 bg-white/10 border-t border-white/10">
          <div className="text-center mb-3">
            <p className="text-white/50 text-sm">Current Balance</p>
            <p className="text-2xl font-bold text-white">{formatBalance(balance)}</p>
          </div>
          <button
            onClick={handleResetBalance}
            className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-400/30 rounded-lg py-2 px-4 text-sm transition-colors"
          >
            Reset Balance (Testing Only)
          </button>
        </div>

        {/* Navigation Instructions - Bottom */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-white/50 text-sm">
            Swipe up or press ↑ to go back to Wallet
          </p>
        </div>
      </AnimatedTransition>

      {/* Modals */}
      <CurrencyModal
        isOpen={showCurrencyModal}
        onClose={() => setShowCurrencyModal(false)}
      />

      <LanguageModal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />

      <SupportModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />

      <RewardsModal
        isOpen={showRewardsModal}
        onClose={() => setShowRewardsModal(false)}
      />
    </>
  );
}
