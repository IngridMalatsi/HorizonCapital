// Comprehensive mock data for HorizonCapital Growth Readiness Engine
// Localized specifically for South African townships and urban informal MSMEs

export const BUSINESS_PROFILES = [
  {
    id: 'thandi-bakery',
    name: "Thandi's Bakery",
    owner: "Thandi Khumalo",
    location: "Orlando West, Soweto (Gauteng)",
    type: "Home-Based Bakery & Catering",
    phone: "+27 82 459 8812",
    cipcReg: "K2023/849122/07",
    sarsTaxPin: "9812-7492-11",
    bankName: "FNB Business Cheque",
    accountNumber: "•••• 4819",
    avatar: "🥖",
    initialReadinessScore: 78,
    cashInDrawer: 1420,
    digitalBankBalance: 4850,
    outstandingReceivables: 3450,
    avgWeeklyRevenue: 3800,
    weeklyBurnRate: 2400,
    rating: 4.9,
    reviewCount: 42,
    esdStatus: "Pre-Qualified for Anglo American & Woolworths ESD"
  },
  {
    id: 'sipho-spaza',
    name: "Sipho's Super Spaza",
    owner: "Sipho Ndlovu",
    location: "Site B, Khayelitsha (Western Cape)",
    type: "Retail Spaza & Convenience",
    phone: "+27 71 390 1485",
    cipcReg: "K2022/190433/07",
    sarsTaxPin: "7721-3390-42",
    bankName: "Standard Bank MyMo Biz",
    accountNumber: "•••• 9102",
    avatar: "🛒",
    initialReadinessScore: 82,
    cashInDrawer: 3850,
    digitalBankBalance: 9200,
    outstandingReceivables: 1800,
    avgWeeklyRevenue: 7200,
    weeklyBurnRate: 5100,
    rating: 4.8,
    reviewCount: 88,
    esdStatus: "Tiger Brands Local Distribution Partner"
  },
  {
    id: 'lerato-catering',
    name: "Lerato's Township Flavours",
    owner: "Lerato Moloi",
    location: "Ext 2, Tembisa (Gauteng)",
    type: "Event Catering & Platters",
    phone: "+27 83 912 4022",
    cipcReg: "K2024/091284/07",
    sarsTaxPin: "4491-0021-99",
    bankName: "Nedbank Small Business",
    accountNumber: "•••• 6231",
    avatar: "🍲",
    initialReadinessScore: 71,
    cashInDrawer: 950,
    digitalBankBalance: 3100,
    outstandingReceivables: 5200,
    avgWeeklyRevenue: 4900,
    weeklyBurnRate: 3600,
    rating: 4.7,
    reviewCount: 29,
    esdStatus: "Graduating to Corporate Procurement Ready"
  }
];

export const INITIAL_CASH_FLOW_WEEKS = [
  { week: 'W1 (This Wk)', inflow: 3800, outflow: 2400, balance: 6270, status: 'safe', label: 'Stable' },
  { week: 'W2', inflow: 3200, outflow: 2600, balance: 6870, status: 'safe', label: 'Healthy' },
  { week: 'W3', inflow: 2900, outflow: 3400, balance: 6370, status: 'safe', label: 'Flour bulk buy' },
  { week: 'W4 (Month-end)', inflow: 1100, outflow: 7150, balance: 320, status: 'warning', label: 'CRITICAL DIP (<R500)', dip: true },
  { week: 'W5', inflow: 4200, outflow: 2100, balance: 2420, status: 'recovering', label: 'Receivables In' },
  { week: 'W6', inflow: 3900, outflow: 2300, balance: 4020, status: 'safe', label: 'Stable' },
  { week: 'W7', inflow: 4100, outflow: 2500, balance: 5620, status: 'safe', label: 'Healthy' },
  { week: 'W8 (Mid-month)', inflow: 3700, outflow: 2400, balance: 6920, status: 'safe', label: 'Stable' },
  { week: 'W9', inflow: 4500, outflow: 2800, balance: 8620, status: 'safe', label: 'Catering Peak' },
  { week: 'W10', inflow: 3800, outflow: 2400, balance: 10020, status: 'safe', label: 'Safe Buffer' },
  { week: 'W11', inflow: 3900, outflow: 2500, balance: 11420, status: 'safe', label: 'Steady' },
  { week: 'W12 (Month-end)', inflow: 2200, outflow: 4800, balance: 8820, status: 'safe', label: 'Salaries/Rent' },
  { week: 'W13', inflow: 4400, outflow: 2600, balance: 10620, status: 'safe', label: 'Growth Ready' }
];

