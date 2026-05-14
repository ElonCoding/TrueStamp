import React, { useState } from 'react';
import { Wallet } from 'lucide-react';

export default function ConnectWalletButton({ 
  onConnect 
}: { 
  onConnect?: (address: string) => void 
}) {
  const [connecting, setConnecting] = useState(false);

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      if (onConnect) onConnect('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
    }, 1500);
  };

  return (
    <button 
      onClick={handleConnect}
      disabled={connecting}
      className="glow-border relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all bg-background rounded-full overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-electric-blue"></span>
      <span className="relative flex items-center">
        {connecting ? (
          <>
            <Wallet className="w-5 h-5 mr-2 animate-pulse" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="w-5 h-5 mr-2 group-hover:text-electric-blue transition-colors" />
            Connect Web3 Wallet
          </>
        )}
      </span>
    </button>
  );
}
