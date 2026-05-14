"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BulkUpload from './BulkUpload';
import MintingStatus from './MintingStatus';
import InstitutionStats from './InstitutionStats';
import RevocationList from './RevocationList';

export default function IssuerPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'status' | 'revoke'>('upload');

  return (
    <div className="space-y-8 relative">
      {/* Background Effect */}
      <div className="absolute inset-0 z-[-1] bg-electric-blue/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-neon-purple">
          Issuer Dashboard
        </h1>
      </div>

      <InstitutionStats />

      <div className="border-b border-white/10">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('upload')}
            className={`${
              activeTab === 'upload'
                ? 'border-electric-blue text-electric-blue'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Bulk Upload & Mint
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`${
              activeTab === 'status'
                ? 'border-neon-purple text-neon-purple'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Minting Status
          </button>
          <button
            onClick={() => setActiveTab('revoke')}
            className={`${
              activeTab === 'revoke'
                ? 'border-red-400 text-red-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Revocation Management
          </button>
        </nav>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-6"
      >
        {activeTab === 'upload' && <BulkUpload />}
        {activeTab === 'status' && <MintingStatus />}
        {activeTab === 'revoke' && <RevocationList />}
      </motion.div>
    </div>
  );
}
