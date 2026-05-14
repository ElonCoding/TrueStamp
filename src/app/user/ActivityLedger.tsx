import React, { useState } from 'react';
import { Activity, Download, Filter } from 'lucide-react';

export default function ActivityLedger() {
  const [filter, setFilter] = useState('All');

  const activities = [
    { id: 1, date: '2026-05-14 10:23', action: 'Issued', credential: 'BSc Computer Science', counterparty: '0xGlobalTech...1234' },
    { id: 2, date: '2026-05-12 14:05', action: 'Shared', credential: 'KYC Verification', counterparty: '0xDeFiBank...abcd' },
    { id: 3, date: '2026-05-10 09:15', action: 'Viewed', credential: 'BSc Computer Science', counterparty: '0xRecruiter...8888' },
    { id: 4, date: '2026-04-20 16:45', action: 'Revoked', credential: 'Old Gym Pass', counterparty: '0xGymChain...9999' },
  ];

  const filtered = filter === 'All' ? activities : activities.filter(a => a.action === filter);

  const exportCSV = () => {
    // Mock export
    alert('Exporting CSV...');
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl glassmorphism p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Activity className="w-6 h-6 text-cyan mr-3" />
          <h2 className="text-2xl font-bold">Activity Ledger</h2>
        </div>
        
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 pr-4 py-2 w-full bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan appearance-none"
            >
              <option value="All">All Actions</option>
              <option value="Issued">Issued</option>
              <option value="Shared">Shared</option>
              <option value="Viewed">Viewed</option>
              <option value="Revoked">Revoked</option>
            </select>
          </div>
          <button 
            onClick={exportCSV}
            className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm font-semibold transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-gray-300">
          <thead className="bg-white/10 border-b border-white/10">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg font-semibold text-white">Date & Time</th>
              <th className="px-4 py-3 font-semibold text-white">Action</th>
              <th className="px-4 py-3 font-semibold text-white">Credential</th>
              <th className="px-4 py-3 rounded-tr-lg font-semibold text-white">Counterparty</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">{item.date}</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    item.action === 'Issued' ? 'bg-green-500/20 text-green-400' :
                    item.action === 'Shared' ? 'bg-electric-blue/20 text-electric-blue' :
                    item.action === 'Viewed' ? 'bg-gray-500/20 text-gray-300' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {item.action}
                  </span>
                </td>
                <td className="px-4 py-4 font-medium text-white">{item.credential}</td>
                <td className="px-4 py-4 font-mono text-xs text-neon-purple">{item.counterparty}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No activities found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
