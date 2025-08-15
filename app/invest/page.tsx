'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { TrendingUp, Shield, Zap, Star, ArrowRight, Info } from 'lucide-react';

export default function InvestPage() {
  const router = useRouter();
  const [selectedFund, setSelectedFund] = useState<string | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [investmentSuccess, setInvestmentSuccess] = useState(false);

  // Mock investment funds data
  const investmentFunds = [
    {
      id: 'mantle-yield',
      name: 'Mantle Yield Fund',
      description: 'High-yield DeFi strategies on Mantle Network',
      apy: '12.5%',
      risk: 'Medium',
      minInvestment: '100',
      maxInvestment: '100,000',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-blue-500 to-purple-600',
      features: ['Automated yield farming', 'Liquidity mining', 'Compound interest']
    },
    {
      id: 'stable-growth',
      name: 'Stable Growth Fund',
      description: 'Conservative stablecoin yield strategies',
      apy: '8.2%',
      risk: 'Low',
      minInvestment: '50',
      maxInvestment: '50,000',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-600',
      features: ['USDC yield farming', 'Low volatility', 'Daily compounding']
    },
    {
      id: 'defi-accelerator',
      name: 'DeFi Accelerator',
      description: 'Aggressive DeFi yield optimization',
      apy: '18.7%',
      risk: 'High',
      minInvestment: '500',
      maxInvestment: '250,000',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-orange-500 to-red-600',
      features: ['Multi-protocol farming', 'Leveraged strategies', 'Weekly rebalancing']
    },
    {
      id: 'premium-yield',
      name: 'Premium Yield Fund',
      description: 'Exclusive high-performance yield strategies',
      apy: '15.3%',
      risk: 'Medium-High',
      minInvestment: '1000',
      maxInvestment: '500,000',
      icon: <Star className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-600',
      features: ['Institutional strategies', 'Advanced risk management', 'Monthly distributions']
    }
  ];

  const handleFundSelect = (fundId: string) => {
    setSelectedFund(fundId);
    setShowInvestmentModal(true);
  };

  const handleInvestmentSubmit = () => {
    if (investmentAmount && parseFloat(investmentAmount) > 0) {
      setInvestmentSuccess(true);
      setTimeout(() => {
        setShowInvestmentModal(false);
        setInvestmentSuccess(false);
        setSelectedFund(null);
        setInvestmentAmount('');
      }, 3000);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setInvestmentAmount(value);
  };

  const getSelectedFund = () => {
    return investmentFunds.find(fund => fund.id === selectedFund);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* Header */}
      <div className="relative z-10 pt-12 pb-8 px-6">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="text-white/70 hover:text-white transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">Invest</h1>
          <div className="w-8"></div>
        </div>

        {/* Balance Display */}
        <div className="border border-white/20 rounded-2xl p-6 mb-8">
          <div className="text-center">
            <p className="text-white/50 text-sm mb-2">Available Balance</p>
            <p className="text-3xl font-bold text-white mb-2">$1,234.56</p>
            <p className="text-white/70 text-sm">Ready to invest and earn yield</p>
          </div>
        </div>

        {/* Investment Funds */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Investment Funds</h2>
          
          {investmentFunds.map((fund, index) => (
            <motion.div
              key={fund.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-white/20 rounded-2xl p-6 hover:bg-white/5 transition-all duration-200 cursor-pointer"
              onClick={() => handleFundSelect(fund.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${fund.color} flex items-center justify-center text-white`}>
                    {fund.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-white">{fund.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        fund.risk === 'Low' ? 'bg-green-500/20 text-green-400' :
                        fund.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        fund.risk === 'High' ? 'bg-red-500/20 text-red-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {fund.risk}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm mb-3">{fund.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-white/50">Min: ${fund.minInvestment}</span>
                      <span className="text-white/50">Max: ${fund.maxInvestment}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400 mb-1">{fund.apy}</div>
                  <div className="text-white/50 text-sm">APY</div>
                  <ArrowRight className="w-5 h-5 text-white/50 mt-2" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Investment Tips */}
        <div className="mt-8 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-white font-semibold mb-2">Investment Tips</h3>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• Diversify across multiple funds to reduce risk</li>
                <li>• Higher APY typically means higher risk</li>
                <li>• You can withdraw your investment anytime</li>
                <li>• Yield is compounded automatically</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      {showInvestmentModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="border border-white/20 rounded-3xl p-8 shadow-2xl w-full max-w-md"
          >
            {!investmentSuccess ? (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Invest in {getSelectedFund()?.name}</h2>
                  <p className="text-white/70 text-sm">Enter the amount you want to invest</p>
                </div>

                {/* Fund Details */}
                <div className="border border-white/10 rounded-2xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/50 text-sm">Expected APY</span>
                    <span className="text-green-400 font-semibold">{getSelectedFund()?.apy}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/50 text-sm">Risk Level</span>
                    <span className="text-white font-semibold">{getSelectedFund()?.risk}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-sm">Min Investment</span>
                    <span className="text-white font-semibold">${getSelectedFund()?.minInvestment}</span>
                  </div>
                </div>

                {/* Investment Amount */}
                <div className="mb-6">
                  <label className="block text-white/70 text-sm mb-2">Investment Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/30 text-lg">$</span>
                    <input
                      type="text"
                      value={investmentAmount}
                      onChange={handleAmountChange}
                      placeholder="0.00"
                      className="w-full border border-white/20 text-white text-xl font-semibold text-center py-4 pl-8 pr-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/30"
                    />
                  </div>
                </div>

                {/* Fund Features */}
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Fund Features</h4>
                  <div className="space-y-2">
                    {getSelectedFund()?.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        <span className="text-white/70 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleInvestmentSubmit}
                    disabled={!investmentAmount || parseFloat(investmentAmount) < parseFloat(getSelectedFund()?.minInvestment || '0')}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-4 px-6 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Invest Now
                  </button>
                  <button
                    onClick={() => setShowInvestmentModal(false)}
                    className="w-full border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl hover:bg-white/5 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              /* Success Screen */
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                  className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-400/30"
                >
                  <TrendingUp size={40} className="text-green-400" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold text-white mb-4"
                >
                  Investment Successful!
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-white/70 mb-6"
                >
                  You've successfully invested ${investmentAmount} in {getSelectedFund()?.name}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="p-4 mb-6 border border-white/10 rounded-2xl"
                >
                  <p className="text-white/50 text-sm">Expected Annual Yield</p>
                  <p className="text-2xl font-bold text-green-400">${(parseFloat(investmentAmount) * parseFloat(getSelectedFund()?.apy.replace('%', '') || '0') / 100).toFixed(2)}</p>
                  <p className="text-white/50 text-xs mt-1">Based on current APY</p>
                </motion.div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