export const READINESS_CHECKS_DATA = [
  {
    key: 'records',
    name: 'Record Completeness',
    score: 85,
    benchmark: '80%',
    status: 'good',
    detail: '94% of WhatsApp chats & POS transactions logged with timestamped invoices',
    recommendation: 'Keep snapping supplier slips to maintain Tier 1 rating'
  },
  {
    key: 'profitability',
    name: 'Unit Margin & Pricing',
    score: 74,
    benchmark: '70%',
    status: 'good',
    detail: 'Average gross margin at 56.7% across signature baked lines',
    recommendation: 'Watch recent 12% hike in cake flour and sunflower oil costs'
  },
  {
    key: 'buffers',
    name: 'Cash Flow Buffer',
    score: 62,
    benchmark: '75%',
    status: 'warning',
    detail: 'Projected balance dips to R320 on Week 4 below R500 minimum safety emergency threshold',
    recommendation: 'Do NOT accept unhedged post-delivery payment terms on bulk orders'
  },
  {
    key: 'reliability',
    name: 'Payment Reliability',
    score: 82,
    benchmark: '80%',
    status: 'good',
    detail: 'Founder has zero supplier defaults; customer payment recovery rate is 88%',
    recommendation: 'Flagged 1 recurring late-paying event planner (Mbali Events)'
  },
  {
    key: 'capacity',
    name: 'Capacity & Compliance',
    score: 86,
    benchmark: '75%',
    status: 'good',
    detail: 'Valid CIPC registration, SARS Good Standing, certified food handler license',
    recommendation: 'Eligible for Anglo American ESD procurement matchmaking'
  }
];

