import React, { useState } from 'react';
import { StoreProfile, PayableBill, TransactionActivity, Language } from '../types';
import { forecastTrajectory } from '../data/mockData';

interface CashFlowScreenProps {
  currentStore: StoreProfile;
  payables: PayableBill[];
  activities: TransactionActivity[];
  onPayUPI: (payable: PayableBill) => void;
  language: Language;
}

export const CashFlowScreen: React.FC<CashFlowScreenProps> = ({
  currentStore,
  payables,
  activities,
  onPayUPI,
  language,
}) => {
  const [activeView, setActiveView] = useState<'forecast' | 'payables' | 'history'>('forecast');
  const [selectedDay, setSelectedDay] = useState<number | null>(5); // Default to Thursday dip (index 5)

  const isHindi = language === 'hi';

  const totalInflow = forecastTrajectory.reduce((acc, curr) => acc + curr.inflow, 0);
  const totalOutflow = forecastTrajectory.reduce((acc, curr) => acc + curr.outflow, 0);

  return (
    <div className="app-container flex flex-col px-3 sm:px-4 gap-3.5 pb-24 selection:bg-[#a9f3c5]">
      {/* Header Banner */}
      <section className="w-full mt-2">
        <div className="bg-[#0f172a] text-white rounded-2xl p-4 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {isHindi ? 'दैनिक नकदी स्थिति' : 'Daily Cash Velocity'}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
              ● {isHindi ? 'लाइव मॉनिटर' : 'Live Sync'}
            </span>
          </div>

          <div className="mt-2 flex items-baseline justify-between">
            <div>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
                ₹{currentStore.currentCash.toLocaleString('en-IN')}
              </span>
              <span className="block text-xs text-slate-300 mt-0.5">
                {isHindi ? 'काउंटर + बैंक में कुल नकदी' : 'In Counter Cash + Bank Balance'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">{isHindi ? 'सुरक्षित सीमा' : 'Safe Buffer'}</span>
              <span className="font-mono text-sm font-bold text-emerald-400">
                ₹{currentStore.minSafeReserve.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase">{isHindi ? '7-दिन कुल आवक' : '7-Day Inflow'}</span>
              <span className="font-mono font-bold text-emerald-400">+₹{totalInflow.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-slate-400 uppercase">{isHindi ? '7-दिन कुल जावक' : '7-Day Outflow'}</span>
              <span className="font-mono font-bold text-red-400">-₹{totalOutflow.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex p-1 bg-[#eff4ff] rounded-xl text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveView('forecast')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            activeView === 'forecast'
              ? 'bg-[#004328] text-white shadow-sm'
              : 'text-[#404942] hover:text-[#0b1c30]'
          }`}
        >
          {isHindi ? 'भविष्यवाणी चार्ट' : '9-Day Forecast'}
        </button>
        <button
          type="button"
          onClick={() => setActiveView('payables')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            activeView === 'payables'
              ? 'bg-[#004328] text-white shadow-sm'
              : 'text-[#404942] hover:text-[#0b1c30]'
          }`}
        >
          {isHindi ? 'सप्लायर बिल' : 'Payable Bills'}
        </button>
        <button
          type="button"
          onClick={() => setActiveView('history')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            activeView === 'history'
              ? 'bg-[#004328] text-white shadow-sm'
              : 'text-[#404942] hover:text-[#0b1c30]'
          }`}
        >
          {isHindi ? 'लेनदेन इतिहास' : 'Transactions'}
        </button>
      </div>

      {/* VIEW 1: FORECAST TIMELINE */}
      {activeView === 'forecast' && (
        <section className="flex flex-col gap-3">
          {/* Timeline Bar Chart */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {isHindi ? 'दैनिक अनुमानित बैलेंस' : 'Projected Daily Balance'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isHindi ? 'गुरुवार को ₹20,000 की सुरक्षित सीमा टूटेगी' : 'Breaches ₹20k reserve on Thursday (T-5)'}
                </p>
              </div>
              <span className="material-symbols-outlined text-red-500 text-[20px]">warning</span>
            </div>

            {/* Bars */}
            <div className="grid grid-cols-9 gap-1 items-end h-32 pt-4 pb-2 border-b border-slate-100">
              {forecastTrajectory.map((item, idx) => {
                const isSelected = selectedDay === idx;
                const isBelowMin = item.projectedBalance < currentStore.minSafeReserve;
                const heightPercent = Math.max(15, Math.min(100, (item.projectedBalance / 50000) * 100));

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDay(idx)}
                    className="flex flex-col items-center gap-1 cursor-pointer group"
                  >
                    <div className="w-full flex items-end justify-center h-24">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[28px] rounded-t-md transition-all ${
                          isBelowMin
                            ? 'bg-red-500 group-hover:bg-red-600'
                            : isSelected
                            ? 'bg-[#004328]'
                            : 'bg-[#8ed6aa] group-hover:bg-[#4edea3]'
                        }`}
                      />
                    </div>
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-[#004328]' : 'text-slate-500'}`}>
                      {item.dayName}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Safe Reserve Marker Line Explanation */}
            <div className="flex items-center justify-between text-[11px] pt-2 text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-red-400 inline-block"></span>
                {isHindi ? 'सुरक्षित सीमा (₹20k)' : 'Safe Reserve (₹20k)'}
              </span>
              <span className="text-[10px] text-slate-400">
                {isHindi ? 'क्लिक करके विवरण देखें' : 'Tap day bar for details'}
              </span>
            </div>
          </div>

          {/* Selected Day Deep Dive */}
          {selectedDay !== null && forecastTrajectory[selectedDay] && (
            <div className={`p-4 rounded-2xl border shadow-sm ${
              forecastTrajectory[selectedDay].isDip
                ? 'bg-red-50/70 border-red-200'
                : 'bg-white border-slate-100'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    forecastTrajectory[selectedDay].isDip ? 'bg-red-500 animate-ping' : 'bg-[#006c49]'
                  }`} />
                  <span className="font-bold text-sm text-slate-900">
                    {forecastTrajectory[selectedDay].dayName} ({forecastTrajectory[selectedDay].date})
                  </span>
                </div>
                <span className="font-mono text-base font-bold text-slate-900">
                  ₹{forecastTrajectory[selectedDay].projectedBalance.toLocaleString('en-IN')}
                </span>
              </div>

              {forecastTrajectory[selectedDay].notes && (
                <p className="text-xs text-red-700 font-semibold mt-1">
                  ⚠️ {forecastTrajectory[selectedDay].notes}
                </p>
              )}

              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="bg-white/80 p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase block">{isHindi ? 'अपेक्षित आवक' : 'Expected Inflow'}</span>
                  <span className="font-mono font-bold text-emerald-600">
                    +₹{forecastTrajectory[selectedDay].inflow.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase block">{isHindi ? 'नियोजित खर्च' : 'Planned Outflow'}</span>
                  <span className="font-mono font-bold text-red-600">
                    -₹{forecastTrajectory[selectedDay].outflow.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Advice Card */}
          <div className="bg-[#e5eeff] p-3.5 rounded-2xl border border-[#dce9ff] flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#004328] text-[22px] mt-0.5">tips_and_updates</span>
            <div>
              <h4 className="font-bold text-xs text-[#004328]">
                {isHindi ? 'नकदी संकट से बचने की रणनीति' : 'Cash Buffer Protection Strategy'}
              </h4>
              <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                {isHindi
                  ? 'अमूल डेयरी सप्लायर को ₹18,000 देने से पहले अगर आप राज शर्मा से ₹12,000 या अमित से ₹8,500 वसूल लें, तो आपका बैलेंस कभी ₹20k से नीचे नहीं जाएगा।'
                  : 'Collecting ₹8,500 from Amit Gupta or ₹12,000 from Raj Sharma before Wednesday ensures your reserve never breaches the ₹20k threshold.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* VIEW 2: PAYABLES LIST */}
      {activeView === 'payables' && (
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isHindi ? 'आगामी सप्लायर व किराया भुगतान' : 'Upcoming Supplier & Rent Dues'}
            </span>
            <span className="text-xs font-bold font-mono text-red-600">
              ₹{payables.reduce((s, p) => s + p.amount, 0).toLocaleString('en-IN')} Total
            </span>
          </div>

          {payables.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-slate-900">{p.vendor}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {p.category}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{p.description}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-base font-bold text-red-600">
                    ₹{p.amount.toLocaleString('en-IN')}
                  </span>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">
                    Due: {p.dueDate}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-1 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => onPayUPI(p)}
                  className="flex-1 py-2 rounded-full bg-[#0d5c3a] hover:bg-[#004328] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
                  {isHindi ? 'UPI से भुगतान करें' : 'Pay via UPI'}
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* VIEW 3: TRANSACTION ACTIVITY LOG */}
      {activeView === 'history' && (
        <section className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            {isHindi ? 'आज के सभी लेनदेन' : "Today's Transaction Log"}
          </span>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100 overflow-hidden">
            {activities.map((act) => {
              const isPositive = act.amount > 0;
              return (
                <div key={act.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm ${
                        act.type === 'sale'
                          ? 'bg-emerald-100 text-emerald-800'
                          : act.type === 'expense'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {act.type === 'sale' ? 'point_of_sale' : act.type === 'expense' ? 'arrow_outward' : 'savings'}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-slate-900 block">{act.title}</span>
                      <span className="text-[11px] text-slate-500">{act.subtitle}</span>
                    </div>
                  </div>
                  <span
                    className={`font-mono text-sm font-bold ${
                      isPositive ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {isPositive ? '+' : ''}₹{Math.abs(act.amount).toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
