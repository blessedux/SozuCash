'use client';

import { useState } from 'react';
import { AnimatedTransition } from '../../shared/AnimatedTransition';
import { SettingsMenu } from '../features/SettingsMenu';
import { CurrencyModal } from '../modals/CurrencyModal';
import { LanguageModal } from '../modals/LanguageModal';
import { SupportModal } from '../modals/SupportModal';
import { RewardsModal } from '../modals/RewardsModal';

export function SettingsPage() {
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);

  return (
    <>
      <AnimatedTransition className="h-full flex flex-col overflow-hidden">
        <SettingsMenu onClose={() => {}} />
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
