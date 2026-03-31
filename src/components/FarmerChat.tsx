import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getFarmerChatResponse } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function FarmerChat({ lang }: { lang: 'en' | 'ml' }) {
  const t = {
    en: {
      welcome: "Hello! I'm your AgriSense Kerala Assistant. How can I help you with your crops today? You can ask about symptoms, treatments, or farming advice.",
      placeholder: "Ask about crop diseases, treatments, or farming tips...",
      assistant: "AgriSense Assistant",
      status: "AI Powered",
      error: "I'm sorry, I'm having trouble connecting right now. Please try again later."
    },
    ml: {
      welcome: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ അഗ്രിസെൻസ് കേരള അസിസ്റ്റന്റ് ആണ്. ഇന്ന് നിങ്ങളുടെ കൃഷിയെക്കുറിച്ച് എനിക്ക് എങ്ങനെ സഹായിക്കാനാകും? രോഗലക്ഷണങ്ങൾ, ചികിത്സകൾ അല്ലെങ്കിൽ കൃഷി ഉപദേശങ്ങൾ എന്നിവയെക്കുറിച്ച് നിങ്ങൾക്ക് ചോദിക്കാം.",
      placeholder: "രോഗങ്ങൾ, ചികിത്സകൾ, കൃഷി ടിപ്പുകൾ എന്നിവ ചോദിക്കൂ...",
      assistant: "അഗ്രിസെൻസ് അസിസ്റ്റന്റ്",
      status: "AI പവർഡ്",
      error: "ക്ഷമിക്കണം, എനിക്ക് ഇപ്പോൾ കണക്റ്റുചെയ്യാൻ കഴിയുന്നില്ല. ദയവായി പിന്നീട് ശ്രമിക്കുക."
    }
  }[lang];

  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: t.welcome }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ role: 'model', text: t.welcome }]);
  }, [lang]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await getFarmerChatResponse(userMsg, history, lang);
    
    setMessages(prev => [...prev, { role: 'model', text: response || t.error }]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[700px] flex flex-col bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm">
      {/* Chat Header */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <Bot className="text-emerald-500" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-white">{t.assistant}</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{t.status}</span>
            </div>
          </div>
        </div>
        <Sparkles className="text-amber-500/50" size={20} />
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-zinc-800' : 'bg-emerald-500/10'
                }`}>
                  {msg.role === 'user' ? <User size={16} className="text-zinc-400" /> : <Bot size={16} className="text-emerald-500" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-zinc-700/50'
                }`}>
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-emerald-500" />
              </div>
              <div className="bg-zinc-800 p-4 rounded-2xl rounded-tl-none border border-zinc-700/50">
                <Loader2 className="text-emerald-500 animate-spin" size={20} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 border-t border-zinc-800 bg-zinc-900/80">
        <div className="relative flex items-center">
          <input 
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={t.placeholder}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-4 pl-4 pr-14 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-black rounded-lg transition-all"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[10px] text-zinc-500 text-center mt-3 uppercase tracking-widest">
          Powered by Gemini 3 Flash • AgriSense Kerala
        </p>
      </form>
    </div>
  );
}
