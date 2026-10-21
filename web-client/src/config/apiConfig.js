/**
 * HorizonCapital — Centralized API Integration Architecture
 * 
 * This file serves as the single source of truth for all external API endpoints,
 * keys, and integration bridges. When implementing production services, replace
 * the simulated promises with real HTTP requests (fetch/axios) or SDK calls.
 */

export const API_CONFIG = {
  ai: {
    provider: import.meta.env.VITE_AI_PROVIDER || 'anthropic',
    anthropicKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
    geminiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
    isConfigured: Boolean(import.meta.env.VITE_ANTHROPIC_API_KEY || import.meta.env.VITE_GEMINI_API_KEY),
    docsUrl: 'https://docs.anthropic.com/claude/reference/getting-started-with-the-api',
    targetFile: 'src/components/OrderIntakeView.jsx'
  },
  ocr: {
    provider: import.meta.env.VITE_OCR_PROVIDER || 'google_vision',
    apiKey: import.meta.env.VITE_VISION_OCR_API_KEY || '',
    isConfigured: Boolean(import.meta.env.VITE_VISION_OCR_API_KEY),
    docsUrl: 'https://cloud.google.com/vision/docs/ocr',
    targetFile: 'src/components/LedgerView.jsx'
  },
  payment: {
    gateway: import.meta.env.VITE_PAYMENT_GATEWAY || 'stitch',
    apiKey: import.meta.env.VITE_PAYMENT_API_KEY || '',
    merchantId: import.meta.env.VITE_PAYMENT_MERCHANT_ID || '',
    isConfigured: Boolean(import.meta.env.VITE_PAYMENT_API_KEY),
    docsUrl: 'https://stitch.money/docs',
    targetFile: 'src/components/MicroPosView.jsx'
  },
  cipc: {
    apiKey: import.meta.env.VITE_CIPC_VERIFICATION_KEY || '',
    isConfigured: Boolean(import.meta.env.VITE_CIPC_VERIFICATION_KEY),
    docsUrl: 'https://eservices.cipc.co.za',
    targetFile: 'src/components/MarketLinkerView.jsx'
  },
  database: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    isConfigured: Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY),
    docsUrl: 'https://supabase.com/docs',
    targetFile: 'src/data/mockData.js'
  }
};

/**
 * List of all integration modules for the developer inspection UI
 */
