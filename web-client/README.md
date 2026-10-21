# HorizonCapital — Growth Readiness Engine
### Township MSME Financial Operating System & Risk Intelligence

> **Core Value Proposition:** Micro-entrepreneurs rarely fail from a lack of ambition — they fail from uncalculated growth. By connecting informal WhatsApp order intake directly to forward-looking cash flow projections and scam protection, HorizonCapital answers one critical daily business decision in under 30 seconds:
> 
> **"Can I afford to say yes to this order right now?"**

---

## 🚀 Key Modules & System Architecture

### 1. Hackathon 4-Screen Interaction Loop (Pitch Ready)
* **Screen 1 (Baseline Context):** Home Dashboard for Thandi's Bakery (Soweto), showcasing a 13-week rolling cash flow projection with a visible month-end dip at Week 4, paired with her overall 5-Check Readiness Score (78/100).
* **Screen 2 (Zero-Friction Capture):** WhatsApp-first order intake that simulates Claude AI extraction of informal South African WhatsApp messages into structured JSON (Client, Line Items, Quantity, Deadline, Quoted Price, Payment Terms).
* **Screen 3 (Intelligence & Risk Check):** Real-time unit economics breakdown (R650 ingredient cost vs R850 gross profit / 56.7% margin), flagging critical cash-flow solvency warnings (cash dips to R320 before payout, below the R500 survival buffer) and buyer default patterns.
* **Screen 4 (Action & Decision):** Township Counter-Offer generator enforcing a 50% upfront deposit (`R750 now, R750 on delivery`), safe cash flow forecast update, and +6 points Readiness Score bump (78 → 84/100).

### 2. Concept 2: The "Traders Hub" (Transaction & Funding Focused)
* **Micro-POS (Tap-to-Pay & SoftPOS):** Turns the founder's smartphone into an NFC contactless card terminal without purchasing expensive physical card hardware. Features interactive keypad, tactile audio chime, contactless tap simulation, and digital WhatsApp receipt generator.
* **Smart Ledger (Cash vs. Digital Toggle):** Clearly separates physical cash in the drawer (e.g., R1,420) from digital money in the bank (e.g., R4,850) to prevent township commingling of funds.
* **Snap-to-Record (OCR Receipt Scanner):** Automatically digitizes physical paper slips from Boxer Superstores, Makro, and Cashbuild into categorized ledger entries.
* **The "Scorecard" & Pre-vetted Funding:** Silently tracks 90 days of steady trade, unlocking pre-approved R5,000 working capital facilities with 1-click disbursement into the digital wallet.

### 3. Concept 3: The "Market Linker" (Procurement & Trust)
* **Verified Profile (Digital Identity):** Aggregates CIPC company registration, SARS Tax Compliance PIN, verified business banking, and township customer reviews.
* **Shareable Trust Badge:** Shareable verified digital profile link with QR code for corporate buyers.
* **Funder-Ready Executive Summary Export:** Formal 1-page institutional audit report for corporate Enterprise & Supplier Development (ESD) programs and banks, ready to print or save to PDF.

### 4. Responsive Design (Mobile & Desktop/Laptop)
* **Fluid Dual-Layout:** Seamlessly adapts between desktop/laptop monitors (sidebar, multi-column dashboard, wide 13-week charts) and mobile smartphones (bottom navigation bar, touch-first inputs).
* **Device Simulator Switcher:** Built-in toggle allowing desktop users to inspect the app inside a realistic township mobile handset mockup with notch, status bar, and tactile feel.
* **Tactile Web Audio:** Built-in synthesizer for POS chimes, cash drawer sounds, risk alerts, and celebration pings.

---

## 🛠️ Tech Stack
* **Frontend:** React 19 + Vite 8
* **Styling:** Tailwind CSS v4 + Plus Jakarta Sans + Space Grotesk
* **Icons:** Lucide React
* **Effects:** Canvas Confetti & Web Audio API Synthesizer

---

## 💻 Running the Application Locally (Co-Developer Friendly)

This project is completely self-contained and does **not** require any AI tools or agent runtimes to run or edit!

### 1-Click Launchers
* **Windows Users:** Double-click **`start.bat`** in this folder. It automatically checks Node, installs dependencies if needed, and opens your browser!
* **Mac / Linux Users:** Run `./start.sh` in your terminal.

### Manual Command Line
```bash
# 1. Install dependencies (only needed the first time)
npm install

# 2. Start local hot-reloading development server
npm run dev
# (or: npm start)
```
Your browser will automatically open to:
👉 **[http://localhost:5173](http://localhost:5173)**

> 📘 **Full Co-Developer Guide:** For step-by-step instructions on editing components, modifying mock data, testing on real mobile devices via local Wi-Fi, and troubleshooting common environment errors, see **[`SETUP.md`](./SETUP.md)**.

