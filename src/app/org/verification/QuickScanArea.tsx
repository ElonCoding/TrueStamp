import React, { useState } from 'react';
import { QrCode, Search, ScanLine } from 'lucide-react';

interface QuickScanAreaProps {
  onVerify: (id: string) => void;
}

export default function QuickScanArea({ onVerify }: QuickScanAreaProps) {
  const [credentialId, setCredentialId] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentialId.trim()) {
      onVerify(credentialId.trim());
    }
  };

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      onVerify('mock-qr-token-1005');
    }, 2000);
  };

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl glassmorphism glow-border">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <ScanLine className="w-6 h-6 mr-2 text-electric-blue" />
        Quick Scan & Verify
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* QR Scanner Area */}
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-500 rounded-2xl relative overflow-hidden bg-black/20">
          {scanning ? (
            <div className="relative flex flex-col items-center">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-1 bg-electric-blue shadow-[0_0_15px_#00f0ff] animate-[scan_2s_ease-in-out_infinite]"></div>
              <QrCode className="w-32 h-32 text-gray-500 opacity-50 mb-4" />
              <p className="text-electric-blue font-semibold animate-pulse">Scanning QR Code...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <QrCode className="w-32 h-32 text-gray-400 mb-4" />
              <button 
                onClick={simulateScan}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-semibold transition-colors"
              >
                Click to Start Camera Scan
              </button>
            </div>
          )}
          
          <style>{`
            @keyframes scan {
              0% { top: 10%; }
              50% { top: 90%; }
              100% { top: 10%; }
            }
          `}</style>
        </div>

        {/* Manual Input Area */}
        <div className="flex flex-col justify-center space-y-4">
          <h3 className="text-lg font-semibold text-gray-300">Or enter Credential ID manually</h3>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-electric-blue focus:border-electric-blue sm:text-sm transition-colors"
                placeholder="e.g. 0xabcdef123..."
              />
            </div>
            <button
              type="submit"
              disabled={!credentialId.trim()}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-electric-blue to-neon-purple hover:from-electric-blue/80 hover:to-neon-purple/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Verify Credential
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
