import React from 'react';

export function WalletDashboard() {
  return (
    <div className="dashboard-container fixed inset-0 p-6 z-10 bg-gradient-to-br from-purple-600/20 to-blue-600/20">
      <div className="glass-panel relative z-20 h-full rounded-3xl border border-white/10 backdrop-blur-xl bg-white/5 p-8">
        <div className="balance-section text-center p-6 rounded-2xl border border-white/5 bg-white/5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/60">Total Balance</span>
            <div className="network-select flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
              <img src="/assets/mnt-logo.png" alt="MNT" className="w-5 h-5 rounded-full" />
              <span>MNT</span>
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            1,234.56 MNT
          </h2>
          <span className="text-white/60">≈ $345.67</span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 my-6">
          {/* ... buttons ... */}
        </div>
      </div>
    </div>
  );
} 