import React, { useState } from 'react';
import { 
  BadgeCheck, 
  ShieldCheck, 
  Building2, 
  FileCheck2, 
  Share2, 
  Copy, 
  Check, 
  Star, 
  QrCode, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function MarketLinkerView({
  currentProfile,
  onOpenReport
}) {
  // =========================================================================
  // API INTEGRATION POINT: CIPC & SARS Registry Validation
  // Provider: South Africa CIPC BizPortal API / SARS eFiling Compliance PIN API
  // Config / Env: VITE_CIPC_VERIFICATION_KEY (see src/config/apiConfig.js)
  // Call: await verifyCipcBusiness(currentProfile.cipcReg)
  // =========================================================================
  const [copiedLink, setCopiedLink] = useState(false);
  const shareableUrl = `https://horizoncapital.africa/trust/${currentProfile.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    sounds.playSuccess();
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-4 sm:space-y-6">
      {/* Clean, Modern Header Bar */}
      <div className="flex w-full flex-col items-stretch gap-3 pb-3 sm:pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Verified Digital Identity & Trust
            </span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-slate-100 tracking-tight">
            Market Linker & Trust Badge
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Aggregated CIPC registration, SARS tax good standing, and customer ratings for corporate ESD contracts.
          </p>
        </div>

        <div className="flex w-full flex-wrap gap-2">
          <button
            onClick={onOpenReport}
            className="min-w-0 flex-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Funder PDF</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left = Verified Profile Dossier | Right = Shareable Trust Badge */}
      <div className="grid grid-cols-1 2xl:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Column: Aggregated Compliance Credentials */}
        <div className="2xl:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center text-3xl shadow-inner">
                  {currentProfile.avatar}
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
                    {currentProfile.name}
                    <BadgeCheck className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                  </h2>
                </div>
              </div>
            </div>

            {/* Aggregated Institutional Checklist */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
                Official Regulatory & Banking Footprint
              </span>

              {/* CIPC Registration */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">CIPC Business Registration</div>
                    <div className="text-[10px] text-slate-400 font-mono">{currentProfile.cipcReg}</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Verified Active
                </span>
              </div>

              {/* SARS Tax Pin */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">SARS Tax Compliance Status</div>
                    <div className="text-[10px] text-slate-400 font-mono">PIN: {currentProfile.sarsTaxPin}</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Good Standing
                </span>
              </div>

              {/* Verified Bank Account */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">Verified Business Banking</div>
                    <div className="text-[10px] text-slate-400 font-mono">{currentProfile.bankName} ({currentProfile.accountNumber})</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  12+ Mo History
                </span>
              </div>

              {/* Customer Reviews & Rating */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">Township Customer Reputation</div>
                    <div className="text-[10px] text-slate-400">{currentProfile.reviewCount} Verified WhatsApp & SoftPOS Buyers</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-300 font-bold font-mono text-xs">
                  <span>{currentProfile.rating} / 5.0</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Shareable Digital Trust Badge (Concept 3) */}
        <div className="2xl:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/40 shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Shareable Digital Footprint
              </span>
              <span className="text-[10px] text-slate-400 font-mono">ID: {currentProfile.id}</span>
            </div>

            {/* Trust Badge Display */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-cyan-950/60 border-2 border-emerald-500/60 shadow-xl space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="w-14 h-14 rounded-2xl bg-slate-900/90 border border-emerald-500/50 mx-auto flex items-center justify-center text-3xl shadow-lg">
                {currentProfile.avatar}
              </div>

              <div>
                <h3 className="font-black text-lg text-slate-100 flex items-center justify-center gap-1.5">
                  {currentProfile.name}
                  <BadgeCheck className="w-5 h-5 text-emerald-400" />
                </h3>
                <div className="text-xs text-emerald-400 font-semibold mt-0.5">
                  HorizonCapital Verified Supplier
                </div>
              </div>

              {/* Dynamic QR Code representation */}
              <div className="p-3 bg-white rounded-xl w-36 h-36 mx-auto flex flex-col items-center justify-center shadow-lg">
                <QrCode className="w-28 h-28 text-slate-950" />
                <span className="text-[8px] text-slate-700 font-bold tracking-tight">SCAN FOR VERIFIED TRUST</span>
              </div>

              <div className="pt-2 text-[10px] text-slate-300 font-mono">
                CIPC: {currentProfile.cipcReg} • SARS: PIN Valid
              </div>
            </div>

            {/* Shareable Link Box */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 text-xs">
              <span className="text-slate-400 font-mono truncate text-[11px]">
                {shareableUrl}
              </span>
              <button
                onClick={handleCopyLink}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Share to Corporate Procurement Button */}
            <button
              onClick={() => {
                handleCopyLink();
                sounds.playSuccess();
                alert(`Trust Badge Link copied! Send this link to Anglo American, Woolworths, or any corporate procurement portal.`);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Trust Badge with Corporate Buyers</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
