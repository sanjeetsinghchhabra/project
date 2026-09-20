import React, { useState } from 'react';
import { CustomerUdhaar, Language } from '../types';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: CustomerUdhaar[];
  onRecordTransaction: (data: {
    type: 'sale' | 'udhaar_out' | 'udhaar_in' | 'expense';
    amount: number;
    title: string;
    subtitle: string;
    customerId?: string;
  }) => void;
  language: Language;
}

export const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  onClose,
  customers,
  onRecordTransaction,
  language,
}) => {
  const [tab, setTab] = useState<'sale' | 'udhaar_out' | 'udhaar_in' | 'expense'>('sale');
  const [amount, setAmount] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [customerName, setCustomerName] = useState('');
  const [note, setNote] = useState('');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi'>('upi');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    let title = '';
    let subtitle = '';

    if (tab === 'sale') {
      title = `Cash Sale`;
      subtitle = `${paymentMode.toUpperCase()} Direct • ${note || 'Retail goods'}`;
    } else if (tab === 'udhaar_out') {
      const selected = customers.find(c => c.id === selectedCustomerId);
      const name = customerName || selected?.name || 'Customer';
      title = `Udhaar Diya: ${name}`;
      subtitle = note || 'Kirana items on credit';
    } else if (tab === 'udhaar_in') {
      const selected = customers.find(c => c.id === selectedCustomerId);
      const name = customerName || selected?.name || 'Customer';
      title = `Udhaar Collection: ${name}`;
      subtitle = `${paymentMode.toUpperCase()} • Received against balance`;
    } else {
      title = note || 'Store Expense / Bill';
      subtitle = `${paymentMode.toUpperCase()} Payment`;
    }

    onRecordTransaction({
      type: tab,
      amount: numAmount,
      title,
      subtitle,
      customerId: selectedCustomerId,
    });

    setAmount('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-5 flex flex-col gap-4 shadow-2xl border border-slate-200 animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0d5c3a] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">add</span>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900">
              {language === 'en' ? 'Quick Transaction Entry' : 'त्वरित लेनदेन प्रविष्टि'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* 4 Transaction Type Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setTab('sale')}
            className={`py-2 text-[11px] font-bold rounded-lg transition-all ${
              tab === 'sale'
                ? 'bg-[#006c49] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'en' ? '+ Sale' : '+ बिक्री'}
          </button>
          <button
            type="button"
            onClick={() => setTab('udhaar_out')}
            className={`py-2 text-[11px] font-bold rounded-lg transition-all ${
              tab === 'udhaar_out'
                ? 'bg-[#ba1a1a] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'en' ? 'Udhaar Diya' : 'उधार दिया'}
          </button>
          <button
            type="button"
            onClick={() => setTab('udhaar_in')}
            className={`py-2 text-[11px] font-bold rounded-lg transition-all ${
              tab === 'udhaar_in'
                ? 'bg-[#004328] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'en' ? 'Udhaar Mila' : 'उधार मिला'}
          </button>
          <button
            type="button"
            onClick={() => setTab('expense')}
            className={`py-2 text-[11px] font-bold rounded-lg transition-all ${
              tab === 'expense'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'en' ? '- Kharcha' : '- खर्चा'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Amount input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {language === 'en' ? 'Amount (रुपये)' : 'रकम (₹)'}
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xl font-bold text-slate-500">₹</span>
              <input
                type="number"
                step="any"
                required
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                className="w-full pl-8 pr-4 py-2.5 text-2xl font-mono font-bold text-slate-900 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006c49]"
              />
            </div>
          </div>

          {/* Customer Selection for Udhaar */}
          {(tab === 'udhaar_out' || tab === 'udhaar_in') && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {language === 'en' ? 'Select Customer' : 'ग्राहक चुनें'}
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006c49] font-medium"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (Balance: ₹{c.amount.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Payment Mode */}
          {(tab === 'sale' || tab === 'udhaar_in' || tab === 'expense') && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {language === 'en' ? 'Payment Method' : 'भुगतान माध्यम'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMode('upi')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    paymentMode === 'upi'
                      ? 'border-[#006c49] bg-[#e5eeff] text-[#004328]'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                  UPI / QR
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('cash')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    paymentMode === 'cash'
                      ? 'border-[#006c49] bg-[#e5eeff] text-[#004328]'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">payments</span>
                  Cash Counter
                </button>
              </div>
            </div>
          )}

          {/* Note / Description */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {language === 'en' ? 'Description / Item Details' : 'विवरण या सामान'}
            </label>
            <input
              type="text"
              placeholder={
                tab === 'sale'
                  ? 'E.g., Groceries & Dairy'
                  : tab === 'udhaar_out'
                  ? 'E.g., Mustard Oil 5L, Sugar 5kg'
                  : tab === 'udhaar_in'
                  ? 'E.g., Partial clearance'
                  : 'E.g., Electricity bill or Shop expense'
              }
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006c49]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-1 rounded-full bg-[#0d5c3a] hover:bg-[#004328] text-white font-bold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">check</span>
            {language === 'en' ? 'Save Transaction' : 'लेनदेन सुरक्षित करें'}
          </button>
        </form>
      </div>
    </div>
  );
};
