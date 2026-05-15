import React from 'react';
import { BookOpen, User, Briefcase, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoryGridProps {
  onSelectCategory: (category: string | null) => void;
  activeCategory: string | null;
}

export default function CategoryGrid({ onSelectCategory, activeCategory }: CategoryGridProps) {
  const categories = [
    { id: 'Education', icon: <BookOpen className="w-8 h-8" />, count: 3, color: 'text-electric-blue', bg: 'from-electric-blue/20 to-blue-900/20' },
    { id: 'Identity', icon: <User className="w-8 h-8" />, count: 1, color: 'text-neon-purple', bg: 'from-neon-purple/20 to-purple-900/20' },
    { id: 'Professional', icon: <Briefcase className="w-8 h-8" />, count: 5, color: 'text-cyan', bg: 'from-cyan/20 to-teal-900/20' },
    { id: 'Health', icon: <HeartPulse className="w-8 h-8" />, count: 2, color: 'text-magenta', bg: 'from-magenta/20 to-pink-900/20' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {categories.map((cat) => (
        <motion.div
          key={cat.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory(activeCategory === cat.id ? null : cat.id)}
          className={`cursor-pointer rounded-2xl p-[1px] ${
            activeCategory === cat.id ? 'bg-gradient-to-tr from-white to-gray-400 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : `bg-gradient-to-tr ${cat.bg} hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]`
          } transition-all`}
        >
          <div className={`h-full bg-background rounded-2xl p-6 flex flex-col items-center justify-center text-center ${activeCategory === cat.id ? 'bg-white/5' : ''}`}>
            <div className={`${cat.color} mb-3`}>
              {cat.icon}
            </div>
            <h3 className="font-bold text-white mb-1">{cat.id}</h3>
            <span className="text-xs font-semibold text-gray-400 bg-black/40 px-3 py-1 rounded-full border border-white/5">
              {cat.count} Credentials
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
