import React from 'react';
import { FluidParticles } from './ui/fluid-particle';

export const ParticleBackground: React.FC = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      <FluidParticles
        particleDensity={100}
        particleSize={1}
        particleColor="#555555"
        activeColor="#000000"
        maxBlastRadius={300}
        hoverDelay={1}
        interactionDistance={100}
      />
    </div>
  );
}; 