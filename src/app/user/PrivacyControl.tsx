import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, Lock, Check } from 'lucide-react';

interface Credential {
  id: string;
  name: string;
  issuer: string;
  category: string;
}

interface PrivacyControlProps {
  credentials: Credential[];
}

export default function PrivacyControl({ credentials }: PrivacyControlProps) {
  const [privacyStates, setPrivacyStates] = useState<Record<string, 'Public' | 'Private' | 'Selective'>>({});
  const [selectedDisclosure, setSelectedDisclosure] = useState<string | null>(null);

  useEffect(() => {
    // Load from mock localStorage
    const saved = localStorage.getItem('truestamp_privacy_settings');
    window.setTimeout(() => {
      if (saved) {
        setPrivacyStates(JSON.parse(saved));
      } else {
        const initial: Record<string, 'Public' | 'Private' | 'Selective'> = {};
        credentials.forEach(c => initial[c.id] = 'Private');
        setPrivacyStates(initial);
      }
    }, 0);
  }, [credentials]);

  const updatePrivacy = (id: string, state: 'Public' | 'Private' | 'Selective') => {
    const newStates = { ...privacyStates, [id]: state };
    setPrivacyStates(newStates);
    localStorage.setItem('truestamp_privacy_settings', JSON.stringify(newStates));
    
    if (state === 'Selective') {
      setSelectedDisclosure(id);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl glassmorphism p-6">
      <div className="flex items-center mb-6">
        <Shield className="w-6 h-6 text-electric-blue mr-3" />
        <h2 className="text-2xl font-bold">Privacy Controls</h2>
      </div>

      <div className="space-y-4">
        {credentials.map(cred => (
          <div key={cred.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-black/40 border border-white/5 rounded-xl hover:bg-white/5 transition-colors">
            <div className="mb-4 md:mb-0">
              <h3 className="text-white font-semibold">{cred.name}</h3>
              <p className="text-sm text-gray-400">Issuer: {cred.issuer} • ID: {cred.id}</p>
            </div>
            
            <div className="flex bg-black/60 rounded-xl p-1 border border-white/10">
              <button
                onClick={() => updatePrivacy(cred.id, 'Public')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                  privacyStates[cred.id] === 'Public' ? 'bg-green-500/20 text-green-400 shadow-sm' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Eye className="w-4 h-4 mr-1.5" /> Public
              </button>
              <button
                onClick={() => updatePrivacy(cred.id, 'Selective')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                  privacyStates[cred.id] === 'Selective' ? 'bg-electric-blue/20 text-electric-blue shadow-sm' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Shield className="w-4 h-4 mr-1.5" /> Selective
              </button>
              <button
                onClick={() => updatePrivacy(cred.id, 'Private')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                  privacyStates[cred.id] === 'Private' ? 'bg-red-500/20 text-red-400 shadow-sm' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <EyeOff className="w-4 h-4 mr-1.5" /> Private
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Selective Disclosure Modal */}
      {selectedDisclosure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-background border border-white/10 p-6 rounded-2xl max-w-md w-full">
            <div className="flex items-center mb-4 text-electric-blue">
              <Lock className="w-6 h-6 mr-2" />
              <h3 className="text-xl font-bold text-white">Selective Disclosure</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6">Choose which fields to share for Credential <span className="text-white font-mono">{selectedDisclosure}</span>. Unselected fields will remain zero-knowledge proven.</p>
            
            <div className="space-y-3 mb-6">
              {['Holder Name', 'Issue Date', 'Credential Grade', 'Issuing Body Signature'].map((field, idx) => (
                <label key={idx} className="flex items-center p-3 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                  <input type="checkbox" className="form-checkbox h-5 w-5 text-electric-blue bg-black border-white/20 rounded focus:ring-electric-blue focus:ring-offset-background" defaultChecked={idx < 2} />
                  <span className="ml-3 text-white text-sm font-medium">{field}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setSelectedDisclosure(null)}
                className="px-4 py-2 rounded-xl bg-electric-blue/20 text-electric-blue font-semibold hover:bg-electric-blue/30 transition-colors flex items-center"
              >
                <Check className="w-4 h-4 mr-2" />
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
