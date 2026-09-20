import React, { useState } from 'react';
import { CustomerUdhaar, Language } from '../types';

interface LedgerModalProps {
  customer: CustomerUdhaar | null;
  onClose: () => void;
  onSettleAmount: (customerId: string, amount: number) => void;
  language: Language;
}

export const LedgerModal: React.FC<LedgerModalProps> = ({
  customer,
  onClose,
  onSettleAmount,
  language,
}) => {
  const [settleInput, setSettleInput] = useState('');

  if (!customer) return null;

  const handleSettle = (amountToSettle: number) => {
    if (amountToSettle <= 0) return;
    onSettleAmount(customer.id, amountToSettle);
    setSettleInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#f8f9ff] rounded-t-2xl sm:rounded-2xl w-full max-w-md p-5 flex flex-col gap-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#004328] text-white flex items-center justify-center font-bold text-sm">
              {customer.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">{customer.name}</h3>
              <p className="text-xs text-slate-500">{customer.phone} • Last active {customer.lastActive}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Total Outstanding Card */}
        <div className="bg-[#0f172a] text-white p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              {language === 'en' ? 'Net Outstanding Udhaar' : 'कुल बाकी उधार'}
            </span>
            <div className="text-2xl font-mono font-bold text-red-400 mt-0.5">
              ₹{customer.amount.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="text-right">
            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold uppercase tracking-wider">
              {customer.daysOverdue}d overdue
            </span>
            <span className="block text-[11px] text-slate-300 mt-1">
              Pay chance: {customer.likelihoodToPay}%
            </span>
          </div>
        </div>

        {/* Quick Settle Inputs */}
        <div className="bg-white p-3 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-800 block mb-1.5">
            {language === 'en' ? 'Record Received Payment (जमा करें)' : 'भुगतान दर्ज करें'}
          </span>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder={language === 'en' ? 'Enter amount (₹)' : 'रकम डालें (₹)'}
              value={settleInput}
              onChange={(e) => setSettleInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006c49] font-mono font-bold"
            />
            <button
              type="button"
              onClick={() => handleSettle(parseFloat(settleInput) || 0)}
              disabled={!settleInput || parseFloat(settleInput) <= 0}
              className="px-4 py-2 bg-[#006c49] disabled:bg-slate-300 text-white rounded-xl text-xs font-bold active:scale-95 transition-transform"
            >
              {language === 'en' ? 'Clear Part' : 'जमा करें'}
            </button>
          </div>
          <div className="flex gap-1.5 mt-2">
            <button
              type="button"
              onClick={() => handleSettle(customer.amount)}
              className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold hover:bg-emerald-100"
            >
              {language === 'en' ? 'Clear Full (₹' + customer.amount + ')' : 'पूरा क्लियर करें'}
            </button>
            {customer.amount > 2000 && (
              <button
                type="button"
                onClick={() => handleSettle(2000)}
                className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold hover:bg-slate-200"
              >
                ₹2,000
              </button>
            )}
          </div>
        </div>

        {/* Ledger Transaction History */}
        <div>
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            {language === 'en' ? 'Ledger History / सामान ब्यौरा' : 'खाता इतिहास'}
          </h4>
          <div className="flex flex-col gap-2">
            {customer.ledgerHistory.map((item) => (
              <div
                key={item.id}
                className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-800">{item.description}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-mono font-bold ${item.type === 'debit' ? 'text-red-600' : 'text-emerald-600'}`}>
                    {item.type === 'debit' ? '-' : '+'}₹{item.amount.toLocaleString('en-IN')}
                  </span>
                  <span className="block text-[9px] text-slate-400 uppercase">
                    {item.type === 'debit' ? 'Baki (Debit)' : 'Jama (Credit)'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