export const INTEGRATION_REGISTRY = [
  {
    id: 'ai-parser',
    name: 'WhatsApp AI Order Parsing & Risk Intelligence',
    category: 'AI & Natural Language Processing',
    purpose: 'Extracts unstructured WhatsApp messages into JSON (items, price, deadline) and evaluates township scam/default risk.',
    envVar: 'VITE_ANTHROPIC_API_KEY or VITE_GEMINI_API_KEY',
    targetFile: 'src/components/OrderIntakeView.jsx',
    functionName: 'callAiOrderParser(rawMessage)',
    status: API_CONFIG.ai.isConfigured ? 'LIVE_KEY_DETECTED' : 'SIMULATION_MODE',
    examplePayload: {
      model: "claude-3-5-sonnet-20241022",
      messages: [{ role: "user", content: "Extract order details: Hi, need 100 muffins for Saturday..." }]
    }
  },
  {
    id: 'receipt-ocr',
    name: 'Snap-to-Record Physical Receipt OCR',
    category: 'Computer Vision & Document AI',
    purpose: 'Extracts merchant, items, VAT, and totals from paper supplier receipts (Boxer, Makro, Cashbuild).',
    envVar: 'VITE_VISION_OCR_API_KEY',
    targetFile: 'src/components/LedgerView.jsx',
    functionName: 'callOcrReceiptScanner(imageFile)',
    status: API_CONFIG.ocr.isConfigured ? 'LIVE_KEY_DETECTED' : 'SIMULATION_MODE',
    examplePayload: {
      requests: [{ image: { source: { imageUri: "..." } }, features: [{ type: "DOCUMENT_TEXT_DETECTION" }] }]
    }
  },
  {
    id: 'softpos-gateway',
    name: 'Micro-POS SoftPOS & Tap-to-Pay Gateway',
    category: 'Payment Processing & Settlement',
    purpose: 'Processes contactless NFC payments, instant EFTs, and generates digital transaction slips.',
    envVar: 'VITE_PAYMENT_API_KEY & VITE_PAYMENT_MERCHANT_ID',
    targetFile: 'src/components/MicroPosView.jsx',
    functionName: 'processSoftPosPayment(amount, metadata)',
    status: API_CONFIG.payment.isConfigured ? 'LIVE_KEY_DETECTED' : 'SIMULATION_MODE',
    examplePayload: {
      amountInCents: 8500,
      currency: "ZAR",
      paymentMethod: "NFC_CONTACTLESS",
      description: "Thandi Bakery walk-in sale"
    }
  },
  {
    id: 'cipc-sars',
    name: 'CIPC & SARS Verification Registry',
    category: 'Regulatory & Trust Compliance',
    purpose: 'Validates legal business registration, tax pin good standing, and B-BBEE compliance for corporate ESD contracts.',
    envVar: 'VITE_CIPC_VERIFICATION_KEY',
    targetFile: 'src/components/MarketLinkerView.jsx',
    functionName: 'verifyCipcBusiness(registrationNumber)',
    status: API_CONFIG.cipc.isConfigured ? 'LIVE_KEY_DETECTED' : 'SIMULATION_MODE',
    examplePayload: {
      enterpriseNumber: "K2023/849122/07",
      taxPin: "9812-7492-11"
    }
  },
  {
    id: 'cloud-db',
    name: 'Cloud Database & Transaction Ledger Sync',
    category: 'Database & Real-time Sync',
    purpose: 'Persists ledger records, historical cash flow buffers, and pre-vetted credit scorecard data across devices.',
    envVar: 'VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY',
    targetFile: 'src/App.jsx & src/data/mockData.js',
    functionName: 'supabase.from("transactions").insert(...)',
    status: API_CONFIG.database.isConfigured ? 'LIVE_KEY_DETECTED' : 'SIMULATION_MODE',
    examplePayload: {
      table: "transactions",
      records: [{ profile_id: "thandi-bakery", amount: 1500, channel: "DIGITAL" }]
    }
  }
];

// ========================================================
// API Service Bridges (Ready to connect with live endpoints)
// ========================================================

/**
 * 1. AI Order Parser Bridge
 * To connect live: replace the setTimeout with a fetch call to Anthropic/Gemini/OpenAI.
 */
export async function callAiOrderParser(rawMessage) {
  if (API_CONFIG.ai.isConfigured) {
    // Example live Claude API call:
    // const res = await fetch('https://api.anthropic.com/v1/messages', {
    //   method: 'POST',
    //   headers: {
    //     'x-api-key': API_CONFIG.ai.anthropicKey,
    //     'content-type': 'application/json',
    //     'anthropic-version': '2023-06-01'
    //   },
    //   body: JSON.stringify({ ... })
    // });
    // return await res.json();
  }
  // Local high-speed fallback simulator
  return new Promise((resolve) => setTimeout(resolve, 1400));
}

/**
 * 2. Receipt OCR Bridge
 * To connect live: replace with Google Vision / Mindee REST call.
 */
export async function callOcrReceiptScanner(fileOrPreset) {
  if (API_CONFIG.ocr.isConfigured) {
    // Example Google Vision REST call:
    // const res = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${API_CONFIG.ocr.apiKey}`, { ... });
    // return await res.json();
  }
  return new Promise((resolve) => setTimeout(resolve, 1200));
}

/**
 * 3. SoftPOS Payment Bridge
 * To connect live: replace with Stitch / Yoco / Ozow API call.
 */
export async function processSoftPosPayment(amount, metadata) {
  if (API_CONFIG.payment.isConfigured) {
    // Example payment intent creation:
    // const res = await fetch('https://api.stitch.money/graphql', { ... });
  }
  return new Promise((resolve) => setTimeout(resolve, 1500));
}

/**
 * 4. CIPC & SARS Verification Bridge
 */
export async function verifyCipcBusiness(registrationNumber) {
  if (API_CONFIG.cipc.isConfigured) {
    // Call CIPC validation service
  }
  return new Promise((resolve) => setTimeout(resolve, 800));
}
