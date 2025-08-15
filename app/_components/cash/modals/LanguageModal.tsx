'use client';

import { GlassmorphicModal } from '../../shared/GlassmorphicModal';
import { Button } from '../../ui/Button';
import { useWallet } from '../../../_context/WalletContext';
import type { Language } from '../../../_types/wallet';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
}

export function LanguageModal({ isOpen, onClose }: LanguageModalProps) {
  const { selectedLanguage, setSelectedLanguage } = useWallet();
  const languages: Language[] = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    onClose();
  };

  return (
    <GlassmorphicModal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Language"
    >
      <div className="space-y-4">
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
      </div>
    </GlassmorphicModal>
  );
}
