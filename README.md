# HorizonCapital

HorizonCapital is a mobile-first prototype for business funding readiness, cash-flow review, order intake, and ledger workflows. It includes a responsive web client, an Expo app shell that displays the same web experience, Supabase authentication, and a small Node.js API.

## Overview

The prototype demonstrates how users could:

- evaluate their financial readiness and eligibility
- view available funding or cash-flow options
- track money movement and transaction status
- manage digital order or funding requests
- explore example order and funding workflows across devices

## Product Goals

- Deliver a smooth cross-platform experience for smartphone users
- Simplify financial assessment and decision workflows
- Provide clear transaction and funding workflows
- Reduce friction in funding and payment processing
- Establish a shared interface and API foundation for future development

## Tech Stack

### Frontend
React web client for desktop and mobile, displayed inside an Expo React Native WebView shell on mobile.

### Backend
Shared Node.js HTTP API server. The current implemented endpoint reports API health; business operations are still prototype simulations.

### Identity & Data
Supabase Auth handles sign-in. Business profiles, ledger entries, and other demo activity are currently held in client memory rather than persisted.

### Security & Compliance
This project is a prototype, not a production financial service. See [SECURITY.md](./SECURITY.md) for the SSDLC control status, current data boundaries, and security requirements. The compliance submission includes planned controls that are not yet implemented; they are explicitly identified there.

## Core Features

### 1. Funding Readiness Assessment
The prototype demonstrates an example readiness score, assessment flow, cash-flow forecast, and sample funding offers. It does not determine real eligibility.

### 2. Transaction and Cash Management
The prototype displays sample balances and ledger entries, and supports simulated transaction capture. Entries are not saved to a database or connected to a bank.

### 3. Order / Funding Workflow
The prototype demonstrates WhatsApp-style order review, simulated counter-offers, and funding flows.

### 4. Integrations
Payment, OCR, messaging, and regulatory integrations are not connected. The UI contains prototype demonstrations only.

### 5. Shared API
The Node.js server currently exposes a health check only. It does not yet process business operations or persist data.

## System Architecture

The responsive React web client is the shared UI for browser and mobile. The Expo React Native app loads that same client in a native WebView, so both use the same screens and styling. During development, Vite proxies `/api` requests to the Node.js server. Supabase Auth handles sign-in in the web client; the WebView uses that same web session. The API currently provides only `GET /api/health`; business data remains in client memory and is not synchronized or persisted.

## Project Structure

```text
HorizonCapital/
├── README.md
├── database/
│   ├── schema.sql
│   └── seed.sql
├── web-client/
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── components/
│       ├── config/
│       ├── data/
│       └── utils/
├── mobile-client/
│   ├── package.json
│   ├── app.json
│   └── App.tsx
├── server/
│   ├── package.json
│   ├── server.js
│   └── package-lock.json
├── supabase/
│   └── migrations/
└── .gitignore
```

## Implementation Status

### Implemented in the web prototype

- Responsive dashboard with readiness score and cash-flow forecast
- WhatsApp-style order intake and simulated counter-offer flow
- Ledger with cash and digital balances, plus simulated transaction capture
- Micro-POS payment simulation
- Funding offer and disbursement simulation
- Market Linker profile and funder report views
- Desktop, tablet, and smartphone preview modes

### Implemented shared development setup

- The native Expo app loads the same responsive web client used by the web preview, inside a native WebView shell
- The web client checks the shared Node API health endpoint, and Vite proxies `/api` requests to that server
- Supabase Auth is configured by the web client and used inside the native WebView

### Not implemented or connected yet

- The API currently exposes health only; demo business data and transactions remain in client memory and are not synchronized or persisted
- API authentication/authorization and persistent user or transaction records
- Live banking, payment-provider, SoftPOS/NFC, OCR, or WhatsApp integrations
- Production credit decisioning, fraud checks, and compliance controls

### Run the shared development stack

Use three terminals from the `HorizonCapital` directory. The native app loads the same Vite web app and calls the same API as the browser.

```bash
# Terminal 1: shared API server
cd server
npm install
npm run dev
```

