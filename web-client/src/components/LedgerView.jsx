import React, { useMemo, useState } from 'react';
import {
  Wallet,
  Camera,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Coins,
  Building,
  Check,
  X,
  TrendingUp,
  TrendingDown,
  Receipt,
  CalendarDays,
  Download,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

/**
 * LedgerView
 *
 * Props:
 * - transactions: array of transaction records
 * - cashInDrawer: current physical cash balance (optional; derived from transactions if omitted)
 * - digitalBankBalance: current digital balance (optional; derived from transactions if omitted)
 * - onAddTransaction: callback called after a transaction is added
 * - presetReceipts: optional sample receipt objects for demonstration
 *
 * Notes:
 * - This component calculates analytics from the transaction data it receives.
 * - It does not itself persist data. Connect onAddTransaction and the transactions
 *   prop to your backend/database for persistent, shared real-life data.
 * - Receipt scanning below is a manual receipt-review flow, not live OCR.
 */

const CURRENCY = 'en-ZA';
const CHART_COLORS = ['#FF6B00', '#B84D00', '#6C757D', '#DDE1E5', '#F28C45', '#C62828'];

const DEFAULT_RECEIPTS = [
  {
    id: 'sample-receipt-1',
    merchant: 'Soweto Wholesale',
    date: new Date().toISOString().slice(0, 10),
    total: 425.5,
    taxVat: 55.5,
    suggestedChannel: 'CASH',
    category: 'Cost of Goods (Ingredients)',
    items: [
      { name: 'Flour', price: 180 },
      { name: 'Sugar', price: 95.5 },
      { name: 'Cooking oil', price: 150 },
    ],
  },
  {
    id: 'sample-receipt-2',
    merchant: 'Local Packaging Supplier',
    date: new Date().toISOString().slice(0, 10),
    total: 280,
    taxVat: 36.52,
    suggestedChannel: 'DIGITAL',
    category: 'Packaging & Bags',
    items: [
      { name: 'Paper bags', price: 160 },
      { name: 'Containers', price: 120 },
    ],
  },
  {
    id: 'sample-receipt-3',
    merchant: 'Hardware & Utilities',
    date: new Date().toISOString().slice(0, 10),
    total: 199.99,
    taxVat: 26.09,
    suggestedChannel: 'CASH',
    category: 'Utilities & Electricity',
    items: [
      { name: 'Cleaning supplies', price: 79.99 },
      { name: 'Electricity', price: 120 },
    ],
  },
];

const CATEGORIES = [
  'Walk-in Sales',
  'Order Deposit',
  'Cost of Goods (Ingredients)',
  'Packaging & Bags',
  'Utilities & Electricity',
  'Transport & Delivery',
  'Rent',
  'Equipment',
  'Other',
];

function formatZAR(value) {
  const amount = Number(value);
  return `R ${Number.isFinite(amount) ? amount : 0}`.replace(
    /^R (.*)$/,
    (_, number) =>
      `R ${Number(number).toLocaleString(CURRENCY, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
  );
}

function parseDate(value) {
  if (!value) return null;
  const match = String(value).match(/^(\d{4}-\d{2}-\d{2})/);
  if (match) {
    const [year, month, day] = match[1].split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function dateKey(value) {
  const date = parseDate(value);
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function prettyDate(value) {
  const date = parseDate(value);
  return date
    ? date.toLocaleDateString(CURRENCY, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : String(value || 'Unknown date');
}

function makeId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `tx-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getAnalytics(transactions) {
  const validTransactions = transactions.filter(
    (tx) => Number.isFinite(Number(tx.amount)) && tx.date
  );

  const income = validTransactions.filter((tx) => Number(tx.amount) > 0);
  const expenses = validTransactions.filter((tx) => Number(tx.amount) < 0);

  const totalRevenue = income.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const totalExpenses = expenses.reduce((sum, tx) => sum + Math.abs(Number(tx.amount)), 0);
  const digitalRevenue = income
    .filter((tx) => tx.channel === 'DIGITAL')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
  const cashRevenue = income
    .filter((tx) => tx.channel === 'CASH')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const categoryTotals = {};
  const dailyTotals = {};

  for (const tx of validTransactions) {
    const amount = Number(tx.amount);
    const category = tx.category || 'Uncategorised';

    if (amount < 0) {
      categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(amount);
    }

    const day = dateKey(tx.date);
    if (!day) continue;

    if (!dailyTotals[day]) {
      dailyTotals[day] = { date: day, revenue: 0, expenses: 0 };
    }

    if (amount > 0) dailyTotals[day].revenue += amount;
    if (amount < 0) dailyTotals[day].expenses += Math.abs(amount);
  }

  return {
    transactionCount: validTransactions.length,
    totalRevenue,
    totalExpenses,
    netCashFlow: totalRevenue - totalExpenses,
    digitalRevenue,
    cashRevenue,
    digitalSalesShare: totalRevenue > 0 ? (digitalRevenue / totalRevenue) * 100 : 0,
    expensesByCategory: Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }))
      .sort((a, b) => b.value - a.value),
    dailyTrend: Object.values(dailyTotals)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14),
  };
}

