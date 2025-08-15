'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, Play, Pause, RotateCcw, Home } from 'lucide-react';

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const demoSteps = [
    {
      title: "Landing Page",
      description: "Beautiful landing page with parallax effects and call-to-action",
      action: "Open App",
      route: "/",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Locked Screen",
      description: "Secure authentication with Face ID/Touch ID",
      action: "Unlock with Face ID",
      route: "/locked-screen",
      color: "from-blue-500 to-purple-500"
    },
    {
      title: "App Navigation",
      description: "Main app interface with swipe navigation",
      action: "Navigate to Pay",
      route: "/app-navigation",
      color: "from-green-500 to-blue-500"
    },
    {
      title: "Pay Screen",
      description: "Send payments with NFC or QR code",
      action: "Send Payment",
      route: "/pay",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Receive Screen",
      description: "Receive payments with QR code generation",
      action: "Receive Payment",
      route: "/receive",
      color: "from-teal-500 to-green-500"
    }
  ];

  const startAutoPlay = () => {
    setIsPlaying(true);
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= demoSteps.length - 1) {
          clearInterval(interval);
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 3000);
    setAutoPlayInterval(interval);
  };

  const stopAutoPlay = () => {
    setIsPlaying(false);
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
    }
  };

  const resetDemo = () => {
    stopAutoPlay();
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const navigateToStep = () => {
    router.push(demoSteps[currentStep].route);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">SozuCash Demo Flow</h1>
            <p className="text-white/70">Complete user journey showcase</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="p-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all"
          >
            <Home size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-white/70">
              Step {currentStep + 1} of {demoSteps.length}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={isPlaying ? stopAutoPlay : startAutoPlay}
                className={`p-2 rounded-full transition-all ${
                  isPlaying 
                    ? 'bg-red-500/20 text-red-400 border border-red-400/30' 
                    : 'bg-green-500/20 text-green-400 border border-green-400/30'
                }`}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                onClick={resetDemo}
                className="p-2 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full bg-gradient-to-r ${demoSteps[currentStep].color}`}
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Current Step Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl mb-8"
          >
            <div className="text-center">
              <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${demoSteps[currentStep].color} rounded-full flex items-center justify-center`}>
                <span className="text-2xl font-bold">{currentStep + 1}</span>
              </div>
              
              <h2 className="text-2xl font-bold mb-4">{demoSteps[currentStep].title}</h2>
              <p className="text-white/70 mb-6 max-w-md mx-auto">
                {demoSteps[currentStep].description}
              </p>
              
              <button
                onClick={navigateToStep}
                className={`bg-gradient-to-r ${demoSteps[currentStep].color} text-white py-3 px-6 rounded-2xl font-semibold hover:scale-105 active:scale-95 transition-all`}
              >
                {demoSteps[currentStep].action}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-2xl transition-all ${
              currentStep === 0
                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <ArrowRight size={16} className="rotate-180" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-2">
            {demoSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-white'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            disabled={currentStep === demoSteps.length - 1}
            className={`flex items-center space-x-2 px-4 py-2 rounded-2xl transition-all ${
              currentStep === demoSteps.length - 1
                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <span>Next</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Step Overview */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4">Complete Flow Overview</h3>
          <div className="grid gap-4">
            {demoSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  index === currentStep
                    ? 'bg-white/10 border-white/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
                onClick={() => setCurrentStep(index)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-sm font-bold`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{step.title}</h4>
                    <p className="text-white/60 text-sm">{step.description}</p>
                  </div>
                  {index === currentStep && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
