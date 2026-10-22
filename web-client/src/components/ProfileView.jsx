import React from 'react';
import {
  Building2,
  KeyRound,
  Monitor,
  Smartphone,
  Tablet,
  Volume2,
  VolumeX
} from 'lucide-react';
import FundingView from './FundingView';
import MarketLinkerView from './MarketLinkerView';

const deviceOptions = [
  { id: 'desktop', label: 'Desktop', Icon: Monitor },
  { id: 'tablet', label: 'Tablet', Icon: Tablet },
  { id: 'smartphone', label: 'Phone', Icon: Smartphone }
];

export default function ProfileView({
  currentProfile,
  readinessScore,
  fundingOffers,
  onDisburseLoan,
  loanDisbursed,
  onOpenReport,
  soundEnabled,
  onToggleSound,
  deviceMode,
  onSelectDeviceMode,
  onOpenApiKeys
}) {
  const accountDetails = [
    { label: 'Account owner', value: currentProfile.owner },
    { label: 'Contact number', value: currentProfile.phone },
    { label: 'Business registration', value: currentProfile.cipcReg },
    { label: 'Business bank', value: `${currentProfile.bankName} (${currentProfile.accountNumber})` }
  ];

  return (
    <div className="w-full max-w-full min-w-0 space-y-5 sm:space-y-7 pb-28 sm:pb-24 md:pb-8">
      <header className="pb-4 border-b border-slate-800">
        <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Business profile</span>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight mt-1">Profile</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          Manage funding, trust information, account details, and the application preferences available for this dashboard.
        </p>
      </header>

      <nav aria-label="Profile sections" className="flex gap-2 overflow-x-auto pb-1">
        {[
          ['profile-funding', 'Funding'],
          ['profile-trust', 'Trust'],
          ['profile-account', 'User account'],
          ['profile-settings', 'Application settings']
        ].map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className="shrink-0 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-emerald-300 hover:border-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
          >
            {label}
          </a>
        ))}
      </nav>

      <section id="profile-funding" className="scroll-mt-4 min-w-0">
        <FundingView
          fundingOffers={fundingOffers}
          readinessScore={readinessScore}
          onDisburseLoan={onDisburseLoan}
          loanDisbursed={loanDisbursed}
          currentProfile={currentProfile}
        />
      </section>

      <section id="profile-trust" className="scroll-mt-4 min-w-0">
        <MarketLinkerView currentProfile={currentProfile} onOpenReport={onOpenReport} />
      </section>

      <section id="profile-account" className="scroll-mt-4 p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 min-w-0">
        <div className="flex items-start gap-3 pb-3 border-b border-slate-800">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><Building2 className="w-5 h-5" /></div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-slate-100">User Account Settings</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Read-only details for the active business profile. Switch profiles using the selector in the top bar.
            </p>
          </div>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {accountDetails.map(({ label, value }) => (
            <div key={label} className="min-w-0 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <dt className="text-[10px] uppercase tracking-wide text-slate-400">{label}</dt>
              <dd className="mt-1 text-xs text-slate-200 font-medium break-words">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="profile-settings" className="scroll-mt-4 p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 min-w-0">
        <div className="pb-3 border-b border-slate-800">
          <h2 className="text-sm sm:text-base font-bold text-slate-100">Application Settings</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Existing dashboard preferences and integration controls.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
          <div className="min-w-0 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <VolumeX className="w-4 h-4 text-slate-400 shrink-0" />}
                <div className="min-w-0">
                  <h3 className="text-xs font-semibold text-slate-200">Tactile sound effects</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Play sounds for dashboard actions.</p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={soundEnabled}
                onClick={onToggleSound}
                className={`shrink-0 px-3 py-1.5 rounded-lg border text-[11px] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 ${
                  soundEnabled ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-slate-900 text-slate-300 border-slate-700'
                }`}
              >
                {soundEnabled ? 'On' : 'Off'}
              </button>
            </div>
          </div>

          <div className="min-w-0 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <Monitor className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-semibold text-slate-200">Display preview</h3>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {deviceOptions.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={deviceMode === id}
                  onClick={() => onSelectDeviceMode(id)}
                  className={`min-w-0 py-2 px-1 rounded-lg border text-[10px] font-medium flex flex-col items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 ${
                    deviceMode === id ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="min-w-0 p-3 rounded-xl bg-slate-950 border border-slate-800 lg:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <h3 className="text-xs font-semibold text-slate-200">API integration keys</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Manage the existing integration configuration panel.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenApiKeys}
              className="shrink-0 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
            >
              Open API key settings
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
