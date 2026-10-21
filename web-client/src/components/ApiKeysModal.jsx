import React, { useState } from 'react';
import { 
  Key, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Code2, 
  CheckCircle2, 
  AlertCircle, 
  FileCode, 
  Sparkles,
  Server,
  CreditCard,
  Building2,
  Database,
  Layers
} from 'lucide-react';
import { INTEGRATION_REGISTRY, API_CONFIG } from '../config/apiConfig';
import { sounds } from '../utils/soundEffects';

export default function ApiKeysModal({ isOpen, onClose }) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [activeTab, setActiveTab] = useState(INTEGRATION_REGISTRY[0].id);

  if (!isOpen) return null;

  const activeIntegration = INTEGRATION_REGISTRY.find(i => i.id === activeTab) || INTEGRATION_REGISTRY[0];

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    sounds.playPosTap();
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getCategoryIcon = (id) => {
    switch (id) {
      case 'ai-parser': return Sparkles;
      case 'receipt-ocr': return Layers;
      case 'softpos-gateway': return CreditCard;
      case 'cipc-sars': return Building2;
      case 'cloud-db': return Database;
      default: return Key;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                API Integration & Key Architecture
              </h2>
              <p className="text-xs text-slate-400">
                Identify where external API keys and live endpoints plug in across the codebase.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Integration List | Right Implementation Details */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Column: Modules List */}
          <div className="md:col-span-5 p-3 sm:p-4 border-r border-slate-800 bg-slate-950/50 overflow-y-auto space-y-2">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
              Select Integration Module
            </div>

            {INTEGRATION_REGISTRY.map((item) => {
              const Icon = getCategoryIcon(item.id);
              const isSelected = activeTab === item.id;
              const isLive = item.status === 'LIVE_KEY_DETECTED';

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    sounds.playPosTap();
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-slate-850 border-emerald-500/60 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-100 flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                      {item.name.split('&')[0]}
                    </span>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${
                      isLive 
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {isLive ? 'Live Key' : 'Simulation'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 line-clamp-1">
                    {item.category}
                  </span>
                </button>
              );
            })}

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 px-2 space-y-1">
              <span className="block font-semibold text-slate-300">Configuration File:</span>
              <span className="font-mono text-emerald-400 block truncate">.env.example → .env</span>
            </div>
          </div>

          {/* Right Column: Detailed Implementation & Code Location */}
          <div className="md:col-span-7 p-4 sm:p-6 overflow-y-auto space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider font-mono">
                  {activeIntegration.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-100">
                {activeIntegration.name}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {activeIntegration.purpose}
              </p>
            </div>

            {/* Environment Variable Box */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Environment Variable(s):</span>
                <button
                  onClick={() => handleCopy(activeIntegration.envVar, 'env')}
                  className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300"
                >
                  {copiedKey === 'env' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Variable</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-300 select-all">
                {activeIntegration.envVar}
              </div>
            </div>

            {/* Code Implementation Location */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  Code File & Function Location:
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Front-to-Back Bridge</span>
              </div>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">File:</span>
                  <span className="text-slate-100 font-bold">{activeIntegration.targetFile}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Service Bridge:</span>
                  <span className="text-cyan-300">{activeIntegration.functionName}</span>
                </div>
              </div>
            </div>

            {/* Sample Request Payload / Contract */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span>Production Request Contract (Sample JSON):</span>
              </div>
              <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
                {JSON.stringify(activeIntegration.examplePayload, null, 2)}
              </pre>
            </div>

            {/* Quick Helper Step */}
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-200">
              <strong>How to connect:</strong> Copy <code className="font-mono text-emerald-300">.env.example</code> to <code className="font-mono text-emerald-300">.env</code> in your root folder, paste your API key, and restart with <code className="font-mono text-emerald-300">npm run dev</code>. The application will automatically detect your live key!
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-850 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Central Bridge: <code className="font-mono text-emerald-400">src/config/apiConfig.js</code></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
