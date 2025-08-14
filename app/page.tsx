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

  return (
    <div className="relative w-full h-screen overflow-y-scroll snap-y snap-mandatory" style={{ isolation: 'isolate' }}>
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
                style={{
                  mixBlendMode: 'difference',
                  color: '#ffffff',
                  WebkitTextFillColor: '#ffffff',
                  textShadow: 'none',
                  fontFamily: "'Helvetica', sans-serif",
                  fontWeight: 600
                }}
              />
            </div>

            {/* Hero Text */}
            <h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              style={{
                mixBlendMode: 'difference',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Helvetica', sans-serif",
                fontWeight: 600
              }}
            >
              Free. Permissionless. Instant.
            </h1>
            
            <p 
              className="text-xl md:text-2xl mb-8 text-white/90"
              style={{
                mixBlendMode: 'difference',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Helvetica', sans-serif",
                fontWeight: 400
              }}
            >
              No banks. No borders. No fees.
            </p>

            {/* CTA Button */}
            <button
              onClick={() => router.push('/app')}
              className="bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-4 px-8 rounded-2xl text-lg shadow-2xl hover:shadow-white/10 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              🚀 Open App
            </button>
          </div>
        </div>

        {/* Why SozuCash Section - Second Viewport */}
        <div className="h-screen flex items-center justify-center snap-start">
          <div className={`max-w-4xl mx-auto px-6 transition-opacity duration-1000 ${currentSection === 1 ? 'opacity-100' : 'opacity-0'}`}>
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
              Why SozuCash?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: 'Free Forever', desc: 'No transaction fees, no maintenance costs.' },
                { title: 'Permissionless Access', desc: 'Anyone can open an account instantly.' },
                { title: 'Instant Final Settlement', desc: 'Transactions are confirmed in seconds.' },
                { title: 'Anonymous by Design', desc: 'Your funds, your privacy, your control.' },
                { title: 'On-Chain Yield', desc: 'Earn from your deposits while you spend.' }
              ].map((feature, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                  <h3 
                    className="text-xl font-semibold mb-2"
                    style={{
                      mixBlendMode: 'difference',
                      color: '#ffffff',
                      WebkitTextFillColor: '#ffffff',
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                      fontFamily: "'Helvetica', sans-serif",
                      fontWeight: 600
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p 
                    className="text-white/80"
                    style={{
                      mixBlendMode: 'difference',
                      color: '#ffffff',
                      WebkitTextFillColor: '#ffffff',
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                      fontFamily: "'Helvetica', sans-serif",
                      fontWeight: 400
                    }}
                  >
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Powered by Mantle Section - Third Viewport */}
        <div className="h-screen flex items-center justify-center snap-start">
          <div className={`max-w-4xl mx-auto px-6 text-center transition-opacity duration-1000 ${currentSection === 2 ? 'opacity-100' : 'opacity-0'}`}>
            <h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{
                mixBlendMode: 'difference',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Helvetica', sans-serif",
                fontWeight: 600
              }}
            >
              Powered by Mantle Network
            </h2>
            
            <p 
              className="text-xl mb-8 text-white/90"
              style={{
                mixBlendMode: 'difference',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Helvetica', sans-serif",
                fontWeight: 400
              }}
            >
              SozuCash runs on Mantle Network — a next-gen EVM-compatible blockchain delivering:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                'Ultra-low costs',
                'High scalability', 
                'Global reach'
              ].map((feature, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                  <p 
                    className="text-lg font-semibold"
                    style={{
                      mixBlendMode: 'difference',
                      color: '#ffffff',
                      WebkitTextFillColor: '#ffffff',
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                      fontFamily: "'Helvetica', sans-serif",
                      fontWeight: 600
                    }}
                  >
                    {feature}
                  </p>
                </div>
              ))}
            </div>
            
            <p 
              className="text-lg text-white/80"
              style={{
                mixBlendMode: 'difference',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Helvetica', sans-serif",
                fontWeight: 400
              }}
            >
              By leveraging Mantle, we bring USDC (digital dollars) to anyone, anywhere — with the speed and smoothness of Google Pay, but fully self-custodial and trustless.
            </p>
          </div>
        </div>

        {/* How It Works Section - Fourth Viewport */}
        <div className="h-screen flex items-center justify-center snap-start">
          <div className={`max-w-4xl mx-auto px-6 text-center transition-opacity duration-1000 ${currentSection === 3 ? 'opacity-100' : 'opacity-0'}`}>
            <h2 
              className="text-3xl md:text-4xl font-bold mb-8"
              style={{
                mixBlendMode: 'difference',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Helvetica', sans-serif",
                fontWeight: 600
              }}
            >
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '1', title: 'Open the app', desc: 'instantly get your free EVM wallet.' },
                { step: '2', title: 'Start transacting', desc: 'send and receive USDC in seconds.' },
                { step: '3', title: 'Earn while you hold', desc: 'your balance generates yield automatically.' }
              ].map((item, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8">
                  <div 
                    className="text-4xl font-bold mb-4"
                    style={{
                      mixBlendMode: 'difference',
                      color: '#ffffff',
                      WebkitTextFillColor: '#ffffff',
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                      fontFamily: "'Helvetica', sans-serif",
                      fontWeight: 600
                    }}
                  >
                    {item.step}
                  </div>
                  <h3 
                    className="text-xl font-semibold mb-2"
                    style={{
                      mixBlendMode: 'difference',
                      color: '#ffffff',
                      WebkitTextFillColor: '#ffffff',
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                      fontFamily: "'Helvetica', sans-serif",
                      fontWeight: 600
                    }}
                  >
                    {item.title}
                  </h3>
                  <p 
                    className="text-white/80"
                    style={{
                      mixBlendMode: 'difference',
                      color: '#ffffff',
                      WebkitTextFillColor: '#ffffff',
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                      fontFamily: "'Helvetica', sans-serif",
                      fontWeight: 400
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Future of Money Section - Fifth Viewport */}
        <div className="h-screen flex items-center justify-center snap-start">
          <div className={`max-w-4xl mx-auto px-6 text-center transition-opacity duration-1000 ${currentSection === 4 ? 'opacity-100' : 'opacity-0'}`}>
            <h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{
                mixBlendMode: 'difference',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Helvetica', sans-serif",
                fontWeight: 600
              }}
            >
              The Future of Money is Here
            </h2>
            
            <p 
              className="text-xl text-white/90 mb-8"
              style={{
                mixBlendMode: 'difference',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Helvetica', sans-serif",
                fontWeight: 400
              }}
            >
              SozuCash is the most competitive, permissionless, and borderless way to trade goods and services — giving everyone the right to transact freely.
            </p>

            <button
              onClick={() => router.push('/app')}
              className="bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-4 px-8 rounded-2xl text-lg shadow-2xl hover:shadow-white/10 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              🚀 Launch SozuCash App
            </button>
          </div>
        </div>

        {/* Contact & Links Section - Sixth Viewport */}
        <div className="h-screen flex items-center justify-center snap-start">
          <div className={`max-w-4xl mx-auto px-6 text-center transition-opacity duration-1000 ${currentSection === 5 ? 'opacity-100' : 'opacity-0'}`}>
            <h2 
              className="text-3xl md:text-4xl font-bold mb-8"
              style={{
                mixBlendMode: 'difference',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Helvetica', sans-serif",
                fontWeight: 600
              }}
            >
              Contact & Links
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: '📩', label: 'Email', link: 'hello@sozu.cash', href: 'mailto:hello@sozu.cash' },
                { icon: '💻', label: 'GitHub', link: 'github.com/sozu-cash', href: 'https://github.com/sozu-cash' },
                { icon: '🐦', label: 'Twitter/X', link: '@SozuCash', href: 'https://twitter.com/SozuCash' }
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <div 
                    className="text-3xl mb-2"
                    style={{
                      mixBlendMode: 'difference',
                      color: '#ffffff',
                      WebkitTextFillColor: '#ffffff',
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                      fontFamily: "'Helvetica', sans-serif",
                      fontWeight: 600
                    }}
                  >
                    {item.icon}
                  </div>
                  <h3 
                    className="text-lg font-semibold mb-1"
                    style={{
                      mixBlendMode: 'difference',
                      color: '#ffffff',
                      WebkitTextFillColor: '#ffffff',
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                      fontFamily: "'Helvetica', sans-serif",
                      fontWeight: 600
                    }}
                  >
                    {item.label}
                  </h3>
                  <p 
                    className="text-white/80"
                    style={{
                      mixBlendMode: 'difference',
                      color: '#ffffff',
                      WebkitTextFillColor: '#ffffff',
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                      fontFamily: "'Helvetica', sans-serif",
                      fontWeight: 400
                    }}
                  >
                    {item.link}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
