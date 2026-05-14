import React from 'react';
import { Shield, MessageSquare, Globe, Mail, Disc } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-background pt-24 pb-12 border-t border-white/10 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-electric-blue to-transparent shadow-[0_0_20px_rgba(0,240,255,0.8)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <a href="#" className="flex items-center space-x-2 group mb-6">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-electric-blue to-neon-purple p-[1px]">
                <div className="flex items-center justify-center w-full h-full bg-background rounded-xl">
                  <Shield className="w-5 h-5 text-electric-blue" />
                </div>
              </div>
              <span className="text-2xl font-bold text-white">Truestamp</span>
            </a>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              The premier Web3 platform for decentralized trust, verification, and digital asset security.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-electric-blue transition-colors">
                <MessageSquare className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-electric-blue transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-electric-blue transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-electric-blue transition-colors">
                <Disc className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Platform</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-electric-blue transition-colors text-sm">Issuers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-electric-blue transition-colors text-sm">Verifiers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-electric-blue transition-colors text-sm">Smart Contracts</a></li>
              <li><a href="#" className="text-gray-400 hover:text-electric-blue transition-colors text-sm">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Resources</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-neon-purple transition-colors text-sm">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-neon-purple transition-colors text-sm">API Reference</a></li>
              <li><a href="#" className="text-gray-400 hover:text-neon-purple transition-colors text-sm">Whitepaper</a></li>
              <li><a href="#" className="text-gray-400 hover:text-neon-purple transition-colors text-sm">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Subscribe</h4>
            <p className="text-gray-400 text-sm mb-4">Get the latest updates on Web3 verification.</p>
            <form className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
              />
              <button className="bg-gradient-to-r from-electric-blue to-neon-purple hover:from-electric-blue/80 hover:to-neon-purple/80 text-white font-bold py-3 px-4 rounded-lg text-sm transition-colors">
                Subscribe
              </button>
            </form>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs mb-4 md:mb-0">
            © 2026 Truestamp. All rights reserved. Built for the decentralized web.
          </p>
          <div className="flex space-x-6 text-xs text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
