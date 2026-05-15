import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, LockKeyhole, Award, Link, Wallet, Fingerprint } from 'lucide-react';

const Features = () => {
  const features = [
    {
      title: "Immutable Verification",
      description: "Once stamped, a document’s hash cannot be altered, ensuring permanent truth on the decentralized ledger.",
      icon: <ShieldCheck className="w-8 h-8 text-electric-blue" />,
      color: "from-electric-blue to-blue-600"
    },
    {
      title: "Blockchain Security",
      description: "Secured by zero-knowledge proofs and advanced cryptographic hashing algorithms.",
      icon: <LockKeyhole className="w-8 h-8 text-neon-purple" />,
      color: "from-neon-purple to-purple-600"
    },
    {
      title: "Digital Certificates",
      description: "Issue, manage, and verify digital certificates instantly without relying on centralized authorities.",
      icon: <Award className="w-8 h-8 text-magenta" />,
      color: "from-magenta to-pink-600"
    },
    {
      title: "Smart Contracts",
      description: "Automate compliance and execution of verification rules seamlessly via programmatic smart contracts.",
      icon: <Link className="w-8 h-8 text-cyan" />,
      color: "from-cyan to-teal-500"
    },
    {
      title: "Wallet Authentication",
      description: "Log in securely using your Web3 wallet. No more easily compromised passwords.",
      icon: <Wallet className="w-8 h-8 text-white" />,
      color: "from-gray-300 to-gray-500"
    },
    {
      title: "Hash Encrypted Documents Integration",
      description: "Combine blockchain hash verification with advanced encrypted document for extreme security.",
      icon: <LockKeyhole className="w-8 h-8 text-electric-blue" />,
      color: "from-electric-blue to-cyan"
    }
  ];

  return (
    <section className="relative py-24 bg-grid-pattern">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Advanced <span className="text-glow text-electric-blue">Capabilities</span></h2>
          <p className="text-gray-400 text-lg">Designed for enterprises, engineered for the decentralized future. Explore our suite of premium features.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glassmorphism glow-border group rounded-2xl p-8 hover:bg-white/5 transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} p-[1px] mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                <div className="w-full h-full bg-background rounded-xl flex items-center justify-center">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{feature.description}</p>

              <a href="#" className="inline-flex items-center text-sm font-semibold text-electric-blue group-hover:text-neon-purple transition-colors">
                Learn More <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