export const WHATSAPP_PRESETS = [
  {
    id: 'mbali-muffins',
    title: "100 Muffins for Saturday (Mbali Events - High Risk)",
    sender: "Mbali Events (083 441 9012)",
    rawMessage: `Hi Thandi, hope you are well sisi! 🙏
Need 100 mixed fresh muffins (50 blueberry, 50 choc chip) for a corporate youth seminar in Soweto this Saturday by 2pm.
We have budget of R1,500. Can pay after delivery on Monday once our finance approves invoice. Please confirm urgent! 🧁`,
    extractedData: {
      client: "Mbali Events & Planners",
      item: "100 Mixed Fresh Muffins",
      quantity: 100,
      deadline: "This Saturday, 14:00",
      offeredPrice: 1500,
      paymentTerms: "Post-delivery payment (Unhedged 100% Credit)",
      productionCost: 650,
      grossProfit: 850,
      marginPercent: 56.7,
      riskLevel: "CRITICAL",
      riskReasons: [
        "Buyer has paid 3 weeks late on past 3 orders",
        "Raw materials (R650) require immediate cash outflow on Friday morning",
        "Your available cash balance drops from R970 to R320 before delivery payout",
        "Falls below your R500 emergency safety buffer"
      ],
      counterOfferRecommendation: {
        depositPercent: 50,
        depositAmount: 750,
        balanceAmount: 750,
        depositTiming: "Immediate upon order confirmation",
        balanceTiming: "Cash or SoftPOS Tap on delivery",
        proposedMessage: `Hi Mbali! We'd love to cater your 100 fresh muffins for Saturday's seminar! 🧁✨

To secure the ingredients and reserve the oven schedule, our standard policy for event orders is a 50% deposit (R750) upon confirmation, with the remaining R750 paid via instant Tap-to-Pay card / EFT upon Saturday delivery.

Can I send our business bank details or an instant payment link so we get your batch started right away? Warm regards, Thandi (Thandi's Bakery Soweto)`
      }
    }
  },
  {
    id: 'church-scones',
    title: "5 Buckets of Scones (Grace Fellowship - Low Risk)",
    sender: "Pastor Dlamini (072 109 4321)",
    rawMessage: `Sanibonani Thandi. Grace Fellowship requires 5x 5L buckets of fresh butter scones for Sunday morning service. Total quote R1,250. We will pay 50% upfront via Capitec EFT today and cash balance on collection.`,
    extractedData: {
      client: "Grace Fellowship Church",
      item: "5x 5L Buckets of Butter Scones",
      quantity: 5,
      deadline: "Sunday 07:30",
      offeredPrice: 1250,
      paymentTerms: "50% upfront EFT + 50% cash on collection",
      productionCost: 480,
      grossProfit: 770,
      marginPercent: 61.6,
      riskLevel: "SAFE",
      riskReasons: [
        "Verified repeat community buyer (100% on-time record)",
        "R625 upfront covers 130% of production ingredient cost",
        "Cash buffer remains well above R1,000 threshold"
      ],
      counterOfferRecommendation: {
        depositPercent: 50,
        depositAmount: 625,
        balanceAmount: 625,
        depositTiming: "Capitec instant payment",
        balanceTiming: "Cash upon collection",
        proposedMessage: `Amen Pastor Dlamini! Your 5 buckets of fresh butter scones are confirmed for Sunday 07:30. Thank you for the upfront Capitec deposit. Looking forward to seeing you!`
      }
    }
  },
  {
    id: 'corporate-catering',
    title: "Corporate Sandwich Platters (FNB Branch - 30-Day Risk)",
    sender: "Kagiso Procurement (011 884 1000)",
    rawMessage: `Good day Ms Khumalo, we wish to order 6 large savoury platters for our regional staff meeting next Wednesday. Total value R3,600. Our procurement system operates strictly on 30-day payment terms following invoice submission. Kindly issue invoice.`,
    extractedData: {
      client: "FNB Soweto Cluster",
      item: "6 Large Premium Savoury Platters",
      quantity: 6,
      deadline: "Next Wednesday 10:00",
      offeredPrice: 3600,
      paymentTerms: "Net-30 Corporate Terms",
      productionCost: 1650,
      grossProfit: 1950,
      marginPercent: 54.2,
      riskLevel: "HIGH_CASH_LOCKUP",
      riskReasons: [
        "Corporate buyer is legitimate but 30-day terms locks up R1,650 cash for 4+ weeks",
        "Could trigger cash insolvency before salary day",
        "Requires pre-vetted invoice discounting or 50% purchase order advance"
      ],
      counterOfferRecommendation: {
        depositPercent: 40,
        depositAmount: 1440,
        balanceAmount: 2160,
        depositTiming: "Purchase Order Advance / Early Payment Discount",
        balanceTiming: "Net-14 terms",
        proposedMessage: `Good day Kagiso. Thank you for choosing Thandi's Bakery. As an accredited township MSME, we offer a 5% early settlement discount for 7-day payment, or a 40% initial procurement disbursement (R1,440) to cover raw materials. We can also process this through your ESD supplier early-pay portal. Please advise!`
      }
    }
  }
];

