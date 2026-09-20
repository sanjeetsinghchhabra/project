import React, { useState } from 'react';
import { StoreProfile, CustomerUdhaar, PayableBill, Language } from '../types';

interface AISahayakScreenProps {
  currentStore: StoreProfile;
  customers: CustomerUdhaar[];
  payables: PayableBill[];
  onOpenVoiceModal: () => void;
  language: Language;
}

interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  actionButton?: {
    label: string;
    action: () => void;
  };
}

export const AISahayakScreen: React.FC<AISahayakScreenProps> = ({
  currentStore,
  customers,
  payables,
  onOpenVoiceModal,
  language,
}) => {
  const isHindi = language === 'hi';

  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: isHindi
        ? `नमस्ते राधेश्याम जी! मैं आपका व्यापार सहायक हूँ। आपकी दुकान के वित्तीय आंकड़ों का विश्लेषण करके मैं आपको सही समय पर सही सलाह देता हूँ। आप बोलकर या लिखकर मुझसे कुछ भी पूछ सकते हैं!`
        : `Namaste Radhey Shyam ji! I am your Vyapar Sahayak. I continuously analyze Sharma General Store's cash flow, supplier bills, and udhaar khata to guide your daily decisions. Ask me anything!`,
      time: '10:00 AM',
    }
  ]);

  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQuestions = [
    {
      q: isHindi ? 'क्या मैं आज ₹15,000 का सरसों तेल स्टॉक मंगा सकता हूँ?' : 'Can I buy ₹15,000 mustard oil stock today?',
      a: isHindi
        ? '⚠️ नहीं, अभी न खरीदें! गुरुवार को आपका बैलेंस ₹12,500 रह जाएगा (जो ₹20,000 की सुरक्षित सीमा से कम है)। अगर आप अभी ₹15,000 का तेल मंगाएंगे तो ओवरड्राफ्ट हो जाएगा। पहले राज शर्मा से ₹12,000 की वसूली करें, फिर शुक्रवार को ऑर्डर दें।'
        : '⚠️ Caution: Do NOT buy today! Your balance dips to ₹12,500 on Thursday against your ₹20,000 safe reserve. Adding a ₹15,000 stock purchase will cause an overdraft. Collect ₹12,000 from Raj Sharma first, then place this order on Friday.',
    },
    {
      q: isHindi ? 'इस हफ्ते का ₹7,500 का घाटा कैसे टालें?' : 'How to prevent this week\'s ₹7,500 cash shortage?',
      a: isHindi
        ? '💡 व्यापार सहायक समाधान:\n1. राज शर्मा (बकाया ₹12,000) को तुरंत व्हाट्सएप तकाजा भेजें - वे 92% विश्वसनीय हैं।\n2. अमित गुप्ता (बकाया ₹8,500) से आंशिक ₹5,000 प्राप्त करें।\n3. अमुल सप्लायर से 2 दिन की अतिरिक्त मोहलत लें।'
        : '💡 Vyapar Sahayak Action Plan:\n1. Send an urgent WhatsApp reminder to Raj Sharma (₹12,000 due, 92% reliability).\n2. Request partial ₹5,000 clearance from Amit Gupta.\n3. Request a 2-day payment buffer from Amul dairy distributor.',
    },
    {
      q: isHindi ? 'सबसे पहले किस ग्राहक से उधार मांगना चाहिए?' : 'Which customer should I collect from first?',
      a: isHindi
        ? '🎯 प्राथमिकता 1: राज शर्मा (₹12,000)।\nकारण: इनकी अकेले की वसूली आपके पूरे ₹7,500 के संभावित घाटे को खत्म कर देगी और इनका भुगतान रिकॉर्ड 92% उत्तम है।'
        : '🎯 Priority 1: Raj Sharma (₹12,000).\nReason: His single payment eliminates the entire ₹7,500 deficit alone, and he has a 92% on-call clearance probability.',
    },
    {
      q: isHindi ? 'अगले हफ्ते कौन से बड़े खर्चे आने वाले हैं?' : 'What major payments are due next week?',
      a: isHindi
        ? '📋 आगामी देयताएं:\n• अमुल व आईटीसी सप्लायर: ₹18,000 (3 दिन में)\n• दुकान का किराया: ₹8,000 (1 अप्रैल)\n• एबीसी होलसेल: ₹5,000 (कल)\nकुल देय: ₹31,000'
        : '📋 Upcoming Outflows:\n• Amul & ITC Supplier: ₹18,000 (in 3 days)\n• Shop Rent: ₹8,000 (1st April)\n• ABC Wholesale: ₹5,000 (Tomorrow)\nTotal dues: ₹31,000',
    },
  ];

  const handleSendQuestion = (question: string, predefinedAnswer?: string) => {
    if (!question.trim()) return;

    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: question,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setUserInput('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = predefinedAnswer;
      if (!replyText) {
        const lower = question.toLowerCase();
        if (lower.includes('udhaar') || lower.includes('credit') || lower.includes('collection')) {
          replyText = isHindi
            ? 'आपके पास 7 ग्राहकों से कुल ₹38,500 उधार बकाया है। इनमें से राज शर्मा (₹12k) और अमित गुप्ता (₹8.5k) से आज वसूली करना सबसे असरदार रहेगा।'
            : 'You have ₹38,500 in outstanding credit across 7 customers. Collecting from Raj Sharma (₹12k) and Amit Gupta (₹8.5k) will immediately stabilize your reserves.';
        } else if (lower.includes('cash') || lower.includes('paisa') || lower.includes('balance')) {
          replyText = isHindi
            ? `आपकी दुकान में वर्तमान उपलब्ध नकदी ₹${currentStore.currentCash.toLocaleString('en-IN')} है। सुरक्षित रिज़र्व सीमा ₹${currentStore.minSafeReserve.toLocaleString('en-IN')} है।`
            : `Current available cash is ₹${currentStore.currentCash.toLocaleString('en-IN')}, with a minimum safe operating threshold of ₹${currentStore.minSafeReserve.toLocaleString('en-IN')}.`;
        } else {
          replyText = isHindi
            ? `शर्मा जनरल स्टोर के डेटा के अनुसार, आपकी दैनिक काउंटर बिक्री औसतन ₹4,500-₹6,000 है। गुरुवार के सप्लायर भुगतान से पहले ₹8,500 की वसूली करना अनिवार्य है।`
            : `Based on Sharma General Store's financial velocity, your daily sales average ₹4,500-₹6,000. Prioritize collecting ₹8,500 before Thursday's ₹18k supplier batch.`;
        }
      }

      const botMsg: AIChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="app-container flex flex-col px-3 sm:px-4 gap-3.5 pb-24 selection:bg-[#a9f3c5]">
      {/* Top Banner with Mic shortcut */}
      <section className="w-full mt-2">
        <div className="bg-[#004328] text-white rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#6cf8bb] text-[#004328] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">smart_toy</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {isHindi ? 'व्यापार AI सह-पायलट' : 'Vyapar AI Co-Pilot'}
              </h2>
              <span className="text-[11px] text-[#a9f3c5]">
                {isHindi ? 'किराना वित्तीय डॉक्टर' : 'Kirana Financial Intelligence'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenVoiceModal}
            className="px-3 py-1.5 rounded-full bg-[#0d5c3a] hover:bg-[#002111] text-white text-xs font-bold flex items-center gap-1.5 border border-[#a9f3c5]/30 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-[#6cf8bb]">mic</span>
            <span>{isHindi ? 'बोलकर पूछें' : 'Voice Entry'}</span>
          </button>
        </div>
      </section>

      {/* Suggested Questions Grid */}
      <section className="flex flex-col gap-1.5">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          {isHindi ? 'अक्सर पूछे जाने वाले वित्तीय प्रश्न' : 'Frequent Store Queries'}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {suggestedQuestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendQuestion(item.q, item.a)}
              className="p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 text-left transition-all shadow-sm flex items-start gap-2 group active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[#006c49] text-[18px] mt-0.5 group-hover:scale-110 transition-transform">
                help_outline
              </span>
              <span className="text-xs font-medium text-slate-800 leading-snug">
                {item.q}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Chat Conversation Stream */}
      <section className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex flex-col gap-3 min-h-[260px] max-h-[420px] overflow-y-auto">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#004328] text-white rounded-br-none'
                  : 'bg-[#eff4ff] text-slate-900 border border-slate-100 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>
              <span
                className={`block text-[9px] mt-1 text-right ${
                  msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                }`}
              >
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 p-2 bg-[#eff4ff] rounded-xl w-24">
            <span className="w-1.5 h-1.5 bg-[#006c49] rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-[#006c49] rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1.5 h-1.5 bg-[#006c49] rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </div>
        )}
      </section>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendQuestion(userInput);
        }}
        className="flex items-center gap-2 bg-white p-1.5 rounded-full border border-slate-200 shadow-sm"
      >
        <button
          type="button"
          onClick={onOpenVoiceModal}
          className="w-9 h-9 rounded-full bg-[#eff4ff] hover:bg-[#e5eeff] text-[#004328] flex items-center justify-center flex-shrink-0"
          title="Voice query"
        >
          <span className="material-symbols-outlined text-[20px]">mic</span>
        </button>

        <input
          type="text"
          placeholder={isHindi ? 'दुकान के खातों के बारे में पूछें...' : 'Ask about store cash, suppliers, or bills...'}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-1 px-2 py-1.5 text-xs bg-transparent focus:outline-none text-slate-800"
        />

        <button
          type="submit"
          disabled={!userInput.trim()}
          className="w-9 h-9 rounded-full bg-[#004328] disabled:bg-slate-300 text-white flex items-center justify-center flex-shrink-0 transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
        </button>
      </form>
    </div>
  );
};
