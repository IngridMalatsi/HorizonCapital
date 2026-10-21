import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquareCheck, 
  Wallet, 
  CreditCard, 
  Coins, 
  BadgeCheck, 
  ShieldCheck, 
  ChevronRight, 
  PlusCircle, 
  FileCheck2,
  AlertTriangle,
  Lock,
  ArrowUpRight
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
  onTriggerNewIntake
}) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Executive Overview',
      subtitle: '13-Wk Cashflow & 5-Check Score',
      icon: LayoutDashboard,
    },
    {
      id: 'order-intake',
      label: 'WhatsApp AI Intake',
      subtitle: '"Can I afford to say yes?"',
      icon: MessageSquareCheck,
      badge: 'Core Engine'
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
      id: 'funding',
      label: 'Scorecard & Funding',
      subtitle: 'R5,000 Pre-Approved Credit',
      icon: Coins,
      tag: 'Unlocked'
    },
    {
      id: 'market-linker',
      label: 'Market Linker & Trust',
      subtitle: 'CIPC / SARS Trust Badge & ESD',
      icon: BadgeCheck,
    },
  ];

  const totalLiquidity = cashInDrawer + digitalBankBalance;

  return (
    <aside className="w-72 hidden md:flex flex-col bg-slate-900/90 border-r border-slate-800 shrink-0 min-h-[calc(100vh-65px)] p-4 text-slate-200">
      {/* MSME Profile Header Card */}
      <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/70 mb-4">
        <div className="flex items-center gap-3 mb-2.5">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl">
            {currentProfile.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 font-bold text-sm text-slate-100 truncate">
              {currentProfile.name}
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            </div>
            <div className="text-xs text-slate-400 truncate">{currentProfile.owner}</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">{currentProfile.location}</div>
          </div>
        </div>

        {/* Readiness Meter in Sidebar */}
        <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
          <span className="text-slate-400">Readiness Score</span>
          <span className="font-bold text-emerald-400 font-mono">
            {readinessScore}/100
          </span>
        </div>
      </div>

      {/* Quick Action Button */}
      <button
        onClick={() => {
          onTriggerNewIntake();
          sounds.playPosTap();
        }}
        className="w-full mb-4 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
      >
        <PlusCircle className="w-4 h-4" />
        <span>Evaluate WhatsApp Order</span>
      </button>

      {/* Navigation Links */}
      <div className="flex-1 space-y-1">
        <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Decision Engine & Tools
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                sounds.playPosTap();
              }}
              className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between group transition-all text-xs ${
                isActive
                  ? 'bg-emerald-950/70 border border-emerald-700/80 text-emerald-300 font-medium shadow-md'
                  : 'hover:bg-slate-800/70 text-slate-300 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                    {item.label}
                    {item.tag && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                    {item.subtitle}
                  </div>
                </div>
              </div>

              {item.badge ? (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {item.badge}
                </span>
              ) : (
                <ChevronRight className={`w-3.5 h-3.5 text-slate-600 transition-transform ${isActive ? 'translate-x-0.5 text-emerald-400' : 'group-hover:translate-x-0.5'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Mini Liquidity Card */}
      <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span>Total Working Liquidity</span>
          <span className="font-bold text-slate-100">R {totalLiquidity.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-slate-800/80 text-[11px]">
          <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
            <span className="text-slate-400 block text-[9px]">Cash Drawer</span>
            <span className="font-bold text-amber-400">R {cashInDrawer.toLocaleString('en-ZA')}</span>
          </div>
          <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
            <span className="text-slate-400 block text-[9px]">FNB Bank</span>
            <span className="font-bold text-emerald-400">R {digitalBankBalance.toLocaleString('en-ZA')}</span>
          </div>
        </div>
      </div>

      {/* Funder Report Trigger in Sidebar */}
      <div className="mt-3">
        <button
          onClick={() => {
            onOpenReport();
            sounds.playSuccess();
          }}
          className="w-full py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-xs flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>ESD Funder Summary</span>
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </aside>
  );
}
