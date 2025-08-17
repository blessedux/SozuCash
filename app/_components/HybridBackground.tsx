'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// LavaLamp Shader (simplified version for the hybrid effect)
const vertexShader = `
varying vec2 vUv;
uniform float time;
uniform vec4 resolution;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;
varying vec2 vUv;
uniform float time;
uniform vec4 resolution;

float PI = 3.141592653589793238;

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 p, vec3 axis, float angle) {
    mat4 m = rotationMatrix(axis, angle);
    return (m * vec4(p, 1.0)).xyz;
}

float smin( float a, float b, float k ) {
    k *= 6.0;
    float h = max( k-abs(a-b), 0.0 )/k;
    return min(a,b) - h*h*h*k*(1.0/6.0);
}

float sphereSDF(vec3 p, float r) {
    return length(p) - r;
}

float sdf(vec3 p) {
    vec3 p1 = rotate(p, vec3(0.0, 0.0, 1.0), time/5.0);
    vec3 p2 = rotate(p, vec3(1.), -time/5.0);
    vec3 p3 = rotate(p, vec3(1., 1., 0.), -time/4.5);
    vec3 p4 = rotate(p, vec3(0., 1., 0.), -time/4.0);
    
    float final = sphereSDF(p1 - vec3(-0.5, 0.0, 0.0), 0.35);
    float nextSphere = sphereSDF(p2 - vec3(0.55, 0.0, 0.0), 0.3);
    final = smin(final, nextSphere, 0.1);
    nextSphere = sphereSDF(p2 - vec3(-0.8, 0.0, 0.0), 0.2);
    final = smin(final, nextSphere, 0.1);
    nextSphere = sphereSDF(p3 - vec3(1.0, 0.0, 0.0), 0.15);
    final = smin(final, nextSphere, 0.1);
    nextSphere = sphereSDF(p4 - vec3(0.45, -0.45, 0.0), 0.15);
    final = smin(final, nextSphere, 0.1);
    
    return final;
}

vec3 getNormal(vec3 p) {
    float d = 0.001;
    return normalize(vec3(
        sdf(p + vec3(d, 0.0, 0.0)) - sdf(p - vec3(d, 0.0, 0.0)),
        sdf(p + vec3(0.0, d, 0.0)) - sdf(p - vec3(d, 0.0, 0.0)),
        sdf(p + vec3(0.0, 0.0, d)) - sdf(p - vec3(d, 0.0, 0.0))
    ));
}

float rayMarch(vec3 rayOrigin, vec3 ray) {
    float t = 0.0;
    for (int i = 0; i < 100; i++) {
        vec3 p = rayOrigin + ray * t;
        float d = sdf(p);
        if (d < 0.001) return t;
        t += d;
        if (t > 100.0) break;
    }
    return -1.0;
}

void main() {
    vec2 newUV = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);
    vec3 cameraPos = vec3(0.0, 0.0, 5.0);
    vec3 ray = normalize(vec3((vUv - vec2(0.5)) * resolution.zw, -1));
    vec3 color = vec3(1.0);
    
    float t = rayMarch(cameraPos, ray);
    if (t > 0.0) {
        vec3 p = cameraPos + ray * t;
        vec3 normal = getNormal(p);
        float fresnel = pow(1.0 + dot(ray, normal), 3.0);
        color = vec3(fresnel);
        gl_FragColor = vec4(color, 1.0);
    } else {
        gl_FragColor = vec4(1.0);
    }
}
`;

function LavaLampShader() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  
  const uniforms = React.useMemo(() => ({
    time: { value: 0 },
    resolution: { value: new THREE.Vector4() }
  }), []);

  React.useEffect(() => {
    const { width, height } = size;
    const imageAspect = 1;
    let a1, a2;
    
    if (height / width > imageAspect) {
      a1 = (width / height) * imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = (height / width) / imageAspect;
    }
    
    uniforms.resolution.value.set(width, height, a1, a2);
  }, [size, uniforms]);

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[5, 5]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        opacity={0.3}
      />
    </mesh>
  );
}

interface HybridBackgroundProps {
  className?: string;
  scale?: number;
  enableInteractions?: boolean;
  lavaOpacity?: number;
  showLavaBubbles?: boolean;
  onLoad?: () => void;
}

