import React, { useState } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  MessageSquare, 
  Wallet, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Building2, 
  Coins, 
  ChevronRight 
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function DashboardView({
  currentProfile,
  readinessScore,
  checksData,
  cashFlowWeeks,
  cashInDrawer,
  digitalBankBalance,
  onNavigateTab,
  onSelectWhatsappPreset,
  onOpenReport
}) {
  const [selectedScenario, setSelectedScenario] = useState('baseline'); // 'baseline', 'unhedged', 'counter_offer'
  const [selectedWeek, setSelectedWeek] = useState(cashFlowWeeks[3]); // Focus on Week 4 dip by default

  const totalLiquidity = cashInDrawer + digitalBankBalance;

  // Compute modified cashflow based on scenario
  const getScenarioWeeks = () => {
    return cashFlowWeeks.map((w, idx) => {
      if (selectedScenario === 'baseline') {
        return w;
      }
      if (selectedScenario === 'unhedged') {
        if (idx === 3) {
          return { ...w, outflow: w.outflow + 650, balance: Math.max(0, w.balance - 650), status: 'critical', label: 'INSOLVENCY RISK: R320' };
        }
        if (idx === 6) {
          return { ...w, inflow: w.inflow + 1500, balance: w.balance + 850, label: 'Late Payment Arrived' };
        }
        return w;
      }
      if (selectedScenario === 'counter_offer') {
        if (idx === 3) {
          return { ...w, inflow: w.inflow + 750, outflow: w.outflow + 650, balance: w.balance + 100, status: 'safe', label: 'PROTECTED (+R750 Deposit)' };
        }
        if (idx === 4) {
          return { ...w, inflow: w.inflow + 750, balance: w.balance + 850, status: 'safe', label: 'Final 50% Delivery Cash' };
        }
        return w;
      }
      return w;
    });
  };

  const activeCashFlowWeeks = getScenarioWeeks();
  const maxBalance = Math.max(...activeCashFlowWeeks.map(w => w.balance), 12000);

  return (
    <div className="space-y-4 sm:space-y-6 pb-28 sm:pb-24 md:pb-8">
      {/* Clean, Modern Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono truncate">
              {currentProfile.location}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/60 shrink-0">
              Verified MSME
            </span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-slate-100 tracking-tight">
            {currentProfile.name}
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            {currentProfile.type} • Financial Runway & Risk Operating System
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              onSelectWhatsappPreset('mbali-muffins');
              onNavigateTab('order-intake');
              sounds.playPosTap();
            }}
            className="flex-1 sm:flex-none px-3 sm:px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Evaluate Order</span>
          </button>

          <button
            onClick={() => {
              onOpenReport();
              sounds.playSuccess();
            }}
            className="flex-1 sm:flex-none px-3 sm:px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>ESD Audit</span>
          </button>
        </div>
      </div>

      {/* Primary Financial Snapshot Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {/* Total Working Liquidity */}
        <div className="p-3 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs mb-1">
              <span className="font-medium truncate">Total Liquidity</span>
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            </div>
            <div className="text-base sm:text-2xl font-bold text-slate-100 font-mono tracking-tight truncate">
              R {totalLiquidity.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] sm:text-[11px] text-emerald-400 font-medium">
            <span className="flex items-center font-bold">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14.2%
            </span>
            <span className="text-slate-400 font-normal hidden sm:inline">vs last mo</span>
          </div>
        </div>

        {/* Cash in Drawer */}
        <div className="p-3 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs mb-1">
              <span className="font-medium truncate">Cash Drawer</span>
              <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            </div>
            <div className="text-base sm:text-2xl font-bold text-amber-300 font-mono tracking-tight truncate">
              R {cashInDrawer.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-2 truncate">
            Till cash for daily buys
          </div>
        </div>

        {/* Digital Bank Balance */}
        <div className="p-3 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs mb-1">
              <span className="font-medium truncate">FNB Bank</span>
              <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            </div>
            <div className="text-base sm:text-2xl font-bold text-emerald-400 font-mono tracking-tight truncate">
              R {digitalBankBalance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-2 truncate">
            SoftPOS & verified EFTs
          </div>
        </div>

        {/* Readiness Score Card */}
        <div className="p-3 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs mb-1">
              <span className="font-medium truncate">Readiness</span>
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-2xl font-bold text-emerald-400 font-mono">{readinessScore}</span>
              <span className="text-[11px] sm:text-xs text-slate-400 font-mono">/100</span>
              <span className="ml-auto text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 truncate">
                Tier 1
              </span>
            </div>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${readinessScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* 13-Week Cash Flow Rolling Projection (Clean & Touch-Friendly) */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-100">
                13-Week Cash Flow Forecast
              </h2>
              <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                Forward Horizon
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Identifies month-end dips. Safe reserve: <strong className="text-amber-300 font-mono">R500.00</strong>.
            </p>
          </div>

          {/* Scenario Simulation Selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto w-full sm:w-auto text-[11px]">
            <button
              onClick={() => {
                setSelectedScenario('baseline');
                sounds.playPosTap();
              }}
              className={`flex-1 sm:flex-none px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedScenario === 'baseline'
                  ? 'bg-slate-800 text-slate-100 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Baseline
            </button>
            <button
              onClick={() => {
                setSelectedScenario('unhedged');
                sounds.playWarning();
              }}
              className={`flex-1 sm:flex-none px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedScenario === 'unhedged'
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-800 shadow-sm'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              Unhedged Order
            </button>
            <button
              onClick={() => {
                setSelectedScenario('counter_offer');
                sounds.playSuccess();
              }}
              className={`flex-1 sm:flex-none px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedScenario === 'counter_offer'
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800 shadow-sm'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              50% Deposit
            </button>
          </div>
        </div>

        {/* Scenario Alert Notification Banner */}
        {selectedScenario === 'unhedged' && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-rose-300">Critical Reserve Breach</span>
              <p className="mt-0.5 text-rose-200/90 leading-relaxed text-[11px]">
                Spending R650 on ingredients in Week 4 drops cash to <strong className="font-mono text-rose-300 font-bold">R320.00</strong> (below R500 survival threshold).
              </p>
            </div>
          </div>
        )}

        {selectedScenario === 'counter_offer' && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-emerald-300">Protected Growth</span>
              <p className="mt-0.5 text-emerald-200/90 leading-relaxed text-[11px]">
                50% deposit (R750) funds ingredients upfront. Week 4 balance safely remains at <strong className="font-mono text-emerald-300 font-bold">R1,070.00</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Clean Interactive 13-Week Chart */}
        <div className="pt-1">
          <div className="h-44 sm:h-56 flex items-end gap-1 sm:gap-2 px-2 sm:px-3 py-3 rounded-xl bg-slate-950 border border-slate-800/80 overflow-x-auto">
            {activeCashFlowWeeks.map((week) => {
              const heightPercent = Math.max(8, Math.round((week.balance / maxBalance) * 100));
              const isSelected = selectedWeek.week === week.week;
              const isDanger = week.balance < 500;
              const isLow = week.balance < 2000;

              return (
                <div
                  key={week.week}
                  onClick={() => {
                    setSelectedWeek(week);
                    sounds.playPosTap();
                  }}
                  className="flex-1 min-w-[34px] sm:min-w-[48px] flex flex-col items-center justify-end h-full group cursor-pointer"
                >
                  {/* Tooltip value */}
                  <span className={`text-[8px] sm:text-[10px] font-mono mb-1 transition-opacity ${isSelected ? 'opacity-100 font-bold text-white' : 'opacity-60 group-hover:opacity-100 text-slate-400'}`}>
                    R{Math.round(week.balance / 1000)}k
                  </span>

                  {/* Vertical bar */}
                  <div className="w-full relative flex items-end justify-center h-32 sm:h-40 bg-slate-900/60 rounded-t-lg overflow-hidden border border-slate-800/50">
                    <div 
                      className="absolute left-0 right-0 border-b border-dashed border-rose-500/30 pointer-events-none"
                      style={{ bottom: `${(500 / maxBalance) * 100}%` }}
                    />

                    <div
                      className={`w-full rounded-t transition-all duration-300 relative ${
                        isDanger
                          ? 'bg-rose-500'
                          : isLow
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      } ${isSelected ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-900' : ''}`}
                      style={{ height: `${heightPercent}%` }}
                    >
                      {isDanger && (
                        <div className="absolute top-0.5 inset-x-0 flex justify-center">
                          <AlertTriangle className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Week label */}
                  <div className={`mt-1.5 text-center text-[9px] sm:text-[10px] font-medium leading-tight ${isSelected ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                    {week.week.split(' ')[0]}
                    {week.dip && (
                      <span className="block text-[7px] sm:text-[8px] text-rose-400 font-bold">DIP</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Week Inspection Strip */}
          <div className="mt-2.5 p-2.5 sm:p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5 text-[11px] sm:text-xs">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Focused: {selectedWeek.week}
              </span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] font-semibold ${
                selectedWeek.balance < 500
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {selectedWeek.label}
              </span>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 text-[10px] sm:text-[11px] font-mono">
              <div>
                <span className="text-slate-400 font-sans">In: </span>
                <span className="text-emerald-400 font-bold">+R{selectedWeek.inflow.toLocaleString('en-ZA')}</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans">Out: </span>
                <span className="text-rose-400 font-bold">-R{selectedWeek.outflow.toLocaleString('en-ZA')}</span>
              </div>
              <div className="pl-2 border-l border-slate-800">
                <span className="text-slate-400 font-sans">Bal: </span>
                <span className={`font-bold ${selectedWeek.balance < 500 ? 'text-rose-400 font-black' : 'text-slate-100'}`}>
                  R{selectedWeek.balance.toLocaleString('en-ZA')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Check Transparent Readiness Score Breakdown */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100">
              Five-Check Growth Readiness
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Continuous assessment across record completeness, margins, and cash runway.
            </p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono shrink-0">
            {readinessScore}/100
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
          {checksData.map((check) => {
            const isWarning = check.status === 'warning';
            return (
              <div
                key={check.key}
                className={`p-3 rounded-xl border transition-all ${
                  isWarning
                    ? 'bg-rose-950/20 border-rose-700/50'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-xs text-slate-200">{check.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400">Target: {check.benchmark}</span>
                    <span className={`text-[11px] font-bold font-mono px-1.5 py-0.2 rounded ${
                      isWarning
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {check.score}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1.5">
                  <div
                    className={`h-full rounded-full ${
                      isWarning ? 'bg-rose-500' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${check.score}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                  {check.detail}
                </p>

                <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-start gap-1.5 text-[10px]">
                  <Sparkles className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-slate-400 truncate">{check.recommendation}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Direct Township Operations & Hub Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
        {/* Module 1: WhatsApp Order Intake */}
        <div 
          onClick={() => {
            onNavigateTab('order-intake');
            sounds.playPosTap();
          }}
          className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 cursor-pointer group transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-105 transition-transform">
            <MessageSquare className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-xs sm:text-sm text-slate-100 flex items-center justify-between">
            WhatsApp Order Intake
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 group-hover:text-slate-300 transition-all" />
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
            Convert informal WhatsApp customer chats into structured quotes and verify cash-flow risk before saying yes.
          </p>
        </div>

        {/* Module 2: Micro-POS SoftPOS */}
        <div 
          onClick={() => {
            onNavigateTab('micro-pos');
            sounds.playPosTap();
          }}
          className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 cursor-pointer group transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-2 group-hover:scale-105 transition-transform">
            <CreditCard className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-xs sm:text-sm text-slate-100 flex items-center justify-between">
            Micro-POS SoftPOS
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 group-hover:text-slate-300 transition-all" />
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
            Accept contactless card payments directly on your smartphone via NFC with zero physical terminal rental fees.
          </p>
        </div>

        {/* Module 3: Market Linker Trust Badge */}
        <div 
          onClick={() => {
            onNavigateTab('market-linker');
            sounds.playPosTap();
          }}
          className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 cursor-pointer group transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-2 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-xs sm:text-sm text-slate-100 flex items-center justify-between">
            Market Linker & Trust
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 group-hover:text-slate-300 transition-all" />
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
            Verified digital credentials (CIPC, SARS PIN, and reviews) to unlock corporate ESD supplier procurement.
          </p>
        </div>
      </div>
    </div>
  );
}
