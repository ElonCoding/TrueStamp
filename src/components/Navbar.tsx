import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Moon, Sun, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 top-0 start-0 border-b border-white/5 bg-background/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between p-4 lg:py-6">
        <a href="#" className="flex items-center space-x-2 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-electric-blue to-neon-purple p-[1px]">
            <div className="flex items-center justify-center w-full h-full bg-background rounded-xl">
              <Shield className="w-5 h-5 text-electric-blue group-hover:text-neon-purple transition-colors" />
            </div>
          </div>
          <span className="self-center text-2xl font-bold whitespace-nowrap text-white text-glow">Truestamp</span>
        </a>
        
        <div className="flex md:order-2 space-x-3 md:space-x-4">
          <button className="hidden md:flex items-center justify-center p-2 rounded-full border border-white/10 hover:border-white/30 transition-all text-gray-300 hover:text-white">
            <Moon className="w-5 h-5" />
          </button>
          
          <button className="hidden lg:block text-sm font-semibold text-gray-300 hover:text-white px-4 py-2 transition-colors">
            Join as Verifier
          </button>
          
          <button className="glow-border relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white transition-all bg-background rounded-full overflow-hidden group">
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-electric-blue"></span>
            <span className="relative">Connect Wallet</span>
          </button>
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        
        <div className={`${isOpen ? 'block' : 'hidden'} items-center justify-between w-full md:flex md:w-auto md:order-1 mt-4 md:mt-0`}>
          <ul className="flex flex-col p-4 md:p-0 font-medium border border-white/10 rounded-2xl md:flex-row md:space-x-8 md:border-0 bg-white/5 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none">
            <li>
              <a href="#" className="block py-2 px-3 text-electric-blue rounded md:bg-transparent md:p-0" aria-current="page">Home</a>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 text-gray-300 rounded hover:bg-white/5 md:hover:bg-transparent md:hover:text-white md:p-0 transition-colors">Docs</a>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 text-gray-300 rounded hover:bg-white/5 md:hover:bg-transparent md:hover:text-white md:p-0 transition-colors">About</a>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 text-gray-300 rounded hover:bg-white/5 md:hover:bg-transparent md:hover:text-white md:p-0 transition-colors">FAQs</a>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 text-gray-300 rounded hover:bg-white/5 md:hover:bg-transparent md:hover:text-white md:p-0 transition-colors">Contact</a>
            </li>
            <li className="md:hidden mt-4">
               <button className="w-full glow-border relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white transition-all bg-background rounded-full">
                  Join as Organization
               </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
