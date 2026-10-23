import React, { useState } from 'react';
import {
  LayoutDashboard,
  MessageSquareCheck,
  Wallet,
  CreditCard,
  UserRound,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  FileCheck2,
  ArrowUpRight,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function Sidebar({
  activeTab,
  onSelectTab,
  currentProfile,
  readinessScore,
  cashInDrawer,
  digitalBankBalance,
  onOpenReport,
}) {
  const [toolsOpen, setToolsOpen] = useState(false);

  const menuItems = [
    {
      id: 'order-intake',
      label: 'Chat Orders',
      subtitle: 'WhatsApp order intake',
      icon: MessageSquareCheck,
    },
    {
      id: 'ledger',
      label: 'Smart Ledger',
      subtitle: 'Cash vs Digital + Snap Receipt',
      icon: Wallet,
    },
    {
      id: 'micro-pos',
      label: 'Micro-POS SoftPOS',
      subtitle: 'NFC Phone Tap-to-Pay',
      icon: CreditCard,
    },
    {
      id: 'profile',
      label: 'Profile',
      subtitle: 'Funding, Trust & Settings',
      icon: UserRound,
    },
  ];

  const totalLiquidity = (Number(cashInDrawer) || 0) + (Number(digitalBankBalance) || 0);

  const selectTab = (tabId) => {
    onSelectTab(tabId);
    sounds.playPosTap();
  };

  return (
    <aside className="w-full md:w-72 md:flex md:flex-col bg-slate-900/90 border-r border-slate-800 shrink-0 min-h-0 md:min-h-[calc(100vh-65px)] p-3 sm:p-4 text-slate-200">
      {/* Business profile and Executive Overview */}
      <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/70 mb-4">
        <div className="flex items-center gap-3 mb-2.5 min-w-0">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl">
            {currentProfile?.avatar || '🏪'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 font-bold text-sm text-slate-100 min-w-0">
              <span className="truncate">{currentProfile?.name || 'Business Profile'}</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            </div>
            <div className="text-xs text-slate-400 truncate">{currentProfile?.owner}</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5 truncate">
              {currentProfile?.location}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => selectTab('dashboard')}
          aria-current={activeTab === 'dashboard' ? 'page' : undefined}
          className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
            activeTab === 'dashboard'
              ? 'bg-emerald-950/70 border border-emerald-700/80 text-emerald-300'
              : 'border border-transparent text-slate-200 hover:bg-slate-700/60'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          <span className="font-semibold">Executive Overview</span>
          {activeTab === 'dashboard' && <span className="ml-auto text-[10px] text-emerald-400">Active</span>}
        </button>

        {/* Readiness score */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-700/60 flex items-center justify-between gap-2 text-xs">
          <span className="text-slate-400">Readiness Score</span>
          <span className="font-bold text-emerald-400 font-mono shrink-0">
            {readinessScore}/100
          </span>
        </div>
      </div>

      {/* Collapsible navigation menu */}
      <div className="flex-1 min-w-0">
        <button
          type="button"
          onClick={() => setToolsOpen((open) => !open)}
          aria-expanded={toolsOpen}
          className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider hover:bg-slate-800/70 transition-colors"
        >
          <span>Decision Engine &amp; Tools</span>
          <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
        </button>

        {toolsOpen && (
          <nav className="mt-1 space-y-1" aria-label="Decision Engine and Tools">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full min-w-0 text-left p-2.5 rounded-xl flex items-center justify-between gap-2 group transition-all text-xs ${
                    isActive
                      ? 'bg-emerald-950/70 border border-emerald-700/80 text-emerald-300 font-medium shadow-md'
                      : 'hover:bg-slate-800/70 text-slate-300 border border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <span className={`p-1.5 rounded-lg shrink-0 ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-slate-100 truncate">{item.label}</span>
                      <span className="block text-[10px] text-slate-400 truncate">{item.subtitle}</span>
                    </span>
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 text-slate-600 transition-transform ${isActive ? 'translate-x-0.5 text-emerald-400' : 'group-hover:translate-x-0.5'}`} />
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {/* Mini Liquidity Card */}
      <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-1 text-slate-400 mb-1.5">
          <span>Total Working Liquidity</span>
          <span className="font-bold text-slate-100 tabular-nums">
            R {totalLiquidity.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1.5 border-t border-slate-800/80 text-[11px]">
          <div className="bg-slate-900 p-1.5 rounded border border-slate-800 min-w-0">
            <span className="text-slate-400 block text-[9px]">Cash Drawer</span>
            <span className="font-bold text-amber-400 break-words">R {Number(cashInDrawer || 0).toLocaleString('en-ZA')}</span>
          </div>
          <div className="bg-slate-900 p-1.5 rounded border border-slate-800 min-w-0">
            <span className="text-slate-400 block text-[9px]">FNB Bank</span>
            <span className="font-bold text-emerald-400 break-words">R {Number(digitalBankBalance || 0).toLocaleString('en-ZA')}</span>
          </div>
        </div>
      </div>

      {/* ESD report shortcut */}
      <div className="mt-3">
        <button
          type="button"
          onClick={() => {
            onOpenReport();
            sounds.playSuccess();
          }}
          className="w-full py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-xs flex items-center justify-between gap-2 transition-colors"
        >
          <span className="flex items-center gap-1.5 min-w-0">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">ESD Funder Summary</span>
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </button>
      </div>
    </aside>
  );
}
