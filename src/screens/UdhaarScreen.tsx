import React, { useState } from 'react';
import { CustomerUdhaar, Language } from '../types';

interface UdhaarScreenProps {
  customers: CustomerUdhaar[];
  onOpenWhatsApp: (customer: CustomerUdhaar) => void;
  onOpenLedger: (customer: CustomerUdhaar) => void;
  onAddNewCustomer: (customer: CustomerUdhaar) => void;
  language: Language;
}

export const UdhaarScreen: React.FC<UdhaarScreenProps> = ({
  customers,
  onOpenWhatsApp,
  onOpenLedger,
  onAddNewCustomer,
  language,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'overdue' | 'high_impact'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newItems, setNewItems] = useState('');

  const isHindi = language === 'hi';

  const totalOutstanding = customers.reduce((s, c) => s + c.amount, 0);
  const overdueCount = customers.filter(c => c.daysOverdue >= 5).length;

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.phone.includes(searchTerm) ||
                          c.itemsSummary.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'overdue') return c.daysOverdue >= 5;
    if (filter === 'high_impact') return c.impactLevel === 'high' || c.amount >= 8000;
    return true;
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(newAmount);
    if (!newName || !amountNum) return;

    const newCust: CustomerUdhaar = {
      id: `cust-${Date.now()}`,
      name: newName,
      phone: newPhone || '+91 98000 00000',
      amount: amountNum,
      daysOverdue: 0,
      itemsSummary: newItems || 'Retail kirana goods',
      impactLevel: amountNum > 8000 ? 'high' : amountNum > 4000 ? 'medium' : 'low',
      likelihoodToPay: 90,
      lastActive: 'Just now',
      ledgerHistory: [
        {
          id: `lh-${Date.now()}`,
          date: 'Today',
          description: newItems || 'New credit entry',
          type: 'debit',
          amount: amountNum,
        }
      ]
    };

    onAddNewCustomer(newCust);
    setShowAddModal(false);
    setNewName('');
    setNewPhone('');
    setNewAmount('');
    setNewItems('');
  };

  return (
    <div className="app-container flex flex-col px-3 sm:px-4 gap-3.5 pb-24 selection:bg-[#a9f3c5]">
      {/* Header Summary */}
      <section className="w-full mt-2">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {isHindi ? 'कुल बकाया उधार (7 ग्राहक)' : 'Total Outstanding Khata'}
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 mt-0.5">
                ₹{totalOutstanding.toLocaleString('en-IN')}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3 py-2 rounded-full bg-[#004328] hover:bg-[#002111] text-white text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              {isHindi ? 'नया ग्राहक' : '+ New Customer'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="text-slate-600">
                {overdueCount} {isHindi ? 'खाते 5+ दिन पुराने' : 'Overdue (>5 Days)'}
              </span>
            </div>
            <div className="flex items-center justify-end gap-1.5 text-[#006c49] font-semibold">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>{isHindi ? '88% वसूली संभावना' : '88% Pay Probability'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">search</span>
          <input
            type="text"
            placeholder={isHindi ? 'ग्राहक का नाम, फोन या सामान खोजें...' : 'Search by customer name, phone, item...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#006c49]"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-slate-400"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-[#004328] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {isHindi ? 'सभी (All)' : 'All Khata'} ({customers.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('overdue')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === 'overdue'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {isHindi ? 'अति देय (5+ Days)' : 'Overdue'}
          </button>
          <button
            type="button"
            onClick={() => setFilter('high_impact')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === 'high_impact'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {isHindi ? 'बड़ी रकम (High Impact)' : 'High Amount (>₹8k)'}
          </button>
        </div>
      </div>

      {/* Customer Cards List */}
      <section className="flex flex-col gap-2.5">
        {filteredCustomers.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center text-slate-400 border border-slate-100">
            <span className="material-symbols-outlined text-[36px] text-slate-300 mb-1">person_search</span>
            <p className="text-xs">{isHindi ? 'कोई ग्राहक नहीं मिला' : 'No matching customers found'}</p>
          </div>
        ) : (
          filteredCustomers.map((cust) => {
            const isHighOverdue = cust.daysOverdue >= 5;
            return (
              <div
                key={cust.id}
                className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex flex-col gap-2.5 hover:border-slate-200 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                      isHighOverdue ? 'bg-red-100 text-red-700' : 'bg-[#e5eeff] text-[#004328]'
                    }`}>
                      {cust.name.charAt(0)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-sm text-slate-900">{cust.name}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                            isHighOverdue ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {cust.daysOverdue > 0 ? `${cust.daysOverdue}D Overdue` : 'Current'}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">{cust.phone}</span>
                      <span className="text-[11px] text-slate-600 mt-0.5">{cust.itemsSummary}</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="font-mono text-base font-bold text-slate-900 block">
                      ₹{cust.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      {cust.likelihoodToPay}% pay chance
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-50">
                  <button
                    type="button"
                    onClick={() => onOpenWhatsApp(cust)}
                    className="flex-1 py-1.5 rounded-full bg-[#6cf8bb] hover:bg-[#4edea3] text-[#004328] font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    <span>{isHindi ? 'तकाजा भेजें' : 'WhatsApp'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenLedger(cust)}
                    className="px-4 py-1.5 rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] text-slate-800 font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-colors"
                  >
                    <span>{isHindi ? 'खाता बही' : 'Ledger'}</span>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Add New Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-5 flex flex-col gap-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">
                {isHindi ? 'नया उधार ग्राहक जोड़ें' : 'Add New Customer Udhaar'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isHindi ? 'ग्राहक का नाम' : 'Customer Name'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="E.g., Ramesh Kumar"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006c49]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isHindi ? 'फोन नंबर' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  placeholder="+91 98112 00000"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006c49]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isHindi ? 'शुरुआती उधार रकम (₹)' : 'Initial Credit Amount (₹)'} *
                </label>
                <input
                  type="number"
                  required
                  placeholder="2500"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006c49]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isHindi ? 'सामान का विवरण' : 'Item / Goods Summary'}
                </label>
                <input
                  type="text"
                  placeholder="E.g., Atta 10kg, Mustard Oil 5L, Spices"
                  value={newItems}
                  onChange={(e) => setNewItems(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006c49]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 rounded-full bg-[#004328] text-white font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                {isHindi ? 'खाता खोलें और जोड़ें' : 'Open Khata Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
