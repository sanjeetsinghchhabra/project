import React, { useState } from 'react';
import { StoreProfile, Language } from '../types';
import { alternateStores } from '../data/mockData';

interface HeaderProps {
  currentStore: StoreProfile;
  onSelectStore: (store: StoreProfile) => void;
  language: Language;
  onToggleLanguage: () => void;
  onOpenNotifications: () => void;
  unreadAlertsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentStore,
  onSelectStore,
  language,
  onToggleLanguage,
  onOpenNotifications,
  unreadAlertsCount,
}) => {
  const [storeMenuOpen, setStoreMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 w-full z-40 bg-[#f8f9ff]/90 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.03)] border-b border-[#e5eeff]">
      <div className="app-container h-16 px-3 sm:px-4 flex items-center justify-between gap-2">
        {/* Left: Logo & Store Selector */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <img
            alt="VyaparPulse Logo"
            className="h-8 w-auto object-contain flex-shrink-0 cursor-pointer"
            src="https://lh3.googleusercontent.com/aida/AEtjO1X2KKkK85qxd7sxoxnv_abxeAHLji1YgdYNuVMWn7mZpWe3sAxm-wp8ernppjPlzKIQ1FRkCSRmknjJGd5qsUVZY9TZnQIYvWaXR7E0JpkyYG-6bq37jCXKWrvFRyVHgjFyzhS-HTVAEYLEAzRV7Vwbp92PRmgNweZvc2W3TMFi3ZWc-pml8lMawt0q56Najbbci5RsgF9VtGE5I-TujYM9Ii7mvow_Yv_k0_ByUE-RfGj5AkasWTXMQe8"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-[19px] sm:text-[21px] text-[#004328] tracking-tight leading-none truncate">
              {language === 'en' ? 'VyaparPulse' : 'व्यापारपल्स'}
            </span>
            <div className="relative mt-0.5">
              <button
                type="button"
                onClick={() => setStoreMenuOpen(!storeMenuOpen)}
                className="flex items-center gap-1 text-[#404942] hover:text-[#0b1c30] transition-colors text-xs font-semibold"
                title="Switch Store"
              >
                <span className="material-symbols-outlined text-[13px] text-[#004328]">storefront</span>
                <span className="font-mono text-[12px] truncate max-w-[130px] sm:max-w-[200px]">
                  {currentStore.name}
                </span>
                <span className="material-symbols-outlined text-[14px]">
                  {storeMenuOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                </span>
              </button>

              {/* Store Switcher Dropdown */}
              {storeMenuOpen && (
                <div className="absolute top-7 left-0 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                    {language === 'en' ? 'Your Stores / Branches' : 'आपकी दुकानें / शाखाएं'}
                  </div>
                  {alternateStores.map((store) => (
                    <button
                      key={store.id}
                      type="button"
                      onClick={() => {
                        onSelectStore(store);
                        setStoreMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                        store.id === currentStore.id
                          ? 'bg-[#e5eeff] text-[#004328] font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{store.name}</span>
                        <span className="text-[10px] text-slate-500">{store.location}</span>
                      </div>
                      {store.id === currentStore.id && (
                        <span className="material-symbols-outlined text-[16px] text-[#004328]">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Language Toggle */}
          <button
            aria-label="Toggle Language"
            type="button"
            onClick={onToggleLanguage}
            className="h-8 sm:h-9 px-2.5 rounded-full bg-[#eff4ff] hover:bg-[#e5eeff] flex items-center justify-center gap-1 transition-colors active:scale-95"
            title="Switch Language"
          >
            <span className={`text-[11px] font-bold ${language === 'en' ? 'text-[#004328]' : 'text-slate-400'}`}>
              EN
            </span>
            <span className="text-slate-300 text-xs">|</span>
            <span className={`text-[11px] font-bold ${language === 'hi' ? 'text-[#004328]' : 'text-slate-400'}`}>
              हिंदी
            </span>
          </button>

          {/* Notifications Trigger */}
          <button
            aria-label="Notifications"
            type="button"
            onClick={onOpenNotifications}
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#404942] hover:bg-[#eff4ff] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px] sm:text-[22px]">notifications</span>
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#ba1a1a] ring-2 ring-white"></span>
            )}
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-8 h-8 rounded-full bg-[#004328] flex items-center justify-center shadow-sm text-white hover:opacity-90 active:scale-95 transition-all"
              title="Merchant Profile"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-10 w-60 bg-white rounded-xl shadow-xl border border-slate-100 p-3 z-50">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-[#004328] text-white flex items-center justify-center font-bold text-sm">
                    {currentStore.ownerName.charAt(0)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-xs text-slate-900 truncate">{currentStore.ownerName}</span>
                    <span className="text-[10px] text-slate-500 truncate">{currentStore.phone}</span>
                  </div>
                </div>
                <div className="py-2 flex flex-col gap-1 text-xs text-slate-700">
                  <div className="flex justify-between py-1 text-[11px]">
                    <span className="text-slate-500">Min Safe Reserve:</span>
                    <span className="font-mono font-bold text-[#004328]">₹{currentStore.minSafeReserve.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1 text-[11px]">
                    <span className="text-slate-500">Active Register:</span>
                    <span className="font-bold text-emerald-600">Online</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setProfileOpen(false)}
                  className="w-full py-1.5 mt-1 text-center bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
