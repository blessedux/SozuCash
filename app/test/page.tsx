'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

export default function TestPage() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]') as HTMLElement;

    if (triggerElement) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "0% 0%",
          end: "100% 0%",
          scrub: 0
        }
      });

      const layers = [
        { layer: "1", yPercent: 70, scale: 1.5 },  // Sky - fastest with zoom
        { layer: "2", yPercent: 55 },  // Far mountains - fast
        { layer: "3", yPercent: 40 },  // Middle mountains - medium
        { layer: "4", yPercent: 40 },  // Logo - same as middle mountains
        { layer: "5", yPercent: 10 }   // Person - slowest
      ];

      layers.forEach((layerObj, idx) => {
        const elements = triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`);
        if (elements.length > 0) {
          const animationProps: any = {
            yPercent: layerObj.yPercent,
            ease: "none"
          };
          
          // Add scale transform for sky layer (layer 1)
          if (layerObj.scale) {
            animationProps.scale = layerObj.scale;
          }
          
          tl.to(
            elements,
            animationProps,
            idx === 0 ? undefined : "<"
          );
        }
      });
    }

    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return () => {
      // Clean up GSAP and ScrollTrigger instances
      ScrollTrigger.getAll().forEach(st => st.kill());
      gsap.killTweensOf(triggerElement);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="parallax test-page" ref={parallaxRef}>
      <section className="parallax__header">
        <div className="parallax__visuals">
          <div data-parallax-layers className="parallax__layers">
            {/* Sky layer - moves fastest */}
            <div 
              data-parallax-layer="1" 
              className="parallax__sky-layer"
            ></div>
            
            {/* Far mountains - moves fast */}
            <img 
              src="https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795be09b462b2e8ebf71_osmo-parallax-layer-3.webp" 
              loading="eager" 
              width="800" 
              data-parallax-layer="2" 
              alt="" 
              className="parallax__layer-img" 
            />
            
            {/* Middle mountains - moves medium */}
            <img 
              src="https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795b4d5ac529e7d3a562_osmo-parallax-layer-2.webp" 
              loading="eager" 
              width="800" 
              data-parallax-layer="3" 
              alt="" 
              className="parallax__layer-img" 
            />
            
            {/* Logo - moves medium-slow */}
            <div data-parallax-layer="4" className="parallax__layer-title">
              <img 
                src="/sozu-logo.png" 
                alt="Sozu Cash" 
                className="parallax__title-img"
                width={300}
                height={112}
              />
            </div>
            
            {/* Person on ground - moves slowest */}
            <img 
              src="https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795bb5aceca85011ad83_osmo-parallax-layer-1.webp" 
              loading="eager" 
              width="800" 
              data-parallax-layer="5" 
              alt="" 
              className="parallax__layer-img" 
            />
          </div>
        </div>
      </section>
      <section className="parallax__content">
        <div className="text-center w-full max-w-6xl mx-auto px-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 160 160" fill="none" className="osmo-icon-svg">
            <path d="M94.8284 53.8578C92.3086 56.3776 88 54.593 88 51.0294V0H72V59.9999C72 66.6273 66.6274 71.9999 60 71.9999H0V87.9999H51.0294C54.5931 87.9999 56.3777 92.3085 53.8579 94.8283L18.3431 130.343L29.6569 141.657L65.1717 106.142C67.684 103.63 71.9745 105.396 72 108.939V160L88.0001 160L88 99.9999C88 93.3725 93.3726 87.9999 100 87.9999H160V71.9999H108.939C105.407 71.9745 103.64 67.7091 106.12 65.1938L106.142 65.1716L141.657 29.6568L130.343 18.3432L94.8284 53.8578Z" fill="currentColor"></path>
          </svg>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-8 mt-8">Free. Permissionless. Instant.</h2>
          <p className="text-lg md:text-xl opacity-80 mb-12 max-w-3xl mx-auto">
            The most competitive, permissionless, and borderless way to trade goods and services — giving everyone the right to transact freely.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-3">One-Tap Payments</h3>
              <p className="text-gray-300">Tap NFC or scan QR to pay instantly. No extra confirmations needed.</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold mb-3">Passkey Security</h3>
              <p className="text-gray-300">Biometric authentication with Face ID or fingerprint. No passwords required.</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-3">Instant Settlement</h3>
              <p className="text-gray-300">USDC transactions confirmed in seconds on Mantle Network.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Additional component section */}
      <section className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center w-full">
        <div className="text-center w-full max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Powered by Mantle Network</h2>
          <p className="text-lg md:text-xl opacity-80 mb-12 max-w-3xl mx-auto">
            SozuCash runs on Mantle Network — a next-gen EVM-compatible blockchain delivering ultra-low costs, high scalability, and global reach.
          </p>
          
          <div className="grid md:grid-cols-2 gap-12 mt-16">
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-3">Ultra-Low Costs</h3>
              <p className="text-gray-300">Transaction fees that are a fraction of traditional networks, making micro-payments viable.</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-3">Global Reach</h3>
              <p className="text-gray-300">Accessible to anyone, anywhere with an internet connection and a smartphone.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-black py-16 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <img 
                src="/sozu-logo.png" 
                alt="Sozu Cash" 
                className="h-8 mb-4"
              />
              <p className="text-gray-400 mb-4">
                The most competitive, permissionless, and borderless way to trade goods and services.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">GitHub</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Discord</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 SozuCash. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
