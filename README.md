# HorizonCapital

HorizonCapital is a digital finance platform designed to help users assess funding readiness, manage capital needs, and securely process transactions through a mobile-first experience. The platform combines a responsive customer interface with a secure backend service layer for real-time financial data, transaction processing, and risk-aware operations.

## Overview

The platform is built to support a seamless user journey from initial assessment to funding decisions and financial management. It helps users:

- evaluate their financial readiness and eligibility
- view available funding or cash-flow options
- track money movement and transaction status
- manage digital order or funding requests
- access a secure and compliant payment experience across devices

## Product Goals

- Deliver a smooth cross-platform experience for smartphone users
- Simplify financial assessment and decision workflows
- Provide secure and transparent transaction operations
- Reduce friction in funding and payment processing
- Support scalable growth with cloud-native infrastructure

## Tech Stack

### Frontend
React web client for desktop and mobile, displayed inside an Expo React Native WebView shell on mobile.

### Backend
Shared Node.js HTTP API server. The current implemented endpoint reports API health; business operations are still prototype simulations.

### Identity & Data
Supabase Auth handles sign-in. Business profiles, ledger entries, and other demo activity are currently held in client memory rather than persisted.

### Security & Compliance
End-to-end encryption, built-in fraud protection protocols, and secure API integrations for digital payment gateways.

## Core Features

### 1. Funding Readiness Assessment
Users can complete a financial assessment to determine eligibility, readiness, and likely funding pathways.

### 2. Transaction and Cash Management
The system supports money tracking, transaction visibility, and financial decision support in a secure environment.

### 3. Order / Funding Workflow
Users can manage order-related funding flows, monitor progress, and complete operations through a streamlined digital journey.

### 4. Secure Payments and Integrations
The platform is designed to support secure API-based payment integrations with fraud screening and compliance safeguards.

### 5. Real-Time Data Handling
The backend is structured to process and respond to financial events in near real time, powering dashboards, alerts, and status updates.

## System Architecture

HorizonCapital's current development architecture uses the responsive web client as the shared user interface. The Expo app loads that same client in a native WebView, and the Vite development server proxies its `/api` requests to the shared Node server. Supabase Auth is used by the web client; durable business-data APIs and storage have not been implemented yet.

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
│   ├── assets/
│   └── src/
│       ├── components/
│       ├── navigation/
│       ├── screens/
│       ├── services/
│       └── types/
├── server/
│   ├── package.json
│   ├── server.js
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       └── services/
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
- Supabase Auth is configured by the web client and therefore shared by the web app and native wrapper

### Not implemented or connected yet

- The API currently exposes health only; demo business data and transactions remain in client memory and are not synchronized or persisted
- Server-side API authentication/authorization and persistent user or transaction records
- Live banking, payment-provider, SoftPOS/NFC, OCR, or WhatsApp integrations
- Production credit decisioning, fraud checks, and compliance controls

### Run the shared development stack

Use three terminals from the `HorizonCapital` directory. The native app uses the same Vite web app and the same API server as the web client.

```bash
# Terminal 1: shared API server
cd server
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

The API listens on port `4000`; the web client proxies `/api` to it and runs on port `5173`. Expo detects its development host and loads the web client there. If using a physical device and automatic host detection does not work, set `EXPO_PUBLIC_WEB_CLIENT_URL` in `mobile-client/.env` to `http://<computer-lan-ip>:5173`, then restart Expo. Keep the device and computer on the same network.

To check the shared API directly, open `http://localhost:4000/api/health`.

## Environment Variables

The server accepts `PORT` (default `4000`) and `ALLOWED_ORIGINS` for comma-separated web origins when calling the API directly across origins. The web client accepts `API_SERVER_URL` for the Vite proxy target (default `http://127.0.0.1:4000`) and `VITE_API_URL` for a deployed API origin (default `/api`). The native wrapper accepts `EXPO_PUBLIC_WEB_CLIENT_URL` when it should load a specific deployed or LAN web client URL.

## Security Considerations

HorizonCapital is designed with strong security in mind:

- end-to-end encryption for sensitive data
- secure authentication and authorization
- fraud-monitoring logic for transaction review
- protected API gateways and signed requests
- data minimization and safe storage of transactional records
- secure handling of payment provider credentials

## Compliance Focus

The platform is intended to support compliance-conscious financial operations by integrating secure transaction models, audit-friendly records, and reliable API governance.

## Development Workflow

1. Define and validate business rules for funding and payment flows.
2. Implement API endpoints and data models.
3. Build mobile interfaces for assessment and transaction tasks.
4. Integrate secure third-party services.
5. Test payment, fraud, and user flow scenarios.
6. Deploy to cloud infrastructure with monitoring and backup controls.

## Deployment

Recommended deployment model:

- Frontend: Vercel or Firebase hosting for web and app delivery support
- Backend: Node.js or Python API deployed on scalable cloud infrastructure
- Database: PostgreSQL managed instance
- Monitoring: logging, error tracking, analytics, and alerting dashboards

## Roadmap

- build complete onboarding and assessment experience
- integrate secure payment gateways
- add analytics dashboards for transaction insights
- strengthen fraud detection and compliance automation
- improve user personalization and status tracking

## License

This project is currently under active development and may be updated as the product requirements evolve.

## Summary

HorizonCapital is positioned as a modern financial platform that combines secure digital transactions, responsive user experiences, and scalable backend services. The architecture is designed to support rapid growth while maintaining strong compliance, risk controls, and reliability for users managing financial decisions on the go.
