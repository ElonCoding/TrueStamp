import React from 'react';
import { Award, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function InstitutionStats() {
  const stats = [
    { label: 'Total Minted', value: '1,245', icon: <Award className="w-8 h-8 text-electric-blue" /> },
    { label: 'Active Credentials', value: '1,230', icon: <CheckCircle className="w-8 h-8 text-green-400" /> },
    { label: 'Revoked', value: '15', icon: <XCircle className="w-8 h-8 text-red-400" /> },
    { label: 'Pending', value: '3', icon: <Clock className="w-8 h-8 text-yellow-400" /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="p-6 bg-white/5 border border-white/10 rounded-2xl glassmorphism glow-border flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl">
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
