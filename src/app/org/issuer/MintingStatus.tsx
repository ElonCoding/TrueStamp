import React, { useEffect, useState } from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';

// Mock useQuery hook
const useQuery = () => {
  const [data, setData] = useState([
    { tokenId: '1001', recipient: 'Alice', status: 'Confirmed', txHash: '0xabc123...' },
    { tokenId: '1002', recipient: 'Bob', status: 'Pending', txHash: '0xdef456...' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate polling
      setData(prev => [...prev]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return { data };
};

export default function MintingStatus() {
  const { data } = useQuery();

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl glassmorphism">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Minting Status</h2>
        <div className="flex items-center text-sm text-gray-400">
          <RefreshCw className="w-4 h-4 mr-2 animate-spin-slow" />
          Auto-updating (10s)
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-gray-300">
          <thead className="bg-white/10">
            <tr>
              <th className="px-4 py-2 rounded-tl-lg">Token ID</th>
              <th className="px-4 py-2">Recipient</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 rounded-tr-lg">Transaction</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-mono text-electric-blue">{item.tokenId}</td>
                <td className="px-4 py-3">{item.recipient}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    item.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' :
                    item.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <a 
                    href={`https://amoy.polygonscan.com/tx/${item.txHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-neon-purple hover:text-magenta transition-colors"
                  >
                    {item.txHash}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
