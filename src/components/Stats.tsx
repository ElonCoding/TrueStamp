import React from 'react';
import { motion } from 'framer-motion';
import { FileCheck, Shield, Clock, Activity } from 'lucide-react';

const Stats = () => {
  const stats = [
    {
      icon: <FileCheck className="w-6 h-6 text-electric-blue" />,
      value: "10K+",
      label: "Docs to Verify",
      subtext: "by year-end"
    },
    {
      icon: <Shield className="w-6 h-6 text-neon-purple" />,
      value: "99.99%",
      label: "Security Guaranteed",
      subtext: "military-grade encryption"
    },
    {
      icon: <Clock className="w-6 h-6 text-cyan" />,
      value: "24/7",
      label: "System Availability",
      subtext: "global node network"
    }
  ];

  return (
    <section className="relative z-20 -mt-10 mb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glassmorphism glow-border rounded-3xl p-8 lg:p-12"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left space-y-2 relative">
                {/* Micro animation dot */}
                <div className="absolute -top-2 -right-2 w-2 h-2 rounded-full bg-electric-blue animate-ping opacity-75 hidden md:block"></div>
                
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 mb-2 group-hover:bg-white/10 transition-colors">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                  {stat.value}
                </h3>
                <div>
                  <p className="text-lg font-bold text-white">{stat.label}</p>
                  <p className="text-sm text-gray-400">{stat.subtext}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Real-time Ticker */}
          <div className="w-full lg:w-1/3 bg-black/40 rounded-2xl p-6 border border-white/5 flex flex-col justify-center">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="w-5 h-5 text-magenta animate-pulse" />
              <span className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Live Network</span>
            </div>
            <div className="space-y-3">
              {[
                { id: "0x7f...a9", action: "Verified Cert", time: "2s ago" },
                { id: "0x3b...c4", action: "Issued Doc", time: "12s ago" },
                { id: "0x1a...f2", action: "Smart Contract Exec", time: "28s ago" }
              ].map((tx, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-electric-blue font-mono">{tx.id}</span>
                  <span className="text-gray-300">{tx.action}</span>
                  <span className="text-gray-500">{tx.time}</span>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </motion.div>
    </section>
  );
};

export default Stats;
