import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';
import DigitalSignatureProof from './DigitalSignatureProof';
import RequestAccessButton from './RequestAccessButton';

export interface VerificationData {
  id: string;
  status: 'Valid' | 'Invalid' | 'Revoked';
  holderName: string;
  issueDate: string;
  issuingOrg: string;
  credentialType: string;
  proof?: {
    contractAddress: string;
    tokenId: string;
    signatureHash: string;
    blockNumber: number;
    timestamp: string;
  };
}

interface VerificationResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: VerificationData | null;
}

export default function VerificationResultModal({ isOpen, onClose, data }: VerificationResultModalProps) {
  if (!data) return null;

  const StatusIcon = 
    data.status === 'Valid' ? CheckCircle :
    data.status === 'Revoked' ? AlertTriangle : XCircle;

  const statusColor = 
    data.status === 'Valid' ? 'text-green-400' :
    data.status === 'Revoked' ? 'text-yellow-400' : 'text-red-400';

  const statusBg = 
    data.status === 'Valid' ? 'bg-green-500/10 border-green-500/30' :
    data.status === 'Revoked' ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-red-500/10 border-red-500/30';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-background border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className={`p-6 border-b flex justify-between items-center ${statusBg}`}>
              <div className="flex items-center space-x-3">
                <StatusIcon className={`w-8 h-8 ${statusColor}`} />
                <h2 className="text-2xl font-bold text-white">
                  Credential {data.status}
                </h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-gray-400">Credential ID</p>
                  <p className="font-mono text-electric-blue">{data.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-400">Holder Name</p>
                  <p className="font-semibold text-white">{data.holderName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-400">Issue Date</p>
                  <p className="font-semibold text-white">{data.issueDate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-400">Issuing Org</p>
                  <p className="font-semibold text-white">{data.issuingOrg}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-gray-400">Credential Type</p>
                  <p className="font-semibold text-white">{data.credentialType}</p>
                </div>
              </div>

              {data.status === 'Valid' && data.proof && (
                <DigitalSignatureProof proof={data.proof} />
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-white/5">
              <div className="flex justify-end space-x-4">
                <button 
                  onClick={onClose}
                  className="px-6 py-2 rounded-xl border border-white/10 hover:bg-white/10 transition-colors font-semibold text-white"
                >
                  Close
                </button>
                {data.status === 'Valid' && (
                  <RequestAccessButton credentialId={data.id} />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
