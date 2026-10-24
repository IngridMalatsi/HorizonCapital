import React, { useState } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Copy, 
  Check, 
  ArrowRight, 
  ShieldAlert, 
  RotateCcw, 
  DollarSign, 
  Calendar, 
  User, 
  Package, 
  Clock, 
  Percent, 
  Zap,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

export default function OrderIntakeView({
  presets,
  currentPresetId,
  onSelectPreset,
  onAcceptCounterOffer,
  orderAccepted,
  readinessScore
}) {
  const activePreset = presets.find(p => p.id === currentPresetId) || presets[0];

  const [inputMessage, setInputMessage] = useState(activePreset.rawMessage);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(4); // 1: Parsing, 2: Economics, 3: Cashflow, 4: Done
  const [copied, setCopied] = useState(false);
  const [customCounterDeposit, setCustomCounterDeposit] = useState(50);

  // When preset changes, update message
  const handleSelectPreset = (preset) => {
    onSelectPreset(preset.id);
    setInputMessage(preset.rawMessage);
    setAnalysisStep(4);
    sounds.playPosTap();
  };

  const handleRunAiAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisStep(1);
    sounds.playPosTap();

    setTimeout(() => setAnalysisStep(2), 600);
    setTimeout(() => setAnalysisStep(3), 1200);
    setTimeout(() => {
      setAnalysisStep(4);
      setIsAnalyzing(false);
      if (activePreset.extractedData.riskLevel === 'CRITICAL') {
        sounds.playWarning();
      } else {
        sounds.playSuccess();
      }
    }, 1800);
  };

  const handleCopyCounterOffer = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    sounds.playSuccess();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAcceptSimulation = () => {
    // Fire confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    sounds.playSuccess();
    onAcceptCounterOffer(activePreset);
  };

  const extracted = activePreset.extractedData;
  const isCriticalRisk = extracted.riskLevel === 'CRITICAL';
  return (
    <div className="w-full max-w-full min-w-0 space-y-4 sm:space-y-6 pb-28 sm:pb-24 md:pb-8">
      {/* Clean, Modern Header Bar */}
      <div className="flex w-full flex-col items-stretch gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Order Intake & Verification</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            WhatsApp Order Risk Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Review sample order details and demonstration risk indicators. This screen does not connect to WhatsApp or an AI service.
          </p>
        </div>

      </div>

      <section className="w-full min-w-0 p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3" aria-labelledby="whatsapp-orders-title">
        <div className="pb-2 border-b border-slate-800/80">
          <h2 id="whatsapp-orders-title" className="text-sm font-semibold text-slate-200">WhatsApp Orders</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Choose an order to review its message and cash-flow risk.</p>
        </div>
        <ul className="space-y-2">
          {presets.map((preset) => {
            const order = preset.extractedData;
            const isSelected = preset.id === currentPresetId;

            return (
              <li key={preset.id} className={`min-w-0 p-3 rounded-xl bg-slate-950 border text-xs transition-colors ${
                isSelected ? 'border-emerald-700/70' : 'border-slate-800'
              }`}>
                <button
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  aria-pressed={isSelected}
                  className="w-full min-w-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 rounded"
                >
                  <span className="block text-slate-200 font-semibold break-words">
                    <span className="text-emerald-400 mr-2" aria-hidden="true">•</span>{order.item}
                  </span>
                  <span className="block mt-1 pl-4 text-[11px] text-slate-400 break-words">
                    {order.client} · {order.quantity} ordered · Due {order.deadline}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Main Grid: Left = WhatsApp Input Interface | Right = Risk & Decision Engine */}
      <div className="grid grid-cols-1 gap-4">
        {/* Left Column: Screen 2 (Zero-Friction WhatsApp Interface) */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">WhatsApp Business Chat</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Sender: {activePreset.sender}
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Today, 11:34 AM</span>
            </div>

            {/* Simulated WhatsApp Chat Bubble */}
            <div className="p-4 rounded-2xl rounded-tl-sm bg-[#FFF1E8] border border-orange-500 text-slate-800 shadow-inner leading-relaxed relative">
              <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold mb-1.5">
                <span>{activePreset.sender}</span>
                <span className="text-[10px] uppercase tracking-wider bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">Township Order</span>
              </div>
              <p className="whitespace-pre-line text-[13px] sm:text-[14px] leading-relaxed text-emerald-50 tracking-normal font-normal">{inputMessage}</p>
              <div className="text-right text-[10px] text-emerald-400/80 mt-2 font-mono">
                11:34 AM ✓✓
              </div>
            </div>

            <div className="mt-3">
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Edit or Paste Another WhatsApp Message:
              </label>
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                maxLength={4000}
                rows={3}
                placeholder="Paste informal chat message here (e.g. 'Hi, need 100 muffins for Saturday...')"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 transition-colors resize-none"
              />
              <p className="mt-2 text-[11px] leading-relaxed text-amber-300">
                Demo only: do not paste real phone numbers, addresses, ID details, banking credentials, or other sensitive personal information. Text stays in this browser and is not sent to WhatsApp or an AI provider.
              </p>
            </div>

            <button
              onClick={handleRunAiAnalysis}
              disabled={isAnalyzing}
              className="w-full mt-3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-98 transition-all disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-emerald-200" />
                  <span>Running demo analysis...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Run demo order analysis</span>
                </>
              )}
            </button>

            {/* Realtime Extraction Progress Stepper */}
            {isAnalyzing && (
              <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1.5 animate-in fade-in duration-150">
                <div className={`flex items-center gap-2 ${analysisStep >= 1 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                  <Check className="w-3.5 h-3.5" />
                  <span>1. Parsing quantities, items & delivery deadline...</span>
                </div>
                <div className={`flex items-center gap-2 ${analysisStep >= 2 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                  <Check className="w-3.5 h-3.5" />
                  <span>2. Calculating unit economics (ingredients vs margin)...</span>
                </div>
                <div className={`flex items-center gap-2 ${analysisStep >= 3 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                  <Check className="w-3.5 h-3.5" />
                  <span>3. Running 13-week cash-flow buffer simulation...</span>
                </div>
                <div className={`flex items-center gap-2 ${analysisStep >= 4 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                  <Check className="w-3.5 h-3.5" />
                  <span>4. Checking township buyer fraud & late payment records...</span>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Intelligence, Risk Assessment & Counter-Offer */}
        <div className="space-y-4">
          {/* Intelligence & Risk Analysis */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300">
                  Unit Economics & Reserve Solvency
                </span>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                isCriticalRisk
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
              }`}>
                {isCriticalRisk ? <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                {isCriticalRisk ? 'Critical Cash Risk' : 'Low Risk Order'}
              </span>
            </div>

            {/* Unit Economics Breakdown Card */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 p-2.5 sm:p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block truncate">Revenue</span>
                <span className="text-xs sm:text-base font-bold text-slate-100 font-mono truncate block">
                  R {extracted.offeredPrice.toLocaleString('en-ZA')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block truncate">Ingredients</span>
                <span className="text-xs sm:text-base font-bold text-rose-400 font-mono truncate block">
                  -R {extracted.productionCost.toLocaleString('en-ZA')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block truncate">Gross Margin</span>
                <span className="text-xs sm:text-base font-bold text-emerald-400 font-mono truncate block">
                  R {extracted.grossProfit.toLocaleString('en-ZA')} ({extracted.marginPercent}%)
                </span>
              </div>
            </div>

            {/* Risk Warnings & Pattern Flags */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Identified Cash Flow & Buyer Risk Patterns:</span>
              </div>
              <div className="space-y-1.5">
                {extracted.riskReasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                      isCriticalRisk
                        ? 'bg-rose-950/30 border-rose-800/50 text-rose-200'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="text-rose-400 font-bold shrink-0 mt-0.5">•</span>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* The Critical Verdict: "Can I Afford to Say Yes Right Now?" */}
            <div className="p-4 rounded-xl border border-orange-500 bg-[#FFF1E8]">
              <div className="text-xs text-black uppercase tracking-wider font-semibold">
                Decision Engine Verdict:
              </div>
              <div className="text-base sm:text-lg font-black mt-0.5 text-black flex items-center gap-2">
                {isCriticalRisk ? (
                  <>
                    <span className="text-rose-400">CANNOT AFFORD TO ACCEPT ON UNHEDGED CREDIT</span>
                  </>
                ) : (
                  <>
                    <span className="text-emerald-400">SAFE TO ACCEPT ON PROPOSED TERMS</span>
                  </>
                )}
              </div>
              <p className="text-xs text-black mt-1">
                {isCriticalRisk
                  ? "Saying 'Yes' as-is will empty your cash drawer for raw ingredients, leaving you with only R320 before delivery payout. If Mbali pays late (as she did 3 times before), your bakery faces immediate insolvency."
                  : "Order terms cover your raw material costs with safe buffer headroom. You can proceed with standard confirmation."}
              </p>
            </div>
          </div>

          {/* Counter-Offer Generator */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300">
                  Recommended Safe Counter-Offer
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                50% Upfront Deposit Policy
              </span>
            </div>

            {/* Counter-Offer Breakdown */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-bold text-slate-200 mb-2">
                Recommended Solution: 50% Upfront Commitment
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/40">
                  <span className="text-[10px] text-slate-400 block">Upfront Deposit (Now)</span>
                  <span className="text-sm font-black text-emerald-400 font-mono">
                    R {extracted.counterOfferRecommendation.depositAmount.toLocaleString('en-ZA')}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Fully funds R650 raw materials</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Delivery Balance (Saturday)</span>
                  <span className="text-sm font-black text-slate-200 font-mono">
                    R {extracted.counterOfferRecommendation.balanceAmount.toLocaleString('en-ZA')}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Paid via SoftPOS Tap or Cash</span>
                </div>
              </div>
            </div>

            {/* Generated WhatsApp Counter-Offer Message */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Respectful Township Counter-Offer Text:</span>
                </span>
                <button
                  onClick={() => handleCopyCounterOffer(extracted.counterOfferRecommendation.proposedMessage)}
                  className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy WhatsApp Text</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-[13px] sm:text-[14px] text-slate-100 leading-relaxed relative">
                <p className="whitespace-pre-line font-normal">
                  {extracted.counterOfferRecommendation.proposedMessage}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleAcceptSimulation}
                disabled={orderAccepted}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xl active:scale-98 transition-all ${
                  orderAccepted
                    ? 'bg-emerald-900 text-emerald-200 border border-emerald-700 cursor-default'
                    : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-950/50'
                }`}
              >
                {orderAccepted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Counter-Offer Accepted & Cash Flow De-risked! (+6 Readiness Points)</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Send Counter-Offer & Simulate Safe Order Acceptance</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleCopyCounterOffer(extracted.counterOfferRecommendation.proposedMessage)}
                  className="py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Send className="w-3 h-3 text-emerald-400" />
                  <span>Send via WhatsApp</span>
                </button>
                <button
                  onClick={() => {
                    sounds.playWarning();
                    alert("Order safely declined. You protected your cash flow buffer of R500.");
                  }}
                  className="py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-rose-300 border border-slate-700/80 font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <AlertCircle className="w-3 h-3 text-rose-400" />
                  <span>Decline Safely</span>
                </button>
              </div>
            </div>

            {/* Impact on Score & Buffer Summary */}
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Simulated Impact: Increases Readiness Score from 78 → 84/100</span>
              </span>
              <span className="font-mono font-bold text-emerald-400">+R750 Protected Inflow</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
