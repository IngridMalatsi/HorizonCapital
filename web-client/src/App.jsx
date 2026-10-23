import React, { useState } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import OrderIntakeView from './components/OrderIntakeView';
import LedgerView from './components/LedgerView';
import MicroPosView from './components/MicroPosView';
import ProfileView from './components/ProfileView';
import AccountFlowView from './components/AccountFlowView';
import FunderReportModal from './components/FunderReportModal';
import ApiKeysModal from './components/ApiKeysModal';
import DeviceSimulatorFrame from './components/DeviceSimulatorFrame';
import TrustQrModal from './components/TrustQrModal';

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
  const [isSignedIn, setIsSignedIn] = useState(true);
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
  const [trustQrOpen, setTrustQrOpen] = useState(false);

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

  const handleSignIn = () => {
    setIsSignedIn(true);
    setActiveTab('dashboard');
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setActiveTab('signin');
  };

  const handleNavigateToFunding = () => {
    setActiveTab('profile');
    requestAnimationFrame(() => {
      document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };


  // Keep the Executive Overview's 13-week cash-flow chart in sync with ledger activity.
  // Use explicit week dates when available; otherwise use the first forecast week.
  const updateCashFlowForTransaction = (transaction, preferredWeekIndex = null) => {
    const amount = Number(transaction?.amount) || 0;
    const transactionDate = String(transaction?.date || '').slice(0, 10);
    if (!amount) return;

    setCashFlowWeeks((weeks) => {
      if (!Array.isArray(weeks) || weeks.length === 0) return weeks;

      const matchingIndex = weeks.findIndex((week) => {
        const start = week.startDate || week.weekStart || week.start || week.date;
        const end = week.endDate || week.weekEnd || week.end || start;
        if (!start) return false;
        const startDay = String(start).slice(0, 10);
        const endDay = String(end || start).slice(0, 10);
        return Boolean(transactionDate) && transactionDate >= startDay && transactionDate <= endDay;
      });

      const index = preferredWeekIndex != null
        ? Math.min(Math.max(preferredWeekIndex, 0), weeks.length - 1)
        : matchingIndex >= 0 ? matchingIndex : 0;

      return weeks.map((week, weekIndex) => {
        if (weekIndex !== index) return week;
        const inflowDelta = amount > 0 ? amount : 0;
        const outflowDelta = amount < 0 ? Math.abs(amount) : 0;
        const nextBalance = (Number(week.balance) || 0) + amount;
        return {
          ...week,
          inflow: (Number(week.inflow) || 0) + inflowDelta,
          outflow: (Number(week.outflow) || 0) + outflowDelta,
          balance: nextBalance,
          ...(nextBalance < 0 ? { status: 'warning' } : {}),
        };
      });
    });
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

    // Keep the existing Week 4 deposit scenario reflected in the forecast graph.
    updateCashFlowForTransaction(newTx, 3);
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
    updateCashFlowForTransaction(newTx);
  };

  // Add ledger transaction (manual or snap-to-record)
  const handleAddTransaction = (newTx) => {
    const amount = Number(newTx?.amount) || 0;
    setTransactions(prev => [newTx, ...prev]);

    if (newTx.channel === 'CASH') {
      setCashInDrawer(prev => Math.max(0, prev + amount));
    } else {
      setDigitalBankBalance(prev => Math.max(0, prev + amount));
    }

    // The Ledger charts derive from transactions; this also updates dashboard cash flow.
    updateCashFlowForTransaction({ ...newTx, amount });
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
    updateCashFlowForTransaction(newTx);
    setReadinessScore(prev => Math.min(100, prev + 3));
  };

  return (
    <DeviceSimulatorFrame
      deviceMode={deviceMode}
      onSelectDeviceMode={handleSelectDeviceMode}
    >
      {/* Top Navbar */}
      {isSignedIn && (
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
        />
      )}

      {/* Main Body Layout */}
      <div className="flex-1 flex w-full min-w-0 max-w-[100vw] min-h-0 overflow-hidden">
        {/* Desktop Sidebar (Only visible on desktop mode on medium+ screens) */}
        {isSignedIn && deviceMode === 'desktop' && (
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
        <main className="relative flex-1 max-w-7xl mx-auto w-full min-w-0 max-w-[100vw] px-2.5 sm:px-6 py-3.5 sm:py-6 overflow-y-auto overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <DashboardView
              currentProfile={currentProfile}
              readinessScore={readinessScore}
              checksData={checksData}
              cashFlowWeeks={cashFlowWeeks}
              cashInDrawer={cashInDrawer}
              digitalBankBalance={digitalBankBalance}
              deviceMode={deviceMode}
              onNavigateTab={setActiveTab}
              onNavigateFunding={handleNavigateToFunding}
              onSelectWhatsappPreset={(id) => setCurrentPresetId(id)}
              onOpenReport={() => setFunderReportOpen(true)}
              onOpenTrustQr={() => setTrustQrOpen(true)}
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

          {['profile', 'profile-funding', 'profile-trust', 'profile-account', 'profile-settings'].includes(activeTab) && (
            <ProfileView
              section={activeTab}
              onBack={() => setActiveTab('menu')}
              currentProfile={currentProfile}
              readinessScore={readinessScore}
              fundingOffers={FUNDING_OFFERS}
              onDisburseLoan={handleDisburseLoan}
              loanDisbursed={loanDisbursed}
              onOpenReport={() => setFunderReportOpen(true)}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              deviceMode={deviceMode}
              onSelectDeviceMode={handleSelectDeviceMode}
              onOpenApiKeys={() => setApiKeysModalOpen(true)}
            />
          )}

          {['menu', 'settings', 'user-profile', 'account-settings', 'integrations', 'appearance'].includes(activeTab) && (
            <AccountFlowView
              screen={activeTab}
              onNavigate={setActiveTab}
              onSignIn={handleSignIn}
              onLogout={handleSignOut}
              onOpenIntegrations={() => setApiKeysModalOpen(true)}
            />
          )}

          {activeTab === 'signin' && (
            <AccountFlowView
              screen="signin"
              onNavigate={setActiveTab}
              onSignIn={handleSignIn}
              onLogout={handleSignOut}
              onOpenIntegrations={() => setApiKeysModalOpen(true)}
            />
          )}

          {activeTab.startsWith('unavailable:') && (
            <AccountFlowView
              screen={activeTab}
              onNavigate={setActiveTab}
              onSignIn={handleSignIn}
              onLogout={handleSignOut}
              onOpenIntegrations={() => setApiKeysModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Bottom Navigation Bar (Visible on mobile/tablet screens or simulated phone/tablet frames) */}
      {isSignedIn && !['signin'].includes(activeTab) && (
        <div className={deviceMode !== 'desktop' ? 'block shrink-0' : 'md:hidden shrink-0'}>
          <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
        </div>
      )}

      {activeTab === 'dashboard' && trustQrOpen && (
        <TrustQrModal
          currentProfile={currentProfile}
          deviceMode={deviceMode}
          onClose={() => setTrustQrOpen(false)}
        />
      )}

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
