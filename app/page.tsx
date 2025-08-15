'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LavaLampBackground from '@/components/LavaLampBackground'

export default function LandingPage() {
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const section = Math.round(scrollPosition / windowHeight)
      setCurrentSection(section)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Add landing-page class to body to prevent white background
  useEffect(() => {
    document.body.classList.add('landing-page');
    return () => {
      document.body.classList.remove('landing-page');
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-y-scroll snap-y snap-mandatory landing-page" style={{ isolation: 'isolate' }}>
      {/* Lava Lamp Background - Fixed for parallax */}
      <LavaLampBackground />
      
      {/* Content Overlay - Positioned to overlap the background */}
      <div className="relative z-30 w-full">
        {/* Hero Section - First Viewport */}
        <div className="h-screen flex items-center justify-center snap-start">
          <div className={`text-center max-w-4xl mx-auto px-6 transition-opacity duration-1000 ${currentSection === 0 ? 'opacity-100' : 'opacity-0'}`}>
            {/* SOZU Logo */}
            <div className="mb-8">
              <img
                src="/sozu-logo.svg"
                alt="Sozu Cash"
                width={300}
                height={112}
                className="filter brightness-0 invert"
              />
            </div>

            {/* Hero Text */}
            <h1 
              className="text-4xl md:text-6xl font-bold mb-6 text-white"
            >
              The Real Digital Cash
            </h1>
            
            <p 
              className="text-xl md:text-2xl mb-8 text-white/90"
            >
              1-tap to pay in USDC on Mantle. Permissionless. Anonymous. Instant settlement.
            </p>

            {/* CTA Button */}
            <button
              onClick={() => router.push('/locked-screen')}
              className="bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-4 px-8 rounded-2xl text-lg shadow-2xl hover:shadow-white/10 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Get Your Free Wallet — No Banks. No Borders.
            </button>
          </div>
        </div>

        {/* It's your money, evolved - Second Viewport */}
        <div className="h-screen flex items-center justify-center snap-start">
          <div className={`max-w-4xl mx-auto px-6 transition-opacity duration-1000 ${currentSection === 1 ? 'opacity-100' : 'opacity-0'}`}>
            <h2 
              className="text-3xl md:text-4xl font-bold mb-8 text-center text-white"
            >
              It's your money, evolved
            </h2>
            
            <p 
              className="text-lg md:text-xl mb-8 text-white/80 text-center"
            >
              SozuCash is your DeFi-powered, instant-settlement payment app.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-3">Runs on Mantle Network</h3>
                <p className="text-gray-300">Fast, low-cost, and secure</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-xl font-semibold mb-3">Works Anywhere</h3>
                <p className="text-gray-300">NFC or QR accepted worldwide</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">🔓</div>
                <h3 className="text-xl font-semibold mb-3">No Permission</h3>
                <p className="text-gray-300">No banks, no borders, no limits</p>
              </div>
            </div>
          </div>
        </div>

        {/* Works right from your phone - Third Viewport */}
        <div className="h-screen flex items-center justify-center snap-start">
          <div className={`max-w-4xl mx-auto px-6 transition-opacity duration-1000 ${currentSection === 2 ? 'opacity-100' : 'opacity-0'}`}>
            <h2 
              className="text-3xl md:text-4xl font-bold mb-8 text-center text-white"
            >
              Works right from your phone
            </h2>
            
            <p 
              className="text-lg md:text-xl mb-8 text-white/80 text-center"
            >
              Download the app and you're set — your SozuCash wallet is ready in seconds.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-semibold mb-3">Pay with NFC or QR</h3>
                <p className="text-gray-300">Tap or scan to pay instantly</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-3">Fund with USDC</h3>
                <p className="text-gray-300">On Mantle Network</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">🔑</div>
                <h3 className="text-xl font-semibold mb-3">Full Control</h3>
                <p className="text-gray-300">Keep your keys, own your money</p>
              </div>
            </div>
          </div>
        </div>

        {/* Send it, receive it, settle instantly - Fourth Viewport */}
        <div className="h-screen flex items-center justify-center snap-start">
          <div className={`max-w-4xl mx-auto px-6 transition-opacity duration-1000 ${currentSection === 3 ? 'opacity-100' : 'opacity-0'}`}>
            <h2 
              className="text-3xl md:text-4xl font-bold mb-8 text-center"
              style={{
                mixBlendMode: 'difference',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Helvetica', sans-serif",
                fontWeight: 600
              }}
            >
              Send it, receive it, settle instantly
            </h2>
            
            <p 
              className="text-lg md:text-xl mb-8 text-white/80 text-center"
              style={{
                mixBlendMode: 'difference',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Helvetica', sans-serif",
                fontWeight: 400
              }}
            >
              Send or collect USDC instantly with a tap or a scan.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-4xl mb-4">👤</div>
                <h3 className="text-xl font-semibold mb-3">No Usernames</h3>
                <p className="text-gray-300">No middlemen, direct payments</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-3">Instant Settlement</h3>
                <p className="text-gray-300">Payments land in seconds</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold mb-3">Always Final</h3>
                <p className="text-gray-300">No reversals, instant settlement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Spend anywhere — and earn while you grow the network - Fifth Viewport */}
        <div className="h-screen flex items-center justify-center snap-start">
          <div className={`max-w-4xl mx-auto px-6 transition-opacity duration-1000 ${currentSection === 4 ? 'opacity-100' : 'opacity-0'}`}>
            <h2 
              className="text-3xl md:text-4xl font-bold mb-8 text-center"
              style={{
                mixBlendMode: 'difference',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Helvetica', sans-serif",
                fontWeight: 600
              }}
            >
              Spend anywhere — and earn while you grow the network
            </h2>
            
            <p 
              className="text-lg md:text-xl mb-8 text-white/80 text-center"
              style={{
                mixBlendMode: 'difference',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Helvetica', sans-serif",
                fontWeight: 400
              }}
            >
              SozuCash works anywhere in the world, with anyone who has an EVM wallet or the SozuCash app installed.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-xl font-semibold mb-3">Global Payments</h3>
                <p className="text-gray-300">No banks, no borders</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold mb-3">Peer-to-Peer</h3>
                <p className="text-gray-300">Direct merchant payments</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">🎁</div>
                <h3 className="text-xl font-semibold mb-3">Earn Rewards</h3>
                <p className="text-gray-300">Get paid for referrals</p>
              </div>
            </div>
          </div>
        </div>

        {/* MI5 — Your yield engine - Sixth Viewport */}
        <div className="h-screen flex items-center justify-center snap-start">
          <div className={`max-w-4xl mx-auto px-6 transition-opacity duration-1000 ${currentSection === 5 ? 'opacity-100' : 'opacity-0'}`}>
            <h2 
              className="text-3xl md:text-4xl font-bold mb-8 text-center"
              style={{
                mixBlendMode: 'difference',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Helvetica', sans-serif",
                fontWeight: 600
              }}
            >
              MI5 — Your yield engine
            </h2>
            
            <p 
              className="text-lg md:text-xl mb-8 text-white/80 text-center"
              style={{
                mixBlendMode: 'difference',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Helvetica', sans-serif",
                fontWeight: 400
              }}
            >
              While you're spending, MI5 is working.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="text-center">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-semibold mb-3">Smart DeFi Protocol</h3>
                <p className="text-gray-300">Allocates wrapped ETH, BTC, and stablecoins for optimized returns</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">💸</div>
                <h3 className="text-xl font-semibold mb-3">Ecosystem Funding</h3>
                <p className="text-gray-300">Earnings flow back to fund cashback and incentives</p>
              </div>
            </div>
          </div>
        </div>

        {/* 10% Instant Cashback - Seventh Viewport */}
        <div className="h-screen flex items-center justify-center snap-start">
          <div className={`max-w-4xl mx-auto px-6 transition-opacity duration-1000 ${currentSection === 6 ? 'opacity-100' : 'opacity-0'}`}>
            <h2 
              className="text-3xl md:text-4xl font-bold mb-8 text-center"
              style={{
                mixBlendMode: 'difference',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Helvetica', sans-serif",
                fontWeight: 600
              }}
            >
              10% Instant Cashback
            </h2>
            
            <p 
              className="text-lg md:text-xl mb-8 text-white/80 text-center"
              style={{
                mixBlendMode: 'difference',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Helvetica', sans-serif",
                fontWeight: 400
              }}
            >
              Every payment you make gets 10% back — instantly.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-3">Funded by MI5</h3>
                <p className="text-gray-300">Yield and ecosystem incentives</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-3">No Waiting</h3>
                <p className="text-gray-300">Instant cashback on every payment</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-xl font-semibold mb-3">No Fine Print</h3>
                <p className="text-gray-300">No categories, no restrictions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Passkeys Security - Eighth Viewport */}
        <div className="h-screen flex items-center justify-center snap-start">
          <div className={`max-w-4xl mx-auto px-6 transition-opacity duration-1000 ${currentSection === 7 ? 'opacity-100' : 'opacity-0'}`}>
            <h2 
              className="text-3xl md:text-4xl font-bold mb-8 text-center"
              style={{
                mixBlendMode: 'difference',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Helvetica', sans-serif",
                fontWeight: 600
              }}
            >
              Passkeys Security
            </h2>
            
            <p 
              className="text-lg md:text-xl mb-8 text-white/80 text-center"
              style={{
                mixBlendMode: 'difference',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Helvetica', sans-serif",
                fontWeight: 400
              }}
            >
              Your wallet is protected by the same level of security you expect from modern devices.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-4xl mb-4">👁️</div>
                <h3 className="text-xl font-semibold mb-3">Face ID & Touch ID</h3>
                <p className="text-gray-300">Biometric authentication</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">🔐</div>
                <h3 className="text-xl font-semibold mb-3">Device-Level Security</h3>
                <p className="text-gray-300">Modern device protection</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">🔑</div>
                <h3 className="text-xl font-semibold mb-3">Non-Custodial</h3>
                <p className="text-gray-300">Only you control your keys</p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy First - Ninth Viewport */}
        <div className="h-screen flex items-center justify-center snap-start">
          <div className={`max-w-4xl mx-auto px-6 transition-opacity duration-1000 ${currentSection === 8 ? 'opacity-100' : 'opacity-0'}`}>
            <h2 
              className="text-3xl md:text-4xl font-bold mb-8 text-center"
              style={{
                mixBlendMode: 'difference',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Helvetica', sans-serif",
                fontWeight: 600
              }}
            >
              Privacy First
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold mb-3">Permissionless</h3>
                <p className="text-gray-300">Anonymous and private</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">👤</div>
                <h3 className="text-xl font-semibold mb-3">Pseudonymous</h3>
                <p className="text-gray-300">On-chain payments in USDC</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">🚫</div>
                <h3 className="text-xl font-semibold mb-3">No Tracking</h3>
                <p className="text-gray-300">No transaction tracking, no data sales</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA - Tenth Viewport */}
        <div className="h-screen flex items-center justify-center snap-start">
          <div className={`max-w-4xl mx-auto px-6 text-center transition-opacity duration-1000 ${currentSection === 9 ? 'opacity-100' : 'opacity-0'}`}>
            <h2 
              className="text-3xl md:text-5xl font-bold mb-8"
              style={{
                mixBlendMode: 'difference',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Helvetica', sans-serif",
                fontWeight: 600
              }}
            >
              SozuCash — Cash, without compromise.
            </h2>
            
            <p 
              className="text-xl md:text-2xl mb-8 text-white/80"
              style={{
                mixBlendMode: 'difference',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Helvetica', sans-serif",
                fontWeight: 400
              }}
            >
              Instant. Borderless. Yours.
            </p>

            <button
              onClick={() => router.push('/locked-screen')}
              className="bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-4 px-8 rounded-2xl text-lg shadow-2xl hover:shadow-white/10 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
