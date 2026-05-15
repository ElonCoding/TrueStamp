import React, { useState } from 'react';
import { Loader2, Key, Check, AlertCircle } from 'lucide-react';

interface RequestAccessButtonProps {
  credentialId: string;
}

export default function RequestAccessButton({ credentialId }: RequestAccessButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const requestAccess = () => {
    void credentialId;
    setStatus('loading');
    
    // Mock wallet signature request
    setTimeout(() => {
      // Simulate success 80% of the time
      if (Math.random() > 0.2) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    }, 2500);
  };

  if (status === 'success') {
    return (
      <button 
        disabled
        className="px-6 py-2 rounded-xl bg-green-500/20 text-green-400 font-semibold border border-green-500/30 flex items-center"
      >
        <Check className="w-4 h-4 mr-2" />
        Access Granted
      </button>
    );
  }

  if (status === 'error') {
    return (
      <button 
        onClick={() => setStatus('idle')}
        className="px-6 py-2 rounded-xl bg-red-500/20 text-red-400 font-semibold border border-red-500/30 flex items-center hover:bg-red-500/30 transition-colors"
      >
        <AlertCircle className="w-4 h-4 mr-2" />
        Signature Failed - Retry
      </button>
    );
  }

  return (
    <button 
      onClick={requestAccess}
      disabled={status === 'loading'}
      className="glow-border relative inline-flex items-center justify-center px-6 py-2 bg-gradient-to-r from-electric-blue to-neon-purple hover:from-electric-blue/90 hover:to-neon-purple/90 text-white font-semibold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
    >
      {status === 'loading' ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Awaiting Wallet Signature...
        </>
      ) : (
        <>
          <Key className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          Request Full Access
        </>
      )}
    </button>
  );
}
