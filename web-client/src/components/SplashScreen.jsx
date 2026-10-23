import { Building2, LoaderCircle } from 'lucide-react';

export default function SplashScreen({ message = 'Growing stronger, together' }) {
  return (
    <main
      role="status"
      aria-live="polite"
      className="min-h-screen w-full flex flex-col items-center justify-center gap-5 bg-[#F8F9FA] text-slate-100"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/50">
        <Building2 size={32} aria-hidden="true" />
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold tracking-tight">
          Horizon<span className="text-emerald-400">Capital</span>
        </p>
        <p className="mt-2 text-sm text-slate-400">{message}</p>
      </div>
      <LoaderCircle className="animate-spin text-emerald-400" size={20} aria-hidden="true" />
    </main>
  );
}
