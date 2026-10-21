import React, { useState } from 'react';
import { 
  Building2, 
  Smartphone, 
  Tablet,
  Monitor, 
  Volume2, 
  VolumeX, 
  FileText, 
  CheckCircle2, 
  ChevronDown, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Key,
  MoreVertical,
  X
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function Navbar({
  currentProfile,
  onSelectProfile,
  profiles,
  deviceMode,
  onSelectDeviceMode,
  soundEnabled,
  onToggleSound,
  onOpenReport,
  onOpenApiKeys,
  readinessScore
}) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shrink-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-600 text-white shadow-sm shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-sm sm:text-base font-bold tracking-tight text-white whitespace-nowrap">
                Horizon<span className="text-emerald-400">Capital</span>
              </span>
              <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 uppercase tracking-wider">
                Readiness Engine
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 hidden sm:block">
              Township MSME Operating System
            </p>
          </div>
        </div>

        {/* Center / Right Control Tray */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Active Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-colors text-xs font-medium"
              title="Switch business profile"
            >
              <span className="text-base">{currentProfile.avatar}</span>
              <div className="text-left hidden sm:block max-w-[120px] md:max-w-none truncate">
                <div className="font-semibold text-slate-200 flex items-center gap-1 text-[11px] md:text-xs truncate">
                  {currentProfile.name}
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                  Select Active Township MSME
                </div>
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectProfile(p);
                      setProfileDropdownOpen(false);
                      sounds.playSuccess();
                    }}
                    className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                      p.id === currentProfile.id
                        ? 'bg-emerald-950/60 border border-emerald-800/80 text-emerald-300'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{p.avatar}</span>
                      <div className="truncate">
                        <div className="font-semibold text-slate-200 truncate">{p.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{p.location}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono shrink-0">
                      {p.initialReadinessScore}/100
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop & Tablet Direct Controls (Hidden on narrow mobile screens) */}
          <div className="hidden md:flex items-center gap-2">
            {/* Readiness Score Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/50 border border-emerald-800/50">
              <span className="text-[10px] text-slate-300 font-medium">Readiness:</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">
                {readinessScore}/100
              </span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                const newState = onToggleSound();
                if (newState) sounds.playPosTap();
              }}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 transition-colors"
              title={soundEnabled ? "Tactile sound effects enabled" : "Sound muted"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Device Switcher (Desktop view) */}
            <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/80 text-xs">
              <button
                onClick={() => onSelectDeviceMode('desktop')}
                className={`p-1.5 rounded-md transition-colors ${deviceMode === 'desktop' ? 'bg-slate-700 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
                title="Full Responsive Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onSelectDeviceMode('tablet')}
                className={`p-1.5 rounded-md transition-colors ${deviceMode === 'tablet' ? 'bg-slate-700 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
                title="Tablet / iPad Frame (820×1080)"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onSelectDeviceMode('smartphone')}
                className={`p-1.5 rounded-md transition-colors ${deviceMode === 'smartphone' ? 'bg-slate-700 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
                title="Smartphone Frame (390×844)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* API Keys Modal Button */}
            <button
              onClick={() => {
                onOpenApiKeys();
                sounds.playPosTap();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>API Keys</span>
            </button>

            {/* ESD Funder Report Button */}
            <button
              onClick={() => {
                onOpenReport();
                sounds.playSuccess();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>ESD Report</span>
            </button>
          </div>

          {/* Mobile Quick Action Menu Toggle (Visible on smartphone views) */}
          <div className="relative md:hidden">
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setProfileDropdownOpen(false);
              }}
              className="p-1.5 rounded-lg bg-slate-800/90 border border-slate-700/80 text-slate-200 hover:bg-slate-750 transition-colors"
              title="Open settings & options"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <MoreVertical className="w-4 h-4 text-slate-300" />}
            </button>

            {/* Mobile Options Dropdown Sheet */}
            {mobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2.5 z-50 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px]">
                  <span className="text-slate-400">Scorecard:</span>
                  <span className="font-bold text-emerald-400 font-mono">{readinessScore}/100</span>
                </div>

                {/* Device Mode Selector in Mobile Menu */}
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Display Frame</span>
                  <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-center text-[10px]">
                    <button
                      onClick={() => {
                        onSelectDeviceMode('smartphone');
                        setMobileMenuOpen(false);
                      }}
                      className={`py-1 rounded-lg ${deviceMode === 'smartphone' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
                    >
                      Phone
                    </button>
                    <button
                      onClick={() => {
                        onSelectDeviceMode('tablet');
                        setMobileMenuOpen(false);
                      }}
                      className={`py-1 rounded-lg ${deviceMode === 'tablet' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
                    >
                      Tablet
                    </button>
                    <button
                      onClick={() => {
                        onSelectDeviceMode('desktop');
                        setMobileMenuOpen(false);
                      }}
                      className={`py-1 rounded-lg ${deviceMode === 'desktop' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}`}
                    >
                      Full
                    </button>
                  </div>
                </div>

                {/* Action Buttons in Mobile Menu */}
                <div className="space-y-1.5 pt-1 border-t border-slate-800">
                  <button
                    onClick={() => {
                      onOpenApiKeys();
                      setMobileMenuOpen(false);
                      sounds.playPosTap();
                    }}
                    className="w-full text-left p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-200 flex items-center gap-2"
                  >
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>API Integration Keys</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenReport();
                      setMobileMenuOpen(false);
                      sounds.playSuccess();
                    }}
                    className="w-full text-left p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/70 text-xs text-emerald-300 font-medium flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Generate ESD Funder Report</span>
                  </button>

                  <button
                    onClick={() => {
                      onToggleSound();
                      sounds.playPosTap();
                    }}
                    className="w-full text-left p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-xs text-slate-300 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                      <span>Haptic Audio Effects</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{soundEnabled ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
