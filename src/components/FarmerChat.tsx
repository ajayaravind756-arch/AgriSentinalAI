import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Trash2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { chatWithAgriAI } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export default function FarmerChat({ lang }: { lang: 'en' | 'ml' }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = {
    en: {
      welcome: "Hello! I'm your AgriSense AI Kerala Assistant. How can I help you with your crops today?",
      placeholder: "Ask about crop diseases, treatments, or farming tips...",
      status: "System Online",
      thinking: "AgriSense is thinking...",
      clear: "Clear Chat",
      suggestions: [
        "How to treat rice blast disease?",
        "Current market price for wheat?",
        "Best organic fertilizers for soil?",
        "Latest government schemes for farmers?"
      ]
    },
    ml: {
       welcome: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ അഗ്രിസെൻസ് കേരള AI അസിസ്റ്റന്റ് ആണ്. ഇന്ന് നിങ്ങളുടെ കൃഷിയെക്കുറിച്ച് എനിക്ക് എങ്ങനെ സഹായിക്കാനാകും?",
       placeholder: "രോഗങ്ങൾ, ചികിത്സകൾ, കൃഷി ടിപ്പുകൾ എന്നിവ ചോദിക്കൂ...",
       status: "സിസ്റ്റം ഓൺ‌ലൈൻ",
       thinking: "അഗ്രിസെൻസ് ചിന്തിക്കുന്നു...",
       clear: "ചാറ്റ് ക്ലിയർ ചെയ്യുക",
       suggestions: [
        "നെല്ലിലുണ്ടാകുന്ന രോഗങ്ങളെ എങ്ങനെ ചികിത്സിക്കാം?",
        "നെല്ലിന്റെ ഇന്നത്തെ വിപണി വില എത്രയാണ്?",
        "മണ്ണിന് ഏറ്റവും അനുയോജ്യമായ ജൈവ വളങ്ങൾ ഏതാണ്?",
        "കർഷകർക്കായുള്ള പുതിയ സർക്കാർ പദ്ധതികൾ ഏതെല്ലാം?"
       ]
    }
  }[lang];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // Format history for Gemini API
      const history = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const response = await chatWithAgriAI(currentInput, history, lang);
      
      const aiMessage: Message = {
        role: 'model',
        text: response || "I'm sorry, I'm having trouble connecting right now.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-[#0a0a0a] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tighter uppercase leading-none text-white">AgriSense <span className="text-emerald-500">AI</span></h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{t.status}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
          title={t.clear}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-600/10 rounded-3xl flex items-center justify-center border border-emerald-500/20">
              <Sparkles className="w-10 h-10 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-bold tracking-tight uppercase text-white">AgriSense Intelligence</h4>
              <p className="text-sm text-zinc-500 max-w-xs mx-auto uppercase tracking-widest font-bold">
                {t.welcome}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md pt-4">
              {t.suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(suggestion)}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-400 hover:bg-white/10 hover:border-emerald-500/30 transition-all text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                msg.role === 'user' ? "bg-white text-black" : "bg-emerald-600 text-white"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={cn(
                "max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed",
                msg.role === 'user' 
                  ? "bg-white/10 text-white rounded-tr-none border border-white/10" 
                  : "bg-emerald-600/10 text-zinc-200 rounded-tl-none border border-emerald-500/20"
              )}>
                <div className="prose prose-sm prose-invert prose-emerald max-w-none">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                <div className={cn(
                  "mt-3 text-[9px] font-bold uppercase tracking-widest opacity-50",
                  msg.role === 'user' ? "text-right" : "text-left"
                )}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4"
          >
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-emerald-600/10 p-5 rounded-3xl rounded-tl-none border border-emerald-500/20 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">{t.thinking}</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-white/5 bg-white/5">
        <div className="relative flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.placeholder}
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-white outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={cn(
              "p-4 rounded-2xl transition-all shadow-lg",
              !input.trim() || isTyping
                ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                : "bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-500 active:scale-95"
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
