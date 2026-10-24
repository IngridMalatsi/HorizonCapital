import { useState } from 'react';
import { Building2 } from 'lucide-react';

const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20';

export default function AuthScreen({ supabase, initialError = '', configError = '' }) {
  const [mode, setMode] = useState('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError);
  const [message, setMessage] = useState('');

  const isRegistering = mode === 'sign-up';

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!supabase) return;

    setBusy(true);
    try {
      if (isRegistering) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim() || null,
              business_name: businessName.trim() || null,
            },
            emailRedirectTo: window.location.origin,
          },
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setMessage('If registration succeeds, check your email for a confirmation link, then return here to sign in.');
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Authentication failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-white px-4 py-10 text-slate-100">
      <section className="w-full max-w-md">
        <header className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950">
            <Building2 size={27} aria-hidden="true" />
          </div>
          <p className="text-xl font-bold tracking-tight">
            Horizon<span className="text-emerald-400">Capital</span>
          </p>
          <h1 className="mt-5 text-2xl font-bold">
            {isRegistering ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {isRegistering
              ? 'Set up a secure account for your business.'
              : 'Sign in to continue to your business workspace.'}
          </p>
        </header>

        {configError ? (
          <div role="alert" className="rounded-2xl border border-rose-800 bg-rose-950/40 p-5 text-sm leading-relaxed text-rose-100">
            <h2 className="font-semibold">Supabase configuration is invalid</h2>
            <p className="mt-2 text-rose-200/80">{configError}</p>
            <p className="mt-2 text-rose-200/80">
              Correct the value in <code>web-client/.env</code>, then restart Vite. Do not share your key.
            </p>
          </div>
        ) : !supabase ? (
          <div role="alert" className="rounded-2xl border border-amber-800 bg-amber-950/40 p-5 text-sm leading-relaxed text-amber-100">
            <h2 className="font-semibold">Supabase is not configured</h2>
            <p className="mt-2 text-amber-200/80">
              Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> to
              <code> web-client/.env</code>, apply the SQL migration in <code>supabase/migrations</code>,
              then restart the web server.
            </p>
            <p className="mt-2 text-amber-200/80">
              Use a publishable key only. Never put a Supabase secret or service-role key in a client app.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/20 sm:p-6">
            {isRegistering && (
              <>
                <label className="block text-sm font-medium text-slate-300">
                  Your name <span className="font-normal text-slate-500">(optional)</span>
                  <input
                    autoComplete="name"
                    className={inputClass}
                    maxLength={120}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="e.g. Thandi Khumalo"
                    value={fullName}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-300">
                  Business name <span className="font-normal text-slate-500">(optional)</span>
                  <input
                    autoComplete="organization"
                    className={inputClass}
                    maxLength={120}
                    onChange={(event) => setBusinessName(event.target.value)}
                    placeholder="e.g. Thandi's Bakery"
                    value={businessName}
                  />
                </label>
              </>
            )}

            <label className="block text-sm font-medium text-slate-300">
              Email
              <input
                autoComplete="email"
                className={inputClass}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </label>

            <label className="block text-sm font-medium text-slate-300">
              Password
              <input
                autoComplete={isRegistering ? 'new-password' : 'current-password'}
                className={inputClass}
                minLength={8}
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
              {isRegistering && <span className="mt-1 block text-xs font-normal text-slate-500">Use at least 8 characters.</span>}
            </label>

            {error && <p role="alert" className="rounded-lg border border-rose-900/70 bg-rose-950/50 p-3 text-sm text-rose-200">{error}</p>}
            {message && <p role="status" className="rounded-lg border border-emerald-900/70 bg-emerald-950/40 p-3 text-sm text-emerald-200">{message}</p>}

            <button
              className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={busy}
              type="submit"
            >
              {busy ? 'Please wait…' : isRegistering ? 'Create account' : 'Sign in'}
            </button>

            <div className="pt-1 text-center text-sm text-slate-400">
              {isRegistering ? 'Already have an account?' : 'New to HorizonCapital?'}{' '}
              <button
                className="font-semibold text-emerald-400 hover:text-emerald-300"
                disabled={busy}
                onClick={() => changeMode(isRegistering ? 'sign-in' : 'sign-up')}
                type="button"
              >
                {isRegistering ? 'Sign in' : 'Create an account'}
              </button>
            </div>
          </form>
        )}

        <p className="mt-5 text-center text-xs leading-relaxed text-slate-500">
          Passwords are managed by Supabase Auth. Business information and financial activity in the dashboard remain demo data.
        </p>
      </section>
    </main>
  );
}
