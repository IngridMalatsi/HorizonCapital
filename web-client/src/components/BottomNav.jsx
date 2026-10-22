import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  MessageSquareCheck,
  Menu as MenuIcon
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function BottomNav({ activeTab, onSelectTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'ledger', label: 'Ledger', icon: Wallet },
    { id: 'order-intake', label: 'WhatsApp', icon: MessageSquareCheck },
    { id: 'menu', label: 'Menu', icon: MenuIcon },
  ];
  const accountScreens = [
    'menu',
    'settings',
    'user-profile',
    'account-settings',
    'integrations',
    'appearance',
    'profile',
    'profile-funding',
    'profile-trust',
    'profile-account',
    'profile-settings'
  ];
  const currentTab = accountScreens.includes(activeTab) || activeTab.startsWith('unavailable:')
    ? 'menu'
    : activeTab;

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-30 w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-800/90 text-slate-400 px-1 py-1 shadow-2xl shrink-0 select-none">
      <div className="max-w-lg mx-auto grid grid-cols-4 gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                sounds.playPosTap();
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg transition-all relative min-h-[46px] ${
                isActive
                  ? 'text-emerald-400 font-semibold bg-emerald-950/50'
                  : 'hover:text-slate-200 active:bg-slate-800/50'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-emerald-400' : 'text-slate-400'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-[8px] font-bold text-slate-950 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight truncate max-w-full ${
                isActive ? 'font-semibold text-emerald-400' : 'font-normal text-slate-400'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0.5 w-5 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
