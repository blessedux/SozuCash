'use client';

import { GlassmorphicModal } from '../../shared/GlassmorphicModal';
import { Card } from '../../ui/Card';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
}

export function RewardsModal({ isOpen, onClose }: RewardsModalProps) {
  return (
    <GlassmorphicModal
      isOpen={isOpen}
      onClose={onClose}
      title="Rewards Program"
    >
      <div className="space-y-6">
        {/* Referral Rewards */}
        <Card className="p-4 space-y-2">
          <h3 className="text-white font-semibold">Referral Rewards</h3>
          <p className="text-white/70 text-sm">
            Earn 10% cashback for each user you onboard to Sozu Cash.
          </p>
          <div className="mt-2 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
            <p className="text-green-400 text-sm font-semibold">
              10% Referral Bonus
            </p>
          </div>
        </Card>

        {/* Transaction Rewards */}
        <Card className="p-4 space-y-2">
          <h3 className="text-white font-semibold">Transaction Rewards</h3>
          <p className="text-white/70 text-sm">
            Get instant cashback on every payment you make.
          </p>
          <div className="mt-2 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
            <p className="text-green-400 text-sm font-semibold">
              5% Transaction Cashback
            </p>
          </div>
        </Card>

        {/* Additional Benefits */}
        <div className="space-y-2">
          <h3 className="text-white font-semibold text-sm">Additional Benefits</h3>
          <ul className="list-disc list-inside space-y-1 text-white/70 text-sm ml-2">
            <li>Early access to new features</li>
            <li>Priority customer support</li>
            <li>Exclusive community events</li>
            <li>Special merchant discounts</li>
          </ul>
        </div>

        {/* Terms */}
        <p className="text-white/50 text-xs text-center">
          Rewards are automatically credited to your wallet.
          Terms and conditions apply.
        </p>
      </div>
    </GlassmorphicModal>
  );
}
