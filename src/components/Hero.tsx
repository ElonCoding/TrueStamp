import React from 'react';
import { motion } from 'framer-motion';
import BlockchainCube from './BlockchainCube';
import { ArrowRight, ShieldCheck, Building2 } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-electric-blue rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-neon-purple rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-center text-center lg:text-left"
          >
            <div className="inline-flex items-center justify-center lg:justify-start space-x-2 mb-6">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-electric-blue uppercase tracking-wider backdrop-blur-sm flex items-center">
                <span className="w-2 h-2 rounded-full bg-electric-blue animate-pulse mr-2"></span>
                Web3 Powered Verification
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              The Future of <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-neon-purple to-magenta">
                Decentralized Trust
              </span>
              <br className="hidden sm:block" /> & Verification
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0">
              Empower your organization with immutable, high-speed, and secure document verification powered by cutting-edge blockchain technology.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="glow-border w-full sm:w-auto relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all bg-gradient-to-r from-electric-blue/20 to-neon-purple/20 hover:from-electric-blue/40 hover:to-neon-purple/40 rounded-full group">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all bg-white/5 border border-white/10 hover:bg-white/10 rounded-full backdrop-blur-md">
                <Building2 className="w-5 h-5 mr-2 text-gray-300" />
                Join as Issuer
              </button>
              
              <button className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all bg-white/5 border border-white/10 hover:bg-white/10 rounded-full backdrop-blur-md">
                <ShieldCheck className="w-5 h-5 mr-2 text-gray-300" />
                Join as Verifier
              </button>
            </div>
          </motion.div>
          
          {/* Right 3D Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[500px] lg:h-[600px] flex items-center justify-center"
          >
            {/* Holographic Platform */}
            <div className="absolute bottom-10 w-3/4 h-24 bg-electric-blue/20 rounded-full blur-2xl transform rotate-x-60"></div>
            <div className="absolute bottom-16 w-1/2 h-1 bg-gradient-to-r from-transparent via-neon-purple to-transparent blur-sm"></div>
            
            <BlockchainCube />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
