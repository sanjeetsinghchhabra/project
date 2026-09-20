import React, { useState } from 'react';
import { CustomerUdhaar, PayableBill, InventoryAlert, TransactionActivity, StoreProfile, Language } from '../types';
import { translations } from '../data/mockData';

interface HomeScreenProps {
  currentStore: StoreProfile;
  customers: CustomerUdhaar[];
  payables: PayableBill[];
  inventoryAlerts: InventoryAlert[];
  activities: TransactionActivity[];
  onOpenVoiceModal: () => void;
  onOpenWhatsApp: (customer: CustomerUdhaar) => void;
  onOpenLedger: (customer: CustomerUdhaar) => void;
  onPayUPI: (payable: PayableBill) => void;
  onReorder: (alert: InventoryAlert) => void;
  onNavigateToSimulation: () => void;
  onNavigateToUdhaar: () => void;
  onNavigateToCashFlow: () => void;
  language: Language;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentStore,
  customers,
  payables,
  inventoryAlerts,
  activities,
  onOpenVoiceModal,
  onOpenWhatsApp,
  onOpenLedger,
  onPayUPI,
  onReorder,
  onNavigateToSimulation,
  onNavigateToUdhaar,
  onNavigateToCashFlow,
  language,
}) => {
  const [whyExpanded, setWhyExpanded] = useState(false);
  const t = translations[language];

  // Dynamic calculations
  const totalUdhaar = customers.reduce((sum, c) => sum + c.amount, 0);
  const totalPayables = payables.reduce((sum, p) => sum + p.amount, 0);
  const topPriorityCustomer = customers.find(c => c.name.includes('Raj Sharma')) || customers[0];
  const priorityPayable = payables[0];
  const priorityInventory = inventoryAlerts[0];

  const scrollToPriority = () => {
    const elem = document.getElementById('priorityCollectionSection');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container flex flex-col px-3 sm:px-4 gap-3.5 pb-24 selection:bg-[#a9f3c5]">
      {/* Voice Entry Quick Action Pill Banner */}
      <section className="w-full mt-2">
        <div className="bg-[#eff4ff] rounded-2xl p-2.5 flex items-center justify-between shadow-sm border border-slate-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              id="voiceRecordTrigger"
              type="button"
              onClick={onOpenVoiceModal}
              className="w-10 h-10 rounded-full bg-[#0d5c3a] text-white flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform shadow-sm hover:bg-[#004328]"
              title="Speak to record entry"
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>
            <div
              className="flex flex-col min-w-0 cursor-pointer"
              onClick={onOpenVoiceModal}
            >
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[11px] text-[#0d5c3a] uppercase tracking-wider">
                  {t.bolkarLikhein}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#006c49] animate-pulse"></span>
              </div>
              <span className="text-xs text-[#404942] truncate font-medium">
                {t.voiceSample}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenVoiceModal}
            className="px-3 py-1.5 rounded-full bg-[#e5eeff] hover:bg-[#dce9ff] text-[#004328] font-bold text-xs flex-shrink-0 active:scale-95 transition-all"
          >
            {t.tryNow}
          </button>
        </div>
      </section>

      {/* Store Context Greeting Card */}
      <section className="w-full flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm text-[#404942]">{t.greeting}</span>
            <span className="text-base">👋</span>
          </div>
          <div className="flex items-center gap-1 text-[#0b1c30]">
            <span className="font-bold text-base sm:text-lg tracking-tight">
              {currentStore.name}
            </span>
            <span className="material-symbols-outlined text-[16px] text-emerald-700">verified</span>
          </div>
          <span className="text-xs text-[#404942]">{currentStore.location}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-[#404942] uppercase tracking-wider">
            {language === 'en' ? 'TODAY' : 'आज'}
          </span>
          <span className="font-mono text-xs font-bold text-[#004328]">
            29 MAR 2025
          </span>
        </div>
      </section>

      {/* Top 3 Financial Health Metrics (Equal Split Grid) */}
      <section className="grid grid-cols-3 gap-2 w-full">
        {/* Available Cash */}
        <div
          onClick={onNavigateToCashFlow}
          className="bg-white rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between shadow-sm border border-slate-100 hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#404942] uppercase tracking-wider">
              {t.available}
            </span>
            <span className="w-2 h-2 rounded-full bg-[#006c49]"></span>
          </div>
          <div className="my-1">
            <div className="font-bold text-[20px] sm:text-[22px] text-[#0b1c30] leading-tight font-sans">
              ₹{(currentStore.currentCash / 1000).toFixed(1)}
              <span className="text-xs font-normal text-[#404942]">k</span>
            </div>
          </div>
          <div className="bg-[#eff4ff] rounded px-1.5 py-0.5 mt-0.5">
            <span className="text-[10px] text-[#404942] block leading-tight font-medium">
              {t.safeMin}: ₹{(currentStore.minSafeReserve / 1000).toFixed(0)}k
            </span>
          </div>
        </div>

        {/* Expected Collections (In) */}
        <div
          onClick={onNavigateToUdhaar}
          className="bg-white rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between shadow-sm border border-slate-100 hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#006c49] uppercase tracking-wider">
              {t.comingIn}
            </span>
            <span className="material-symbols-outlined text-[14px] text-[#006c49]">arrow_downward</span>
          </div>
          <div className="my-1">
            <div className="font-bold text-[20px] sm:text-[22px] text-[#006c49] leading-tight font-sans">
              ₹{(totalUdhaar / 1000).toFixed(1)}
              <span className="text-xs font-normal text-[#404942]">k</span>
            </div>
          </div>
          <div className="bg-[#eff4ff] rounded px-1.5 py-0.5 mt-0.5">
            <span className="text-[10px] text-[#006c49] block leading-tight font-bold">
              {customers.length} {t.udhaarCount}
            </span>
          </div>
        </div>

        {/* Upcoming Payments (Out) */}
        <div
          onClick={onNavigateToCashFlow}
          className="bg-white rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between shadow-sm border border-slate-100 hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#ba1a1a] uppercase tracking-wider">
              {t.goingOut}
            </span>
            <span className="material-symbols-outlined text-[14px] text-[#ba1a1a]">arrow_upward</span>
          </div>
          <div className="my-1">
            <div className="font-bold text-[20px] sm:text-[22px] text-[#ba1a1a] leading-tight font-sans">
              ₹{(totalPayables / 1000).toFixed(1)}
              <span className="text-xs font-normal text-[#404942]">k</span>
            </div>
          </div>
          <div className="bg-[#eff4ff] rounded px-1.5 py-0.5 mt-0.5">
            <span className="text-[10px] text-[#ba1a1a] block leading-tight font-bold">
              {payables.length} {t.billsDueCount}
            </span>
          </div>
        </div>
      </section>

      {/* HERO CASHPULSE CARD (Fintech warning & action module) */}
      <section className="w-full bg-[#31394e] text-white rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
        {/* Subtle warning glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-red-500/20 blur-2xl pointer-events-none" />

        {/* Header status tag */}
        <div className="flex items-center justify-between relative z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ba1a1a] text-white text-[11px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            {t.shortagePredicted}
          </span>
          <span className="font-mono text-xs font-semibold text-[#bbc2dc] bg-slate-800/60 px-2 py-0.5 rounded">
            {t.daysTag}
          </span>
        </div>

        {/* Big Impact Shortfall Statement */}
        <div className="mt-3 relative z-10">
          <h2 className="text-lg sm:text-xl font-bold text-white leading-tight font-sans">
            {t.shortageTitle}
          </h2>
          <p className="text-xs text-[#bbc2dc] mt-1">
            {t.shortageDesc}
          </p>
        </div>

        {/* Visual Timeline Forecast Line (Inline SVG) */}
        <div className="my-3 py-1 relative z-10">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#bbc2dc] mb-1">
            <span>Today (₹42.5k)</span>
            <span className="text-red-400 font-bold">Thu Dip (-₹7.5k)</span>
            <span>Next Mon (₹34k)</span>
          </div>
          <div className="w-full h-14 bg-slate-900/60 rounded-xl p-1.5 flex items-center border border-slate-700/40">
            <svg className="w-full h-11 overflow-visible" fill="none" viewBox="0 0 300 40">
              <path
                d="M 0 10 C 60 12, 100 28, 160 34 C 200 37, 240 18, 300 12"
                fill="none"
                stroke="#EF4444"
                strokeLinecap="round"
                strokeWidth="2.5"
              />
              <circle cx="160" cy="34" fill="#EF4444" r="4.5" stroke="#ffffff" strokeWidth="1.5" />
              <line opacity="0.4" stroke="#BBC2DC" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="300" y1="26" y2="26" />
              <text fill="#BBC2DC" fontFamily="Plus Jakarta Sans" fontSize="8" x="5" y="24">
                Safe Reserve ₹20k
              </text>
            </svg>
          </div>
        </div>

        {/* Expandable "Why?" Interactive Drawer Button */}
        <div className="relative z-10">
          <button
            type="button"
            onClick={() => setWhyExpanded(!whyExpanded)}
            className="w-full py-2 px-3 rounded-xl bg-[#485066] hover:bg-slate-700 text-white flex items-center justify-between active:scale-[0.99] transition-all"
          >
            <span className="font-bold text-xs flex items-center gap-1.5 text-white">
              <span className="material-symbols-outlined text-[18px] text-red-300">analytics</span>
              {t.whyHappens}
            </span>
            <span className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${whyExpanded ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>

          {/* Expandable Content Panel */}
          {whyExpanded && (
            <div className="flex flex-col gap-2 mt-2 pt-1 animate-in fade-in duration-200">
              {/* Driver 1 */}
              <div className="bg-slate-800/80 rounded-xl p-2.5 flex items-start justify-between border border-slate-700/60">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-red-400 text-[18px] mt-0.5">call_made</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-white">₹18,000 Supplier Payment</span>
                    <span className="text-[11px] text-[#bbc2dc]">Amul Dairy & ITC distribution • Due in 3 days</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-red-500/20 text-red-300 px-2 py-0.5 rounded">High Outflow</span>
              </div>

              {/* Driver 2 */}
              <div className="bg-slate-800/80 rounded-xl p-2.5 flex items-start justify-between border border-slate-700/60">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-red-400 text-[18px] mt-0.5">store</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-white">₹8,000 Shop Rent</span>
                    <span className="text-[11px] text-[#bbc2dc]">Landlord monthly advance • Due 1st of month</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-slate-700 text-slate-300 px-2 py-0.5 rounded">Fixed Cost</span>
              </div>

              {/* Driver 3 */}
              <div className="bg-slate-800/80 rounded-xl p-2.5 flex items-start justify-between border border-slate-700/60">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-[18px] mt-0.5">call_received</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-white">₹10,500 Expected Collections</span>
                    <span className="text-[11px] text-[#bbc2dc]">Calculated from 14 regular customers' pay patterns</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Inflow</span>
              </div>
            </div>
          )}
        </div>

        {/* AI Recommendation Insight Box */}
        <div className="mt-3 bg-white/10 rounded-xl p-3 relative z-10 border border-white/10">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[#6ffbbe] text-[20px] mt-0.5 flex-shrink-0">auto_awesome</span>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#6ffbbe] uppercase tracking-wider">
                {t.aiActionTag}
              </span>
              <p className="text-xs text-white mt-0.5 font-medium leading-relaxed">
                {t.aiActionDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Main Dual CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-3 relative z-10">
          <button
            type="button"
            onClick={scrollToPriority}
            className="w-full h-11 px-4 rounded-full bg-[#006c49] hover:bg-[#005236] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-transform"
          >
            <span>{t.viewPriorityBtn}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          <button
            type="button"
            onClick={onNavigateToSimulation}
            className="w-full h-11 px-4 rounded-full bg-[#485066] hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-98 transition-colors border border-slate-600"
          >
            <span className="material-symbols-outlined text-[18px] text-[#6ffbbe]">bolt</span>
            <span>{t.runSimulationBtn}</span>
          </button>
        </div>
      </section>

      {/* TODAY'S PROACTIVE ACTIONS QUEUE */}
      <section className="w-full flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-[#0b1c30] tracking-tight">
              {t.priorityActionsTitle}
            </h3>
            <span className="w-5 h-5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[11px] flex items-center justify-center font-bold">
              3
            </span>
          </div>
          <span className="text-xs text-[#404942]">{t.tapToClear}</span>
        </div>

        {/* Action Item 1: Urgent Udhaar Recovery */}
        {topPriorityCustomer && (
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[20px]">person_alert</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-[#0b1c30] truncate">{topPriorityCustomer.name}</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#ba1a1a] text-white text-[10px] font-bold uppercase">
                      {topPriorityCustomer.daysOverdue}D {t.overdueDays}
                    </span>
                  </div>
                  <span className="text-xs text-[#404942] truncate">{topPriorityCustomer.itemsSummary}</span>
                </div>
              </div>
              <div className="flex flex-col items-end flex-shrink-0">
                <span className="font-mono text-base font-bold text-[#ba1a1a] leading-tight">
                  ₹{topPriorityCustomer.amount.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] font-bold text-[#404942]">UDHAAR</span>
              </div>
            </div>

            {/* Action Buttons Pair */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onOpenWhatsApp(topPriorityCustomer)}
                className="flex-1 h-9 rounded-full bg-[#6cf8bb] hover:bg-[#4edea3] text-[#004328] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>{t.whatsAppBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenLedger(topPriorityCustomer)}
                className="px-4 h-9 rounded-full bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-colors"
              >
                <span>{t.ledgerBtn}</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Item 2: Supplier Payment Due Tomorrow */}
        {priorityPayable && (
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#eff4ff] text-[#004328] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-[#0b1c30] truncate">{priorityPayable.vendor}</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#e5eeff] text-[#005232] text-[10px] font-bold uppercase">
                      {t.dueTomorrow}
                    </span>
                  </div>
                  <span className="text-xs text-[#404942] truncate">{priorityPayable.description}</span>
                </div>
              </div>
              <div className="flex flex-col items-end flex-shrink-0">
                <span className="font-mono text-base font-bold text-[#0b1c30] leading-tight">
                  ₹{priorityPayable.amount.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] font-bold text-[#404942]">PAYABLE</span>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onPayUPI(priorityPayable)}
                className="flex-1 h-9 rounded-full bg-[#0d5c3a] hover:bg-[#004328] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]">account_balance</span>
                <span>{t.reviewPayUpi}</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Item 3: Inventory Alert Reorder */}
        {priorityInventory && (
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#eff4ff] text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-[#0b1c30] truncate">{priorityInventory.itemName}</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold uppercase">
                      {priorityInventory.daysLeft} {t.daysLeft}
                    </span>
                  </div>
                  <span className="text-xs text-[#404942]">Only {priorityInventory.stockLeft} packs in shelf stock</span>
                </div>
              </div>
              <div className="flex flex-col items-end flex-shrink-0">
                <span className="font-mono text-xs font-bold text-[#ba1a1a] leading-tight">
                  {priorityInventory.stockLeft} {priorityInventory.unit}
                </span>
                <span className="text-[10px] font-bold text-[#404942]">CRITICAL</span>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onReorder(priorityInventory)}
                className="flex-1 h-9 rounded-full bg-[#e5eeff] hover:bg-[#dce9ff] text-[#004328] font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                <span>{t.reorderBtn}</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* WHO SHOULD I COLLECT FROM FIRST? (Priority Recovery Engine) */}
      <section className="w-full flex flex-col gap-2.5 scroll-mt-20" id="priorityCollectionSection">
        <div className="flex items-center justify-between px-0.5">
          <div>
            <h3 className="font-bold text-base text-[#0b1c30] tracking-tight">
              {t.whoCollectTitle}
            </h3>
            <p className="text-xs text-[#404942]">
              {t.whoCollectSubtitle}
            </p>
          </div>
          <span className="material-symbols-outlined text-[#004328] text-[24px]">psychology</span>
        </div>

        {/* Ranked List Container */}
        <div className="flex flex-col gap-2 w-full">
          {customers.slice(0, 3).map((cust, idx) => {
            const isRank1 = idx === 0;
            return (
              <div
                key={cust.id}
                className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xs ${
                      isRank1
                        ? 'bg-[#a9f3c5] text-[#002111]'
                        : 'bg-[#eff4ff] text-[#404942]'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs sm:text-sm text-[#0b1c30] truncate">{cust.name}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                          cust.impactLevel === 'high'
                            ? 'bg-[#ba1a1a] text-white'
                            : 'bg-[#dce9ff] text-[#005232]'
                        }`}
                      >
                        {cust.impactLevel === 'high' ? 'High Impact' : cust.impactLevel === 'medium' ? 'Medium' : 'Low'}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#006c49] font-medium truncate">
                      {isRank1
                        ? 'Reliable payer • Resolves entire deficit alone'
                        : `${cust.daysOverdue} days overdue • Pays immediately upon call`}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0 pl-2">
                  <span className="font-mono text-sm sm:text-base text-[#0b1c30] font-bold">
                    ₹{cust.amount.toLocaleString('en-IN')}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenWhatsApp(cust)}
                    className="mt-1 w-8 h-8 rounded-full bg-[#6cf8bb] hover:bg-[#4edea3] text-[#004328] flex items-center justify-center active:scale-95 transition-transform"
                    title="Send WhatsApp Reminder"
                  >
                    <span className="material-symbols-outlined text-[16px]">send</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* BUSINESS HEALTH SCORE WIDGET */}
      <section className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#404942] uppercase tracking-wider">
              {t.healthScoreTitle}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30]">82</span>
              <span className="text-xs text-[#404942]">/ 100</span>
              <span className="px-2 py-0.5 rounded-full bg-[#6cf8bb] text-[#004328] text-[10px] font-bold">
                🟢 {t.healthy}
              </span>
            </div>
          </div>

          {/* Radial Mini Progress Ring Indicator */}
          <div className="w-12 h-12 relative flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#e5eeff]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <path
                className="text-[#006c49]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray="82, 100"
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
            <span className="absolute material-symbols-outlined text-[18px] text-[#006c49]">trending_up</span>
          </div>
        </div>

        {/* 4 Sub-Pillar Progress Breakdown */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Pillar 1: Cash Flow */}
          <div className="bg-[#eff4ff] rounded-xl p-2.5 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[#0b1c30] text-xs">
              <span>{t.cashFlowPillar}</span>
              <span className="font-mono text-[11px] font-bold">18/20</span>
            </div>
            <div className="w-full bg-[#dce9ff] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#006c49] h-full rounded-full" style={{ width: '90%' }} />
            </div>
          </div>

          {/* Pillar 2: Receivables (Flagged Improvement Area) */}
          <div className="bg-[#ffdad6]/40 rounded-xl p-2.5 flex flex-col gap-1 border border-[#ffdad6]">
            <div className="flex items-center justify-between text-[#ba1a1a] text-xs">
              <span className="font-bold">{t.receivablesPillar}</span>
              <span className="font-mono text-[11px] font-bold">14/20</span>
            </div>
            <div className="w-full bg-red-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#ba1a1a] h-full rounded-full" style={{ width: '70%' }} />
            </div>
            <span className="text-[9px] text-[#ba1a1a] font-bold leading-none">
              {t.improveFlag}
            </span>
          </div>

          {/* Pillar 3: Inventory */}
          <div className="bg-[#eff4ff] rounded-xl p-2.5 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[#0b1c30] text-xs">
              <span>{t.inventoryPillar}</span>
              <span className="font-mono text-[11px] font-bold">17/20</span>
            </div>
            <div className="w-full bg-[#dce9ff] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#006c49] h-full rounded-full" style={{ width: '85%' }} />
            </div>
          </div>

          {/* Pillar 4: Payables */}
          <div className="bg-[#eff4ff] rounded-xl p-2.5 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[#0b1c30] text-xs">
              <span>{t.payablesPillar}</span>
              <span className="font-mono text-[11px] font-bold">16/20</span>
            </div>
            <div className="w-full bg-[#dce9ff] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#006c49] h-full rounded-full" style={{ width: '80%' }} />
            </div>
          </div>
        </div>
      </section>

      {/* RECENT TRANSACTIONS PEEK (Clean Ledger rows) */}
      <section className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="font-bold text-sm sm:text-base text-[#0b1c30] tracking-tight">
            {t.activityLogTitle}
          </h3>
          <button
            type="button"
            onClick={onNavigateToCashFlow}
            className="text-xs font-bold text-[#004328] hover:underline"
          >
            {t.viewAll}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100 overflow-hidden">
          {activities.slice(0, 4).map((act) => {
            const isPositive = act.amount > 0;
            return (
              <div key={act.id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      act.type === 'sale'
                        ? 'bg-[#6cf8bb] text-[#004328]'
                        : act.type === 'expense'
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : 'bg-[#a9f3c5] text-[#002111]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {act.type === 'sale'
                        ? 'payments'
                        : act.type === 'expense'
                        ? 'arrow_outward'
                        : 'account_balance_wallet'}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-xs sm:text-sm text-[#0b1c30] truncate">{act.title}</span>
                    <span className="text-[11px] text-[#404942] truncate">{act.subtitle}</span>
                  </div>
                </div>
                <span
                  className={`font-mono text-xs sm:text-sm font-bold flex-shrink-0 pl-2 ${
                    isPositive ? 'text-[#006c49]' : 'text-[#ba1a1a]'
                  }`}
                >
                  {isPositive ? '+' : ''}₹{Math.abs(act.amount).toLocaleString('en-IN')}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
