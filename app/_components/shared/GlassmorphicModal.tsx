'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';

interface GlassmorphicModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  closeButtonText?: string;
}

export function GlassmorphicModal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  closeButtonText = 'Close',
}: GlassmorphicModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="border border-white/20 rounded-3xl p-8 shadow-2xl w-full max-w-sm pointer-events-auto backdrop-blur-[15px] bg-white/10"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {children}
            </div>

            {/* Close Button */}
            {showCloseButton && (
              <Button
                variant="secondary"
                size="lg"
                className="w-full mt-6"
                onClick={onClose}
              >
                {closeButtonText}
              </Button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
