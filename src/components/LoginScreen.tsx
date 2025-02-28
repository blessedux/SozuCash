import React from 'react';

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="login-container h-full flex flex-col items-center justify-center p-6">
      <div className="brand-section mb-12">
        <img 
          src="/assets/sozu-logo.png" 
          alt="Sozu Cash" 
          className="brand-logo w-40"
        />
      </div>
      <button 
        onClick={onLogin}
        className="twitter-login flex items-center gap-3 bg-black/60 text-white px-6 py-4 rounded-xl border border-white/10 backdrop-blur-lg transition-all hover:bg-black/80 hover:-translate-y-0.5"
      >
        <span>Connect with X</span>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </button>
    </div>
  );
} 