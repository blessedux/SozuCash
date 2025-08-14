'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
varying vec2 vUv;
uniform float time;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}
`

const fragmentShader = `
precision highp float;
varying vec2 vUv;
uniform float time;

void main() {
    vec2 uv = vUv;
    
    // Create a flowing gradient background
    float t = time * 0.5;
    
    // Multiple layers of animated gradients
    float layer1 = sin(uv.x * 3.0 + t) * cos(uv.y * 2.0 + t * 0.7);
    float layer2 = sin(uv.x * 5.0 + t * 1.3) * cos(uv.y * 3.0 + t * 0.5);
    float layer3 = sin(uv.x * 7.0 + t * 0.8) * cos(uv.y * 4.0 + t * 1.2);
    
    // Combine layers
    float combined = (layer1 + layer2 + layer3) / 3.0;
    
    // Create color gradients
    vec3 color1 = vec3(0.1, 0.2, 0.8); // Deep blue
    vec3 color2 = vec3(0.8, 0.1, 0.6); // Purple
    vec3 color3 = vec3(0.2, 0.8, 0.4); // Green
    
    // Mix colors based on position and time
    vec3 finalColor = mix(color1, color2, (combined + 1.0) * 0.5);
    finalColor = mix(finalColor, color3, sin(t * 0.3) * 0.3 + 0.3);
    
    // Add some noise for texture
    float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
    finalColor += noise * 0.05;
    
    // Fade edges
    float edge = 1.0 - smoothstep(0.0, 0.1, uv.x) - smoothstep(0.9, 1.0, uv.x);
    edge *= 1.0 - smoothstep(0.0, 0.1, uv.y) - smoothstep(0.9, 1.0, uv.y);
    
    gl_FragColor = vec4(finalColor * edge, 1.0);
}
`

function AppBackgroundShader() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  const uniforms = useMemo(() => ({
    time: { value: 0 }
  }), [])

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.time.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}

export default function AppBackground() {
  return (
    <div className="fixed inset-0 w-full h-full">
      <Canvas
        camera={{
          left: -1,
          right: 1,
          top: 1,
          bottom: -1,
          near: -1000,
          far: 1000,
          position: [0, 0, 1]
        }}
        orthographic
        gl={{ antialias: true }}
      >
        <AppBackgroundShader />
      </Canvas>
    </div>
  )
}
