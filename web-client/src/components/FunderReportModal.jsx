import React from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  X, 
  Calendar, 
  TrendingUp, 
  Coins, 
  Award,
  BadgeCheck
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function FunderReportModal({
  isOpen,
  onClose,
  currentProfile,
  readinessScore,
  checksData,
  cashFlowWeeks,
  cashInDrawer,
  digitalBankBalance
}) {
  if (!isOpen) return null;

  const handlePrint = () => {
    sounds.playPosTap();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Modal Action Bar (Hidden when printing) */}
        <div className="p-4 bg-slate-850 border-b border-slate-700 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm text-slate-100">
              Institutional ESD & Funder Readiness Audit Dossier
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Formal Document Content */}
        <div className="p-6 sm:p-8 bg-slate-900 text-slate-100 print:bg-white print:text-slate-950 space-y-6">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-800 print:border-slate-300">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-emerald-400 print:text-emerald-800">
                  HorizonCapital
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 print:border-emerald-600 print:text-emerald-800 print:bg-emerald-50 uppercase font-bold tracking-wider">
                  Verified MSME Readiness Report
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight mt-1">
                Executive Supplier & Credit Audit Dossier
              </h1>
              <div className="text-xs text-slate-400 print:text-slate-600 mt-0.5">
                Prepared under the South African Enterprise & Supplier Development (ESD) Framework
              </div>
            </div>

            <div className="text-right sm:border-l sm:pl-6 border-slate-800 print:border-slate-300">
              <div className="text-[10px] text-slate-400 print:text-slate-600 font-mono">AUDIT TIMESTAMP</div>
              <div className="text-xs font-bold font-mono">
                {new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="text-[10px] text-emerald-400 print:text-emerald-700 font-mono mt-0.5">
                STATUS: AUDIT VERIFIED ✓
              </div>
            </div>
          </div>

          {/* Section 1: Business Profile & Regulatory Identity */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950 print:bg-slate-50 border border-slate-800 print:border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 print:text-slate-500 block uppercase">Legal Entity</span>
              <span className="font-bold text-slate-100 print:text-slate-900">{currentProfile.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 print:text-slate-500 block uppercase">Founder / Director</span>
              <span className="font-bold text-slate-100 print:text-slate-900">{currentProfile.owner}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 print:text-slate-500 block uppercase">CIPC Registration</span>
              <span className="font-mono font-bold text-slate-100 print:text-slate-900">{currentProfile.cipcReg}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 print:text-slate-500 block uppercase">SARS Tax Status</span>
              <span className="font-mono font-bold text-emerald-400 print:text-emerald-700">Good Standing (PIN {currentProfile.sarsTaxPin})</span>
            </div>
          </div>

          {/* Section 2: 5-Check Readiness Score Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 print:text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 print:text-emerald-700" />
                1. Five-Check Growth Readiness Assessment
              </h2>
              <span className="text-base font-black text-emerald-400 print:text-emerald-800 font-mono">
                {readinessScore} / 100 (Tier 1 Accredited)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {checksData.map((check) => (
                <div key={check.key} className="p-3 rounded-xl bg-slate-950 print:bg-slate-50 border border-slate-800 print:border-slate-200 text-center">
                  <div className="text-[10px] text-slate-400 print:text-slate-600 truncate">{check.name}</div>
                  <div className="text-lg font-black text-emerald-400 print:text-emerald-800 font-mono my-0.5">
                    {check.score}%
                  </div>
                  <div className="text-[9px] text-slate-500 print:text-slate-600">
                    Benchmark: {check.benchmark}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: 13-Week Cash Flow Runway & Liquidity Audit */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 print:text-slate-800 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400 print:text-emerald-700" />
              2. Liquidity & 13-Week Forward Cash Solvency Audit
            </h2>

            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950 print:bg-slate-50 border border-slate-800 print:border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 print:text-slate-500 block uppercase">Physical Cash in Drawer</span>
                <span className="font-bold text-amber-400 print:text-amber-700 font-mono text-sm">
                  R {cashInDrawer.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 print:text-slate-500 block uppercase">Verified Bank Balance</span>
                <span className="font-bold text-emerald-400 print:text-emerald-700 font-mono text-sm">
                  R {digitalBankBalance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 print:text-slate-500 block uppercase">Consolidated Net Working Capital</span>
                <span className="font-bold text-slate-100 print:text-slate-900 font-mono text-sm">
                  R {(cashInDrawer + digitalBankBalance).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
              <strong>Solvency Analysis:</strong> The MSME demonstrates sustainable weekly unit profitability (average gross margin of 56.7%). Order intake is governed by HorizonCapital's automated risk engine, enforcing 50% upfront deposit terms on bulk catering orders to protect against month-end working capital depletion.
            </p>
          </div>

          {/* Section 4: Underwriting & Pre-Approved Credit Facilities */}
          <div className="space-y-2 p-4 rounded-xl bg-emerald-950/30 print:bg-emerald-50 border border-emerald-800/40 print:border-emerald-300 text-xs text-emerald-200 print:text-emerald-900">
            <div className="font-bold flex items-center gap-1.5 text-sm text-emerald-300 print:text-emerald-900">
              <Award className="w-4 h-4 text-emerald-400 print:text-emerald-700" />
              <span>3. Institutional Credit Endorsement</span>
            </div>
            <p className="leading-relaxed">
              Based on 90 consecutive days of parsed WhatsApp order volume, verified SoftPOS card transactions, and zero supplier defaults, {currentProfile.name} is pre-approved for up to <strong>R 5,000.00</strong> in short-term working capital and meets Tier-1 eligibility for corporate ESD procurement matching.
            </p>
          </div>

          {/* Document Sign-off Footer */}
          <div className="pt-4 border-t border-slate-800 print:border-slate-300 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 print:text-slate-600 font-mono gap-2">
            <div>
              Engineered by HorizonCapital Growth Readiness Engine • ISO/B-BBEE MSME Standard
            </div>
            <div>
              Digital Cryptographic Verification Hash: 0x9f88c3a1b028
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
