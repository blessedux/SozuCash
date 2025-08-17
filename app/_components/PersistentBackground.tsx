'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// LavaLamp Shader (same as HybridBackground)
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

export default function PersistentBackground() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [isInteractingWithUI, setIsInteractingWithUI] = useState(false);

  // Debug state for tracking event flow
  const [eventCount, setEventCount] = useState(0);
  const [lastEventTime, setLastEventTime] = useState<number>(0);
  const [lastEventSent, setLastEventSent] = useState<number>(0);

  // Throttle events to prevent flooding (only send every 100ms)
  const THROTTLE_MS = 100;

  // Simulate actual DOM events on the Spline iframe
  const simulateSplineEvents = useCallback((e: MouseEvent) => {
    if (!iframeRef.current || !splineLoaded) return;
    
    try {
      // Get iframe position
      const rect = iframeRef.current.getBoundingClientRect();
      
      // Calculate relative position within iframe
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;
      
      // Create and dispatch mouse events directly on the iframe
      const mouseMoveEvent = new MouseEvent('mousemove', {
        clientX: relativeX,
        clientY: relativeY,
        movementX: e.movementX,
        movementY: e.movementY,
        bubbles: true,
        cancelable: true
      });
      
      // Try to dispatch on the iframe element itself
      iframeRef.current.dispatchEvent(mouseMoveEvent);
      
      // Also try to dispatch on the iframe's document if accessible
      try {
        if (iframeRef.current.contentDocument) {
          const iframeMouseEvent = new MouseEvent('mousemove', {
            clientX: relativeX,
            clientY: relativeY,
            movementX: e.movementX,
            movementY: e.movementY,
            bubbles: true,
            cancelable: true
          });
          iframeRef.current.contentDocument.dispatchEvent(iframeMouseEvent);
        }
      } catch (error) {
        // CORS restriction - this is expected
      }
      
      // NEW: Try different event types that might wake up Spline
      const eventTypes = ['mouseover', 'mouseenter', 'pointermove', 'pointerover'];
      eventTypes.forEach(eventType => {
        try {
          if (iframeRef.current) {
            const customEvent = new MouseEvent(eventType, {
              clientX: relativeX,
              clientY: relativeY,
              bubbles: true,
              cancelable: true
            });
            iframeRef.current.dispatchEvent(customEvent);
            console.log(`🎯 Dispatched ${eventType} event on Spline iframe`);
          }
        } catch (error) {
          console.log(`❌ Failed to dispatch ${eventType}:`, error);
        }
      });
      
      console.log('🎯 Simulated DOM events on Spline iframe:', { relativeX, relativeY });
      
    } catch (error) {
      console.error('❌ Failed to simulate Spline events:', error);
    }
  }, [splineLoaded]);

  // Enhanced event handler with timing and counting
  const handleIframeMouseMove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const now = Date.now();
    setEventCount(prev => prev + 1);
    setLastEventTime(now);
    
    // Check if events are being throttled
    if (lastEventTime > 0) {
      const timeDiff = now - lastEventTime;
      if (timeDiff > 100) { // More than 100ms between events
        // console.log(`⚠️ Event gap detected: ${timeDiff}ms between events`);
      }
    }
  }, [eventCount, lastEventTime]);

  // Global event handler for Spline interactions
  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    if (!iframeRef.current || !splineLoaded) {
      // console.log('Spline not ready:', { iframeExists: !!iframeRef.current, splineLoaded });
      return;
    }

    // Check if we're interacting with UI elements
    const target = e.target as HTMLElement;
    const isUIElement = target.closest('[data-ui-element]') || 
                       target.closest('button') || 
                       target.closest('input') || 
                       target.closest('a') ||
                       target.closest('.pointer-events-auto');
    
    setIsInteractingWithUI(!!isUIElement);

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Normalize coordinates to 0-1 range
    const normalizedX = e.clientX / viewportWidth;
    const normalizedY = e.clientY / viewportHeight;
    
    // Calculate mouse velocity for dynamic interactions
    const deltaX = e.movementX / viewportWidth;
    const deltaY = e.movementY / viewportHeight;
    
    // Throttle events to prevent flooding
    const now = Date.now();
    if (now - lastEventSent < THROTTLE_MS) {
      return; // Skip this event
    }
    setLastEventSent(now);
    
    // More aggressive debug logging
    if (Math.random() < 0.1) { // Log 10% of events to see more activity
      // console.log('🎯 Spline Event:', {
      //   type: 'mouseMove',
      //   x: normalizedX.toFixed(3),
      //   y: normalizedY.toFixed(3),
      //   deltaX: deltaX.toFixed(4),
      //   deltaY: deltaY.toFixed(4),
      //   isUIElement: !!isUIElement,
      //   iframeExists: !!iframeRef.current,
      //   splineLoaded: splineLoaded
      // });
    }
    
    // Send enhanced mouse data to Spline iframe (THROTTLED)
    try {
      const message = {
        type: 'mouseMove',
        x: normalizedX,
        y: normalizedY,
        deltaX: deltaX,
        deltaY: deltaY,
        viewportWidth: viewportWidth,
        viewportHeight: viewportHeight,
        isUIElement: !!isUIElement,
        timestamp: now
      };
      
      // console.log('📤 Sending to Spline (THROTTLED):', message);
      
      iframeRef.current.contentWindow?.postMessage(message, '*');
      
      // Also try alternative event formats that Spline might expect
      iframeRef.current.contentWindow?.postMessage({
        type: 'mousemove',
        clientX: e.clientX,
        clientY: e.clientY,
        movementX: e.movementX,
        movementY: e.movementY
      }, '*');
      
      // Try Spline-specific event format
      iframeRef.current.contentWindow?.postMessage({
        type: 'spline:mouseMove',
        x: normalizedX,
        y: normalizedY,
        deltaX: deltaX,
        deltaY: deltaY
      }, '*');
      
      // Try generic event format
      iframeRef.current.contentWindow?.postMessage({
        type: 'event',
        name: 'mouseMove',
        data: {
          x: normalizedX,
          y: normalizedY,
          deltaX: deltaX,
          deltaY: deltaY
        }
      }, '*');
      
      // NEW: Also try simulating actual DOM events (THROTTLED)
      simulateSplineEvents(e);
      
    } catch (error) {
      console.error('❌ Failed to send message to Spline:', error);
    }
  }, [splineLoaded, lastEventSent, simulateSplineEvents]);

  const handleGlobalMouseEnter = useCallback(() => {
    if (!iframeRef.current || !splineLoaded) return;
    
    iframeRef.current.contentWindow?.postMessage({
      type: 'mouseEnter',
      timestamp: Date.now()
    }, '*');
  }, [splineLoaded]);

  const handleGlobalMouseLeave = useCallback(() => {
    if (!iframeRef.current || !splineLoaded) return;
    
    iframeRef.current.contentWindow?.postMessage({
      type: 'mouseLeave',
      timestamp: Date.now()
    }, '*');
  }, [splineLoaded]);

  const handleGlobalMouseDown = useCallback((e: MouseEvent) => {
    if (!iframeRef.current || !splineLoaded) return;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const normalizedX = e.clientX / viewportWidth;
    const normalizedY = e.clientY / viewportHeight;
    
    iframeRef.current.contentWindow?.postMessage({
      type: 'mouseDown',
      x: normalizedX,
      y: normalizedY,
      button: e.button,
      timestamp: Date.now()
    }, '*');
  }, [splineLoaded]);

  const handleGlobalMouseUp = useCallback((e: MouseEvent) => {
    if (!iframeRef.current || !splineLoaded) return;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const normalizedX = e.clientX / viewportWidth;
    const normalizedY = e.clientY / viewportHeight;
    
    iframeRef.current.contentWindow?.postMessage({
      type: 'mouseUp',
      x: normalizedX,
      y: normalizedY,
      button: e.button,
      timestamp: Date.now()
    }, '*');
  }, [splineLoaded]);

  const handleGlobalWheel = useCallback((e: WheelEvent) => {
    if (!iframeRef.current || !splineLoaded) return;
    
    iframeRef.current.contentWindow?.postMessage({
      type: 'wheel',
      deltaX: e.deltaX,
      deltaY: e.deltaY,
      deltaZ: e.deltaZ,
      timestamp: Date.now()
    }, '*');
  }, [splineLoaded]);

  // Try to access Spline's internal API and force interactions
  const forceSplineInteractions = useCallback(() => {
    if (!iframeRef.current || !splineLoaded) return;
    
    try {
      // console.log('🧪 Attempting to force Spline interactions...');
      
      const iframe = iframeRef.current;
      
      // Method 1: Try to access Spline's global object
      try {
        const splineWindow = iframe.contentWindow as any;
        
        // Look for common Spline properties
        const splineProps = ['spline', 'SPLINE', 'Spline', 'scene', 'Scene', 'app', 'App'];
        splineProps.forEach(prop => {
          if (splineWindow && splineWindow[prop]) {
            // console.log(`🎯 Found Spline property: ${prop}`, splineWindow[prop]);
            
            const obj = splineWindow[prop];
            
            // Try to enable interactions
            if (typeof obj.enableInteractions === 'function') {
              obj.enableInteractions();
              // console.log(`🎯 Enabled interactions on ${prop}`);
            }
            
            if (typeof obj.setInteractive === 'function') {
              obj.setInteractive(true);
              // console.log(`🎯 Set ${prop} to interactive`);
            }
          }
        });
        
      } catch (error) {
        // console.log('🔒 Cannot access Spline window (CORS)');
      }
      
      // Method 2: Try to inject a script into the iframe
      try {
        if (iframe.contentDocument) {
          const script = document.createElement('script');
          script.textContent = `
            // console.log('🎯 Script injected into Spline iframe');
            
            // Try to find and enable Spline interactions
            if (window.spline) {
              // console.log('🎯 Found window.spline:', window.spline);
              if (window.spline.enableInteractions) {
                window.spline.enableInteractions();
                // console.log('🎯 Enabled Spline interactions');
              }
            }
            
            // Add event listeners to test if events are working
            document.addEventListener('mousemove', (e) => {
              // console.log('🎯 Spline iframe received mousemove:', e.clientX, e.clientY);
            });
            
            document.addEventListener('click', (e) => {
              // console.log('🎯 Spline iframe received click:', e.clientX, e.clientY);
            });
          `;
          
          iframe.contentDocument.head.appendChild(script);
          // console.log('🎯 Script injected successfully');
        }
      } catch (error) {
        // console.log('🔒 Cannot inject script (CORS)');
      }
      
    } catch (error) {
      console.error('❌ Failed to force Spline interactions:', error);
    }
  }, [splineLoaded]);


  // Set up event listeners and Spline interaction
  useEffect(() => {
    if (!splineLoaded) return;
    
    // console.log('🎯 Setting up working Spline event system...');
    
    const iframe = iframeRef.current;
    const container = containerRef.current;
    if (!iframe || !container) return;

    let isMouseDown = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate mouse velocity for more dynamic interactions
      const deltaX = x - lastMouseX;
      const deltaY = y - lastMouseY;
      
      // Update event counter and timestamp
      const now = Date.now();
      setEventCount(prev => prev + 1);
      setLastEventTime(now);
      
      // METHOD 1: Try direct DOM event dispatch on iframe
      try {
        // Create a new mouse event with coordinates relative to the iframe
        const mouseEvent = new MouseEvent('mousemove', {
          clientX: e.clientX,
          clientY: e.clientY,
          screenX: e.screenX,
          screenY: e.screenY,
          bubbles: true,
          cancelable: true,
          view: window
        });
        
        // Dispatch directly on the iframe element
        iframe.dispatchEvent(mouseEvent);
        
        // Also try dispatching on the iframe's contentWindow if accessible
        if (iframe.contentWindow) {
          try {
            iframe.contentWindow.dispatchEvent(mouseEvent);
          } catch (error) {
            // CORS restriction
          }
        }
        
      } catch (error) {
        // Direct event dispatch failed
      }
      
      // METHOD 2: Also try postMessage as backup
      iframe.contentWindow?.postMessage({
        type: 'mouseMove',
        x: x / rect.width,  // Normalize coordinates
        y: y / rect.height,
        deltaX: deltaX / rect.width,
        deltaY: deltaY / rect.height,
        isHovered: true,
        isMouseDown: isMouseDown
      }, '*');
      
      lastMouseX = x;
      lastMouseY = y;
    };

    const handleMouseEnter = () => {
      // Update event counter
      setEventCount(prev => prev + 1);
      setLastEventTime(Date.now());
      
      // METHOD 1: Direct DOM event dispatch
      try {
        const mouseEvent = new MouseEvent('mouseenter', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        iframe.dispatchEvent(mouseEvent);
      } catch (error) {
        // Direct mouseenter dispatch failed
      }
      
      // METHOD 2: PostMessage backup
      iframe.contentWindow?.postMessage({
        type: 'mouseEnter',
        isHovered: true
      }, '*');
    };

    const handleMouseLeave = () => {
      // Update event counter
      setEventCount(prev => prev + 1);
      setLastEventTime(Date.now());
      
      // METHOD 1: Direct DOM event dispatch
      try {
        const mouseEvent = new MouseEvent('mouseleave', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        iframe.dispatchEvent(mouseEvent);
      } catch (error) {
        // Direct mouseleave dispatch failed
      }
      
      // METHOD 2: PostMessage backup
      iframe.contentWindow?.postMessage({
        type: 'mouseLeave',
        isHovered: false
      }, '*');
    };

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      
      // Update event counter
      setEventCount(prev => prev + 1);
      setLastEventTime(Date.now());
      
      const rect = container.getBoundingClientRect();
      iframe.contentWindow?.postMessage({
        type: 'mouseDown',
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height
      }, '*');
      
      // console.log(`🎯 Mouse down event #${eventCount + 1}`);
    };

    const handleMouseUp = (e: MouseEvent) => {
      isMouseDown = false;
      
      // Update event counter
      setEventCount(prev => prev + 1);
      setLastEventTime(Date.now());
      
      const rect = container.getBoundingClientRect();
      iframe.contentWindow?.postMessage({
        type: 'mouseUp',
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height
      }, '*');
      
      // console.log(`🎯 Mouse up event #${eventCount + 1}`);
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      
      // Update event counter
      setEventCount(prev => prev + 1);
      setLastEventTime(Date.now());
      
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      iframe.contentWindow?.postMessage({
        type: 'touchStart',
        x: (touch.clientX - rect.left) / rect.width,
        y: (touch.clientY - rect.top) / rect.height
      }, '*');
      
      // console.log(`🎯 Touch start event #${eventCount + 1}`);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      
      // Update event counter
      setEventCount(prev => prev + 1);
      setLastEventTime(Date.now());
      
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      iframe.contentWindow?.postMessage({
        type: 'touchMove',
        x: (touch.clientX - rect.left) / rect.width,
        y: (touch.clientY - rect.top) / rect.height
      }, '*');
      
      // console.log(`🎯 Touch move event #${eventCount + 1}`);
    };

    // Add event listeners to the container
    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Add simple message listener for Spline responses
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow) return;
      // console.log('📨 Message from Spline:', event.data);
    };
    window.addEventListener('message', handleMessage);

    // Cleanup function
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('message', handleMessage);
    };
  }, [splineLoaded]);



  return (
    <div className="fixed inset-0 z-[-1]">
      {/* Spline Background (Base Layer) */}
      <div 
        ref={containerRef}
        className="fixed inset-0 z-[-1] overflow-hidden spline-background"
        style={{
          cursor: 'default',
          pointerEvents: 'auto', // Allow events to reach the iframe
          zIndex: -1, // Container style
          isolation: 'isolate'
        }}
      >
        <iframe 
          ref={iframeRef}
          src='https://my.spline.design/animatedshapeblend-vPAPkDf3zXbvMSVXAIjlDWIm/'
          frameBorder='0' 
          width='100%' 
          height='100%'
          className="w-full h-full hover:opacity-90 transition-opacity"
          style={{
            transform: 'scale(1.2)',
            pointerEvents: 'auto', // Enable direct interaction
            transition: 'opacity 0.3s ease-in-out',
            border: 'none',
            outline: 'none',
            zIndex: -1,
            cursor: 'default'
          }}
          allow="autoplay; fullscreen"
          allowFullScreen
          title="Spline Background Animation"
          onClick={(e) => {
            e.stopPropagation();
            // console.log('🎯 Spline iframe clicked!');
          }}
          onMouseMove={(e) => {
            e.stopPropagation();
            // console.log('🎯 Spline iframe mouse move!', e.clientX, e.clientY);
            // Also send to global handler for Spline communication
            handleIframeMouseMove(e as any);
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            // console.log('🎯 Spline iframe mouse enter!');
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            // console.log('🎯 Spline iframe mouse leave!');
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            // console.log('🎯 Spline iframe mouse down!');
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            // console.log('🎯 Spline iframe mouse up!');
          }}
          onLoad={() => {
            // console.log('✅ Persistent Spline iframe loaded successfully');
            setSplineLoaded(true);
            
            // Debug: Check iframe properties
            if (iframeRef.current) {
              // console.log('🎯 Iframe properties:');
              // console.log('- pointerEvents:', iframeRef.current.style.pointerEvents);
              // console.log('- zIndex:', iframeRef.current.style.zIndex);
              // console.log('- className:', iframeRef.current.className);
              // console.log('- src:', iframeRef.current.src);
              
              // Force pointer events to be sure
              iframeRef.current.style.pointerEvents = 'auto';
              iframeRef.current.style.cursor = 'default';
              
              // Try to add a click event listener to test if events are reaching the iframe
              iframeRef.current.addEventListener('click', (e) => {
                // console.log('🎯 Iframe received click event!', e);
              });
              
              iframeRef.current.addEventListener('mousemove', (e) => {
                // console.log('🎯 Iframe received mousemove event!', e.clientX, e.clientY);
              });
              
              // console.log('🎯 Added event listeners to iframe for testing');
            }
            
            // Test iframe access
            try {
              // console.log('🧪 Testing iframe access...');
              // console.log('Iframe contentWindow:', iframeRef.current?.contentWindow ? 'global' : 'null');
              // console.log('Iframe contentDocument:', iframeRef.current?.contentDocument ? 'accessible' : 'null');
              
              if (iframeRef.current?.contentWindow) {
                // console.log('🧪 Testing iframe interactivity...');
                // console.log('Iframe pointerEvents style:', iframeRef.current.style.pointerEvents);
                // console.log('Iframe zIndex style:', iframeRef.current.style.zIndex);
                // console.log('Iframe className:', iframeRef.current.className);
                // console.log('Iframe src:', iframeRef.current.src);
                
                // Test if we can send a simple message
                iframeRef.current.contentWindow.postMessage({
                  type: 'test',
                  message: 'Hello from React!',
                  timestamp: Date.now()
                }, '*');
                
                // console.log('🧪 Initializing Spline scene...');
                
                // Send initialization message
                iframeRef.current.contentWindow.postMessage({
                  type: 'SPLINE_INIT',
                  action: 'enableInteractions',
                  config: {
                    enableMouseEvents: true,
                    enableTouchEvents: true,
                    enableKeyboardEvents: true
                  }
                }, '*');
                
                // Try to force interactions after a delay
                setTimeout(() => {
                  forceSplineInteractions();
                }, 2000);
                
              }
            } catch (error) {
              // console.log('🔒 Iframe access restricted (CORS):', error instanceof Error ? error.message : String(error));
            }
          }}
          onError={(e) => {
            console.error('❌ Persistent Spline iframe failed to load:', e);
          }}
        />
      </div>

      {/* Lava Lamp Overlay */}
      <div 
        className="fixed inset-0 z-[-1] pointer-events-none lava-lamp-overlay"
        style={{ 
          mixBlendMode: 'overlay',
          opacity: 1.0,
          pointerEvents: 'none'
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
          style={{ pointerEvents: 'none' }}
          onCreated={(gl) => {
            // console.log('Persistent Three.js Canvas created successfully');
          }}
          onError={(error) => {
            console.error('Persistent Three.js Canvas error:', error);
          }}
        >
          <LavaLampShader />
        </Canvas>
      </div>
    </div>
  );
}
