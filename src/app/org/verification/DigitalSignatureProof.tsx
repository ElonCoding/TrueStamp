import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, ShieldCheck } from 'lucide-react';

interface ProofData {
  contractAddress: string;
  tokenId: string;
  signatureHash: string;
  blockNumber: number;
  timestamp: string;
}

export default function DigitalSignatureProof({ proof }: { proof: ProofData }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-white/10 rounded-xl bg-black/40 overflow-hidden">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors focus:outline-none"
      >
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-electric-blue" />
          <span className="font-semibold text-white">Cryptographic Proof Data</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4 text-xs font-mono text-gray-300 border-t border-white/5">
              
              <div className="flex flex-col space-y-1">
                <span className="text-gray-500 font-sans font-medium text-[10px] uppercase tracking-wider">Contract Address</span>
                <span className="text-electric-blue break-all">{proof.contractAddress}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-gray-500 font-sans font-medium text-[10px] uppercase tracking-wider">Token ID</span>
                  <span>{proof.tokenId}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-gray-500 font-sans font-medium text-[10px] uppercase tracking-wider">Block Number</span>
                  <span>{proof.blockNumber}</span>
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-gray-500 font-sans font-medium text-[10px] uppercase tracking-wider">Signature Hash</span>
                <span className="break-all text-neon-purple">{proof.signatureHash}</span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-gray-500 font-sans font-medium text-[10px] uppercase tracking-wider">Timestamp</span>
                <span>{proof.timestamp}</span>
              </div>

              <div className="pt-2">
                <a 
                  href={`https://amoy.polygonscan.com/token/${proof.contractAddress}?a=${proof.tokenId}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-sans font-semibold text-sm transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on PolygonScan
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