function StatCard({ title, value, subtitle, icon: Icon, tone = 'slate', compact = false }) {
  const tones = {
    slate: 'text-slate-100 bg-slate-800/70',
    green: 'text-emerald-300 bg-emerald-500/10',
    amber: 'text-amber-300 bg-amber-500/10',
    cyan: 'text-cyan-300 bg-cyan-500/10',
    rose: 'text-rose-300 bg-rose-500/10',
  };

  return (
    <div className={`min-w-0 rounded-2xl border border-slate-800 bg-slate-900 ${compact ? 'p-3' : 'p-3 sm:p-4'}`}>
      <div className={`mb-2 flex min-w-0 items-start justify-between gap-1.5 ${compact ? '' : 'sm:mb-3 sm:items-center sm:gap-2'}`}>
        <p className={`min-w-0 font-medium leading-tight text-slate-400 ${compact ? 'text-[11px]' : 'text-[11px] sm:text-xs'}`}>{title}</p>
        <span className={`shrink-0 rounded-lg ${compact ? 'p-1.5' : 'p-1.5 sm:p-2'} ${tones[tone] || tones.slate}`}>
          <Icon className={`h-3.5 w-3.5 ${compact ? '' : 'sm:h-4 sm:w-4'}`} />
        </span>
      </div>
      <p className={`break-words font-black tracking-tight text-slate-100 ${compact ? 'text-base' : 'text-base sm:text-2xl'}`}>
        {value}
      </p>
      {subtitle && <p className={`mt-1.5 leading-snug text-slate-500 ${compact ? 'text-[10px]' : 'text-[10px] sm:mt-2 sm:text-xs'}`}>{subtitle}</p>}
    </div>
  );
}

