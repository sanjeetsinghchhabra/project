import React from 'react';
import { ScreenTab, Language } from '../types';
import { translations } from '../data/mockData';

interface BottomNavProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  language,
}) => {
  const t = translations[language];

  const navItems: Array<{ tab: ScreenTab; label: string; icon: string }> = [
    { tab: 'dashboard', label: t.navHome, icon: 'dashboard' },
    { tab: 'cash-flow', label: t.navCashFlow, icon: 'payments' },
    { tab: 'udhaar-ledger', label: t.navUdhaar, icon: 'account_balance_wallet' },
    { tab: 'simulation', label: t.navWhatIf, icon: 'insights' },
    { tab: 'ai-copilot', label: t.navSahayak, icon: 'smart_toy' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#f8f9ff]/95 backdrop-blur-xl border-t border-[#e5eeff] shadow-[0_-2px_12px_rgba(0,0,0,0.04)] pb-safe">
      <div className="app-container flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const isActive = currentTab === item.tab;
          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => onSelectTab(item.tab)}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] transition-all ${
                isActive
                  ? 'text-[#004328] font-bold scale-105'
                  : 'text-[#404942] hover:text-[#0b1c30]'
              }`}
            >
              <span className={`material-symbols-outlined text-[22px] transition-transform ${isActive ? 'font-fill text-[#006c49]' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[11px] leading-tight font-medium">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#006c49] mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
