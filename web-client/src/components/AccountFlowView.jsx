import React, { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  CreditCard,
  HelpCircle,
  History,
  Languages,
  LogOut,
  MapPin,
  Monitor,
  ShieldCheck,
  UserRound,
  User,
} from 'lucide-react';

const menuItems = [
  { label: 'My addresses', icon: MapPin },
  { label: 'My History', icon: History },
  { label: 'Credit cards', icon: CreditCard },
  { label: 'Help & support', icon: HelpCircle, screen: 'help-support' }
];

const businessToolItems = [
  { label: 'Township Working Capital', icon: CreditCard, screen: 'profile-funding' },
  { label: 'Market Linker & Trust Badge', icon: ShieldCheck, screen: 'profile-trust' }
];

const businessSettingsItems = [
  { label: 'User Account Settings', icon: UserRound, screen: 'profile-account' },
  { label: 'Application Settings', icon: Monitor, screen: 'profile-settings' }
];

const settingsItems = [
  { label: 'Profile', icon: UserRound, screen: 'user-profile' },
  { label: 'Account settings', icon: ShieldCheck, screen: 'account-settings' },
  { label: 'Notifications', icon: Bell },
  { label: 'Appearance', icon: Monitor, screen: 'appearance' },
  { label: 'Languages', icon: Languages },
  { label: 'Help & support', icon: HelpCircle, screen: 'help-support' }
];

function ScreenHeader({ title, onBack }) {
  return (
    <header className="flex items-center gap-3 border-b border-slate-800 pb-4">
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back"
        className="p-2 -ml-2 rounded-lg text-slate-300 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <h1 className="text-xl font-bold text-slate-100">{title}</h1>
    </header>
  );
}

