"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CategoryGrid from './CategoryGrid';
import PrivacyControl from './PrivacyControl';
import NomineeSettings from './NomineeSettings';
import ActivityLedger from './ActivityLedger';
import ConnectWalletButton from '@/components/ConnectWalletButton';

const mockCredentials = [
  { id: '0xabc...123', name: 'BSc Computer Science', issuer: 'Global Tech University', category: 'Education' },
  { id: '0xdef...456', name: 'MSc Data Science', issuer: 'Global Tech University', category: 'Education' },
  { id: '0x123...abc', name: 'KYC Verification', issuer: 'DeFi Bank', category: 'Identity' },
  { id: '0x789...xyz', name: 'AWS Certified', issuer: 'Amazon Web Services', category: 'Professional' },
];

export default function UserDashboard() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredCredentials = activeCategory 
    ? mockCredentials.filter(c => c.category === activeCategory)
    : mockCredentials;

  if (!walletConnected) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 z-[-1] bg-electric-blue/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>
        
        <div className="text-center max-w-md space-y-6">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-neon-purple">
            User Dashboard
          </h1>
          <p className="text-gray-400">
            Connect your Web3 wallet to manage your decentralized credentials, control privacy settings, and view your activity ledger.
          </p>
          <div className="pt-4">
            <ConnectWalletButton onConnect={() => setWalletConnected(true)} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="border-b border-white/10 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white text-glow">My Credentials</h1>
          <div className="flex items-center space-x-2 text-sm font-mono text-electric-blue bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span>0x742d...f44e</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-300">Categories</h2>
          </div>
          <CategoryGrid 
            activeCategory={activeCategory} 
            onSelectCategory={setActiveCategory} 
          />
        </section>

        <section>
          <PrivacyControl credentials={filteredCredentials} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ActivityLedger />
          </div>
          <div className="lg:col-span-1">
            <NomineeSettings />
          </div>
        </section>
      </main>
    </div>
  );
}
