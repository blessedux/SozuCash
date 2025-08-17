'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedTransition } from '../../shared/AnimatedTransition';
import { TrendingUp, Shield, Zap, Star, ExternalLink, BarChart3 } from 'lucide-react';

export function InvestPage() {
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
    <AnimatedTransition className="w-full h-full flex flex-col">
      {!investmentSuccess ? (
        <>
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-lg font-bold text-white mb-4 text-center drop-shadow-lg"
          >
            Invest
          </motion.h1>

          {/* External Links - Uniswap and CoinMarketCap */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex justify-center space-x-4 mb-6"
          >
            {/* Uniswap Link */}
            <a
              href="https://app.uniswap.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-lg hover:bg-blue-500/30 transition-all duration-200 text-blue-300 hover:text-blue-200"
            >
              <ExternalLink size={16} />
              <span className="text-sm font-medium">Uniswap</span>
            </a>

            {/* CoinMarketCap Link */}
            <a
              href="https://coinmarketcap.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-lg hover:bg-green-500/30 transition-all duration-200 text-green-300 hover:text-green-200"
            >
              <BarChart3 size={16} />
              <span className="text-sm font-medium">CoinMarketCap</span>
            </a>
          </motion.div>

          {/* Investment Funds Grid */}
          <div className="grid grid-cols-1 gap-4 overflow-y-auto">
            {investmentFunds.map((fund) => (
              <motion.div
                key={fund.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleFundSelect(fund.id)}
                className="backdrop-blur-[25px] bg-white/10 border border-white/20 rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:bg-white/20"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${fund.color}`}>
                    {fund.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-sm">{fund.name}</h3>
                    <p className="text-white/70 text-xs">{fund.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold text-lg">{fund.apy}</div>
                    <div className="text-white/50 text-xs">{fund.risk} Risk</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-xs text-white/70 mb-2">
                  <span>Min: ${fund.minInvestment}</span>
                  <span>Max: ${fund.maxInvestment}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {fund.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 backdrop-blur-[25px] bg-white/10 rounded-full text-white/70 text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        /* Success Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="w-20 h-20 mx-auto border-2 border-white/20 rounded-full flex items-center justify-center"
          >
            <span className="text-white text-4xl">✓</span>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => setInvestmentSuccess(false)}
            className="text-white/70 hover:text-white transition-colors"
          >
            View more funds →
          </motion.button>
        </motion.div>
      )}
      {/* Navigation Instructions - Bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
      >
        <p className="text-white/50 text-sm">
          Swipe up or press ↑ to go back to Deposit
        </p>
      </motion.div>
    </AnimatedTransition>
  );
}
