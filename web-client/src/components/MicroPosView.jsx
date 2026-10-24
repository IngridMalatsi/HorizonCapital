import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Wifi, 
  CheckCircle2, 
  RotateCcw, 
  Send, 
  QrCode, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Share2,
  FileCheck2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

export default function MicroPosView({ onProcessPayment, currentProfile }) {
  const [amountStr, setAmountStr] = useState('85.00');
  const [paymentMode, setPaymentMode] = useState('NFC'); // 'NFC', 'QR'
  const [posState, setPosState] = useState('IDLE'); // 'IDLE', 'WAITING_TAP', 'AUTHORIZING', 'APPROVED'
  const [lastReceipt, setLastReceipt] = useState(null);

  const handleKeypadPress = (val) => {
    sounds.playPosTap();
    if (val === 'C') {
      setAmountStr('0.00');
      return;
    }
    if (val === 'BACK') {
      const cleaned = amountStr.replace('.', '');
      const sliced = cleaned.length > 1 ? cleaned.slice(0, -1) : '0';
      const num = parseInt(sliced, 10) / 100;
      setAmountStr(num.toFixed(2));
      return;
    }
    
    // Numeric input formatting like POS terminal cents
    const cleaned = (amountStr.replace('.', '') + val).replace(/^0+/, '');
    const num = parseInt(cleaned || '0', 10) / 100;
    if (num > 50000) return; // safety limit R50,000
    setAmountStr(num.toFixed(2));
  };

  const handleSetQuickAmount = (val) => {
    sounds.playPosTap();
    setAmountStr(val.toFixed(2));
  };

  const handleInitiateCharge = () => {
    const amt = parseFloat(amountStr);
    if (amt <= 0) return;
    setPosState('WAITING_TAP');
    sounds.playPosTap();
  };

  // =========================================================================
  // API INTEGRATION POINT: SoftPOS & Tap-to-Pay Gateway
  // Provider: Stitch Money / Yoco SDK / Ozow / Capitec Pay API
  // Replace this simulation with: await processSoftPosPayment(amt, receiptData)
  // =========================================================================
  const handleSimulateCardTap = () => {
    sounds.playPosTap();
    setPosState('AUTHORIZING');

    setTimeout(() => {
      sounds.playSuccess();
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.5 }
      });

      const amt = parseFloat(amountStr);
      const receiptData = {
        txId: `POS-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        merchant: currentProfile.name,
        amount: amt,
        cardScheme: paymentMode === 'NFC' ? 'Visa Contactless (NFC)' : 'Scan to Pay (QR)',
        authCode: `AUTH-${Math.floor(1000 + Math.random() * 9000)}`,
        terminalId: 'SOFT-POS-SOWETO-01'
      };

      setLastReceipt(receiptData);
      setPosState('APPROVED');

      // Credit to digital bank balance
      onProcessPayment(amt, `Micro-POS SoftPOS: ${currentProfile.name} walk-in sale`);
    }, 1400);
  };

  const handleResetPos = () => {
    setPosState('IDLE');
    setAmountStr('0.00');
    sounds.playPosTap();
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-4 sm:space-y-6 pb-28 sm:pb-24 md:pb-8">
      {/* Clean, Modern Header Bar */}
      <div className="flex w-full flex-col items-stretch gap-3 pb-3 sm:pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Contactless SoftPOS Terminal
            </span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-slate-100 tracking-tight">
            Phone Tap-to-Pay (NFC)
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Accept contactless cards on your phone with zero monthly physical card terminal rental fees.
          </p>
        </div>

        {/* SoftPOS Hardware-Free Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-800/80 text-xs font-semibold text-cyan-300 self-start">
          <Wifi className="w-3.5 h-3.5 text-cyan-400" />
          <span>Zero POS Hardware Rental</span>
        </div>
      </div>

      {/* Main Terminal Grid */}
      <div className="grid grid-cols-1 gap-4">
        {/* Left Column: SoftPOS Keypad Terminal */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
            {/* Payment Mode Selector */}
            <div className="grid grid-cols-2 gap-2 mb-4 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <button
                onClick={() => {
                  setPaymentMode('NFC');
                  sounds.playPosTap();
                }}
                className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  paymentMode === 'NFC'
                    ? 'bg-cyan-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Wifi className="w-3.5 h-3.5 rotate-90" />
                <span>NFC Tap to Pay</span>
              </button>
              <button
                onClick={() => {
                  setPaymentMode('QR');
                  sounds.playPosTap();
                }}
                className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  paymentMode === 'QR'
                    ? 'bg-cyan-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Scan to Pay</span>
              </button>
            </div>

            {/* Backlit Display */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-right font-mono shadow-inner mb-4">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-sans">
                Amount to Charge
              </div>
              <div className="text-3xl sm:text-4xl font-black text-cyan-400 tracking-tight mt-0.5">
                R {amountStr}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-sans">
                Direct to {currentProfile.bankName} • Zero settlement delay
              </div>
            </div>

            {/* Quick Amount Chips */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[25, 50, 85, 150].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleSetQuickAmount(amt)}
                  className="py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-bold font-mono transition-colors active:scale-95"
                >
                  R {amt}
                </button>
              ))}
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'BACK'].map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeypadPress(key)}
                  className={`h-12 rounded-xl text-base font-bold font-mono transition-all active:scale-95 flex items-center justify-center ${
                    key === 'C'
                      ? 'bg-rose-950/60 text-rose-300 border border-rose-800/80 hover:bg-rose-900'
                      : key === 'BACK'
                      ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750'
                      : 'bg-slate-950 text-slate-100 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {key === 'BACK' ? '⌫' : key}
                </button>
              ))}
            </div>

            {/* Charge Trigger Button */}
            <button
              onClick={handleInitiateCharge}
              disabled={parseFloat(amountStr) <= 0 || posState === 'WAITING_TAP'}
              className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-950/40 active:scale-98 transition-all disabled:opacity-50"
            >
              <Wifi className="w-4 h-4 rotate-90" />
              <span>{paymentMode === 'NFC' ? `Charge R ${amountStr} via NFC` : `Create R ${amountStr} Scan to Pay request`}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Phone SoftPOS NFC Reader & Approval Slip */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 shadow-2xl min-h-[240px] flex flex-col justify-between">
            {posState === 'IDLE' && (
              <div className="my-auto text-center space-y-4 py-8">
                <div className="w-20 h-20 rounded-full bg-cyan-500/10 border-2 border-dashed border-cyan-500/40 mx-auto flex items-center justify-center text-cyan-400">
                  {paymentMode === 'NFC' ? <Smartphone className="w-10 h-10" /> : <QrCode className="w-10 h-10" />}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-200">
                    Ready for Transaction
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                    {paymentMode === 'NFC'
                      ? 'Enter an amount and start a contactless NFC payment.'
                      : 'Enter an amount to prepare a Scan to Pay request.'}
                  </p>
                </div>
              </div>
            )}

            {posState === 'WAITING_TAP' && (
              <div className="my-auto text-center space-y-5 py-6 animate-in fade-in duration-200">
                {paymentMode === 'NFC' ? (
                  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping" />
                    <div className="absolute inset-2 rounded-full bg-cyan-500/30 animate-pulse" />
                    <div className="relative w-20 h-20 rounded-full bg-cyan-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/40">
                      <Wifi className="w-10 h-10 rotate-90" />
                    </div>
                  </div>
                ) : (
                  <div className="w-28 h-28 mx-auto rounded-2xl bg-white flex items-center justify-center text-slate-950 shadow-xl">
                    <QrCode className="w-20 h-20" aria-hidden="true" />
                  </div>
                )}

                <div>
                  <div className="text-xl font-black text-slate-100 font-mono">
                    R {amountStr}
                  </div>
                  <div className="text-xs font-bold text-cyan-300 mt-1">
                    {paymentMode === 'NFC' ? 'Tap Customer Card or Phone on Screen' : 'Customer Scan to Pay request'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {paymentMode === 'NFC' ? 'NFC Sensor Active • Visa / Mastercard / Apple Pay' : 'Scan request ready • awaiting customer confirmation'}
                  </div>
                </div>

                {/* Simulated interactive tap button */}
                <button
                  onClick={handleSimulateCardTap}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 mx-auto shadow-lg shadow-cyan-950/60 active:scale-95 transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{paymentMode === 'NFC' ? '[Tap Card Here to Authorize]' : '[Simulate Customer Scan]'}</span>
                </button>
              </div>
            )}

            {posState === 'AUTHORIZING' && (
              <div className="my-auto text-center space-y-4 py-8">
                <div className="w-14 h-14 rounded-full border-3 border-cyan-400 border-t-transparent animate-spin mx-auto" />
                <div>
                  <div className="text-sm font-bold text-slate-100">
                    Authorizing with Bank Switch...
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-1">
                    PINless Contactless Verification
                  </div>
                </div>
              </div>
            )}

            {posState === 'APPROVED' && lastReceipt && (
              <div className="space-y-4 animate-in zoom-in-95 duration-200">
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 text-left space-y-3 shadow-inner">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="font-bold text-xs text-emerald-300 uppercase">
                        Payment Approved
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {lastReceipt.authCode}
                    </span>
                  </div>

                  <div className="text-center py-2">
                    <div className="text-2xl font-black text-slate-100 font-mono">
                      R {lastReceipt.amount.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {lastReceipt.merchant} • {lastReceipt.date}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-300 space-y-1 font-mono pt-2 border-t border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Method:</span>
                      <span>{lastReceipt.cardScheme}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Terminal:</span>
                      <span>{lastReceipt.terminalId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Settlement:</span>
                      <span className="text-emerald-400">Instant to FNB Business</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      sounds.playSuccess();
                      alert(`WhatsApp Digital Slip sent to customer for R${lastReceipt.amount.toFixed(2)}!`);
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Digital Receipt via WhatsApp</span>
                  </button>

                  <button
                    onClick={handleResetPos}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>New Transaction</span>
                  </button>
                </div>
              </div>
            )}

            {/* Township Hardware Savings Footer */}
            <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Hardware Hardware Savings: R2,400</span>
              <span className="text-emerald-400 font-semibold">100% Smartphone Powered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
