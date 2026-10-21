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
React Native / Flutter for a responsive, cross-platform mobile and web experience accessible on standard smartphones.

### Backend
Node.js with Express / Python (Django or FastAPI) for robust real-time data processing and secure transaction handling.

### Database & Cloud
PostgreSQL for secure transactional records; Firebase / Vercel for scalable and reliable cloud hosting.

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

HorizonCapital follows a modular architecture:

- Mobile client handles user interaction, onboarding, assessment flow, and account activity
- API layer manages authentication, business logic, and transaction processing
- Database stores transactions, users, risk metadata, and funding records
- Cloud hosting provides scalability, performance, and uptime reliability

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

### Not implemented or connected yet

- The web prototype uses mock data; it is not connected to the database or server
- Authentication, authorization, and persistent user or transaction records
- Live banking, payment-provider, SoftPOS/NFC, OCR, or WhatsApp integrations
- Production credit decisioning, fraud checks, and compliance controls
- A working native mobile client or documented, implemented API endpoints

### Run the web prototype

```bash
cd web-client
npm install
npm run dev
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Python 3.10+ (if using Django or FastAPI)
- PostgreSQL database instance
- Firebase or Vercel project credentials for hosting and services

### Backend Setup

1. Navigate to the server directory.
2. Install dependencies.
3. Configure environment variables for database, JWT/auth, and payment APIs.
4. Start the server in development mode.

Example:

```bash
cd server
npm install
npm run dev
```

### Frontend Setup

1. Navigate to the mobile client directory.
2. Install dependencies.
3. Start the app in emulator, simulator, or web preview mode.

Example:

```bash
cd mobile-client
npm install
npm start
```

## Environment Variables

The application should use environment variables for the following:

- DATABASE_URL
- JWT_SECRET
- FIREBASE_CONFIG
- PAYMENT_API_KEY
- PAYMENT_API_SECRET
- NODE_ENV
- PORT

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
