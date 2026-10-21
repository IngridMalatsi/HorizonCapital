import React, { useState } from 'react';
import { 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Lock, 
  Building2, 
  Clock, 
  Percent, 
  Zap,
  Info,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

export default function FundingView({
  fundingOffers,
  readinessScore,
  onDisburseLoan,
  loanDisbursed,
  currentProfile
}) {
  const [selectedOffer, setSelectedOffer] = useState(fundingOffers[0]);

  const handleClaimFunds = (offer) => {
    sounds.playSuccess();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.55 }
    });
    onDisburseLoan(offer.amount, `${offer.title} disbursement`);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-28 sm:pb-24 md:pb-8">
      {/* Clean, Modern Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Scorecard & Pre-Approved Credit
            </span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-slate-100 tracking-tight">
            Township Working Capital
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Transparent micro-credit unlocked silently after 90 days of verified business ledger transactions.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-800/80 text-xs font-semibold text-amber-300 self-start sm:self-auto">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Funder Status: 92% Complete</span>
        </div>
      </div>

      {/* 90-Day Transaction Tracking Milestone Meter */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-emerald-500/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="text-sm sm:text-base font-bold text-slate-100">
                90-Day Silent Ledger Health Metric
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Tracking consistent sales through WhatsApp intake, SoftPOS, and digitized Boxer/Makro receipts.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-emerald-400 font-mono">84 of 90 Days Logged</span>
            <span className="block text-[10px] text-slate-400">Target reached: Funding unlocked!</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-700"
            style={{ width: '93%' }}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Avg Monthly Turnover</span>
            <span className="font-bold text-slate-100 font-mono">R 16,800.00</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Readiness Score</span>
            <span className="font-bold text-emerald-400 font-mono">{readinessScore}/100</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Supplier Default Rate</span>
            <span className="font-bold text-emerald-400 font-mono">0.0%</span>
          </div>
        </div>
      </div>

      {/* Pre-Approved Micro-Loans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fundingOffers.map((offer) => {
          const isPreApproved = offer.status === 'PRE_APPROVED';
          const isSelected = selectedOffer.id === offer.id;

          return (
            <div
              key={offer.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isPreApproved
                  ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-emerald-500/50 shadow-xl shadow-emerald-950/20'
                  : 'bg-slate-900/60 border-slate-800 opacity-90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    isPreApproved
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {isPreApproved ? 'Pre-Approved Micro-Credit' : 'Unlocking in 14 Days'}
                  </span>

                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    {offer.funder.split(' ')[0]}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100">
                  {offer.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {offer.purpose}
                </p>

                {/* Amount display */}
                <div className="my-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block">
                    Available Credit Limit
                  </span>
                  <div className="text-3xl font-black text-emerald-400 font-mono tracking-tight mt-0.5">
                    R {offer.amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Transparent fee of only {offer.feePercent}% • Zero early settlement penalty
                  </div>
                </div>

                {/* Terms Breakdown */}
                <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                  <div className="flex justify-between py-1 border-b border-slate-800 font-mono text-[11px]">
                    <span className="text-slate-400 font-sans">Repayment Term:</span>
                    <span>{offer.termDays} Days</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800 font-mono text-[11px]">
                    <span className="text-slate-400 font-sans">Installment:</span>
                    <span className="text-emerald-400">
                      {offer.dailyRepayment ? `R ${offer.dailyRepayment.toFixed(2)}/day` : `R ${offer.monthlyRepayment.toFixed(2)}/mo`}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800 font-mono text-[11px]">
                    <span className="text-slate-400 font-sans">Underwriting Logic:</span>
                    <span className="text-slate-300">WhatsApp + SoftPOS verified</span>
                  </div>
                </div>

                {/* Qualifying Factors */}
                <div className="space-y-1 mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Scorecard Validation:
                  </span>
                  {offer.qualifyingFactors.map((factor, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div>
                {isPreApproved ? (
                  <button
                    onClick={() => handleClaimFunds(offer)}
                    disabled={loanDisbursed}
                    className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all ${
                      loanDisbursed
                        ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-default'
                        : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-950/40'
                    }`}
                  >
                    {loanDisbursed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>R 5,000 Disbursed to FNB Account!</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-slate-950" />
                        <span>Unlock & Claim R 5,000 Working Capital</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="w-full py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-semibold flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4 text-slate-500" />
                    <span>Requires 3 More 50% Deposit B2B Orders</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
