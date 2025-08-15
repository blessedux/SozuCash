'use client';

import { GlassmorphicModal } from '../../shared/GlassmorphicModal';
import { Button } from '../../ui/Button';

interface SupportModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
}

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
  return (
    <GlassmorphicModal
      isOpen={isOpen}
      onClose={onClose}
      title="About Sozu Cash"
    >
      <div className="space-y-6">
        <div className="space-y-4 text-white/70 text-sm">
          <p>
            Sozu Cash is a DeFi-powered payment app built on Mantle Network.
          </p>
          
          <div className="space-y-2">
            <p className="text-white font-semibold">Features:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>1-tap NFC payments</li>
              <li>QR code transactions</li>
              <li>10% instant cashback</li>
              <li>Passkey security</li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-white font-semibold">Support Channels:</p>
            <Button
              variant="secondary"
              onClick={() => window.open('https://t.me/blessedux', '_blank')}
              className="w-full justify-between"
            >
              <span>Telegram Support</span>
              <span className="text-white/50">@blessedux</span>
            </Button>
          </div>

          <p className="text-xs text-white/50 mt-4">
            Version 1.0.0 • Built on Mantle Network
          </p>
        </div>
      </div>
    </GlassmorphicModal>
  );
}
