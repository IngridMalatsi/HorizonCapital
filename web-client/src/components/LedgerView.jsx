import React, { useState } from 'react';
import { 
  Wallet, 
  Camera, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  Receipt, 
  Check, 
  Sparkles, 
  Calendar, 
  Tag, 
  Download, 
  Coins, 
  Building,
  UploadCloud,
  FileCheck2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

export default function LedgerView({
  transactions,
  cashInDrawer,
  digitalBankBalance,
  onAddTransaction,
  presetReceipts
}) {
  const [channelFilter, setChannelFilter] = useState('ALL'); // 'ALL', 'CASH', 'DIGITAL'
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL', 'INCOME', 'EXPENSE'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Snap-to-record state
  const [snapModalOpen, setSnapModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(presetReceipts[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  // Manual Add Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState('INCOME');
  const [newChannel, setNewChannel] = useState('CASH');
  const [newCategory, setNewCategory] = useState('Walk-in Sales');

  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    if (channelFilter !== 'ALL' && tx.channel !== channelFilter) return false;
    if (typeFilter !== 'ALL' && tx.type !== typeFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return tx.description.toLowerCase().includes(q) || tx.category.toLowerCase().includes(q);
    }
    return true;
  });

  // =========================================================================
  // API INTEGRATION POINT: Receipt OCR Scanner (Snap-to-Record)
  // Provider: Google Cloud Vision API (images:annotate) or Mindee Document API
  // Config / Env: VITE_VISION_OCR_API_KEY (see src/config/apiConfig.js)
  // Replace this simulation timer with: await callOcrReceiptScanner(receiptFile)
  // =========================================================================
  const handleRunOcrScan = (receipt) => {
    setSelectedReceipt(receipt);
    setIsScanning(true);
    setScanComplete(false);
    sounds.playPosTap();

    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      sounds.playSuccess();
    }, 1500);
  };

  const handleCommitScannedReceipt = () => {
    if (!selectedReceipt) return;

    const newTx = {
      id: `tx-${Date.now()}`,
      date: `${selectedReceipt.date} 12:00`,
      description: `${selectedReceipt.merchant}: ${selectedReceipt.items.map(i => i.name).join(', ')}`,
      type: 'EXPENSE',
      channel: selectedReceipt.suggestedChannel,
      method: 'Snap-to-Record (OCR)',
      amount: -Math.abs(selectedReceipt.total),
      category: selectedReceipt.category,
      status: 'Verified',
      badge: 'Snap-to-Record'
    };

    onAddTransaction(newTx);
    setSnapModalOpen(false);
    setScanComplete(false);
    sounds.playCashDrawer();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!newDesc || !newAmount) return;

    const parsedAmt = parseFloat(newAmount);
    const finalAmt = newType === 'EXPENSE' ? -Math.abs(parsedAmt) : Math.abs(parsedAmt);

    const newTx = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      description: newDesc,
      type: newType,
      channel: newChannel,
      method: newChannel === 'CASH' ? 'Cash in Drawer' : 'Digital Bank Transfer',
      amount: finalAmt,
      category: newCategory,
      status: 'Settled',
      badge: newChannel === 'CASH' ? 'Cash' : 'Bank'
    };

    onAddTransaction(newTx);
    setAddModalOpen(false);
    setNewDesc('');
    setNewAmount('');
    sounds.playCashDrawer();
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-28 sm:pb-24 md:pb-8">
      {/* Clean, Modern Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Township Smart Ledger
            </span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-slate-100 tracking-tight">
            Cash Drawer & Digital Bank
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Clearly separates physical till cash from electronic bank funds to prevent commingling.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Snap-to-record button */}
          <button
            onClick={() => {
              setSnapModalOpen(true);
              sounds.playPosTap();
            }}
            className="flex-1 sm:flex-none px-3 sm:px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Snap Receipt</span>
          </button>

          {/* Add Manual Transaction */}
          <button
            onClick={() => {
              setAddModalOpen(true);
              sounds.playPosTap();
            }}
            className="flex-1 sm:flex-none px-3 sm:px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* Cash vs. Digital Toggle Bar (The Township Tech Twist) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {/* Cash in Drawer Card */}
        <div 
          onClick={() => {
            setChannelFilter(channelFilter === 'CASH' ? 'ALL' : 'CASH');
            sounds.playPosTap();
          }}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            channelFilter === 'CASH'
              ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-950/50'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-400" />
              Physical Cash in Drawer
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Drawer Box
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
            R {cashInDrawer.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Ready for walk-in supplier cash</span>
            <span className="text-amber-400 font-semibold">{channelFilter === 'CASH' ? 'Active Filter ✓' : 'Click to filter'}</span>
          </div>
        </div>

        {/* Digital Bank Balance Card */}
        <div 
          onClick={() => {
            setChannelFilter(channelFilter === 'DIGITAL' ? 'ALL' : 'DIGITAL');
            sounds.playPosTap();
          }}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            channelFilter === 'DIGITAL'
              ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-950/50'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Building className="w-4 h-4 text-emerald-400" />
              Digital Bank (FNB Business)
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              SoftPOS / EFT
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            R {digitalBankBalance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Pre-vetted for Funder Scorecard</span>
            <span className="text-emerald-400 font-semibold">{channelFilter === 'DIGITAL' ? 'Active Filter ✓' : 'Click to filter'}</span>
          </div>
        </div>

        {/* Consolidated Total Liquidity */}
        <div 
          onClick={() => {
            setChannelFilter('ALL');
            sounds.playPosTap();
          }}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            channelFilter === 'ALL'
              ? 'bg-slate-850 border-cyan-500/60 shadow-lg'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-cyan-400" />
              Consolidated Net Liquidity
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Total Safe
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-100 font-mono">
            R {(cashInDrawer + digitalBankBalance).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Combined Township Runway</span>
            <span className="text-cyan-400 font-semibold">{channelFilter === 'ALL' ? 'Showing All' : 'Reset to All'}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by supplier, item, or category..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Type:</span>
            {['ALL', 'INCOME', 'EXPENSE'].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTypeFilter(t);
                  sounds.playPosTap();
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  typeFilter === t
                    ? 'bg-slate-800 text-slate-100 border border-slate-700 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t === 'ALL' ? 'All Transactions' : t === 'INCOME' ? 'Inflows (+)' : 'Outflows (-)'}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table / List */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold text-[11px]">
                <th className="pb-2.5 pl-2">Date & Time</th>
                <th className="pb-2.5">Description</th>
                <th className="pb-2.5">Channel / Method</th>
                <th className="pb-2.5">Category</th>
                <th className="pb-2.5 text-right pr-2">Amount (ZAR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTransactions.map((tx) => {
                const isIncome = tx.amount > 0;
                return (
                  <tr key={tx.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3 pl-2 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="py-3 pr-2 font-medium text-slate-200">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg shrink-0 ${isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {isIncome ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                        </div>
                        <span className="truncate max-w-[220px] sm:max-w-none">{tx.description}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.channel === 'CASH'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {tx.method}
                      </span>
                    </td>
                    <td className="py-3 pr-2 text-slate-400 whitespace-nowrap">
                      {tx.category}
                    </td>
                    <td className={`py-3 pr-2 text-right font-mono font-bold whitespace-nowrap ${
                      isIncome ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {isIncome ? '+' : ''}R {Math.abs(tx.amount).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="py-8 text-center text-slate-500 text-xs">
              No transactions match the selected channel and search filters.
            </div>
          )}
        </div>
      </div>

      {/* Snap-to-Record OCR Receipt Scanner Modal (Image 2 Concept) */}
      {snapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-amber-500/40 p-5 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSnapModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  Township Tech Twist
                </span>
                <span className="text-xs text-slate-400">Concept: Snap-to-Record</span>
              </div>
              <h2 className="text-lg font-bold text-slate-100 mt-1 flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                Snap-to-Record Physical Supplier Receipt
              </h2>
              <p className="text-xs text-slate-400">
                Take a photo of paper grocery or hardware slips to auto-extract line items into your ledger.
              </p>
            </div>

            {/* Preset Township Merchant Receipts for Live Demo */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Choose a Sample Township Receipt to Scan:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {presetReceipts.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleRunOcrScan(r)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      selectedReceipt?.id === r.id
                        ? 'bg-amber-950/60 border-amber-500 text-amber-200 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold truncate">{r.merchant.split('-')[0]}</div>
                    <div className="text-[10px] text-amber-400 font-mono mt-0.5">R {r.total.toFixed(2)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* OCR Scanner Simulation Area */}
            <div className="relative p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden text-center min-h-[160px] flex flex-col items-center justify-center">
              {isScanning ? (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mx-auto" />
                  <div className="text-xs font-semibold text-amber-300">
                    Running OCR Auto-Extraction...
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Extracting merchant, items, VAT, and expense category...
                  </div>
                </div>
              ) : selectedReceipt ? (
                <div className="w-full text-left space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <div className="font-bold text-slate-100 text-sm">{selectedReceipt.merchant}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Date: {selectedReceipt.date} • Soweto Hub</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-amber-400 font-mono">
                        R {selectedReceipt.total.toFixed(2)}
                      </div>
                      <div className="text-[9px] text-slate-400">Incl. VAT R{selectedReceipt.taxVat.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-300 space-y-1">
                    <div className="font-semibold text-slate-400 text-[10px] uppercase">Extracted Line Items:</div>
                    {selectedReceipt.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between font-mono text-[11px]">
                        <span>• {item.name}</span>
                        <span>R {item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Suggested Category:</span>
                    <span className="font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      {selectedReceipt.category}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSnapModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCommitScannedReceipt}
                disabled={isScanning}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Add to Ledger</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Entry Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl relative space-y-4">
            <button
              onClick={() => setAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              Add Manual Ledger Entry
            </h2>

            <form onSubmit={handleManualSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Transaction Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType('INCOME')}
                    className={`py-2 rounded-xl font-bold transition-colors ${
                      newType === 'INCOME'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    Income (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('EXPENSE')}
                    className={`py-2 rounded-xl font-bold transition-colors ${
                      newType === 'EXPENSE'
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    Expense (-)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Payment Channel (Cash vs Digital)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewChannel('CASH')}
                    className={`py-2 rounded-xl font-bold transition-colors ${
                      newChannel === 'CASH'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    Cash Drawer
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewChannel('DIGITAL')}
                    className={`py-2 rounded-xl font-bold transition-colors ${
                      newChannel === 'DIGITAL'
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    Digital Bank (FNB)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Sold 20 Chelsea Buns"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Amount (ZAR)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="e.g. 250.00"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Walk-in Sales">Walk-in Sales</option>
                  <option value="Order Deposit">Order Deposit</option>
                  <option value="Cost of Goods (Ingredients)">Cost of Goods (Ingredients)</option>
                  <option value="Packaging & Bags">Packaging & Bags</option>
                  <option value="Utilities & Electricity">Utilities & Electricity</option>
                  <option value="Transport & Delivery">Transport & Delivery</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
