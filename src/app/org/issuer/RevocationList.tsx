import React, { useState } from 'react';
import { ShieldAlert, Trash2 } from 'lucide-react';

export default function RevocationList() {
  const [credentials, setCredentials] = useState([
    { tokenId: '1001', recipient: 'Alice', date: '2026-05-10', status: 'Active' },
    { tokenId: '1002', recipient: 'Bob', date: '2026-05-12', status: 'Active' },
  ]);

  const [revokingId, setRevokingId] = useState<string | null>(null);

  const confirmRevoke = (tokenId: string) => {
    setRevokingId(tokenId);
  };

  const executeRevoke = () => {
    if (!revokingId) return;
    // Mock revoke
    setCredentials(credentials.map(c => 
      c.tokenId === revokingId ? { ...c, status: 'Revoked' } : c
    ));
    setRevokingId(null);
  };

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl glassmorphism">
      <div className="flex items-center mb-6">
        <ShieldAlert className="w-6 h-6 text-red-400 mr-2" />
        <h2 className="text-2xl font-bold">Revocation Management</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-gray-300">
          <thead className="bg-white/10">
            <tr>
              <th className="px-4 py-2 rounded-tl-lg">Token ID</th>
              <th className="px-4 py-2">Recipient</th>
              <th className="px-4 py-2">Date Issued</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 rounded-tr-lg">Action</th>
            </tr>
          </thead>
          <tbody>
            {credentials.map((item, idx) => (
              <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-mono text-electric-blue">{item.tokenId}</td>
                <td className="px-4 py-3">{item.recipient}</td>
                <td className="px-4 py-3">{item.date}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    item.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {item.status === 'Active' && (
                    <button 
                      onClick={() => confirmRevoke(item.tokenId)}
                      className="inline-flex items-center text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {revokingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-background border border-white/10 p-6 rounded-2xl max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Revocation</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to revoke Token ID <span className="font-mono text-electric-blue">{revokingId}</span>? This action cannot be undone on the blockchain.</p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setRevokingId(null)}
                className="px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-sm font-semibold"
              >
                Cancel
              </button>
              <button 
                onClick={executeRevoke}
                className="px-4 py-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-semibold"
              >
                Confirm Revoke
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
