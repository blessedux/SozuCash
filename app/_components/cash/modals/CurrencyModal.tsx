'use client';

import { GlassmorphicModal } from '../../shared/GlassmorphicModal';
import { Button } from '../../ui/Button';
import { useWallet } from '../../../_context/WalletContext';
import type { Currency } from '../../../_types/wallet';

interface CurrencyModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
}

export function CurrencyModal({ isOpen, onClose }: CurrencyModalProps) {
  const { selectedCurrency, setSelectedCurrency } = useWallet();
  const currencies: Currency[] = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

  const handleCurrencySelect = (currency: Currency) => {
    setSelectedCurrency(currency);
    onClose();
  };

  return (
    <GlassmorphicModal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Currency"
    >
      <div className="space-y-4">
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
      </div>
    </GlassmorphicModal>
  );
}
