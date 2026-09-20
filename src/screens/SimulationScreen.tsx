import React, { useState } from 'react';
import { CustomerUdhaar, PayableBill, StoreProfile, Language } from '../types';

interface SimulationScreenProps {
  currentStore: StoreProfile;
  customers: CustomerUdhaar[];
  payables: PayableBill[];
  onOpenWhatsApp: (customer: CustomerUdhaar) => void;
  onShowToast: (msg: string, icon?: string) => void;
  language: Language;
}

export const SimulationScreen: React.FC<SimulationScreenProps> = ({
  currentStore,
  customers,
  payables,
  onOpenWhatsApp,
  onShowToast,
  language,
}) => {
  // Simulation variables
  const [collectionAmount, setCollectionAmount] = useState<number>(8500);
  const [supplierDelayDays, setSupplierDelayDays] = useState<number>(0);
  const [salesBoostPercent, setSalesBoostPercent] = useState<number>(0);

  const isHindi = language === 'hi';

  // Baseline calculation on Thursday (T-5)
  // Baseline balance on Thursday is ₹12,500 (meaning ₹7,500 below ₹20,000 threshold)
  const baselineThursdayBalance = 12500;
  const safeReserve = currentStore.minSafeReserve; // 20000

  // Effect of simulation:
  // 1. collectionAmount adds directly
  // 2. supplier delay: if delay >= 2 days, the ₹18,000 supplier payment shifts past Thursday, adding +₹18,000 to Thursday balance
  const delayedSupplierBenefit = supplierDelayDays >= 2 ? 18000 : 0;
  // 3. daily sales boost: 5 days * baseline daily sales (~₹5,000) * boost
  const salesBenefit = Math.round(5 * 5000 * (salesBoostPercent / 100));

  const simulatedThursdayBalance = baselineThursdayBalance + collectionAmount + delayedSupplierBenefit + salesBenefit;
  const netDeficitOrSurplus = simulatedThursdayBalance - safeReserve;
  const isSafe = netDeficitOrSurplus >= 0;

  const applyPreset = (preset: 'ai_rec' | 'supplier_delay' | 'aggressive') => {
    if (preset === 'ai_rec') {
      setCollectionAmount(8500);
      setSupplierDelayDays(0);
      setSalesBoostPercent(0);
      onShowToast(isHindi ? 'AI सुझाव लागू: ₹8,500 वसूली' : 'AI Preset: Collect ₹8,500 applied!', 'auto_awesome');
    } else if (preset === 'supplier_delay') {
      setCollectionAmount(0);
      setSupplierDelayDays(3);
      setSalesBoostPercent(5);
      onShowToast(isHindi ? 'सप्लायर भुगतान 3 दिन आगे बढ़ाया' : 'Supplier delayed by 3 days applied!', 'schedule');
    } else {
      setCollectionAmount(20500);
      setSupplierDelayDays(0);
      setSalesBoostPercent(15);
      onShowToast(isHindi ? 'शीर्ष 2 खातों की वसूली (₹20.5k)' : 'Aggressive Recovery applied!', 'bolt');
    }
  };

  return (
    <div className="app-container flex flex-col px-3 sm:px-4 gap-3.5 pb-24 selection:bg-[#a9f3c5]">
      {/* Header Banner */}
      <section className="w-full mt-2">
        <div className="bg-[#31394e] text-white rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#6ffbbe] uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">insights</span>
              {isHindi ? 'कैश सिमुलेशन सैंडबॉक्स' : 'What-If Cash Simulator'}
            </span>
            <span className="text-xs text-slate-300 font-mono">T-5 Days</span>
          </div>

          <h2 className="text-lg font-bold text-white mt-2 leading-tight">
            {isHindi
              ? 'देखें कि कौन से निर्णय घाटे को खत्म कर सकते हैं'
              : 'Test how actions will eliminate the ₹7,500 shortfall'}
          </h2>

          {/* Outcome Result Pill */}
          <div className={`mt-3 p-3 rounded-xl border flex items-center justify-between ${
            isSafe
              ? 'bg-[#006c49]/30 border-[#4edea3] text-white'
              : 'bg-red-500/20 border-red-400 text-red-100'
          }`}>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider">
                {isSafe
                  ? isHindi ? 'परिणाम: सुरक्षित सीमा पार' : 'Simulated Status: Safe'
                  : isHindi ? 'परिणाम: अभी भी कमी' : 'Simulated Status: Shortfall'}
              </span>
              <span className="text-base font-bold font-mono mt-0.5">
                {isSafe
                  ? `+₹${netDeficitOrSurplus.toLocaleString('en-IN')} Buffer Above Reserve`
                  : `-₹${Math.abs(netDeficitOrSurplus).toLocaleString('en-IN')} Deficit Still Remaining`}
              </span>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              isSafe ? 'bg-[#006c49] text-white' : 'bg-red-600 text-white'
            }`}>
              <span className="material-symbols-outlined text-[22px]">
                {isSafe ? 'check' : 'warning'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Preset Scenario Buttons */}
      <section className="flex flex-col gap-1.5">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider px-1">
          {isHindi ? 'त्वरित परिदृश्य (Quick Presets)' : 'Quick Scenario Presets'}
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => applyPreset('ai_rec')}
            className="p-2.5 bg-white rounded-xl border border-slate-200 text-left hover:border-[#006c49] transition-all shadow-sm active:scale-95"
          >
            <span className="text-[10px] font-bold text-[#006c49] block uppercase">AI Recom</span>
            <span className="text-xs font-bold text-slate-900 block mt-0.5">Collect ₹8.5k</span>
            <span className="text-[10px] text-slate-500">From Amit Gupta</span>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('supplier_delay')}
            className="p-2.5 bg-white rounded-xl border border-slate-200 text-left hover:border-slate-400 transition-all shadow-sm active:scale-95"
          >
            <span className="text-[10px] font-bold text-amber-600 block uppercase">Supplier Delay</span>
            <span className="text-xs font-bold text-slate-900 block mt-0.5">+3 Days Amul</span>
            <span className="text-[10px] text-slate-500">Postpone ₹18k</span>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('aggressive')}
            className="p-2.5 bg-white rounded-xl border border-slate-200 text-left hover:border-slate-400 transition-all shadow-sm active:scale-95"
          >
            <span className="text-[10px] font-bold text-indigo-600 block uppercase">Aggressive</span>
            <span className="text-xs font-bold text-slate-900 block mt-0.5">Collect ₹20.5k</span>
            <span className="text-[10px] text-slate-500">Raj + Amit</span>
          </button>
        </div>
      </section>

      {/* Interactive Sliders Sandbox */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-4">
        <h3 className="font-bold text-sm text-slate-900">
          {isHindi ? 'चरों को खुद समायोजित करें' : 'Adjust Simulation Parameters'}
        </h3>

        {/* Slider 1: Udhaar Recovery */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">
              {isHindi ? '1. उधार वसूली (₹)' : '1. Early Udhaar Collected'}
            </span>
            <span className="font-mono font-bold text-[#006c49]">
              ₹{collectionAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="30000"
            step="1000"
            value={collectionAmount}
            onChange={(e) => setCollectionAmount(Number(e.target.value))}
            className="w-full accent-[#006c49] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>₹0</span>
            <span>₹15,000</span>
            <span>₹30,000</span>
          </div>
        </div>

        {/* Slider 2: Supplier Payment Delay */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">
              {isHindi ? '2. सप्लायर भुगतान में छूट (दिन)' : '2. Supplier Payment Delay'}
            </span>
            <span className="font-mono font-bold text-amber-700">
              {supplierDelayDays} {isHindi ? 'दिन' : 'Days'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="7"
            step="1"
            value={supplierDelayDays}
            onChange={(e) => setSupplierDelayDays(Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0 days (pay now)</span>
            <span>3 days (clears dip)</span>
            <span>7 days</span>
          </div>
        </div>

        {/* Slider 3: Daily Sales Boost */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">
              {isHindi ? '3. दैनिक बिक्री वृद्धि (%)' : '3. Counter Sales Growth'}
            </span>
            <span className="font-mono font-bold text-blue-700">
              {salesBoostPercent > 0 ? `+${salesBoostPercent}%` : `${salesBoostPercent}%`}
            </span>
          </div>
          <input
            type="range"
            min="-20"
            max="40"
            step="5"
            value={salesBoostPercent}
            onChange={(e) => setSalesBoostPercent(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>-20% (rain/slow)</span>
            <span>0% (regular)</span>
            <span>+40% (festival surge)</span>
          </div>
        </div>
      </section>

      {/* Comparison Visual Card */}
      <section className="bg-[#eff4ff] rounded-2xl p-4 border border-[#dce9ff] flex flex-col gap-2.5">
        <h4 className="font-bold text-xs text-[#004328] uppercase tracking-wider">
          {isHindi ? 'गुरुवार के अनुमान का तुलनात्मक विश्लेषण' : 'Thursday Forecast Comparison'}
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-xl border border-red-200">
            <span className="text-[10px] font-bold text-red-600 uppercase block">{isHindi ? 'मूल अनुमान (बिना बदलाव)' : 'Current Baseline'}</span>
            <div className="text-lg font-bold font-mono text-slate-900 mt-1">₹12,500</div>
            <span className="text-[11px] text-red-600 font-bold block mt-0.5">-₹7,500 Shortfall</span>
          </div>

          <div className={`p-3 rounded-xl border ${
            isSafe ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-amber-200'
          }`}>
            <span className="text-[10px] font-bold text-[#006c49] uppercase block">{isHindi ? 'सिमुलेशन परिणाम' : 'Simulated Forecast'}</span>
            <div className="text-lg font-bold font-mono text-slate-900 mt-1">₹{simulatedThursdayBalance.toLocaleString('en-IN')}</div>
            <span className={`text-[11px] font-bold block mt-0.5 ${isSafe ? 'text-emerald-700' : 'text-amber-700'}`}>
              {isSafe ? `Safe Buffer (+₹${netDeficitOrSurplus.toLocaleString('en-IN')})` : 'Still Short'}
            </span>
          </div>
        </div>

        {/* Direct Action Trigger */}
        <button
          type="button"
          onClick={() => {
            const topCust = customers[0];
            if (topCust) {
              onOpenWhatsApp(topCust);
            }
          }}
          className="w-full py-2.5 mt-1 rounded-full bg-[#006c49] hover:bg-[#005236] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">chat</span>
          <span>{isHindi ? 'अभी राज शर्मा से वसूली शुरू करें' : 'Execute Plan: WhatsApp Raj Sharma'}</span>
        </button>
      </section>
    </div>
  );
};
