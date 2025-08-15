'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { TrendingUp, Shield, Zap, Star, ArrowRight, Info } from 'lucide-react';

export default function InvestPage() {
  const router = useRouter();
  const [selectedFund, setSelectedFund] = useState<string | null>(null);
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
    setInvestmentSuccess(true);
    setTimeout(() => {
      setInvestmentSuccess(false);
      setSelectedFund(null);
    }, 3000);
  };

  const getSelectedFund = () => {
    return investmentFunds.find(fund => fund.id === selectedFund);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden no-scroll">
      {/* Sozu Cash Logo */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
        <img 
          src="/sozu-logo.png" 
          alt="Sozu Cash" 
          className="w-20"
        />
      </div>

      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="absolute top-8 left-4 z-20 text-white/70 hover:text-white transition-colors"
      >
        ← Back
      </button>

      {/* Main Content */}
      <motion.div
        className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 py-8 pointer-events-none"
        style={{ backgroundColor: 'transparent' }}
      >
        
        <div className="relative z-20 text-center w-80 mx-auto pt-20 pointer-events-auto" style={{ backgroundColor: 'transparent' }}>
          {/* Glassmorphism Card */}
          <div className="border border-white/10 rounded-3xl p-8 shadow-2xl w-full h-96 flex items-center justify-center pointer-events-none backdrop-blur-[10px]">
            <div className="w-full h-full flex flex-col overflow-hidden">
              {/* Title */}
              <h1 className="text-xl font-bold text-white mb-4 text-center flex-shrink-0">Invest</h1>

              {/* Balance Display */}
              <div className="text-center mb-4 flex-shrink-0">
                <p className="text-white/50 text-xs mb-1">Available Balance</p>
                <p className="text-2xl font-bold text-white mb-1">$1,234.56</p>
                <p className="text-white/70 text-xs">Ready to invest and earn yield</p>
              </div>

              {/* Scrollable Investment Funds */}
              <div className="flex-1 overflow-y-auto pr-1 min-h-0">
                <div className="space-y-2">
                  {investmentFunds.map((fund, index) => (
                    <motion.div
                      key={fund.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-white/20 rounded-xl p-3 hover:bg-white/5 transition-all duration-200 cursor-pointer"
                      onClick={() => handleFundSelect(fund.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${fund.color} flex items-center justify-center text-white`}>
                            {fund.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-sm font-semibold text-white truncate">{fund.name}</h3>
                              <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                                fund.risk === 'Low' ? 'bg-green-500/20 text-green-400' :
                                fund.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                fund.risk === 'High' ? 'bg-red-500/20 text-red-400' :
                                'bg-orange-500/20 text-orange-400'
                              }`}>
                                {fund.risk}
                              </span>
                            </div>
                            <p className="text-white/70 text-xs mb-1 truncate">{fund.description}</p>
                            <div className="flex items-center space-x-3 text-xs">
                              <span className="text-white/50">Min: ${fund.minInvestment}</span>
                              <span className="text-white/50">Max: ${fund.maxInvestment}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-bold text-green-400 mb-1">{fund.apy}</div>
                          <div className="text-white/50 text-xs">APY</div>
                          <ArrowRight className="w-4 h-4 text-white/50 mt-1" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Investment Tips */}
              <div className="mt-3 flex-shrink-0">
                <div className="border border-blue-500/20 rounded-xl p-3">
                  <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold text-sm mb-1">Investment Tips</h3>
                      <ul className="text-white/70 text-xs space-y-0.5">
                        <li>• Diversify across multiple funds to reduce risk</li>
                        <li>• Higher APY typically means higher risk</li>
                        <li>• You can withdraw your investment anytime</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Success Message */}
              {investmentSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-3xl flex items-center justify-center"
                >
                  <div className="text-center p-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                      className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-400/30"
                    >
                      <TrendingUp size={32} className="text-green-400" />
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-lg font-bold text-white mb-2"
                    >
                      Investment Successful!
                    </motion.h2>
                    
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-white/70 text-sm"
                    >
                      You've successfully invested in {getSelectedFund()?.name}
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
