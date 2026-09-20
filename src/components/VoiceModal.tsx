import React, { useState, useEffect } from 'react';
import { Language } from '../types';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveEntry: (entry: {
    name: string;
    amount: number;
    type: 'udhaar_out' | 'udhaar_in' | 'sale' | 'expense';
    description: string;
  }) => void;
  language: Language;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose,
  onSaveEntry,
  language,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [parsedData, setParsedData] = useState<{
    name: string;
    amount: number;
    type: 'udhaar_out' | 'udhaar_in' | 'sale' | 'expense';
    displayType: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsListening(true);
      setTranscribedText('');
      setParsedData(null);
    } else {
      setIsListening(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const samplePhrases = [
    { text: 'Ramesh ne 2500 udhaar liya', name: 'Ramesh', amount: 2500, type: 'udhaar_out' as const, displayType: 'Udhaar Diya (Debit)' },
    { text: 'Doodh wale ko 3000 diya', name: 'Amul Milk Supply', amount: 3000, type: 'expense' as const, displayType: 'Kharcha / Vendor Pay' },
    { text: 'Amit Gupta se 5000 udhaar mila', name: 'Amit Gupta', amount: 5000, type: 'udhaar_in' as const, displayType: 'Udhaar Collection' },
    { text: 'Cash Counter sale 1850 rupaye', name: 'Counter Sale', amount: 1850, type: 'sale' as const, displayType: 'Cash Sale' },
  ];

  const handleSelectSample = (phrase: typeof samplePhrases[0]) => {
    setIsListening(false);
    setTranscribedText(phrase.text);
    setParsedData({
      name: phrase.name,
      amount: phrase.amount,
      type: phrase.type,
      displayType: phrase.displayType,
    });
  };

  const handleCustomInput = (text: string) => {
    setTranscribedText(text);
    // Simple Kirana NLP parsing
    const lower = text.toLowerCase();
    const numbers = text.match(/\d+/g);
    const amount = numbers ? parseInt(numbers[0], 10) : 1000;

    let type: 'udhaar_out' | 'udhaar_in' | 'sale' | 'expense' = 'udhaar_out';
    let displayType = 'Udhaar Diya';
    let name = 'Customer';

    if (lower.includes('udhaar liya') || lower.includes('udhar')) {
      type = 'udhaar_out';
      displayType = 'Udhaar Diya (Debit)';
      const parts = text.split(/ne|ko|se/i);
      name = parts[0]?.trim() || 'Ramesh';
    } else if (lower.includes('udhaar mila') || lower.includes('jama')) {
      type = 'udhaar_in';
      displayType = 'Udhaar Collection (Credit)';
      const parts = text.split(/ne|ko|se/i);
      name = parts[0]?.trim() || 'Customer';
    } else if (lower.includes('diya') || lower.includes('bill') || lower.includes('rent')) {
      type = 'expense';
      displayType = 'Supplier / Overhead Payment';
      name = 'Vendor';
    } else {
      type = 'sale';
      displayType = 'Counter Sale';
      name = 'Counter Sale';
    }

    setParsedData({
      name,
      amount,
      type,
      displayType,
    });
  };

  const handleConfirm = () => {
    if (parsedData) {
      onSaveEntry({
        name: parsedData.name,
        amount: parsedData.amount,
        type: parsedData.type,
        description: transcribedText || `${parsedData.displayType}: ${parsedData.name}`,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#f8f9ff] rounded-t-2xl sm:rounded-2xl w-full max-w-md p-5 flex flex-col gap-4 shadow-2xl border border-slate-200 animate-in slide-in-from-bottom duration-200">
        <div className="w-10 h-1.5 bg-[#bfc9c0] rounded-full mx-auto sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-ping" />
            <h4 className="font-bold text-base sm:text-lg text-[#0b1c30]">
              {language === 'en' ? 'Vyapar Voice Assistant (Bolkar Likhein)' : 'व्यापार वॉइस सहायक (बोलकर लिखें)'}
            </h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#e5eeff] hover:bg-slate-200 flex items-center justify-center text-[#404942]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Mic Pulse Center */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col items-center justify-center gap-3 text-center shadow-sm">
          <div
            onClick={() => setIsListening(!isListening)}
            className={`w-16 h-16 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all ${
              isListening
                ? 'bg-[#0d5c3a] text-white ring-8 ring-[#6cf8bb]/40 animate-pulse scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[32px]">mic</span>
          </div>

          <div>
            <p className="font-bold text-sm text-[#0b1c30]">
              {isListening
                ? language === 'en'
                  ? 'Listening... Speak in Hindi, Hinglish, or English'
                  : 'सुन रहे हैं... हिंदी या हिंग्लिश में बोलें'
                : language === 'en'
                  ? 'Tap Mic to Speak or click below'
                  : 'बोलने के लिए माइक दबाएं या नीचे चुनें'}
            </p>
            <p className="text-xs text-[#404942] mt-0.5">
              {language === 'en'
                ? 'E.g., “Ramesh ne 2500 udhaar liya” or “Mohan se 1000 cash mila”'
                : 'उदा. “रमेश ने 2500 उधार लिया” या “अमित से 1000 नकद मिला”'}
            </p>
          </div>

          {/* Direct Text Input Fallback */}
          <div className="w-full mt-1">
            <input
              type="text"
              placeholder={language === 'en' ? 'Or type here: “Ramesh ne 2500 udhaar liya”' : 'या यहाँ लिखें...'}
              value={transcribedText}
              onChange={(e) => handleCustomInput(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#eff4ff] rounded-xl border border-slate-200 focus:outline-none focus:border-[#006c49]"
            />
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
            {language === 'en' ? 'Quick Test Phrases:' : 'त्वरित उदाहरण:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {samplePhrases.map((phrase, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(phrase)}
                className="px-2.5 py-1 rounded-full bg-[#e5eeff] hover:bg-[#dce9ff] text-slate-800 text-xs text-left transition-colors font-medium active:scale-95"
              >
                {phrase.text}
              </button>
            ))}
          </div>
        </div>

        {/* Detected Parsed Result Card */}
        {parsedData && (
          <div className="bg-[#6cf8bb]/20 border border-[#6cf8bb] p-3 rounded-xl flex items-center justify-between animate-in fade-in">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#006c49] uppercase tracking-wider">
                {language === 'en' ? 'AI Parsed Entry' : 'AI द्वारा पहचाना गया'}
              </span>
              <span className="font-bold text-sm text-slate-900">
                {parsedData.name}: ₹{parsedData.amount.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-600">
                {parsedData.displayType}
              </span>
            </div>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-4 py-2 rounded-full bg-[#006c49] hover:bg-[#005236] text-white font-bold text-xs shadow-md active:scale-95 transition-all"
            >
              {language === 'en' ? 'Confirm & Save' : 'पुष्टि करें और जोड़ें'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
