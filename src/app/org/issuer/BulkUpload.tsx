import React, { useState } from 'react';
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';

// Mock hook
const useWallet = () => ({ connected: false });

export default function BulkUpload() {
  const { connected } = useWallet();
  const [data, setData] = useState<{ id: string; name: string }[]>([]);
  const [status, setStatus] = useState<string>('');

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Mock parsing
    setData([
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
    ]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const mintBatch = () => {
    if (!connected) {
      setStatus('Please connect wallet first.');
      return;
    }
    setStatus('Minting...');
    setTimeout(() => setStatus('Minted successfully!'), 2000);
  };

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl glassmorphism">
      <h2 className="text-2xl font-bold mb-4">Bulk Upload Credentials</h2>
      
      <div 
        onDrop={handleDrop} 
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-500 rounded-xl p-12 text-center hover:bg-white/5 transition-colors cursor-pointer mb-6"
      >
        <UploadCloud className="w-12 h-12 text-electric-blue mx-auto mb-4" />
        <p className="text-gray-300">Drag and drop CSV/JSON files here</p>
      </div>

      {data.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Preview</h3>
          <table className="min-w-full text-left text-sm text-gray-300">
            <thead className="bg-white/10">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Recipient Name</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} className="border-b border-white/5">
                  <td className="px-4 py-2">{item.id}</td>
                  <td className="px-4 py-2">{item.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <button 
          onClick={mintBatch}
          className="glow-border px-6 py-2 bg-electric-blue/20 text-electric-blue rounded-full font-semibold hover:bg-electric-blue/30 transition-colors"
        >
          {connected ? 'Mint All' : 'Connect wallet to mint'}
        </button>
        {status && (
          <span className="flex items-center text-sm">
            {status.includes('success') ? <CheckCircle className="w-4 h-4 text-green-400 mr-2" /> : <AlertCircle className="w-4 h-4 text-yellow-400 mr-2" />}
            {status}
          </span>
        )}
      </div>
    </div>
  );
}
