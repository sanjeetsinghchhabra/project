/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ScreenTab,
  Language,
  CustomerUdhaar,
  PayableBill,
  InventoryAlert,
  TransactionActivity,
  StoreProfile,
} from './types';
import {
  initialStoreProfile,
  initialCustomers,
  initialPayableBills,
  initialInventoryAlerts,
  initialActivities,
  translations,
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { CashFlowScreen } from './screens/CashFlowScreen';
import { UdhaarScreen } from './screens/UdhaarScreen';
import { SimulationScreen } from './screens/SimulationScreen';
import { AISahayakScreen } from './screens/AISahayakScreen';
import { VoiceModal } from './components/VoiceModal';
import { RecordModal } from './components/RecordModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { LedgerModal } from './components/LedgerModal';
import { NotificationsModal } from './components/NotificationsModal';
import { Toast } from './components/Toast';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('dashboard');
  const [language, setLanguage] = useState<Language>('en');
  const [currentStore, setCurrentStore] = useState<StoreProfile>(initialStoreProfile);

  // App state
  const [customers, setCustomers] = useState<CustomerUdhaar[]>(initialCustomers);
  const [payables, setPayables] = useState<PayableBill[]>(initialPayableBills);
  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlert[]>(initialInventoryAlerts);
  const [activities, setActivities] = useState<TransactionActivity[]>(initialActivities);

  // Modals
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [whatsAppCustomer, setWhatsAppCustomer] = useState<CustomerUdhaar | null>(null);
  const [ledgerCustomer, setLedgerCustomer] = useState<CustomerUdhaar | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; icon: string; visible: boolean }>({
    message: '',
    icon: 'check_circle',
    visible: false,
  });

  const showToast = (message: string, icon: string = 'check_circle') => {
    setToast({ message, icon, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2800);
  };

  const t = translations[language];

  // Voice entry save
  const handleSaveVoiceEntry = (entry: {
    name: string;
    amount: number;
    type: 'udhaar_out' | 'udhaar_in' | 'sale' | 'expense';
    description: string;
  }) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (entry.type === 'sale') {
      setCurrentStore((prev) => ({ ...prev, currentCash: prev.currentCash + entry.amount }));
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          title: `Cash Sale (${entry.name})`,
          subtitle: `${timeNow} • Voice Entry`,
          time: timeNow,
          amount: entry.amount,
          type: 'sale',
        },
        ...prev,
      ]);
      showToast(`Sale recorded: +₹${entry.amount.toLocaleString('en-IN')}`, 'payments');
    } else if (entry.type === 'expense') {
      setCurrentStore((prev) => ({ ...prev, currentCash: Math.max(0, prev.currentCash - entry.amount) }));
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          title: entry.name,
          subtitle: `${timeNow} • Voice Expense`,
          time: timeNow,
          amount: -entry.amount,
          type: 'expense',
        },
        ...prev,
      ]);
      showToast(`Expense recorded: -₹${entry.amount.toLocaleString('en-IN')}`, 'arrow_outward');
    } else if (entry.type === 'udhaar_out') {
      // Add or update customer balance
      setCustomers((prev) => {
        const existingIndex = prev.findIndex((c) => c.name.toLowerCase() === entry.name.toLowerCase());
        if (existingIndex >= 0) {
          const updated = [...prev];
          const existing = updated[existingIndex];
          updated[existingIndex] = {
            ...existing,
            amount: existing.amount + entry.amount,
            lastActive: 'Just now',
            ledgerHistory: [
              {
                id: `lh-${Date.now()}`,
                date: 'Today',
                description: entry.description,
                type: 'debit',
                amount: entry.amount,
              },
              ...existing.ledgerHistory,
            ],
          };
          return updated;
        } else {
          const newCust: CustomerUdhaar = {
            id: `cust-${Date.now()}`,
            name: entry.name,
            phone: '+91 98000 00000',
            amount: entry.amount,
            daysOverdue: 0,
            itemsSummary: entry.description,
            impactLevel: 'medium',
            likelihoodToPay: 85,
            lastActive: 'Just now',
            ledgerHistory: [
              {
                id: `lh-${Date.now()}`,
                date: 'Today',
                description: entry.description,
                type: 'debit',
                amount: entry.amount,
              },
            ],
          };
          return [newCust, ...prev];
        }
      });
      showToast(`Udhaar recorded for ${entry.name}: ₹${entry.amount.toLocaleString('en-IN')}`, 'menu_book');
    } else if (entry.type === 'udhaar_in') {
      setCurrentStore((prev) => ({ ...prev, currentCash: prev.currentCash + entry.amount }));
      setCustomers((prev) => {
        return prev.map((c) => {
          if (c.name.toLowerCase() === entry.name.toLowerCase()) {
            return {
              ...c,
              amount: Math.max(0, c.amount - entry.amount),
              lastActive: 'Just now',
              ledgerHistory: [
                {
                  id: `lh-${Date.now()}`,
                  date: 'Today',
                  description: 'Payment received (Voice)',
                  type: 'credit',
                  amount: entry.amount,
                },
                ...c.ledgerHistory,
              ],
            };
          }
          return c;
        });
      });
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          title: `Udhaar Collection: ${entry.name}`,
          subtitle: `${timeNow} • Received`,
          time: timeNow,
          amount: entry.amount,
          type: 'udhaar_in',
        },
        ...prev,
      ]);
      showToast(`Udhaar collection recorded from ${entry.name}: +₹${entry.amount.toLocaleString('en-IN')}`, 'account_balance_wallet');
    }
  };

  // Manual record transaction
  const handleRecordTransaction = (data: {
    type: 'sale' | 'udhaar_out' | 'udhaar_in' | 'expense';
    amount: number;
    title: string;
    subtitle: string;
    customerId?: string;
  }) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (data.type === 'sale') {
      setCurrentStore((prev) => ({ ...prev, currentCash: prev.currentCash + data.amount }));
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          title: data.title,
          subtitle: `${timeNow} • ${data.subtitle}`,
          time: timeNow,
          amount: data.amount,
          type: 'sale',
        },
        ...prev,
      ]);
      showToast(`Sale recorded: +₹${data.amount.toLocaleString('en-IN')}`, 'payments');
    } else if (data.type === 'expense') {
      setCurrentStore((prev) => ({ ...prev, currentCash: Math.max(0, prev.currentCash - data.amount) }));
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          title: data.title,
          subtitle: `${timeNow} • ${data.subtitle}`,
          time: timeNow,
          amount: -data.amount,
          type: 'expense',
        },
        ...prev,
      ]);
      showToast(`Expense paid: -₹${data.amount.toLocaleString('en-IN')}`, 'arrow_outward');
    } else if (data.type === 'udhaar_out') {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === data.customerId) {
            return {
              ...c,
              amount: c.amount + data.amount,
              lastActive: 'Just now',
              ledgerHistory: [
                {
                  id: `lh-${Date.now()}`,
                  date: 'Today',
                  description: data.subtitle || 'Credit purchase',
                  type: 'debit',
                  amount: data.amount,
                },
                ...c.ledgerHistory,
              ],
            };
          }
          return c;
        })
      );
      showToast(`Udhaar added: ₹${data.amount.toLocaleString('en-IN')}`, 'menu_book');
    } else if (data.type === 'udhaar_in') {
      setCurrentStore((prev) => ({ ...prev, currentCash: prev.currentCash + data.amount }));
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === data.customerId) {
            return {
              ...c,
              amount: Math.max(0, c.amount - data.amount),
              lastActive: 'Just now',
              ledgerHistory: [
                {
                  id: `lh-${Date.now()}`,
                  date: 'Today',
                  description: 'Payment clearance',
                  type: 'credit',
                  amount: data.amount,
                },
                ...c.ledgerHistory,
              ],
            };
          }
          return c;
        })
      );
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          title: data.title,
          subtitle: `${timeNow} • ${data.subtitle}`,
          time: timeNow,
          amount: data.amount,
          type: 'udhaar_in',
        },
        ...prev,
      ]);
      showToast(`Payment collected: +₹${data.amount.toLocaleString('en-IN')}`, 'account_balance_wallet');
    }
  };

  // Settle amount from customer ledger
  const handleSettleCustomerAmount = (customerId: string, amountToSettle: number) => {
    const cust = customers.find((c) => c.id === customerId);
    const customerName = cust ? cust.name : 'Customer';
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setCurrentStore((prev) => ({ ...prev, currentCash: prev.currentCash + amountToSettle }));
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const newBalance = Math.max(0, c.amount - amountToSettle);
          return {
            ...c,
            amount: newBalance,
            lastActive: 'Just now',
            ledgerHistory: [
              {
                id: `lh-${Date.now()}`,
                date: 'Today',
                description: 'Payment clearance via UPI/Cash',
                type: 'credit',
                amount: amountToSettle,
              },
              ...c.ledgerHistory,
            ],
          };
        }
        return c;
      })
    );

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        title: `Udhaar Collection: ${customerName}`,
        subtitle: `${timeNow} • Cleared in ledger`,
        time: timeNow,
        amount: amountToSettle,
        type: 'udhaar_in',
      },
      ...prev,
    ]);

    setLedgerCustomer(null);
    showToast(`Received ₹${amountToSettle.toLocaleString('en-IN')} from ${customerName}!`, 'done_all');
  };

  // Pay supplier via UPI
  const handlePayUPI = (payable: PayableBill) => {
    setCurrentStore((prev) => ({ ...prev, currentCash: Math.max(0, prev.currentCash - payable.amount) }));
    setPayables((prev) => prev.filter((p) => p.id !== payable.id));
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        title: `Supplier Payment: ${payable.vendor}`,
        subtitle: `${timeNow} • UPI Gateway Paid`,
        time: timeNow,
        amount: -payable.amount,
        type: 'expense',
      },
      ...prev,
    ]);
    showToast(`Paid ₹${payable.amount.toLocaleString('en-IN')} to ${payable.vendor} via UPI!`, 'payments');
  };

  // Distributor reorder
  const handleReorder = (alert: InventoryAlert) => {
    showToast(`Distributor PO generated: ${alert.itemName} (${alert.reorderUnit})`, 'inventory_2');
    setInventoryAlerts((prev) =>
      prev.map((a) => (a.id === alert.id ? { ...a, stockLeft: a.stockLeft + 48, daysLeft: 14, status: 'warning' } : a))
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans selection:bg-[#a9f3c5]">
      {/* Sticky Top Header */}
      <Header
        currentStore={currentStore}
        onSelectStore={(store) => {
          setCurrentStore(store);
          showToast(`Switched to ${store.name}`, 'storefront');
        }}
        language={language}
        onToggleLanguage={() => {
          const nextLang = language === 'en' ? 'hi' : 'en';
          setLanguage(nextLang);
          showToast(nextLang === 'hi' ? 'भाषा: हिंदी चुनी गई' : 'Language: English selected', 'translate');
        }}
        onOpenNotifications={() => setNotificationsOpen(true)}
        unreadAlertsCount={3}
      />

      {/* Main Content Area based on Tab */}
      <main className="flex-1 w-full flex flex-col">
        {currentTab === 'dashboard' && (
          <HomeScreen
            currentStore={currentStore}
            customers={customers}
            payables={payables}
            inventoryAlerts={inventoryAlerts}
            activities={activities}
            onOpenVoiceModal={() => setVoiceModalOpen(true)}
            onOpenWhatsApp={(cust) => setWhatsAppCustomer(cust)}
            onOpenLedger={(cust) => setLedgerCustomer(cust)}
            onPayUPI={handlePayUPI}
            onReorder={handleReorder}
            onNavigateToSimulation={() => setCurrentTab('simulation')}
            onNavigateToUdhaar={() => setCurrentTab('udhaar-ledger')}
            onNavigateToCashFlow={() => setCurrentTab('cash-flow')}
            language={language}
          />
        )}

        {currentTab === 'cash-flow' && (
          <CashFlowScreen
            currentStore={currentStore}
            payables={payables}
            activities={activities}
            onPayUPI={handlePayUPI}
            language={language}
          />
        )}

        {currentTab === 'udhaar-ledger' && (
          <UdhaarScreen
            customers={customers}
            onOpenWhatsApp={(cust) => setWhatsAppCustomer(cust)}
            onOpenLedger={(cust) => setLedgerCustomer(cust)}
            onAddNewCustomer={(newCust) => {
              setCustomers((prev) => [newCust, ...prev]);
              showToast(`Customer ${newCust.name} added to Khata!`, 'person_add');
            }}
            language={language}
          />
        )}

        {currentTab === 'simulation' && (
          <SimulationScreen
            currentStore={currentStore}
            customers={customers}
            payables={payables}
            onOpenWhatsApp={(cust) => setWhatsAppCustomer(cust)}
            onShowToast={showToast}
            language={language}
          />
        )}

        {currentTab === 'ai-copilot' && (
          <AISahayakScreen
            currentStore={currentStore}
            customers={customers}
            payables={payables}
            onOpenVoiceModal={() => setVoiceModalOpen(true)}
            language={language}
          />
        )}
      </main>

      {/* Floating Center "+ Record" Pill Action Button */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
        <button
          aria-label="Quick Record Entry"
          type="button"
          onClick={() => setRecordModalOpen(true)}
          className="flex items-center gap-1.5 px-4 h-12 rounded-full bg-[#0d5c3a] hover:bg-[#004328] text-white shadow-[0_12px_24px_-4px_rgba(13,92,58,0.35)] active:scale-95 transition-all font-bold text-sm tracking-wide"
        >
          <span className="material-symbols-outlined text-[22px]">add</span>
          <span className="pr-1">{t.recordBtn}</span>
        </button>
      </div>

      {/* Fixed Bottom Navigation Bar with 5 Tabs */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={language}
      />

      {/* Interactive Modals */}
      <VoiceModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onSaveEntry={handleSaveVoiceEntry}
        language={language}
      />

      <RecordModal
        isOpen={recordModalOpen}
        onClose={() => setRecordModalOpen(false)}
        customers={customers}
        onRecordTransaction={handleRecordTransaction}
        language={language}
      />

      <WhatsAppModal
        customer={whatsAppCustomer}
        onClose={() => setWhatsAppCustomer(null)}
        onSend={(name, amount) => {
          showToast(`WhatsApp reminder sent to ${name} for ${amount}`, 'send');
        }}
        language={language}
      />

      <LedgerModal
        customer={ledgerCustomer}
        onClose={() => setLedgerCustomer(null)}
        onSettleAmount={handleSettleCustomerAmount}
        language={language}
      />

      <NotificationsModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        language={language}
      />

      {/* Toast popup */}
      <Toast message={toast.message} icon={toast.icon} visible={toast.visible} />
    </div>
  );
}