export default function LedgerView({
  transactions: transactionsProp,
  cashInDrawer,
  digitalBankBalance,
  deviceMode = 'desktop',
  onAddTransaction,
  presetReceipts = DEFAULT_RECEIPTS,
}) {
  const isPhoneMode = deviceMode === 'smartphone';
  // Keep newly entered transactions visible immediately, even if the parent callback
  // does not update its props yet. When the parent does update, IDs prevent duplicates.
  const [localTransactions, setLocalTransactions] = useState([]);
  const suppliedTransactions = Array.isArray(transactionsProp) ? transactionsProp : [];
  const suppliedIds = useMemo(
    () => new Set(suppliedTransactions.map((tx) => String(tx.id))),
    [suppliedTransactions]
  );
  const transactions = useMemo(() => {
    const byId = new Map();
    suppliedTransactions.forEach((tx) => byId.set(String(tx.id), tx));
    localTransactions.forEach((tx) => {
      if (!byId.has(String(tx.id))) byId.set(String(tx.id), tx);
    });
    return Array.from(byId.values()).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  }, [suppliedTransactions, localTransactions]);

  const [channelFilter, setChannelFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [activeTab, setActiveTab] = useState('ledger');

  const [snapModalOpen, setSnapModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(presetReceipts[0] || null);
  const [receiptScanning, setReceiptScanning] = useState(false);
  const [receiptError, setReceiptError] = useState('');
  const [receiptNotice, setReceiptNotice] = useState('');

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState('INCOME');
  const [newChannel, setNewChannel] = useState('CASH');
  const [newCategory, setNewCategory] = useState('Walk-in Sales');
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10));
  const [formError, setFormError] = useState('');

  const addTransaction = (transaction) => {
    // Optimistic local update ensures the ledger and its charts rerender immediately.
    setLocalTransactions((current) => [
      transaction,
      ...current.filter((item) => String(item.id) !== String(transaction.id)),
    ]);

    // Also notify the parent so its dashboard and other screens can update.
    if (typeof onAddTransaction === 'function') {
      onAddTransaction(transaction);
    }
  };

  const filteredTransactions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return transactions.filter((tx) => {
      if (channelFilter !== 'ALL' && tx.channel !== channelFilter) return false;
      if (typeFilter === 'INCOME' && Number(tx.amount) <= 0) return false;
      if (typeFilter === 'EXPENSE' && Number(tx.amount) >= 0) return false;

      const txDay = dateKey(tx.date);
      if (dateFrom && (!txDay || txDay < dateFrom)) return false;
      if (dateTo && (!txDay || txDay > dateTo)) return false;

      if (query) {
        const searchable = [
          tx.description,
          tx.category,
          tx.method,
          tx.channel,
          tx.status,
          tx.type,
        ].filter(Boolean).join(' ').toLowerCase();
        if (!searchable.includes(query)) return false;
      }

      return true;
    });
  }, [transactions, channelFilter, typeFilter, searchQuery, dateFrom, dateTo]);

  // Charts use every transaction in the selected date range, independent of the
  // table's text/type/channel filters, so a new entry cannot be hidden from analytics.
  const analyticsTransactions = useMemo(
    () => transactions.filter((tx) => {
      const txDay = dateKey(tx.date);
      if (dateFrom && (!txDay || txDay < dateFrom)) return false;
      if (dateTo && (!txDay || txDay > dateTo)) return false;
      return true;
    }),
    [transactions, dateFrom, dateTo]
  );
  const analytics = useMemo(() => getAnalytics(analyticsTransactions), [analyticsTransactions]);

  const derivedCashBalance = useMemo(
    () => transactions
      .filter((tx) => tx.channel === 'CASH')
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0),
    [transactions]
  );
  const derivedDigitalBalance = useMemo(
    () => transactions
      .filter((tx) => tx.channel === 'DIGITAL')
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0),
    [transactions]
  );

  // If a supplied balance is a starting/current balance, add only local transactions
  // that have not yet been reflected in the parent's transaction list.
  const unreflectedLocalTransactions = localTransactions.filter((tx) => !suppliedIds.has(String(tx.id)));
  const localCashDelta = unreflectedLocalTransactions
    .filter((tx) => tx.channel === 'CASH')
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
  const localDigitalDelta = unreflectedLocalTransactions
    .filter((tx) => tx.channel === 'DIGITAL')
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const hasCashBalance = cashInDrawer !== undefined && cashInDrawer !== null && Number.isFinite(Number(cashInDrawer));
  const hasDigitalBalance = digitalBankBalance !== undefined && digitalBankBalance !== null && Number.isFinite(Number(digitalBankBalance));
  const cashBalance = hasCashBalance ? Number(cashInDrawer) + localCashDelta : derivedCashBalance;
  const digitalBalance = hasDigitalBalance ? Number(digitalBankBalance) + localDigitalDelta : derivedDigitalBalance;

  const handleManualSubmit = (event) => {
    event.preventDefault();
    setFormError('');

    const amount = Number(newAmount);
    if (!newDesc.trim()) {
      setFormError('Please enter a transaction description.');
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError('Enter an amount greater than zero.');
      return;
    }
    if (!newDate) {
      setFormError('Please select a transaction date.');
      return;
    }

    const isIncome = newType === 'INCOME';
    const transaction = {
      id: makeId(),
      date: `${newDate} ${new Date().toTimeString().slice(0, 5)}`,
      description: newDesc.trim(),
      type: newType,
      channel: newChannel,
      method: newChannel === 'CASH' ? 'Cash in Drawer' : 'Digital Bank Transfer',
      amount: isIncome ? Math.abs(amount) : -Math.abs(amount),
      category: newCategory,
      status: 'Manual entry',
      badge: newChannel === 'CASH' ? 'Cash' : 'Bank',
    };

    addTransaction(transaction);
    setAddModalOpen(false);
    setNewDesc('');
    setNewAmount('');
    setNewType('INCOME');
    setNewChannel('CASH');
    setNewCategory('Walk-in Sales');
    setNewDate(new Date().toISOString().slice(0, 10));
  };

  const handleCommitReceipt = () => {
    if (!selectedReceipt) return;

    const total = Number(selectedReceipt.total);
    if (!Number.isFinite(total) || total <= 0) {
      setReceiptError('This receipt has an invalid total.');
      return;
    }

    const transaction = {
      id: makeId(),
      date: `${selectedReceipt.date || new Date().toISOString().slice(0, 10)} 12:00`,
      description: `${selectedReceipt.merchant || 'Supplier'}: ${(selectedReceipt.items || [])
        .map((item) => item.name)
        .join(', ')}`,
      type: 'EXPENSE',
      channel: selectedReceipt.suggestedChannel === 'DIGITAL' ? 'DIGITAL' : 'CASH',
      method: 'Receipt review',
      amount: -Math.abs(total),
      category: selectedReceipt.category || 'Other',
      status: 'Needs verification',
      badge: 'Receipt',
    };

    addTransaction(transaction);
    setSnapModalOpen(false);
    setReceiptScanning(false);
    setReceiptError('');
    setReceiptNotice('Receipt entry added. Verify it against the original receipt.');
  };

  const downloadCsv = () => {
    const rows = [
      ['Date', 'Description', 'Type', 'Channel', 'Method', 'Category', 'Amount (ZAR)', 'Status'],
      ...filteredTransactions.map((tx) => [
        tx.date,
        tx.description,
        Number(tx.amount) >= 0 ? 'INCOME' : 'EXPENSE',
        tx.channel,
        tx.method,
        tx.category,
        Number(tx.amount),
        tx.status,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\r\n');

    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `ledger-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setChannelFilter('ALL');
    setTypeFilter('ALL');
    setSearchQuery('');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="min-h-screen space-y-5 bg-slate-950 pb-24 text-slate-100">
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Township Smart Ledger
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Cash Drawer & Digital Bank
          </h1>
          <p className="mt-1 max-w-2xl text-xs text-slate-400 sm:text-sm">
            Track income, expenses and payment channels, then analyse business performance from your recorded transactions.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setSnapModalOpen(true);
              setReceiptError('');
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-3 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-400"
          >
            <Camera className="h-4 w-4" /> Receipt Entry
          </button>
          <button
            type="button"
            onClick={() => {
              setFormError('');
              setAddModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm font-semibold hover:border-slate-600"
          >
            <Plus className="h-4 w-4 text-emerald-400" /> Add Entry
          </button>
        </div>
      </div>

      <div className={`grid min-w-0 grid-cols-2 gap-2 ${isPhoneMode ? '' : 'sm:gap-3 xl:grid-cols-4'}`}>
        <StatCard
          title="Physical Cash Balance"
          value={formatZAR(cashBalance)}
          subtitle="Cash-channel balance from supplied balance or ledger entries"
          icon={Coins}
          tone="amber"
          compact={isPhoneMode}
        />
        <StatCard
          title="Digital Bank Balance"
          value={formatZAR(digitalBalance)}
          subtitle="Digital-channel balance from supplied balance or ledger entries"
          icon={Building}
          tone="green"
          compact={isPhoneMode}
        />
        <StatCard
          title="Revenue in Filter"
          value={formatZAR(analytics.totalRevenue)}
          subtitle={`${analytics.transactionCount} transaction(s) in current filter`}
          icon={TrendingUp}
          tone="cyan"
          compact={isPhoneMode}
        />
        <StatCard
          title="Net Cash Flow in Filter"
          value={formatZAR(analytics.netCashFlow)}
          subtitle={`Expenses: ${formatZAR(analytics.totalExpenses)}`}
          icon={analytics.netCashFlow >= 0 ? TrendingUp : TrendingDown}
          tone={analytics.netCashFlow >= 0 ? 'green' : 'rose'}
          compact={isPhoneMode}
        />
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('ledger')}
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${
            activeTab === 'ledger'
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-slate-900 text-slate-400 hover:text-slate-100'
          }`}
        >
          Ledger
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${
            activeTab === 'analytics'
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-slate-900 text-slate-400 hover:text-slate-100'
          }`}
        >
          Analytics
        </button>
      </div>

      {activeTab === 'analytics' ? (
        <div className="space-y-4">
          <div className={`grid gap-3 ${isPhoneMode ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'}`}>
            <StatCard title="Total Expenses" value={formatZAR(analytics.totalExpenses)} subtitle="Outflows in current filter" icon={TrendingDown} tone="rose" compact={isPhoneMode} />
            <StatCard title="Cash Revenue" value={formatZAR(analytics.cashRevenue)} subtitle="Income recorded as cash" icon={Coins} tone="amber" compact={isPhoneMode} />
            <StatCard title="Digital Revenue" value={formatZAR(analytics.digitalRevenue)} subtitle="Income recorded as digital" icon={Building} tone="green" compact={isPhoneMode} />
            <StatCard title="Digital Share" value={`${analytics.digitalSalesShare.toFixed(1)}%`} subtitle="Share of recorded revenue" icon={Wallet} tone="cyan" compact={isPhoneMode} />
          </div>

          <div className={`grid grid-cols-1 gap-4 ${isPhoneMode ? '' : 'xl:grid-cols-3'}`}>
            <section className={`rounded-2xl border border-slate-800 bg-slate-900 p-4 ${isPhoneMode ? '' : 'xl:col-span-2'}`}>
              <div className="mb-4">
                <h2 className="text-lg font-bold">Revenue vs Expenses</h2>
                <p className="text-xs text-slate-400">Daily totals for the selected date range (up to the latest 14 days with transactions).</p>
              </div>
              {analytics.dailyTrend.length ? (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.dailyTrend} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#DDE1E5" />
                      <XAxis dataKey="date" stroke="#6C757D" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#6C757D" tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ background: '#FFFFFF', border: '1px solid #DDE1E5', borderRadius: 12 }}
                        labelStyle={{ color: '#1A1A1A' }}
                        formatter={(value) => formatZAR(value)}
                      />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue" fill="#FF6B00" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expenses" name="Expenses" fill="#6C757D" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState message="Add transactions to see your revenue and expense trend." />
              )}
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <h2 className="text-lg font-bold">Expenses by Category</h2>
              <p className="mb-3 text-xs text-slate-400">Where recorded spending is going</p>
              {analytics.expensesByCategory.length ? (
                <>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={analytics.expensesByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={78} innerRadius={42} paddingAngle={2}>
                          {analytics.expensesByCategory.map((entry, index) => (
                            <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ background: '#FFFFFF', border: '1px solid #DDE1E5', borderRadius: 12 }}
                          formatter={(value) => formatZAR(value)}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    {analytics.expensesByCategory.slice(0, 6).map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between gap-3 text-xs">
                        <span className="flex min-w-0 items-center gap-2 text-slate-300">
                          <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                          <span className="truncate">{item.name}</span>
                        </span>
                        <span className="shrink-0 font-mono text-slate-100">{formatZAR(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <EmptyState message="Expense categories will appear after you record expenses." />
              )}
            </section>
          </div>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-cyan-400" />
              <h2 className="text-lg font-bold">Data quality & interpretation</h2>
            </div>
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-400">
              <li>Analytics reflect only the transactions supplied to this page and the currently selected filters.</li>
              <li>Manually entered and receipt-review entries should be checked against source documents.</li>
              <li>Net cash flow here means recorded income minus recorded expenses; it is not a formal accounting profit figure.</li>
              <li>Connect the parent component to a backend/database for persistent data shared across sessions and devices.</li>
            </ul>
          </section>
        </div>
      ) : (
        <>
          <section className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-3 sm:p-4">
            <div className="mb-3 flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-400" />
              <h2 className="font-bold">Search and filter transactions</h2>
            </div>
            <div className={`grid min-w-0 grid-cols-2 gap-2 ${isPhoneMode ? '' : 'sm:gap-3 md:grid-cols-2 xl:grid-cols-5'}`}>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search description, category or method"
                aria-label="Search transactions"
                className={`min-w-0 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 ${isPhoneMode ? 'col-span-2' : 'col-span-2 xl:col-span-2'}`}
              />
              <select aria-label="Filter by payment channel" value={channelFilter} onChange={(event) => setChannelFilter(event.target.value)} className="col-span-1 min-w-0 rounded-xl border border-slate-800 bg-slate-950 px-2 py-2.5 text-[11px] sm:px-3 sm:text-sm">
                <option value="ALL">All payment channels</option>
                <option value="CASH">Cash</option>
                <option value="DIGITAL">Digital</option>
              </select>
              <select aria-label="Filter by transaction type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="col-span-1 min-w-0 rounded-xl border border-slate-800 bg-slate-950 px-2 py-2.5 text-[11px] sm:px-3 sm:text-sm">
                <option value="ALL">All transaction types</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expenses</option>
              </select>
              <button type="button" onClick={resetFilters} className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-xl border border-slate-700 px-2 py-2.5 text-xs text-slate-300 hover:bg-slate-800 sm:gap-2 sm:px-3 sm:text-sm">
                <RefreshCw className="h-4 w-4" /> Reset filters
              </button>
              <label className="flex min-w-0 flex-col gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-2 text-[10px] text-slate-400 sm:px-3 sm:text-xs">
                <CalendarDays className="h-4 w-4 shrink-0" />
                <span>From date</span>
                <input aria-label="Start date" type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="w-full min-w-0 max-w-full bg-transparent text-xs text-slate-200" />
              </label>
              <label className="flex min-w-0 flex-col gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-2 text-[10px] text-slate-400 sm:px-3 sm:text-xs">
                <CalendarDays className="h-4 w-4 shrink-0" />
                <span>To date</span>
                <input aria-label="End date" type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="w-full min-w-0 max-w-full bg-transparent text-xs text-slate-200" />
              </label>
              <button type="button" onClick={downloadCsv} className={`inline-flex min-w-0 items-center justify-center gap-1.5 rounded-xl bg-cyan-500 px-2 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 ${isPhoneMode ? '' : 'sm:gap-2 sm:px-3 sm:text-sm md:col-span-2 xl:col-span-1'}`}>
                <Download className="h-4 w-4" /> Export CSV
              </button>
            </div>
          </section>

          {receiptNotice && (
            <div className="flex items-start justify-between gap-3 rounded-xl border border-emerald-800 bg-emerald-950/30 p-3 text-sm text-emerald-300">
              <span>{receiptNotice}</span>
              <button type="button" onClick={() => setReceiptNotice('')} aria-label="Dismiss notice"><X className="h-4 w-4" /></button>
            </div>
          )}

          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="flex min-w-0 flex-col gap-2 border-b border-slate-800 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
              <div>
                <h2 className="font-bold">Transaction Ledger</h2>
                <p className="text-xs text-slate-400">{filteredTransactions.length} matching transaction(s)</p>
              </div>
              <button type="button" onClick={downloadCsv} className="inline-flex min-w-0 items-center justify-center gap-2 self-stretch rounded-lg border border-slate-700 px-3 py-2 text-xs hover:bg-slate-800 sm:self-auto">
                <Download className="h-3.5 w-3.5" /> Export filtered records
              </button>
            </div>
            {filteredTransactions.length ? (
              <>
              <div className={isPhoneMode ? 'hidden' : 'hidden overflow-x-auto sm:block'}>
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-slate-950/70 text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Channel / Method</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredTransactions.map((tx) => {
                      const isIncome = Number(tx.amount) > 0;
                      return (
                        <tr key={tx.id} className="hover:bg-slate-800/40">
                          <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">{prettyDate(tx.date)}</td>
                          <td className="max-w-xs px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className={`rounded-lg p-1.5 ${isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                {isIncome ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                              </span>
                              <span className="truncate font-medium">{tx.description || 'No description'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-xs text-slate-200">{tx.channel || 'Unknown'}</div>
                            <div className="text-xs text-slate-500">{tx.method || '—'}</div>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-400">{tx.category || 'Uncategorised'}</td>
                          <td className="px-4 py-3">
                            <span className="rounded-full border border-slate-700 px-2 py-1 text-[10px] text-slate-300">{tx.status || 'Recorded'}</span>
                          </td>
                          <td className={`whitespace-nowrap px-4 py-3 text-right font-mono font-bold ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isIncome ? '+' : '−'}{formatZAR(Math.abs(Number(tx.amount) || 0))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className={`divide-y divide-slate-800 ${isPhoneMode ? '' : 'sm:hidden'}`}>
                {filteredTransactions.map((tx) => {
                  const isIncome = Number(tx.amount) > 0;
                  return (
                    <article key={tx.id} className="min-w-0 space-y-2.5 p-3">
                      <div className="flex min-w-0 items-start justify-between gap-2">
                        <div className="flex min-w-0 items-start gap-2">
                          <span className={`mt-0.5 shrink-0 rounded-lg p-1.5 ${isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {isIncome ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                          </span>
                          <div className="min-w-0">
                            <p className="break-words text-sm font-semibold text-slate-100">{tx.description || 'No description'}</p>
                            <p className="mt-0.5 text-[11px] text-slate-400">{prettyDate(tx.date)}</p>
                          </div>
                        </div>
                        <span className={`shrink-0 whitespace-nowrap text-right text-sm font-bold ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isIncome ? '+' : '−'}{formatZAR(Math.abs(Number(tx.amount) || 0))}
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-2 gap-y-1 pl-8 text-[10px] text-slate-400">
                        <span className="min-w-0 break-words">{tx.channel || 'Unknown'} · {tx.category || 'Uncategorised'}</span>
                        <span className="max-w-full break-words rounded-full border border-slate-700 px-2 py-0.5 text-slate-300">{tx.status || 'Recorded'}</span>
                      </div>
                    </article>
                  );
                })}
              </div>
              </>
            ) : (
              <EmptyState message="No transactions match your filters. Add an entry or reset the filters." />
            )}
          </section>
        </>
      )}

      {snapModalOpen && (
        <Modal title="Receipt Entry" onClose={() => setSnapModalOpen(false)}>
          <p className="text-sm text-slate-400">
            Choose a sample receipt to review and add to the ledger. This is not live OCR; verify all values against the original receipt.
          </p>
          {presetReceipts.length ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {presetReceipts.map((receipt) => (
                <button
                  key={receipt.id}
                  type="button"
                  onClick={() => {
                    setSelectedReceipt(receipt);
                    setReceiptError('');
                  }}
                  className={`rounded-xl border p-3 text-left ${
                    selectedReceipt?.id === receipt.id
                      ? 'border-amber-500 bg-amber-950/30'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <span className="block truncate text-sm font-semibold">{receipt.merchant}</span>
                  <span className="mt-1 block text-xs text-amber-300">{formatZAR(receipt.total)}</span>
                  <span className="mt-1 block text-[10px] text-slate-500">{prettyDate(receipt.date)}</span>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState message="No sample receipts were supplied." />
          )}

          {selectedReceipt && (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold">{selectedReceipt.merchant}</h3>
                  <p className="mt-1 text-xs text-slate-400">{prettyDate(selectedReceipt.date)}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-amber-300">{formatZAR(selectedReceipt.total)}</p>
                  <p className="text-xs text-slate-500">VAT: {formatZAR(selectedReceipt.taxVat || 0)}</p>
                </div>
              </div>
              <div className="space-y-2 py-3">
                {(selectedReceipt.items || []).map((item, index) => (
                  <div key={`${item.name}-${index}`} className="flex justify-between gap-3 text-sm">
                    <span className="text-slate-300">{item.name}</span>
                    <span className="font-mono text-slate-300">{formatZAR(item.price)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-3 text-sm">
                <span className="text-slate-400">Suggested category</span>
                <span className="text-emerald-300">{selectedReceipt.category || 'Other'}</span>
              </div>
            </div>
          )}

          {receiptError && <p className="text-sm text-rose-300">{receiptError}</p>}
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" onClick={() => setSnapModalOpen(false)} className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300">Cancel</button>
            <button type="button" onClick={handleCommitReceipt} disabled={!selectedReceipt || receiptScanning} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-slate-950 disabled:opacity-50">
              <Check className="h-4 w-4" /> Confirm receipt entry
            </button>
          </div>
        </Modal>
      )}

      {addModalOpen && (
        <Modal title="Add Manual Ledger Entry" onClose={() => setAddModalOpen(false)}>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Transaction type</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setNewType('INCOME')} className={`rounded-xl px-3 py-2 text-sm font-semibold ${newType === 'INCOME' ? 'bg-emerald-600 text-white' : 'border border-slate-700 bg-slate-950 text-slate-400'}`}>Income (+)</button>
                <button type="button" onClick={() => setNewType('EXPENSE')} className={`rounded-xl px-3 py-2 text-sm font-semibold ${newType === 'EXPENSE' ? 'bg-rose-600 text-white' : 'border border-slate-700 bg-slate-950 text-slate-400'}`}>Expense (−)</button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Payment channel</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setNewChannel('CASH')} className={`rounded-xl px-3 py-2 text-sm font-semibold ${newChannel === 'CASH' ? 'bg-amber-600 text-white' : 'border border-slate-700 bg-slate-950 text-slate-400'}`}>Cash</button>
                <button type="button" onClick={() => setNewChannel('DIGITAL')} className={`rounded-xl px-3 py-2 text-sm font-semibold ${newChannel === 'DIGITAL' ? 'bg-teal-600 text-white' : 'border border-slate-700 bg-slate-950 text-slate-400'}`}>Digital</button>
              </div>
            </div>

            <div>
              <label htmlFor="ledger-description" className="mb-1 block text-sm text-slate-300">Description</label>
              <input id="ledger-description" required maxLength={200} value={newDesc} onChange={(event) => setNewDesc(event.target.value)} placeholder="e.g. Sold 20 Chelsea buns" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="ledger-amount" className="mb-1 block text-sm text-slate-300">Amount (ZAR)</label>
                <input id="ledger-amount" required min="0.01" step="0.01" type="number" value={newAmount} onChange={(event) => setNewAmount(event.target.value)} placeholder="250.00" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label htmlFor="ledger-date" className="mb-1 block text-sm text-slate-300">Transaction date</label>
                <input id="ledger-date" required type="date" value={newDate} onChange={(event) => setNewDate(event.target.value)} className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" />
              </div>
            </div>

            <div>
              <label htmlFor="ledger-category" className="mb-1 block text-sm text-slate-300">Category</label>
              <select id="ledger-category" value={newCategory} onChange={(event) => setNewCategory(event.target.value)} className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm">
                {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>

            {formError && <p className="rounded-lg border border-rose-900 bg-rose-950/30 p-3 text-sm text-rose-300">{formError}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setAddModalOpen(false)} className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300">Cancel</button>
              <button type="submit" className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-400">Save transaction</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" aria-label={title} className="my-8 w-full max-w-2xl space-y-4 rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close modal" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-800 p-6 text-center">
      <Receipt className="h-6 w-6 text-slate-600" />
      <p className="max-w-md text-sm text-slate-400">{message}</p>
    </div>
  );
}
