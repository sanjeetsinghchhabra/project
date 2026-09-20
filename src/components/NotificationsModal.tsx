import React from 'react';
import { Language } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  const isHindi = language === 'hi';

  const alerts = [
    {
      id: 'n-1',
      title: isHindi ? 'कैश की कमी की चेतावनी' : 'Cash Shortage Predicted',
      desc: isHindi ? 'गुरुवार को ₹7,500 की संभावित कमी होगी। अभी 3 ग्राहकों से वसूली करें।' : 'Potential ₹7,500 shortfall in 5 days before inventory restocking.',
      time: '15m ago',
      type: 'critical',
      icon: 'warning',
    },
    {
      id: 'n-2',
      title: isHindi ? 'सप्लायर भुगतान कल देय' : 'Supplier Due Tomorrow',
      desc: isHindi ? 'ABC Wholesale: ₹5,000 (आटा और चीनी कंसाइनमेंट)' : 'ABC Wholesale: ₹5,000 consignment due tomorrow via UPI.',
      time: '1h ago',
      type: 'warning',
      icon: 'local_shipping',
    },
    {
      id: 'n-3',
      title: isHindi ? 'स्टॉक अलर्ट: मैगी नूडल्स' : 'Critical Stock Alert',
      desc: isHindi ? 'शेल्फ पर केवल 12 पैकेट शेष (2.4 दिन का स्टॉक)' : 'Maggi 2-Min Noodles: Only 12 packs remaining on shelf.',
      time: '3h ago',
      type: 'warning',
      icon: 'inventory_2',
    },
    {
      id: 'n-4',
      title: isHindi ? 'राज शर्मा का बकाया' : 'Khata Aging Alert',
      desc: isHindi ? '₹12,000 का उधार 9 दिनों से बकाया है।' : 'Raj Sharma: ₹12,000 is now 9 days overdue.',
      time: 'Today',
      type: 'info',
      icon: 'person_alert',
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#f8f9ff] rounded-t-2xl sm:rounded-2xl w-full max-w-md p-5 flex flex-col gap-3 shadow-2xl border border-slate-200 animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#004328]">notifications</span>
            <h3 className="font-bold text-base text-slate-900">
              {isHindi ? 'दुकान की सूचनाएं' : 'Store Alerts & Notifications'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
          {alerts.map((a) => (
            <div
              key={a.id}
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                a.type === 'critical'
                  ? 'bg-red-50/80 border-red-200'
                  : a.type === 'warning'
                  ? 'bg-amber-50/70 border-amber-200'
                  : 'bg-white border-slate-100'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] mt-0.5 ${
                  a.type === 'critical' ? 'text-red-600' : a.type === 'warning' ? 'text-amber-600' : 'text-blue-600'
                }`}
              >
                {a.icon}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{a.title}</span>
                  <span className="text-[10px] text-slate-400">{a.time}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors"
        >
          {isHindi ? 'बंद करें' : 'Mark All As Read'}
        </button>
      </div>
    </div>
  );
};
