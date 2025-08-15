'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../ui/Button';
import { useWallet } from '../../../_context/WalletContext';
import type { Currency, Language } from '../../../_types/wallet';

type SettingsPage = 'main' | 'currency' | 'language' | 'support' | 'rewards';

interface SettingsMenuProps {
  onClose?: () => void;
}

export function SettingsMenu({ onClose }: SettingsMenuProps) {
  const [currentPage, setCurrentPage] = useState<SettingsPage>('main');
  const { 
    selectedCurrency, 
    setSelectedCurrency,
    selectedLanguage,
    setSelectedLanguage
  } = useWallet();

  const currencies: Currency[] = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
  const languages: Language[] = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];

  const handleCurrencySelect = (currency: Currency) => {
    setSelectedCurrency(currency);
    setCurrentPage('main');
  };

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setCurrentPage('main');
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-bold text-white mb-4 flex-shrink-0 text-center"
      >
        {currentPage === 'main' ? 'Settings' : 
         currentPage === 'currency' ? 'Display Currency' :
         currentPage === 'language' ? 'Language' :
         currentPage === 'support' ? 'Support' :
         'Rewards Program'}
      </motion.h1>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pr-1 min-h-0">
        <AnimatePresence mode="wait">
          {currentPage === 'main' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Preferences Section */}
              <div className="space-y-2">
                <h3 className="text-white/50 text-xs font-medium uppercase tracking-wide">
                  Preferences
                </h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage('currency')}
                  className="w-full justify-between"
                >
                  <span>Display Currency</span>
                  <span className="text-white/50">{selectedCurrency}</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage('language')}
                  className="w-full justify-between"
                >
                  <span>Language</span>
                  <span className="text-white/50">{selectedLanguage}</span>
                </Button>
              </div>

              {/* Support Section */}
              <div className="space-y-2">
                <h3 className="text-white/50 text-xs font-medium uppercase tracking-wide">
                  Support
                </h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage('support')}
                  className="w-full text-left"
                >
                  More Information
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open('https://t.me/blessedux', '_blank')}
                  className="w-full text-left"
                >
                  Customer Support
                </Button>
              </div>

              {/* Rewards Section */}
              <div className="space-y-2">
                <h3 className="text-white/50 text-xs font-medium uppercase tracking-wide">
                  Rewards
                </h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage('rewards')}
                  className="w-full text-left"
                >
                  Rewards Program
                </Button>
                <p className="text-white/70 text-xs p-2">
                  <span className="font-semibold text-white">Earn rewards!</span>
                  {' '}Get cash back for each user you onboard.
                </p>
              </div>
            </motion.div>
          )}

          {currentPage === 'currency' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <p className="text-white/70 text-sm mb-4">
                Select your preferred display currency
              </p>
              {currencies.map((currency) => (
                <Button
                  key={currency}
                  variant="secondary"
                  onClick={() => handleCurrencySelect(currency)}
                  className="w-full justify-between"
                >
                  <span>{currency}</span>
                  {selectedCurrency === currency && (
                    <span className="text-green-400">✓</span>
                  )}
                </Button>
              ))}
            </motion.div>
          )}

          {currentPage === 'language' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <p className="text-white/70 text-sm mb-4">
                Select your preferred language
              </p>
              {languages.map((language) => (
                <Button
                  key={language}
                  variant="secondary"
                  onClick={() => handleLanguageSelect(language)}
                  className="w-full justify-between"
                >
                  <span>{language}</span>
                  {selectedLanguage === language && (
                    <span className="text-green-400">✓</span>
                  )}
                </Button>
              ))}
            </motion.div>
          )}

          {currentPage === 'support' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-4 text-white/70 text-sm">
                <p>SozuCash is a decentralized payment app built on Mantle Network.</p>
                <p>For support, contact us at t.me/blessedux</p>
                <p>Version: 1.0.0</p>
              </div>
            </motion.div>
          )}

          {currentPage === 'rewards' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-4 text-white/70 text-sm">
                <p>Earn rewards for every user you onboard to SozuCash!</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>5% cashback on referral fees</li>
                  <li>Exclusive early access to new features</li>
                  <li>Priority customer support</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Back Button for Sub-pages */}
      {currentPage !== 'main' && (
        <div className="mt-4 pt-4">
          <Button
            variant="secondary"
            onClick={() => setCurrentPage('main')}
            className="w-full"
          >
            ← Back to Settings
          </Button>
        </div>
      )}
    </div>
  );
}
