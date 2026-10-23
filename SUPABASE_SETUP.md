# Supabase authentication setup

The web and mobile clients use Supabase Auth for email/password accounts. The
optional business name is stored in `public.profiles`; passwords remain in
Supabase Auth and are never written to the profiles table or application code.

## 1. Create and configure a Supabase project

1. Create a project in Supabase and keep its database password private.
2. Open **SQL Editor** and run
   [`supabase/migrations/20261023000000_profiles.sql`](./supabase/migrations/20261023000000_profiles.sql).
3. In **Authentication → URL Configuration**, set the Site URL to your web
   app's origin. Add each local and deployed web origin to the allowed redirect
   URLs, for example `http://localhost:5173/**` and your deployed HTTPS origin.
4. In **Authentication → Providers → Email**, enable email/password sign-in and
   keep email confirmation enabled for production.
5. Copy the project URL and its **publishable** key from the Supabase project
   Connect/API settings. A legacy `anon` key can be used if your project does
   not provide publishable keys.

The SQL migration enables row-level security on `public.profiles`. Signed-in
users can read their own profile and update only its business name. A database
trigger creates a profile when Supabase Auth creates the corresponding user.
Deleting an auth user cascades to that profile.

## 2. Configure the web client

Copy `web-client/.env.example` to `web-client/.env` and fill in:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

Restart Vite after changing environment variables:

```powershell
cd web-client
npm install
npm run dev
```

## 3. Configure the mobile client

Copy `mobile-client/.env.example` to `mobile-client/.env` and fill in:

```dotenv
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

Restart Expo after changing these values. Expo public environment variables are
bundled into the client app. For native builds, rebuild the app after
configuration changes. The mobile client stores its Supabase auth session in
the platform keychain/keystore using Expo SecureStore.

## Key and data safety

- **Never** use a Supabase secret/service-role key in either client, a `VITE_`
  variable, an `EXPO_PUBLIC_` variable, or a committed file. These keys bypass
  row-level security and belong only in a trusted server environment.
- Publishable (or legacy `anon`) keys are client-visible by design. They are
  safe only when database access is protected by correct row-level security
  policies and server-side validation.
- Supabase Auth handles password hashing and authentication. The profile table
  contains only the auth user ID, optional business name, and account creation
  time; it does not contain passwords.
- Browser auth sessions are persisted by Supabase in browser storage. Do not
  store identity documents, bank credentials, payment secrets, or other
  sensitive financial data in browser storage.
- The current ledger, balances, readiness scores, and orders are still
  client-side demo data; authentication does **not** persist or isolate them.
  Do not treat demo balances or offers as real account or credit data.
- Apply database schema changes through reviewed migrations and test RLS with
  separate accounts before storing any additional user data.

## If registration or sign-in does not work

- Verify both client environment files use the URL and publishable key from the
  same Supabase project, then restart the respective development server.
- Confirm the SQL migration completed and the `profiles` table has RLS enabled.
- Check Supabase **Authentication → Logs** and the project email-confirmation
  settings. A newly registered user may need to confirm their email before
  signing in.
- The app intentionally displays a setup warning when the URL or key is
  missing; it does not fake a successful login.