function ListRow({ label, Icon, onClick, destructive = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full min-w-0 flex items-center gap-3 py-3 border-b border-slate-800 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 ${
        destructive ? 'text-rose-400' : 'text-slate-200'
      }`}
    >
      <Icon className={`w-4 h-4 shrink-0 ${destructive ? 'text-rose-400' : 'text-slate-400'}`} />
      <span className="flex-1 min-w-0 text-sm break-words">{label}</span>
      {!destructive && <ChevronRight className="w-4 h-4 shrink-0 text-slate-500" />}
    </button>
  );
}

function DemoNotice() {
  return (
    <p className="text-[11px] leading-relaxed text-slate-400 bg-slate-900 border border-slate-800 rounded-xl p-3">
      Account identity is loaded from your signed-in account. Business balances, transactions, and funding activity shown in this prototype are demo data and are not synced.
    </p>
  );
}

export default function AccountFlowView({
  screen,
  onNavigate,
  onLogout,
  userEmail = '',
  userName = '',
  businessName = '',
}) {
  const [notice, setNotice] = useState('');
  const [twoStep, setTwoStep] = useState(true);
  const [accountSettingsReturn, setAccountSettingsReturn] = useState('user-profile');
  const [helpSupportReturn, setHelpSupportReturn] = useState('menu');
  if (screen === 'menu') {
    return (
      <div className="w-full max-w-full min-w-0 space-y-4">
        <header className="pb-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">Account</span>
          <h1 className="text-2xl font-bold text-slate-100 mt-1">Menu</h1>
        </header>
        <button
          type="button"
          onClick={() => onNavigate('user-profile')}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-left hover:border-slate-700"
        >
          <span className="w-11 h-11 rounded-full bg-slate-700 flex items-center justify-center text-slate-200 shrink-0">
            <User className="w-6 h-6" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-semibold text-slate-100 truncate">{userName || userEmail || 'Account'}</span>
            <span className="block text-xs text-slate-400 truncate">{userEmail || businessName || 'View profile'}</span>
          </span>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
        <nav aria-label="Account menu" className="px-3 rounded-xl bg-slate-900 border border-slate-800">
          {menuItems.map(({ label, icon, screen: destination }) => {
            const Icon = icon;
            return (
              <ListRow
                key={label}
                label={label}
                Icon={Icon}
                onClick={() => destination ? onNavigate(destination) : onNavigate(`unavailable:${label}`)}
              />
            );
          })}
        </nav>
        <section className="space-y-2" aria-label="Business tools">
          <h2 className="px-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">Business</h2>
          <nav className="px-3 rounded-xl bg-slate-900 border border-slate-800">
            {businessToolItems.map(({ label, icon: Icon, screen: destination }) => (
              <ListRow key={label} label={label} Icon={Icon} onClick={() => onNavigate(destination)} />
            ))}
          </nav>
        </section>
        <section className="space-y-2" aria-label="Business and application settings">
          <h2 className="px-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">Settings</h2>
          <nav className="px-3 rounded-xl bg-slate-900 border border-slate-800">
            {businessSettingsItems.map(({ label, icon: Icon, screen: destination }) => (
              <ListRow key={label} label={label} Icon={Icon} onClick={() => onNavigate(destination)} />
            ))}
          </nav>
        </section>
        <DemoNotice />
      </div>
    );
  }

  if (screen === 'settings') {
    return (
      <div className="w-full max-w-full min-w-0 space-y-4">
        <ScreenHeader title="Settings" onBack={() => onNavigate('menu')} />
        <nav aria-label="Settings" className="px-3 rounded-xl bg-slate-900 border border-slate-800">
          {settingsItems.map(({ label, icon, screen: destination }) => {
            const Icon = icon;
            return (
              <ListRow
                key={label}
                label={label}
                Icon={Icon}
                onClick={() => {
                  if (destination === 'help-support') {
                    setHelpSupportReturn(screen);
                    onNavigate(destination);
                  } else if (label === 'Account settings') {
                    setAccountSettingsReturn('settings');
                    onNavigate('account-settings');
                  } else if (destination) {
                    onNavigate(destination);
                  } else {
                    onNavigate(`unavailable:${label}`);
                  }
                }}
              />
            );
          })}
          <ListRow label="Log out" Icon={LogOut} destructive onClick={onLogout} />
        </nav>
        <DemoNotice />
      </div>
    );
  }

  if (screen === 'user-profile') {
    return (
      <div className="w-full max-w-full min-w-0 space-y-4">
        <ScreenHeader title="Profile" onBack={() => onNavigate('menu')} />
        <DemoNotice />
        <div className="flex items-center gap-4 py-2">
          <span className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
            <User className="w-9 h-9" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-100 break-words">{userName || 'Account'}</p>
            <p className="text-xs text-slate-400 break-all">{userEmail || 'Email unavailable'}</p>
          </div>
        </div>
        <div className="px-3 rounded-xl bg-slate-900 border border-slate-800">
          {[
            ['Account name', userName || 'Not set'],
            ['Email', userEmail || 'Not available'],
            ['Business name', businessName || 'Not set'],
          ].map(([label, value]) => (
            <div key={label} className="py-3 border-b border-slate-800 last:border-0">
              <span className="block text-[10px] text-slate-400">{label}</span>
              <span className="mt-0.5 block break-words text-xs text-slate-200">{value}</span>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            setAccountSettingsReturn('user-profile');
            onNavigate('account-settings');
          }}
          className="w-full py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-slate-100"
        >
          Account settings
        </button>
      </div>
    );
  }

  if (screen === 'account-settings') {
    return (
      <div className="w-full max-w-full min-w-0 space-y-4">
        <ScreenHeader title="Account settings" onBack={() => onNavigate(accountSettingsReturn)} />
        <DemoNotice />
        <div className="px-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="border-b border-slate-800 py-3">
            <span className="block text-[10px] text-slate-400">Account name</span>
            <span className="mt-1 block break-words text-xs text-slate-200">{userName || 'Not set'}</span>
          </div>
          <div className="border-b border-slate-800 py-3">
            <span className="block text-[10px] text-slate-400">Login email</span>
            <span className="mt-1 block break-all text-xs text-slate-200">{userEmail || 'Not available'}</span>
          </div>
          <div className="border-b border-slate-800 py-3">
            <span className="block text-[10px] text-slate-400">Business name</span>
            <span className="mt-1 block break-words text-xs text-slate-200">{businessName || 'Not set'}</span>
          </div>
          <p className="py-3 text-xs leading-relaxed text-slate-400">
            Passwords are securely managed by Supabase Auth and are never shown here.
          </p>
          <div className="flex items-center gap-3 py-3 border-b border-slate-800">
            <div className="flex-1 min-w-0">
              <span className="block text-xs text-slate-200">Two step verification</span>
              <span className="block text-[10px] text-slate-400">Title name</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-label="Two step verification"
              aria-checked={twoStep}
              onClick={() => setTwoStep((current) => !current)}
              className={`w-11 h-6 p-1 rounded-full transition-colors ${twoStep ? 'bg-emerald-500' : 'bg-slate-700'}`}
            >
              <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${twoStep ? 'translate-x-5' : ''}`} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setNotice('Connected device management is not available in this demo.')}
            className="w-full flex items-center py-3 text-left"
          >
            <span className="flex-1">
              <span className="block text-xs text-slate-200">Connected devices</span>
              <span className="block text-[10px] text-slate-400">1 device</span>
            </span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        {notice && <p role="status" className="text-xs text-amber-300">{notice}</p>}
        <button
          type="button"
          onClick={() => setNotice('Account deletion is unavailable in this demo. No account was deleted.')}
          className="w-full py-3 rounded-xl border border-rose-900/70 text-sm font-semibold text-rose-400 hover:bg-rose-950/30"
        >
          Delete my account
        </button>
      </div>
    );
  }

  if (screen === 'appearance') {
    return (
      <div className="w-full max-w-full min-w-0 space-y-4">
        <ScreenHeader title="Appearance" onBack={() => onNavigate('settings')} />
        <p className="text-sm text-slate-400">Dashboard display options are available in your business Profile.</p>
        <button type="button" onClick={() => onNavigate('profile')} className="w-full py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-slate-100">
          Open Profile
        </button>
      </div>
    );
  }

  if (screen === 'help-support') {
    return (
      <div className="w-full max-w-full min-w-0 space-y-4">
        <ScreenHeader title="Help & Support" onBack={() => onNavigate(helpSupportReturn)} />
        <p className="text-sm leading-relaxed text-slate-300">
          Find guidance for using HorizonCapital on the web or in the mobile app. Both clients share the same screens and account.
        </p>
        <section className="space-y-3" aria-label="Help topics">
          {[
            {
              title: 'Signing in and your profile',
              detail: 'Sign in with your email and password. Your name and business name come from your account details. If your business profile cannot load, confirm that the Supabase profiles migration has been applied to your project.',
            },
            {
              title: 'Keeping your information safe',
              detail: 'Use a unique password and never share passwords or one-time codes. HorizonCapital does not need your bank login credentials. Do not enter real bank details, identity documents, customer contact information, or other sensitive data in this prototype.',
            },
            {
              title: 'Dashboard and ledger',
              detail: 'The dashboard, balances, readiness score, and ledger currently use sample data for demonstration. Transactions are not saved to a bank or synchronized between sessions.',
            },
            {
              title: 'WhatsApp order review',
              detail: 'The WhatsApp screen demonstrates reviewing sample or pasted order messages and simulated risk indicators. It does not connect to WhatsApp, send messages, or make real credit decisions.',
            },
            {
              title: 'Using web and mobile',
              detail: 'The Expo app displays the shared web client. During development, keep the web client and shared API server running, and ensure your phone and computer are on the same Wi-Fi network. A phone must use your computer’s LAN address rather than localhost.',
            },
            {
              title: 'Troubleshooting',
              detail: 'If the shared API is unavailable, start the Node.js server from the server folder. From the computer, check http://localhost:4000/api/health. For phone access, use the computer’s LAN address. If sign-in or profile setup fails, verify the web client Supabase URL and publishable key and confirm the Supabase profiles migration has been applied.',
            },
          ].map(({ title, detail }) => (
            <article key={title} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">{detail}</p>
            </article>
          ))}
        </section>
        <p className="rounded-xl border border-amber-900/60 bg-amber-950/30 p-3 text-xs leading-relaxed text-amber-200">
          This is a prototype. Do not use its sample balances, funding results, or order assessments for real financial decisions. For account-specific help, contact the HorizonCapital project administrator through your usual support channel.
        </p>
      </div>
    );
  }

  const unavailableLabel = screen.startsWith('unavailable:') ? screen.slice('unavailable:'.length) : 'This section';
  return (
    <div className="w-full max-w-full min-w-0 space-y-4">
      <ScreenHeader title={unavailableLabel} onBack={() => onNavigate('menu')} />
      <p className="text-sm text-slate-400">{unavailableLabel} is not available in the current dashboard. No settings or records were changed.</p>
      <DemoNotice />
    </div>
  );
}
