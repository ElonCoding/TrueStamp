import React, { useState } from 'react';
import { Users, AlertCircle, CheckCircle, PenTool } from 'lucide-react';

export default function NomineeSettings() {
  const [address, setAddress] = useState('');
  const [days, setDays] = useState('90');
  const [status, setStatus] = useState<'idle' | 'signing' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    
    setStatus('signing');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    }, 2000);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl glassmorphism p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-32 bg-neon-purple/10 rounded-full blur-[80px] pointer-events-none mix-blend-screen"></div>
      
      <div className="flex items-center mb-6 relative z-10">
        <Users className="w-6 h-6 text-neon-purple mr-3" />
        <div>
          <h2 className="text-2xl font-bold">Nominee Settings</h2>
          <p className="text-sm text-gray-400 mt-1">Designate a trusted wallet to recover your credentials if you become inactive.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Nominee Wallet Address or ENS</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x... or name.eth"
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple transition-colors"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Inactivity Grace Period (Days)</label>
            <select
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple transition-colors appearance-none"
            >
              <option value="30">30 Days</option>
              <option value="90">90 Days</option>
              <option value="180">180 Days</option>
              <option value="365">1 Year</option>
            </select>
          </div>
        </div>

        <div className="flex items-center p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-sm text-yellow-200">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 text-yellow-400" />
          <p>By signing, you authorize the smart contract to transfer viewing rights to the nominee if your wallet has zero activity for the selected period.</p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            disabled={!address || status === 'signing' || status === 'success'}
            className="glow-border relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-neon-purple to-magenta text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {status === 'signing' ? (
              <>
                <PenTool className="w-4 h-4 mr-2 animate-bounce" />
                Awaiting Signature...
              </>
            ) : status === 'success' ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Nominee Updated
              </>
            ) : (
              'Confirm with Wallet'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