export const INITIAL_LEDGER_TRANSACTIONS = [
  {
    id: 'tx-101',
    date: '2026-10-19 11:20',
    description: 'Walk-in Customer: 4 Muffins & Coffee',
    type: 'INCOME',
    channel: 'DIGITAL',
    method: 'Micro-POS SoftPOS (Tap)',
    amount: 110.00,
    category: 'Walk-in Sales',
    status: 'Settled',
    badge: 'SoftPOS'
  },
  {
    id: 'tx-102',
    date: '2026-10-19 09:45',
    description: 'Cash Drawer Sale: 12 Croissants',
    type: 'INCOME',
    channel: 'CASH',
    method: 'Physical Cash',
    amount: 180.00,
    category: 'Walk-in Sales',
    status: 'In Drawer',
    badge: 'Cash'
  },
  {
    id: 'tx-103',
    date: '2026-10-18 16:30',
    description: 'Boxer Superstores: 25kg Cake Flour & Sugar',
    type: 'EXPENSE',
    channel: 'CASH',
    method: 'Snap-to-Record (OCR)',
    amount: -380.00,
    category: 'Cost of Goods (Ingredients)',
    status: 'Verified',
    receiptUrl: '/receipts/boxer-receipt.jpg',
    badge: 'Snap-to-Record'
  },
  {
    id: 'tx-104',
    date: '2026-10-18 14:15',
    description: 'Grace Fellowship Scone Deposit (50%)',
    type: 'INCOME',
    channel: 'DIGITAL',
    method: 'Capitec Instant Pay',
    amount: 625.00,
    category: 'Order Deposit',
    status: 'Settled',
    badge: 'Bank'
  },
  {
    id: 'tx-105',
    date: '2026-10-17 10:00',
    description: 'Municipal Prepaid Electricity (Bakery Stall)',
    type: 'EXPENSE',
    channel: 'DIGITAL',
    method: 'FNB Banking App',
    amount: -450.00,
    category: 'Utilities',
    status: 'Settled',
    badge: 'Bank'
  },
  {
    id: 'tx-106',
    date: '2026-10-16 15:40',
    description: 'Corner Café: 30 Fresh Bread Loaves',
    type: 'INCOME',
    channel: 'CASH',
    method: 'Physical Cash',
    amount: 450.00,
    category: 'Wholesale B2B',
    status: 'In Drawer',
    badge: 'Cash'
  }
];

export const PRESET_RECEIPTS = [
  {
    id: 'boxer-flour',
    merchant: 'Boxer Superstores - Soweto Plaza',
    date: '2026-10-19',
    total: 380.00,
    taxVat: 49.56,
    items: [
      { name: 'Golden Cloud Cake Flour 25kg', price: 245.00 },
      { name: 'Hullets White Sugar 10kg', price: 135.00 }
    ],
    category: 'Cost of Goods (Baking Ingredients)',
    suggestedChannel: 'CASH'
  },
  {
    id: 'makro-dairy',
    merchant: 'Makro Crown Mines (Johannesburg)',
    date: '2026-10-18',
    total: 720.00,
    taxVat: 93.91,
    items: [
      { name: 'Clover Full Cream Milk 6x2L', price: 210.00 },
      { name: 'Farm Fresh Large Eggs 60pk x2', price: 260.00 },
      { name: 'Stork Butter Spread 5kg Tub', price: 250.00 }
    ],
    category: 'Cost of Goods (Dairy & Eggs)',
    suggestedChannel: 'DIGITAL'
  },
  {
    id: 'cashbuild-stall',
    merchant: 'Cashbuild Soweto Central',
    date: '2026-10-16',
    total: 290.00,
    taxVat: 37.82,
    items: [
      { name: 'Steel Shelf Bracket & Screws', price: 175.00 },
      { name: 'Enamel Gloss White 1L', price: 115.00 }
    ],
    category: 'Stall & Equipment Maintenance',
    suggestedChannel: 'DIGITAL'
  }
];

export const FUNDING_OFFERS = [
  {
    id: 'offer-micro-5k',
    title: 'Township Growth Working Capital',
    amount: 5000,
    termDays: 30,
    dailyRepayment: 172.50,
    feePercent: 3.5,
    status: 'PRE_APPROVED',
    funder: 'HorizonCapital ESD Micro-Credit Pool',
    purpose: 'Bulk raw ingredients to unlock higher margin discounts',
    qualifyingFactors: [
      'Over 90 consecutive days of recorded WhatsApp and SoftPOS trade',
      'Readiness Score of 78/100 (Threshold: 75)',
      'Clean supplier track record & zero bank overdraft penalties'
    ]
  },
  {
    id: 'offer-equipment-15k',
    title: 'Equipment Advancement Facility',
    amount: 15000,
    termDays: 90,
    monthlyRepayment: 5240.00,
    feePercent: 4.8,
    status: 'ELIGIBLE_IN_14_DAYS',
    funder: 'Anglo American Zimele Enterprise Hub',
    purpose: 'Industrial Convection Deck Oven (Doubles daily baking capacity)',
    qualifyingFactors: [
      'Requires 3 more verified B2B orders with 50%+ deposit compliance',
      'Readiness Score above 80'
    ]
  }
];
