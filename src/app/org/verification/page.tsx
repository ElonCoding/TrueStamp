"use client";

import React, { useState } from 'react';
import QuickScanArea from './QuickScanArea';
import VerificationResultModal, { VerificationData } from './VerificationResultModal';
import { ShieldCheck } from 'lucide-react';

export default function VerificationPage() {
  const [modalData, setModalData] = useState<VerificationData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mockVerifyCredential = (id: string) => {
    // Simulate API call and logic
    
    // Determine status randomly or based on specific ID for mock purposes
    let status: 'Valid' | 'Invalid' | 'Revoked' = 'Valid';
    if (id.includes('invalid')) status = 'Invalid';
    else if (id.includes('revoke')) status = 'Revoked';
    
    const mockData: VerificationData = {
      id: id,
      status: status,
      holderName: 'Jane Doe',
      issueDate: '2026-01-15',
      issuingOrg: 'Global Tech University',
      credentialType: 'Degree Certificate',
      proof: status === 'Valid' ? {
        contractAddress: '0x1234567890123456789012345678901234567890',
        tokenId: id.replace(/\D/g, '') || '9999',
        signatureHash: '0x9b3a2a4b8f...e1c9d8a7b6c5',
        blockNumber: 45678912,
        timestamp: new Date().toISOString()
      } : undefined
    };

    setModalData(mockData);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 relative">
      {/* Background Effect */}
      <div className="absolute inset-0 z-[-1] bg-neon-purple/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-magenta">
          Verification Portal
        </h1>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple to-magenta p-[1px] mb-6 shadow-lg">
            <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-neon-purple" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Secure Credential Verification</h2>
          <p className="text-gray-400 text-lg">
            Scan a QR code or manually enter a credential ID to verify its authenticity on the blockchain.
          </p>
        </div>

        <QuickScanArea onVerify={mockVerifyCredential} />
      </div>

      <VerificationResultModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={modalData} 
      />
    </div>
  );
}
