# HorizonCapital — Co-Developer Setup & Editing Guide

Welcome to **HorizonCapital: Growth Readiness Engine**! This project is a fully functioning, mobile-first and desktop-responsive web application designed for South African township and urban informal MSMEs.

This guide provides instructions so you can **run, inspect, and edit** this codebase on your own computer without requiring any AI agents or external setup tools.

---

## ⚡ 1-Minute Quick Start

### Method A: One-Click Launchers (Easiest)

* **Windows:** Simply double-click the **`start.bat`** file in the root folder.
* **macOS / Linux:** Run `chmod +x start.sh && ./start.sh` in your terminal.

The starter script will:
1. Verify Node.js is installed.
2. Automatically run `npm install` if `node_modules` is not yet installed.
3. Start the local server at `http://localhost:5173`.
4. Automatically open your default web browser to the application!

---

### Method B: Standard Terminal / Command Line

If you prefer using the terminal directly:

```bash
# 1. Navigate to the project root directory
cd "Horizon Ventures"

# 2. Install dependencies (only required the first time)
npm install

# 3. Start the hot-reloading development server
npm run dev
```

Your browser will automatically open to:
👉 **`http://localhost:5173`**

*(You can also use `npm start` which runs the same dev command).*

---

## 📱 Testing on Your Real Smartphone (Same Wi-Fi)

The server is pre-configured with `host: true`. When you run `npm run dev`, you will see output like this in your terminal:

```
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.50:5173/
```

To test on your physical iPhone or Android device:
1. Ensure your phone is connected to the same Wi-Fi network as your computer.
2. Open Chrome or Safari on your phone and type the **`Network` URL** (e.g. `http://192.168.1.50:5173`).
3. You can test all touch interactions, WhatsApp presets, and SoftPOS tap flows natively!

---

## ✏️ How to Edit & Customize the Application

This project uses **React 19 + Vite + Tailwind CSS v4** with instant **Hot Module Replacement (HMR)**. Whenever you edit and save any file in the `src/` directory, the browser updates instantly without losing state.

### Codebase Directory Map

| Path | Description | What You Can Edit |
| :--- | :--- | :--- |
| **`src/lib/supabase.js`** | **Supabase authentication client** | Configure the Supabase URL and publishable key in `web-client/.env`. Keep all private provider secrets on a trusted server. |
| **`src/components/ApiKeysModal.jsx`** | **In-App API Inspector** | Interactive modal to preview integration points, copy variable snippets, and check live connection status. |
| **`src/data/mockData.js`** | **Central Business Data Store** | Edit MSME profiles (Thandi's Bakery, Sipho's Spaza), change 13-week cash flow values, add new WhatsApp presets, add Boxer/Makro receipts, and modify micro-loan offers. |
| **`src/components/DashboardView.jsx`** | **Screen 1: Baseline Overview** | 13-Week cash projection chart, 5-check readiness score cards, and baseline liquidity boxes. |
| **`src/components/OrderIntakeView.jsx`** | **Screens 2, 3 & 4: Order demo** | Sample WhatsApp-style chat, timed client-side demonstration, unit economics display, and simulated counter-offer. No AI or WhatsApp service is connected. |
| **`src/components/LedgerView.jsx`** | **Concept 2: Smart Ledger** | The "Cash Drawer vs Bank" toggle, transaction stream list, and the "Snap-to-Record" OCR receipt scanner. |
| **`src/components/MicroPosView.jsx`** | **Concept 2: Micro-POS demo** | Simulated payment terminal interaction and receipt. No real payment is processed. |
| **`src/components/FundingView.jsx`** | **Concept 2: Scorecard & Credit** | 90-day transaction health meter and pre-approved micro-loan disbursement simulation. |
| **`src/components/MarketLinkerView.jsx`**| **Concept 3: Market Linker** | Verified Profile (CIPC, SARS Tax PIN, bank status) and shareable Trust Badge with QR code. |
| **`src/components/FunderReportModal.jsx`**| **Institutional ESD Audit** | The printable/exportable 1-page PDF credit dossier for corporate ESD programs and banks. |
| **`src/components/DeviceSimulatorFrame.jsx`** | **Handset vs Desktop Frame** | Toggle between desktop wide view and realistic smartphone mockup. |
| **`src/utils/soundEffects.js`** | **Tactile Audio Synthesizer** | Web Audio API chimes for POS taps, cash drawer open, and alert beeps (zero external audio files required). |
| **`src/App.jsx`** | **Main App Orchestration** | Global state, tab switching, balance updates, and profile selection. |

---

## Environment variables and secret handling

Copy `web-client/.env.example` to `web-client/.env` and configure the Supabase
project URL and publishable key. `VITE_` variables are compiled into the
browser bundle and must never contain service-role keys, passwords, or
third-party provider secrets. No AI, OCR, payment, or registry integration is
currently connected. See the project [`SECURITY.md`](../SECURITY.md) for the
verified SSDLC status and remaining security work.

---

## 🛠️ Common Co-Developer Gotchas & Fixes

### 1. Windows PowerShell: `npm.ps1 cannot be loaded because running scripts is disabled`
* **Why it happens:** Windows PowerShell has a restrictive execution policy for script files by default.
* **Fix 1 (Recommended):** Run with `npm.cmd` instead:
  ```powershell
  npm.cmd run dev
  ```
* **Fix 2:** Or enable scripts for your user account:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
  ```
* **Fix 3:** Or simply use Command Prompt (`cmd.exe`) or double-click `start.bat`.

### 2. Port `5173` is already in use
* If port 5173 is used by another application, Vite will automatically select the next available port (e.g. `http://localhost:5174/`). Look at the terminal output for the exact link.

### 3. Node.js Version
* This project runs on **Node.js 18.0.0 or higher** (tested on Node 20, 22, and 24). Check your version by typing `node -v`.

---

## 📦 Building for Production Deployment

To generate an optimized, minified production build:

```bash
npm run build
```

This creates a standalone `dist/` folder containing pure HTML, CSS, and JS that can be hosted anywhere with zero server runtime required:
* **Vercel:** Run `npx vercel` or link your GitHub repo.
* **Netlify:** Drag and drop the `dist/` folder to Netlify Drop.
* **GitHub Pages / Firebase Hosting / Render / Cloudflare Pages**.

To preview your production build locally:
```bash
npm run preview
```

---

Happy hacking! If you make any updates or enhancements, feel free to commit and push your branch.
