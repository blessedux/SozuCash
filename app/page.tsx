'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import LavaLampBackground from './_components/LavaLampBackground';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Animation */}
      <LavaLampBackground />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/10 z-[1]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <img 
            src="/sozu-logo.png" 
            alt="Sozu Cash" 
            className="w-32 md:w-40"
          />
        </motion.div>

        {/* Hero Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-black text-center mb-6 drop-shadow-2xl"
        >
          The Future of Payments
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="text-lg md:text-xl text-black/90 text-center max-w-2xl mb-12 drop-shadow-xl"
        >
          Experience seamless NFC payments and instant transfers on Mantle Network.
          No more waiting. No more fees. Just tap and pay.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/app')}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg py-4 px-8 rounded-2xl shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 backdrop-blur-sm"
        >
          Get Started
        </motion.button>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mt-24"
        >
          {[
            {
              title: "Tap & Pay",
              description: "Use NFC technology for instant payments at any terminal"
            },
            {
              title: "Zero Fees",
              description: "No hidden charges. No transaction fees. Keep more of your money"
            },
            {
              title: "Instant Transfers",
              description: "Send money to anyone, anywhere, instantly on Mantle Network"
            }
          ].map((feature, index) => (
            <div 
              key={feature.title}
              className="text-center p-6 rounded-2xl border border-black/20 backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300"
            >
              <h3 className="text-black font-bold text-lg mb-2 drop-shadow-lg">{feature.title}</h3>
              <p className="text-black/90 drop-shadow-md">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}