```bash
# Terminal 2: web client (also serves the app loaded by Expo)
cd web-client
npm install
npm run dev
```

```bash
# Terminal 3: native app shell
cd mobile-client
npm install
npm start
```

The API listens on port `4000`; the web client runs on port `5173` and proxies `/api` to the API server.

For a physical phone, keep it and the development computer on the same Wi-Fi network. Expo host detection is used to find the web client. If that address cannot be reached, set `EXPO_PUBLIC_WEB_CLIENT_URL` in `mobile-client/.env` to `http://<computer-lan-ip>:5173` (for example, `http://192.168.1.10:5173`) and restart Expo. The web dev server must be reachable from the local network.

Check the API at `http://localhost:4000/api/health`. A healthy response is `{"status":"ok","service":"horizon-capital-api"}`.

## Environment Variables

| Variable | Used by | Purpose | Default |
| --- | --- | --- | --- |
| `PORT` | API server | HTTP listen port | `4000` |
| `ALLOWED_ORIGINS` | API server | Comma-separated origins allowed for direct cross-origin browser requests | `http://localhost:5173,http://127.0.0.1:5173` |
| `API_SERVER_URL` | Vite dev server | API proxy target | `http://127.0.0.1:4000` |
| `VITE_API_URL` | Web client | API base URL, including `/api` | `/api` |
| `EXPO_PUBLIC_WEB_CLIENT_URL` | Expo app | Explicit URL for a LAN or deployed web client | Automatically detected in development; required for production builds |

Configure the Supabase project URL and publishable key in `web-client/.env` using the variable names in `web-client/.env.example`. The Expo WebView loads that web client, so Supabase Auth configuration comes from the web client's environment. Set `EXPO_PUBLIC_WEB_CLIENT_URL` in `mobile-client/.env` only when you need to override the auto-detected development URL or configure the native app to load a deployed web client. Use a publishable key only; never put a Supabase secret or service-role key in a client app.

## Security Considerations

When Vercel is configured with `web-client` as its project root, its deployment
configuration applies baseline browser security headers.
Supabase HTTPS is required outside local development, and profile RLS is
enabled by the supplied migration. A subsequent migration records profile
changes in a tamper-evident hash chain; it is not an external immutable WORM
archive. Vercel documents TLS 1.3 and hybrid PQC for compatible browsers, and
the API project includes a TLS verification command, but actual deployed
endpoints still need verification. These controls do not make the prototype
production-ready: demo financial data is not user-isolated or persisted, and
external audit retention, full security testing, incident response, and POPIA
assessment remain outstanding. Follow the control status and deployment requirements in
[SECURITY.md](./SECURITY.md) before handling real data.

## Compliance Focus

POPIA and other compliance obligations have not been legally assessed. Determine applicable requirements before using the product with real users or financial data.

## Development Workflow

1. Define and validate business rules for funding and payment flows.
2. Implement API endpoints and data models.
3. Keep the shared web and mobile experience accessible and consistent.
4. Integrate third-party services through server-side adapters.
5. Test user flows, authorization, and failure scenarios.
6. Complete security and compliance reviews before production deployment.

## Deployment

The current API is a development health-check service, not a production backend. Before deployment, configure a publicly reachable web client and API, set `EXPO_PUBLIC_WEB_CLIENT_URL` for native builds, configure API CORS and Supabase auth redirect URLs, and implement and review the missing persistence and authorization features. Native builds require an HTTPS web-client URL; localhost and LAN URLs are for development only.

## Roadmap

- implement authenticated business-data API endpoints and persistence
- synchronize profiles, ledger activity, and assessment progress across sessions
- add provider integrations only after server-side security controls are in place
- complete security, privacy, and compliance reviews before production use

## License

This project is currently under active development and may be updated as the product requirements evolve.

## Summary

HorizonCapital is currently a prototype: one responsive web app powers both the browser experience and the Expo WebView app, while a shared Node.js server provides an API health check. Authentication uses Supabase; demo business data remains local and is not persisted. The project is not ready to process real payments or make real financial decisions.
