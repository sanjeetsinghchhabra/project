import React from 'react';

interface ToastProps {
  message: string;
  icon?: string;
  visible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, icon = 'check_circle', visible }) => {
  if (!visible) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-top-4">
      <div className="bg-[#213145] text-[#eaf1ff] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-slate-700 max-w-[90vw]">
        <span className="material-symbols-outlined text-[20px] text-[#6ffbbe]">{icon}</span>
        <span className="text-xs font-medium truncate">{message}</span>
      </div>
    </div>
  );
};
