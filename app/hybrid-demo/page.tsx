'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import HybridBackground from '../_components/HybridBackground';

export default function HybridDemoPage() {
  const [lavaOpacity, setLavaOpacity] = useState(0.3);
  const [showLavaBubbles, setShowLavaBubbles] = useState(true);
  const [blendMode, setBlendMode] = useState<'overlay' | 'multiply' | 'screen' | 'difference'>('overlay');

  const blendModes = [
    { value: 'overlay', label: 'Overlay', description: 'Classic masking effect' },
    { value: 'multiply', label: 'Multiply', description: 'Dark, rich blending' },
    { value: 'screen', label: 'Screen', description: 'Light, glowing effect' },
    { value: 'difference', label: 'Difference', description: 'High contrast, artistic' }
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden no-scroll">
      {/* Hybrid Background */}
      <HybridBackground 
        scale={1.2} 
        enableInteractions={true}
        lavaOpacity={lavaOpacity}
        showLavaBubbles={showLavaBubbles}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30 z-[2] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-2xl">
            Hybrid Background Effect
          </h1>
          <p className="text-lg text-white/90 mb-8 drop-shadow-xl">
            Experience the beautiful masking effect where LavaLamp bubbles interact with the Spline canvas.
            This creates a unique visual experience that combines both backgrounds seamlessly.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md w-full"
        >
          <h3 className="text-white font-semibold mb-4 text-center">Effect Controls</h3>
          
          {/* Lava Bubbles Toggle */}
          <div className="mb-4">
            <label className="flex items-center space-x-2 text-white/90">
              <input
                type="checkbox"
                checked={showLavaBubbles}
                onChange={(e) => setShowLavaBubbles(e.target.checked)}
                className="rounded border-white/20"
              />
              <span>Show Lava Bubbles</span>
            </label>
          </div>

          {/* Opacity Control */}
          <div className="mb-4">
            <label className="block text-white/90 text-sm mb-2">
              Lava Opacity: {lavaOpacity.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={lavaOpacity}
              onChange={(e) => setLavaOpacity(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              title="Adjust lava bubble opacity"
              aria-label="Adjust lava bubble opacity from 0 to 1"
            />
          </div>

          {/* Blend Mode Selection */}
          <div className="mb-4">
            <label className="block text-white/90 text-sm mb-2">Blend Mode</label>
            <select
              value={blendMode}
              onChange={(e) => setBlendMode(e.target.value as any)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              title="Select blend mode for the background effect"
              aria-label="Select blend mode for the background effect"
            >
              {blendModes.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label} - {mode.description}
                </option>
              ))}
            </select>
          </div>

          {/* Instructions */}
          <div className="text-xs text-white/70 text-center">
            <p>• Move your mouse to interact with the Spline canvas</p>
            <p>• Adjust opacity to control the masking intensity</p>
            <p>• Try different blend modes for unique effects</p>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={() => window.history.back()}
          className="mt-8 text-white/70 hover:text-white transition-colors text-sm"
        >
          ← Go Back
        </motion.button>
      </div>
    </div>
  );
}
