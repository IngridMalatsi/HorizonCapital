import React, { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  CreditCard,
  Edit2,
  HelpCircle,
  History,
  Languages,
  LogOut,
  MapPin,
  Monitor,
  ShieldCheck,
  UserRound,
  User,
  X
} from 'lucide-react';

const menuItems = [
  { label: 'My addresses', icon: MapPin },
  { label: 'My History', icon: History },
  { label: 'Credit cards', icon: CreditCard },
  { label: 'Settings', icon: Monitor, screen: 'settings' },
  { label: 'Help & support', icon: HelpCircle }
];

const businessToolItems = [
  { label: 'WhatsApp orders', screen: 'order-intake' },
  { label: 'SoftPOS', screen: 'micro-pos' },
  { label: 'Business profile, funding & trust', screen: 'profile' }
];

const settingsItems = [
  { label: 'Profile', icon: UserRound, screen: 'user-profile' },
  { label: 'Account settings', icon: ShieldCheck, screen: 'account-settings' },
  { label: 'Notifications', icon: Bell },
  { label: 'Appearance', icon: Monitor, screen: 'appearance' },
  { label: 'Languages', icon: Languages },
  { label: 'Integrations', icon: CreditCard, screen: 'integrations' },
  { label: 'Help & support', icon: HelpCircle }
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
      Demo interface only. Authentication, account changes, image uploads, and account deletion are not connected to a backend.
    </p>
  );
}

export default function AccountFlowView({
  screen,
  onNavigate,
  onSignIn,
  onLogout,
  onOpenIntegrations
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');
  const [twoStep, setTwoStep] = useState(true);
  const [accountSettingsReturn, setAccountSettingsReturn] = useState('user-profile');
  const [profile, setProfile] = useState({
    name: 'Johnathan Alex',
    birthDate: 'Jan 19, 1986',
    phone: '+1878891821',
    gender: 'Male'
  });
  const [accountEmail, setAccountEmail] = useState('john.alex@example.com');
  const [accountPassword, setAccountPassword] = useState('demo-password');
  const [editingField, setEditingField] = useState('');

  if (screen === 'signin') {
    return (
      <div className="max-w-md mx-auto space-y-5 pt-8">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">HorizonCapital</span>
          <h1 className="text-2xl font-bold text-slate-100 mt-2">Sign in</h1>
          <p className="text-sm text-slate-400 mt-1">Continue to your business dashboard.</p>
        </div>
        <DemoNotice />
        <form
          className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setNotice('');
            onSignIn(email.trim());
          }}
        >
          <label className="block text-xs text-slate-300">
            Email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full min-w-0 px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </label>
          <label className="block text-xs text-slate-300">
            Password
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full min-w-0 px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </label>
          <button type="submit" className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm font-semibold text-white">
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setNotice('Password recovery is unavailable because no authentication service is connected.')}
            className="w-full text-center text-xs text-emerald-400 hover:text-emerald-300"
          >
            Forgot Password?
          </button>
          {notice && <p role="status" className="text-xs text-amber-300">{notice}</p>}
        </form>
      </div>
    );
  }

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
            <span className="block text-sm font-semibold text-slate-100">John Alex</span>
            <span className="block text-xs text-slate-400">View profile</span>
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
        <section className="px-3 rounded-xl bg-slate-900 border border-slate-800" aria-label="Business tools">
          {businessToolItems.map(({ label, screen: destination }) => (
            <ListRow key={label} label={label} Icon={UserRound} onClick={() => onNavigate(destination)} />
          ))}
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
                  if (label === 'Integrations') {
                    onOpenIntegrations();
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
        <div className="flex items-center justify-between gap-4 py-2">
          <span className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
            <User className="w-9 h-9" />
          </span>
          <button
            type="button"
            onClick={() => setNotice('Image upload is not available in this demo.')}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
          >
            Add image
          </button>
        </div>
        <div className="px-3 rounded-xl bg-slate-900 border border-slate-800">
          {Object.entries(profile).map(([field, value]) => (
            <div key={field} className="flex items-center gap-3 py-3 border-b border-slate-800 last:border-0">
              <label className="flex-1 min-w-0">
                <span className="block text-[10px] text-slate-400 capitalize">{field === 'birthDate' ? 'Date of birth' : field}</span>
                <input
                  aria-label={field === 'birthDate' ? 'Date of birth' : field}
                  disabled={editingField !== field}
                  value={value}
                  onChange={(event) => setProfile((current) => ({ ...current, [field]: event.target.value }))}
                  className="w-full min-w-0 mt-0.5 bg-transparent disabled:text-slate-200 enabled:text-white text-xs focus:outline-none"
                />
              </label>
              <button
                type="button"
                aria-label={`Edit ${field === 'birthDate' ? 'date of birth' : field}`}
                aria-pressed={editingField === field}
                onClick={() => setEditingField((current) => current === field ? '' : field)}
                className="p-2 text-slate-400 hover:text-emerald-400"
              >
                {editingField === field ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
        {notice && <p role="status" className="text-xs text-amber-300">{notice}</p>}
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
          {[
            { label: 'Login email', value: accountEmail, setter: setAccountEmail, type: 'email' },
            { label: 'Password', value: accountPassword, setter: setAccountPassword, type: 'password' }
          ].map(({ label, value, setter, type }) => (
            <div key={label} className="flex items-center gap-3 py-3 border-b border-slate-800">
              <label className="flex-1 min-w-0 text-[10px] text-slate-400">
                {label}
                <input
                  type={type}
                  value={value}
                  disabled={editingField !== label}
                  onChange={(event) => setter(event.target.value)}
                  className="block w-full min-w-0 mt-1 bg-transparent disabled:text-slate-400 enabled:text-slate-100 text-xs focus:outline-none"
                />
              </label>
              <button
                type="button"
                aria-label={`Edit ${label}`}
                onClick={() => setEditingField((current) => current === label ? '' : label)}
                className="p-2 text-slate-400 hover:text-emerald-400"
              >
                {editingField === label ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
              </button>
            </div>
          ))}
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

  if (screen === 'integrations') {
    return (
      <div className="w-full max-w-full min-w-0 space-y-4">
        <ScreenHeader title="Integrations" onBack={() => onNavigate('settings')} />
        <p className="text-sm text-slate-400">Open the existing integration settings panel to review configured providers.</p>
        <button type="button" onClick={onOpenIntegrations} className="w-full py-3 rounded-xl bg-emerald-600 text-sm font-semibold text-white">
          Open integrations
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

  const unavailableLabel = screen.startsWith('unavailable:') ? screen.slice('unavailable:'.length) : 'This section';
  return (
    <div className="w-full max-w-full min-w-0 space-y-4">
      <ScreenHeader title={unavailableLabel} onBack={() => onNavigate('menu')} />
      <p className="text-sm text-slate-400">{unavailableLabel} is not available in the current dashboard. No settings or records were changed.</p>
      <DemoNotice />
    </div>
  );
}
