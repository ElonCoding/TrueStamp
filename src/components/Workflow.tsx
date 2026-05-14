import React from 'react';
import { motion } from 'framer-motion';
import { Play, Database, FileKey, Globe, Link as LinkIcon, ShieldAlert } from 'lucide-react';

const Workflow = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col space-y-8"
          >
            <div>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                Secure. Scalable. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-electric-blue">Decentralized.</span>
              </h2>
              <p className="text-xl text-gray-400">
                Our architecture ensures that once a document is verified and hashed on the blockchain, it becomes completely tamper-proof. Experience the next generation of digital truth.
              </p>
            </div>
            
            <div>
              <button className="glow-border inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white transition-all bg-background rounded-full group hover:bg-white/5">
                <div className="w-8 h-8 rounded-full bg-electric-blue/20 flex items-center justify-center mr-3 group-hover:bg-electric-blue/40 transition-colors">
                  <Play className="w-4 h-4 text-electric-blue fill-electric-blue" />
                </div>
                Watch Video Demo
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[600px] w-full perspective-1000"
          >
            {/* Isometric diagram container */}
            <div className="absolute inset-0 transform rotate-x-60 rotate-z-45 scale-110">
              
              {/* Nodes */}
              <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 group">
                <div className="w-24 h-24 bg-navy-dark/80 backdrop-blur-md border-2 border-neon-purple rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(176,38,255,0.4)] transition-transform group-hover:-translate-y-4">
                  <FileKey className="w-10 h-10 text-neon-purple" />
                </div>
                <p className="text-center mt-4 font-bold text-white tracking-widest text-sm transform -rotate-z-45 -rotate-x-60">ISSUER</p>
              </div>

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group">
                <div className="w-32 h-32 bg-navy-dark/90 backdrop-blur-xl border-4 border-electric-blue rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(0,240,255,0.6)] z-10 transition-transform group-hover:-translate-y-6">
                  <LinkIcon className="w-14 h-14 text-electric-blue" />
                </div>
                <p className="text-center mt-4 font-bold text-white tracking-widest text-sm transform -rotate-z-45 -rotate-x-60">SMART CONTRACT</p>
              </div>

              <div className="absolute top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2 group">
                <div className="w-24 h-24 bg-navy-dark/80 backdrop-blur-md border-2 border-magenta rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,0,255,0.4)] transition-transform group-hover:-translate-y-4">
                  <Database className="w-10 h-10 text-magenta" />
                </div>
                <p className="text-center mt-4 font-bold text-white tracking-widest text-sm transform -rotate-z-45 -rotate-x-60">BLOCKCHAIN</p>
              </div>

              <div className="absolute bottom-1/4 left-1/4 transform -translate-x-1/2 translate-y-1/2 group">
                <div className="w-24 h-24 bg-navy-dark/80 backdrop-blur-md border-2 border-cyan rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-transform group-hover:-translate-y-4">
                  <ShieldAlert className="w-10 h-10 text-cyan" />
                </div>
                <p className="text-center mt-4 font-bold text-white tracking-widest text-sm transform -rotate-z-45 -rotate-x-60">VERIFIER</p>
              </div>

              <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2 group">
                <div className="w-24 h-24 bg-navy-dark/80 backdrop-blur-md border-2 border-white rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-transform group-hover:-translate-y-4">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <p className="text-center mt-4 font-bold text-white tracking-widest text-sm transform -rotate-z-45 -rotate-x-60">GLOBAL ACCESS</p>
              </div>

              {/* Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.8))' }}>
                <line x1="25%" y1="25%" x2="50%" y2="50%" stroke="#00f0ff" strokeWidth="4" strokeDasharray="10 10" className="animate-[dash_20s_linear_infinite]" />
                <line x1="75%" y1="25%" x2="50%" y2="50%" stroke="#ff00ff" strokeWidth="4" strokeDasharray="10 10" className="animate-[dash_20s_linear_infinite_reverse]" />
                <line x1="25%" y1="75%" x2="50%" y2="50%" stroke="#00ffff" strokeWidth="4" strokeDasharray="10 10" className="animate-[dash_20s_linear_infinite_reverse]" />
                <line x1="75%" y1="75%" x2="50%" y2="50%" stroke="#ffffff" strokeWidth="4" strokeDasharray="10 10" className="animate-[dash_20s_linear_infinite]" />
              </svg>
            </div>
            
            <style>{`
              @keyframes dash {
                to { stroke-dashoffset: 1000; }
              }
              .perspective-1000 {
                perspective: 1000px;
              }
              .rotate-x-60 {
                transform: rotateX(60deg) rotateZ(45deg);
              }
            `}</style>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Workflow;