export default function HybridBackground({
  className = "",
  scale = 1.2,
  enableInteractions = true,
  lavaOpacity = 0.3,
  showLavaBubbles = true,
  onLoad
}: HybridBackgroundProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);

  useEffect(() => {
    console.log('HybridBackground state:', { splineLoaded, splineError, showLavaBubbles });
  }, [splineLoaded, splineError, showLavaBubbles]);

  useEffect(() => {
    const iframe = iframeRef.current;
    const container = containerRef.current;
    if (!iframe || !container || !enableInteractions) return;

    let isMouseDown = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const deltaX = x - lastMouseX;
      const deltaY = y - lastMouseY;

      // Debug logging
      if (enableInteractions) {
        console.log('Mouse move on SplineBackground:', { x, y, deltaX, deltaY });
      }

      iframe.contentWindow?.postMessage({
        type: 'mouseMove',
        x: x / rect.width,
        y: y / rect.height,
        deltaX: deltaX / rect.width,
        deltaY: deltaY / rect.height,
        isHovered: isHovered,
        isMouseDown: isMouseDown
      }, '*');

      lastMouseX = x;
      lastMouseY = y;
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      console.log('Mouse entered SplineBackground');
      iframe.contentWindow?.postMessage({ type: 'mouseEnter', isHovered: true }, '*');
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      console.log('Mouse left SplineBackground');
      iframe.contentWindow?.postMessage({ type: 'mouseLeave', isHovered: false }, '*');
    };

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      const rect = container.getBoundingClientRect();
      iframe.contentWindow?.postMessage({ 
        type: 'mouseDown', 
        x: (e.clientX - rect.left) / rect.width, 
        y: (e.clientY - rect.top) / rect.height 
      }, '*');
    };

    const handleMouseUp = (e: MouseEvent) => {
      isMouseDown = false;
      const rect = container.getBoundingClientRect();
      iframe.contentWindow?.postMessage({ 
        type: 'mouseUp', 
        x: (e.clientX - rect.left) / rect.width, 
        y: (e.clientY - rect.top) / rect.height 
      }, '*');
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      iframe.contentWindow?.postMessage({ 
        type: 'touchStart', 
        x: (touch.clientX - rect.left) / rect.width, 
        y: (touch.clientY - rect.top) / rect.height 
      }, '*');
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      iframe.contentWindow?.postMessage({ 
        type: 'touchMove', 
        x: (touch.clientX - rect.left) / rect.width, 
        y: (touch.clientY - rect.top) / rect.height 
      }, '*');
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isHovered, enableInteractions]);

  return (
    <div className="relative w-full h-full hybrid-background">
      {/* Fallback Background - Shows if Spline fails */}
      {!splineLoaded && (
        <div 
          className="fixed inset-0 z-0"
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            zIndex: 0
          }}
        >
          {/* Subtle animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 via-slate-500/10 to-slate-700/10 animate-pulse" />
          
          {/* Floating particles */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-bounce" />
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white/5 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-1/4 left-1/2 w-20 h-20 bg-white/5 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
        </div>
      )}

      {/* Spline Background (Base Layer) */}
      <div 
        ref={containerRef}
        className={`fixed inset-0 z-0 overflow-hidden spline-background ${className}`}
        style={{ 
          cursor: enableInteractions ? 'default' : 'none',
          pointerEvents: 'auto',
          zIndex: 0,
          opacity: splineLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        <iframe 
          ref={iframeRef}
          src='https://my.spline.design/animatedshapeblend-vPAPkDf3zXbvMSVXAIjlDWIm/' 
          frameBorder='0' 
          width='100%' 
          height='100%'
          className="w-full h-full"
          style={{ 
            transform: `scale(${scale})`,
            pointerEvents: 'auto',
            transition: 'opacity 0.3s ease-in-out',
            border: 'none',
            outline: 'none'
          }}
          allow="autoplay; fullscreen"
          allowFullScreen
          title="Spline Background Animation"
          onLoad={() => {
            console.log('Spline iframe loaded successfully');
            setSplineLoaded(true);
            if (iframeRef.current) {
              iframeRef.current.style.pointerEvents = 'auto';
            }
            onLoad?.();
          }}
          onError={(e) => {
            console.error('Spline iframe failed to load:', e);
            setSplineError(true);
          }}
        />
      </div>

      {/* Lava Lamp Overlay (Masking Layer) - Must NOT block pointer events */}
      {showLavaBubbles && (
        <div 
          className="fixed inset-0 z-[1] pointer-events-none lava-lamp-overlay"
          style={{ 
            mixBlendMode: 'overlay',
            opacity: lavaOpacity,
            pointerEvents: 'none' // Ensure it doesn't block mouse events
          }}
        >
          <Canvas
            camera={{
              left: -0.5,
              right: 0.5,
              top: 0.5,
              bottom: -0.5,
              near: -1000,
              far: 1000,
              position: [0, 0, 2]
            }}
            orthographic
            gl={{ 
              antialias: true,
              alpha: true,
              premultipliedAlpha: false
            }}
            style={{ pointerEvents: 'none' }} // Ensure Canvas doesn't block events
            onCreated={(gl) => {
              console.log('Three.js Canvas created successfully');
            }}
            onError={(error) => {
              console.error('Three.js Canvas error:', error);
            }}
          >
            <LavaLampShader />
          </Canvas>
        </div>
      )}
    </div>
  );
}
