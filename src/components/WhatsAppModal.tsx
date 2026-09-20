import React, { useState } from 'react';
import { CustomerUdhaar, Language } from '../types';

interface WhatsAppModalProps {
  customer: CustomerUdhaar | null;
  onClose: () => void;
  onSend: (name: string, amount: string) => void;
  language: Language;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  customer,
  onClose,
  onSend,
  language,
}) => {
  const [tone, setTone] = useState<'friendly' | 'formal' | 'urgent'>('friendly');

  if (!customer) return null;

  const formattedAmount = `₹${customer.amount.toLocaleString('en-IN')}`;

  const messages = {
    friendly: `नमस्ते ${customer.name} जी! आशा है आप कुशल मंगल हैं। शर्मा जनरल स्टोर से आपके खाते का कुल बकाया ${formattedAmount} है। सुविधानुसार UPI द्वारा चुकता कर दें। धन्यवाद! 🙏 UPI: sharmastore@upi`,
    formal: `प्रिय ${customer.name} जी, शर्मा जनरल स्टोर की खाता बही के अनुसार आपका बकाया ${formattedAmount} (${customer.itemsSummary}) है। कृपया इसे शीघ्र क्लियर करने का कष्ट करें। धन्यवाद।`,
    urgent: `सादर ${customer.name}, आपका बकाया ${formattedAmount} पिछले ${customer.daysOverdue} दिनों से लंबित है। नए स्टॉक बिल क्लीयरेंस हेतु कृपया आज ही भुगतान करें। UPI Link: upi://pay?pa=sharmastore@upi&am=${customer.amount}`,
  };

  const handleSendWhatsApp = () => {
    onSend(customer.name, formattedAmount);
    const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(messages[tone]);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-5 flex flex-col gap-4 shadow-2xl border border-slate-200 animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[20px]">chat</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {language === 'en' ? 'WhatsApp Udhaar Reminder' : 'व्हाट्सएप तकाजा संदेश'}
              </h3>
              <span className="text-xs text-slate-500">{customer.name} • {customer.phone}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Due amount badge */}
        <div className="bg-[#ffdad6]/40 border border-[#ffdad6] p-3 rounded-xl flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#ba1a1a] uppercase">
              {customer.daysOverdue} {language === 'en' ? 'Days Overdue' : 'दिन बकाया'}
            </span>
            <span className="text-xs text-slate-600">{customer.itemsSummary}</span>
          </div>
          <span className="text-xl font-bold font-mono text-[#ba1a1a]">{formattedAmount}</span>
        </div>

        {/* Tone Selector */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            {language === 'en' ? 'Message Tone (भाषा शैली)' : 'संदेश की शैली'}
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setTone('friendly')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                tone === 'friendly' ? 'bg-[#006c49] text-white' : 'text-slate-600'
              }`}
            >
              {language === 'en' ? 'Friendly' : 'मित्रवत'}
            </button>
            <button
              type="button"
              onClick={() => setTone('formal')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                tone === 'formal' ? 'bg-[#006c49] text-white' : 'text-slate-600'
              }`}
            >
              {language === 'en' ? 'Polite' : 'विनम्र'}
            </button>
            <button
              type="button"
              onClick={() => setTone('urgent')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                tone === 'urgent' ? 'bg-[#ba1a1a] text-white' : 'text-slate-600'
              }`}
            >
              {language === 'en' ? 'Urgent' : 'आवश्यक'}
            </button>
          </div>
        </div>

        {/* Message Preview Box */}
        <div className="bg-emerald-50/50 border border-emerald-200 p-3 rounded-xl">
          <span className="text-[10px] font-bold text-[#006c49] uppercase block mb-1">
            {language === 'en' ? 'Message Preview:' : 'संदेश का पूर्वावलोकन:'}
          </span>
          <p className="text-xs text-slate-700 leading-relaxed font-sans">
            {messages[tone]}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(messages[tone]);
              onSend(customer.name, 'Copied');
            }}
            className="flex-1 py-2.5 rounded-full border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 hover:bg-slate-50"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            {language === 'en' ? 'Copy Text' : 'कॉपी करें'}
          </button>
          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="flex-1 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            {language === 'en' ? 'Send on WhatsApp' : 'व्हाट्सएप भेजें'}
          </button>
        </div>
      </div>
    </div>
  );
};
