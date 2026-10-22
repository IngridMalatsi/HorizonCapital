import React from 'react';
import { BadgeCheck, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function TrustQrModal({ currentProfile, deviceMode, onClose }) {
  const shareableUrl = `https://horizoncapital.africa/trust/${currentProfile.id}`;

  return (
    <div
      className={`${deviceMode === 'desktop' ? 'fixed' : 'absolute'} inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="trust-qr-title"
        className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-5 text-center shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between text-left">
          <div>
            <h2 id="trust-qr-title" className="text-base font-bold text-slate-100">Business QR Code</h2>
            <p className="mt-0.5 text-xs text-slate-400">Scan to view the verified trust badge.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close QR code"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-auto flex h-52 w-52 flex-col items-center justify-center rounded-xl bg-white p-4 text-slate-950">
          <QRCodeSVG value={shareableUrl} size={160} level="M" />
          <span className="mt-1 text-[9px] font-bold tracking-wider">VERIFIED BUSINESS PROFILE</span>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-100">
          {currentProfile.name}
          <BadgeCheck className="h-4 w-4 text-emerald-400" />
        </div>
        <p className="mt-1 break-all text-[11px] text-slate-400">{shareableUrl}</p>
      </section>
    </div>
  );
}
