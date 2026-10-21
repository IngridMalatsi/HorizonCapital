import React from 'react';
import { Smartphone, Tablet, Monitor, Wifi, Battery, Signal } from 'lucide-react';

export default function DeviceSimulatorFrame({
  deviceMode, // 'desktop', 'smartphone', 'tablet'
  children,
  onSelectDeviceMode
}) {
  if (deviceMode === 'desktop') {
    // Standard responsive full-screen web app mode
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </div>
    );
  }

  const isTablet = deviceMode === 'tablet';

  return (
    <div className="min-h-screen bg-slate-950 py-3 sm:py-6 px-2 sm:px-4 flex flex-col items-center justify-start overflow-x-hidden">
      {/* Device Mode Switcher Bar */}
      <div className="mb-3.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-300 text-xs flex items-center gap-2 shadow-lg backdrop-blur-md z-50">
        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Aspect Ratio:</span>
        
        <button
          onClick={() => onSelectDeviceMode('smartphone')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
            deviceMode === 'smartphone'
              ? 'bg-emerald-600 text-white font-semibold shadow-sm'
              : 'hover:text-slate-100 hover:bg-slate-800 text-slate-400'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Phone (390×844)</span>
        </button>

        <button
          onClick={() => onSelectDeviceMode('tablet')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
            deviceMode === 'tablet'
              ? 'bg-emerald-600 text-white font-semibold shadow-sm'
              : 'hover:text-slate-100 hover:bg-slate-800 text-slate-400'
          }`}
        >
          <Tablet className="w-3.5 h-3.5" />
          <span>iPad / Tablet (820×1080)</span>
        </button>

        <button
          onClick={() => onSelectDeviceMode('desktop')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all ml-1"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Exit to Desktop</span>
        </button>
      </div>

      {/* Realistic Hardware Frame Shell */}
      <div 
        className={`relative w-full bg-slate-900 shadow-2xl border-4 sm:border-[6px] border-slate-700/90 ring-1 ring-slate-600/40 flex flex-col overflow-hidden transition-all duration-300 ${
          isTablet
            ? 'max-w-[820px] h-[920px] rounded-[36px] p-2.5 sm:p-3'
            : 'max-w-[400px] h-[844px] rounded-[48px] p-2.5 sm:p-3'
        }`}
      >
        {/* Dynamic Island / Camera Notch (Phone only) */}
        {!isTablet && (
          <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-50 w-28 h-6 bg-slate-950 rounded-full flex items-center justify-between px-3 shadow-md pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-850" />
            <div className="w-2 h-2 rounded-full bg-blue-950/80" />
          </div>
        )}

        {/* Status Bar */}
        <div className={`w-full flex items-center justify-between text-[11px] text-slate-400 font-mono select-none z-40 bg-slate-900 shrink-0 ${
          isTablet ? 'h-6 px-6 pt-0.5' : 'h-7 px-6 pt-1'
        }`}>
          <span className="font-semibold text-slate-300">09:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3 text-slate-300" />
            <Wifi className="w-3 h-3 text-slate-300" />
            <Battery className="w-3.5 h-3.5 text-slate-300" />
          </div>
        </div>

        {/* Inner Screen Viewport Container: Isolated Scroll & Fixed Nav Frame */}
        <div className="flex-1 w-full bg-slate-950 rounded-[30px] sm:rounded-[36px] overflow-hidden relative flex flex-col min-h-0 border border-slate-800/80">
          {children}
        </div>

        {/* Virtual Home Indicator Bar */}
        <div className="h-4 w-full flex items-center justify-center pt-1.5 shrink-0 bg-slate-900 pointer-events-none">
          <div className={`${isTablet ? 'w-48' : 'w-32'} h-1 bg-slate-600/60 rounded-full`} />
        </div>
      </div>
    </div>
  );
}
