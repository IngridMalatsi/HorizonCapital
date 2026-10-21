import React, { useState } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import OrderIntakeView from './components/OrderIntakeView';
import LedgerView from './components/LedgerView';
import MicroPosView from './components/MicroPosView';
import FundingView from './components/FundingView';
import MarketLinkerView from './components/MarketLinkerView';
import FunderReportModal from './components/FunderReportModal';
import ApiKeysModal from './components/ApiKeysModal';
import DeviceSimulatorFrame from './components/DeviceSimulatorFrame';

import { 
  BUSINESS_PROFILES, 
  INITIAL_CASH_FLOW_WEEKS, 
  READINESS_CHECKS_DATA, 
  WHATSAPP_PRESETS, 
  INITIAL_LEDGER_TRANSACTIONS, 
  PRESET_RECEIPTS, 
  FUNDING_OFFERS 
} from './data/mockData';
import { sounds } from './utils/soundEffects';

export default function App() {
  // Active Profile State
  const [currentProfile, setCurrentProfile] = useState(BUSINESS_PROFILES[0]);
  
  // Navigation & View Mode State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [deviceMode, setDeviceMode] = useState('desktop'); // 'desktop', 'smartphone', 'tablet'
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Financial & Readiness Engine State
  const [readinessScore, setReadinessScore] = useState(currentProfile.initialReadinessScore);
  const [checksData, setChecksData] = useState(READINESS_CHECKS_DATA);
  const [cashFlowWeeks, setCashFlowWeeks] = useState(INITIAL_CASH_FLOW_WEEKS);
  
  // Smart Ledger & Balances State (Concept 2 Township Twist)
  const [cashInDrawer, setCashInDrawer] = useState(currentProfile.cashInDrawer);
  const [digitalBankBalance, setDigitalBankBalance] = useState(currentProfile.digitalBankBalance);
  const [transactions, setTransactions] = useState(INITIAL_LEDGER_TRANSACTIONS);

  // WhatsApp Order Intake State
  const [currentPresetId, setCurrentPresetId] = useState('mbali-muffins');
  const [orderAccepted, setOrderAccepted] = useState(false);

  // Funding & Report Modals State
  const [loanDisbursed, setLoanDisbursed] = useState(false);
  const [funderReportOpen, setFunderReportOpen] = useState(false);
  const [apiKeysModalOpen, setApiKeysModalOpen] = useState(false);

  // Switch profile handler
  const handleSelectProfile = (profile) => {
    setCurrentProfile(profile);
    setReadinessScore(profile.initialReadinessScore);
    setCashInDrawer(profile.cashInDrawer);
    setDigitalBankBalance(profile.digitalBankBalance);
    setOrderAccepted(false);
    setLoanDisbursed(false);
  };

  // Toggle tactile sounds
  const handleToggleSound = () => {
    const next = sounds.toggleSound();
    setSoundEnabled(next);
    return next;
  };

  // Select device aspect ratio frame (desktop, smartphone, tablet)
  const handleSelectDeviceMode = (mode) => {
    sounds.playPosTap();
    setDeviceMode(mode);
  };

  // Accept Counter-Offer Simulation (Screens 3 & 4)
  const handleAcceptCounterOffer = (preset) => {
    setOrderAccepted(true);
    
    // Increase score from 78 to 84
    setReadinessScore(prev => Math.min(100, prev + 6));

    // Update cash buffer check from warning (62%) to healthy (80%)
    setChecksData(prev => prev.map(c => {
      if (c.key === 'buffers') {
        return {
          ...c,
          score: 80,
          status: 'good',
          detail: 'Protected via 50% upfront deposit; Week 4 cash buffer safely elevated to R1,070'
        };
      }
      return c;
    }));

    // Add 50% deposit (R750) to transactions and digital bank balance
    const depositAmount = preset.extractedData.counterOfferRecommendation.depositAmount;
    const newTx = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      description: `Order Deposit (50%): ${preset.extractedData.client} - ${preset.extractedData.item}`,
      type: 'INCOME',
      channel: 'DIGITAL',
      method: 'SoftPOS / Instant Pay',
      amount: depositAmount,
      category: 'Order Deposit',
      status: 'Settled',
      badge: 'Protected'
    };

    setTransactions(prev => [newTx, ...prev]);
    setDigitalBankBalance(prev => prev + depositAmount);

    // Update Week 4 cashflow balance
    setCashFlowWeeks(prev => prev.map((w, idx) => {
      if (idx === 3) {
        return { ...w, inflow: w.inflow + depositAmount, balance: w.balance + depositAmount, status: 'safe', label: 'Protected with Deposit' };
      }
      return w;
    }));
  };

  // Process SoftPOS payment (Micro-POS)
  const handleProcessPayment = (amount, description) => {
    const newTx = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      description: description || 'SoftPOS Tap-to-Pay Sale',
      type: 'INCOME',
      channel: 'DIGITAL',
      method: 'Micro-POS SoftPOS (Tap)',
      amount: amount,
      category: 'Walk-in Sales',
      status: 'Settled',
      badge: 'SoftPOS'
    };

    setTransactions(prev => [newTx, ...prev]);
    setDigitalBankBalance(prev => prev + amount);
  };

  // Add ledger transaction (manual or snap-to-record)
  const handleAddTransaction = (newTx) => {
    setTransactions(prev => [newTx, ...prev]);
    if (newTx.channel === 'CASH') {
      setCashInDrawer(prev => Math.max(0, prev + newTx.amount));
    } else {
      setDigitalBankBalance(prev => Math.max(0, prev + newTx.amount));
    }
  };

  // Disburse Pre-Approved Loan (Concept 2 Funding)
  const handleDisburseLoan = (amount, title) => {
    setLoanDisbursed(true);
    setDigitalBankBalance(prev => prev + amount);

    const newTx = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      description: `Disbursement: ${title}`,
      type: 'INCOME',
      channel: 'DIGITAL',
      method: 'HorizonCapital Micro-Credit',
      amount: amount,
      category: 'Working Capital Facility',
      status: 'Settled',
      badge: 'Disbursed'
    };

    setTransactions(prev => [newTx, ...prev]);
    setReadinessScore(prev => Math.min(100, prev + 3));
  };

  return (
    <DeviceSimulatorFrame
      deviceMode={deviceMode}
      onSelectDeviceMode={handleSelectDeviceMode}
    >
      {/* Top Navbar */}
      <Navbar
        currentProfile={currentProfile}
        onSelectProfile={handleSelectProfile}
        profiles={BUSINESS_PROFILES}
        deviceMode={deviceMode}
        onSelectDeviceMode={handleSelectDeviceMode}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenReport={() => setFunderReportOpen(true)}
        onOpenApiKeys={() => setApiKeysModalOpen(true)}
        readinessScore={readinessScore}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex w-full min-h-0 overflow-hidden">
        {/* Desktop Sidebar (Only visible on desktop mode on medium+ screens) */}
        {deviceMode === 'desktop' && (
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            currentProfile={currentProfile}
            readinessScore={readinessScore}
            cashInDrawer={cashInDrawer}
            digitalBankBalance={digitalBankBalance}
            onOpenReport={() => setFunderReportOpen(true)}
            onTriggerNewIntake={() => {
              setCurrentPresetId('mbali-muffins');
              setActiveTab('order-intake');
            }}
          />
        )}

        {/* Dynamic Main View Content Area */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-2.5 sm:px-6 py-3.5 sm:py-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              currentProfile={currentProfile}
              readinessScore={readinessScore}
              checksData={checksData}
              cashFlowWeeks={cashFlowWeeks}
              cashInDrawer={cashInDrawer}
              digitalBankBalance={digitalBankBalance}
              onNavigateTab={setActiveTab}
              onSelectWhatsappPreset={(id) => setCurrentPresetId(id)}
              onOpenReport={() => setFunderReportOpen(true)}
            />
          )}

          {activeTab === 'order-intake' && (
            <OrderIntakeView
              presets={WHATSAPP_PRESETS}
              currentPresetId={currentPresetId}
              onSelectPreset={(id) => setCurrentPresetId(id)}
              onAcceptCounterOffer={handleAcceptCounterOffer}
              orderAccepted={orderAccepted}
              readinessScore={readinessScore}
            />
          )}

          {activeTab === 'ledger' && (
            <LedgerView
              transactions={transactions}
              cashInDrawer={cashInDrawer}
              digitalBankBalance={digitalBankBalance}
              onAddTransaction={handleAddTransaction}
              presetReceipts={PRESET_RECEIPTS}
            />
          )}

          {activeTab === 'micro-pos' && (
            <MicroPosView
              currentProfile={currentProfile}
              onProcessPayment={handleProcessPayment}
            />
          )}

          {activeTab === 'funding' && (
            <FundingView
              fundingOffers={FUNDING_OFFERS}
              readinessScore={readinessScore}
              onDisburseLoan={handleDisburseLoan}
              loanDisbursed={loanDisbursed}
              currentProfile={currentProfile}
            />
          )}

          {activeTab === 'market-linker' && (
            <MarketLinkerView
              currentProfile={currentProfile}
              readinessScore={readinessScore}
              onOpenReport={() => setFunderReportOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Bottom Navigation Bar (Visible on mobile/tablet screens or simulated phone/tablet frames) */}
      <div className={deviceMode !== 'desktop' ? 'block shrink-0' : 'md:hidden shrink-0'}>
        <BottomNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingRiskCount={orderAccepted ? 0 : 1}
        />
      </div>

      {/* Printable Institutional ESD Funder Report Modal */}
      <FunderReportModal
        isOpen={funderReportOpen}
        onClose={() => setFunderReportOpen(false)}
        currentProfile={currentProfile}
        readinessScore={readinessScore}
        checksData={checksData}
        cashFlowWeeks={cashFlowWeeks}
        cashInDrawer={cashInDrawer}
        digitalBankBalance={digitalBankBalance}
      />

      {/* External API Keys & Integration Architecture Modal */}
      <ApiKeysModal
        isOpen={apiKeysModalOpen}
        onClose={() => setApiKeysModalOpen(false)}
      />
    </DeviceSimulatorFrame>
  );
}
