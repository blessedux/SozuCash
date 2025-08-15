'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';

interface PaymentFormProps {
  recipient?: {
    handle: string;
    name: string;
    pfp: string;
  };
  onPaymentComplete?: (amount: string) => void;
  onCancel?: () => void;
}

export function PaymentForm({ 
  recipient, 
  onPaymentComplete,
  onCancel 
}: PaymentFormProps) {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!amount.trim() || parseFloat(amount) <= 0) return;

    setIsProcessing(true);
    try {
      // Mock payment processing - replace with actual payment logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentSuccess(true);
      onPaymentComplete?.(amount);
      
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!paymentSuccess ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          {/* Amount Input */}
          <div className="relative">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              leftIcon={<span className="text-lg">$</span>}
              disabled={isProcessing}
            />
          </div>

          {/* Payment Button */}
          <Button
            onClick={handleSubmit}
            disabled={!amount.trim() || parseFloat(amount) <= 0 || isProcessing}
            className="w-full"
            isLoading={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Send Payment'}
          </Button>

          {/* Cancel Button */}
          {onCancel && (
            <Button
              variant="ghost"
              onClick={onCancel}
              disabled={isProcessing}
              className="w-full"
            >
              Cancel
            </Button>
          )}
        </motion.div>
      ) : (
        /* Payment Success Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-400/30"
          >
            <CheckCircle size={40} className="text-green-400" />
          </motion.div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Payment Sent!
            </h2>
            {recipient && (
              <p className="text-white/70">
                Payment sent to @{recipient.handle}
              </p>
            )}
          </div>

          {/* Payment Details */}
          <Card className="p-4">
            <p className="text-white/50 text-sm">Amount Sent</p>
            <p className="text-3xl font-bold text-white">${amount}</p>
            {recipient && (
              <>
                <p className="text-white/50 text-xs mt-2">
                  To: @{recipient.handle}
                </p>
                <p className="text-white/50 text-xs">
                  Transaction ID: {Math.random().toString(36).substring(2, 15)}
                </p>
              </>
            )}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
