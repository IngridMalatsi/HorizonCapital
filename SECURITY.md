# HorizonCapital security and SSDLC status

This document maps the HorizonCapital SSDLC compliance submission to the
current application. It records implemented controls separately from planned
or unverified controls. A control described in the submission is not considered
implemented unless it is verified in the code or deployment configuration.

## Current system and data

- The web client and the Expo WebView display the same application.
- Supabase Auth handles credentials. The web client uses Supabase's browser
  session storage. The native wrapper currently authenticates through that
  web client; do not assume its separate SecureStore adapter protects the
  WebView's session.
- Supabase `public.profiles` contains an auth user ID and optional business
  name. Its migration enables RLS and scopes profile reads/updates to the
  authenticated user.
- The Node.js API currently exposes only a health endpoint. It does not store
  business data or accept financial transactions.
- Dashboard balances, transactions, readiness results, and order messages are
  demonstration data held in client memory. They are not real account records.
- The WhatsApp order screen performs a timed client-side demonstration. It
  does not connect to WhatsApp or send messages to an AI provider. Avoid
  entering real customer or financial information.

## Control status against the SSDLC submission

| SSDLC area | Current status |
| --- | --- |
| Requirements and threat assessment | Partial. This document records prototype data boundaries and known risks; a formal, reviewed threat model and risk acceptance record do not yet exist. |
| Secure design | Partial. Supabase Auth and owner-scoped RLS protect the profile table. There is no production business-data API, AI pipeline, or end-to-end zero-trust design to assess. |
| Secure development | Partial. Supabase client queries use parameterized SDK calls; browser and native Supabase URLs require HTTPS outside local development; local environment files and signing keys are ignored by Git. |
| Input minimization | Partial. The demo order text is limited to 4,000 characters and the interface warns users not to enter sensitive information. No general PII sanitizer has been implemented because no external AI inference is connected. |
| Database audit trail | Partial. The new migration records profile creation, business-name changes, and deletion in an RLS-protected, append-only table with a SHA-256 hash chain. It has no external WORM archive; a database owner can still alter the table or rewrite the chain. |
| Security testing | Not verified. A successful build or lint run is not a SAST, penetration test, RLS authorization test, or security assessment. |
| Deployment | Partial. When Vercel uses `web-client` as its project root, its response headers include HSTS, MIME-sniffing protection, clickjacking protection, a restrictive referrer policy, and disabled unused device permissions. Vercel documents TLS 1.2/1.3 and hybrid `X25519MLKEM768` negotiation for compatible clients; actual deployed endpoints and clients have not yet been verified. |
| Operations and incident response | Not implemented. The project has no external WORM audit archive, account-lock workflow, alerting, or incident-response automation. |
| POPIA governance | Not assessed. No legal determination, privacy notice, retention schedule, data-subject request workflow, or formal impact assessment is included. |

## Controls that must not be claimed as implemented

The following statements in the compliance submission are not supported by
this codebase and must remain roadmap items until designed, implemented, and
independently tested:

- Post-quantum encryption of browser storage or session tokens.
- Hashed local PIN protection or biometric app locking.
- Automatic PII removal before AI inference.
- An externally immutable WORM copy of audit events, administrative account
  locks, or automated token revocation.
- Production financial-data RLS policies. Only the profile table currently
  exists in this project migration.
- Verified TLS 1.3 and hybrid post-quantum negotiation across every deployed
  client, API, Supabase, and future provider connection.

The web browser's Supabase session storage is not application-level encrypted
by this project. Never store bank passwords, payment credentials, identity
documents, or real transaction/customer data in this prototype.

## Developer and deployment requirements

1. Keep `.env` files, provider secrets, certificates, and signing keys out of
   source control. Client `VITE_` and `EXPO_PUBLIC_` values are public; use only
   Supabase publishable/legacy anon keys in clients.
2. Use HTTPS for deployed web, API, and Supabase endpoints. The application
   permits plain HTTP Supabase URLs only for local development. Development
   servers may use HTTP on a trusted local network; do not expose them as
   production services. Configure Vercel's project root as `web-client` so
   `web-client/vercel.json` applies its security headers.
   In PowerShell, run the TLS 1.3 certificate check from the `server`
   directory:

   ```powershell
   $env:TLS_CHECK_URLS = "https://your-web-host,https://your-api-host,https://your-project.supabase.co"
   npm run security:tls-check
   Remove-Item Env:TLS_CHECK_URLS
   ```

   This verifies trusted certificates and TLS 1.3 negotiation for the listed
   endpoints; it does not test TLS 1.2 rejection or PQC negotiation. For
   Supabase direct PostgreSQL or pooler connections, enable SSL enforcement in
   the Supabase Database SSL settings.
   Vercel documents hybrid `X25519MLKEM768` negotiation for compatible
   browsers. With an OpenSSL version that supports the hybrid group, test each
   hostname separately:

   ```powershell
   openssl s_client -connect your-web-host:443 -servername your-web-host -tls1_3 -groups X25519MLKEM768
   ```

   Confirm the negotiated group in the handshake output. Repeat for the API
   and Supabase host; do not claim end-to-end PQC if any hop or client is
   unverified. Vercel's support does not establish PQC support by other
   providers.
3. Apply migrations in order, including
   `supabase/migrations/20261024000000_audit_log.sql`. Use
   `select public.verify_audit_event_chain();` with a privileged database
   connection to check the current profile audit hash chain. This detects
   accidental or partial tampering but is not protection against a database
   owner who can rewrite both records and hashes.
4. Before adding a persistent table, define its data classification, owner,
   purpose, retention period, authorization rules, and abuse cases. Enable
   RLS and verify that two different users cannot read or modify each other's
   records.
5. Before connecting a messaging or AI provider, obtain appropriate privacy
   review and user notice, minimize transmitted fields, implement and test
   PII redaction on the server, and keep provider credentials server-side.
6. Before handling real financial data, commission security testing including
   dependency/SAST scans, authentication and authorization tests, input
   validation, deployment configuration review, and incident-response
   exercises.
7. Establish a supported way to report vulnerabilities, revoke exposed
   credentials, notify affected users where required, retain audit evidence,
   and meet applicable POPIA obligations.

The database migration is not a substitute for an independent WORM archive.
Choose and configure a separately administered retention-locked object store,
then add a server-side exporter with least-privilege write-only credentials
and test retention, export gaps, and restore procedures. No such provider was
selected or configured for this deployment.

Provider references: [Vercel TLS and post-quantum support](https://vercel.com/docs/cdn-security/encryption),
[Supabase API TLS](https://supabase.com/docs/guides/security/tls),
[Supabase PostgreSQL SSL enforcement](https://supabase.com/docs/guides/platform/ssl-enforcement),
and [NIST FIPS 203 (ML-KEM)](https://csrc.nist.gov/pubs/fips/203/final).

This prototype is not approved for real financial decisions, payments, or
production storage of personal or business transaction data.
