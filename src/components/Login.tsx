import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Leaf, ShieldCheck, Activity, ArrowRight, UserCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'farmer' | 'officer' | 'buyer') => void;
  lang?: 'en' | 'ml';
}

export default function Login({ onLogin, lang = 'en' }: LoginProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleLogin = (role: 'farmer' | 'officer' | 'buyer') => {
    setIsAnimating(true);
    setTimeout(() => {
      onLogin(role);
    }, 500);
  };

  const t = {
    en: {
      title: "Welcome to AgriSentinel",
      subtitle: "Kerala's First AI-Driven One Health Surveillance System",
      selectRole: "Please select your role to continue",
      farmer: "Farmer Portal",
      farmerDesc: "Access notifications, market insights, and report crop health.",
      officer: "Agricultural Officer",
      officerDesc: "Access regional monitoring, heat maps, and verified reports.",
      buyer: "Buyer Portal",
      buyerDesc: "Explore the Agri Exchange to reserve bulk crops from verified farmers."
    },
    ml: {
      title: "അഗ്രിസെന്റിനലിലേക്ക് സ്വാഗതം",
      subtitle: "കേരളത്തിലെ ആദ്യത്തെ AI നിയന്ത്രിത വൺ ഹെൽത്ത് നിരീക്ഷണ സംവിധാനം",
      selectRole: "തുടരാൻ നിങ്ങളുടെ റോൾ തിരഞ്ഞെടുക്കുക",
      farmer: "കർഷക പോർട്ടൽ",
      farmerDesc: "അറിയിപ്പുകൾ, വിപണി വിവരങ്ങൾ എന്നിവ ആക്സസ് ചെയ്യുക.",
      officer: "കൃഷി ഓഫീസർ",
      officerDesc: "പ്രാദേശിക നിരീക്ഷണവും ഹീറ്റ് മാപ്പുകളും പരിശോധിക്കുക.",
      buyer: "വാങ്ങുന്നവരുടെ പോർട്ടൽ",
      buyerDesc: "വിശ്വസനീയ കർഷകരിൽ നിന്ന് വിളകൾ റിസർവ് ചെയ്യാൻ അഗ്രി എക്സ്ചേഞ്ച് സന്ദർശിക്കുക."
    }
  }[lang];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 selection:bg-emerald-500/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isAnimating ? 0 : 1, y: isAnimating ? -20 : 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-zinc-950 border border-zinc-900 overflow-hidden rounded-3xl"
      >
        <div className="p-10 border-b border-zinc-900 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
            <Activity className="text-black" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
          <p className="text-zinc-500">{t.subtitle}</p>
        </div>

        <div className="p-10 bg-zinc-900/30">
          <p className="text-center text-zinc-400 mb-8 font-medium">{t.selectRole}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => handleLogin('farmer')}
              className="group p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-emerald-500/50 hover:bg-zinc-800 transition-all text-left flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                <Leaf className="text-emerald-500" size={24} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                {t.farmer} <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-all text-emerald-500" />
              </h2>
              <p className="text-sm text-zinc-500 flex-1">{t.farmerDesc}</p>
              
              <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center gap-2 text-xs text-zinc-400">
                <UserCircle size={14} className="text-emerald-500" /> Demo Farmer Account
              </div>
            </button>

            <button
              onClick={() => handleLogin('officer')}
              className="group p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-blue-500/50 hover:bg-zinc-800 transition-all text-left flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                <ShieldCheck className="text-blue-500" size={24} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                {t.officer} <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-all text-blue-500" />
              </h2>
              <p className="text-sm text-zinc-500 flex-1">{t.officerDesc}</p>
              
              <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center gap-2 text-xs text-zinc-400">
                <UserCircle size={14} className="text-blue-500" /> Demo Officer Account
              </div>
            </button>

            <button
              onClick={() => handleLogin('buyer')}
              className="group p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-amber-500/50 hover:bg-zinc-800 transition-all text-left flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
                {/* Reusing ShoppingBag isn't strictly necessary, maybe another icon or Leaf/User? Let's use Activity since lucide isn't fully imported here, oops I need to use UserCircle or another imported icon. The file only imports Leaf, ShieldCheck, Activity, ArrowRight, UserCircle. Let's use UserCircle for buyer too, or just Activity. Let's use UserCircle.*/}
                <UserCircle className="text-amber-500" size={24} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                {t.buyer} <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-all text-amber-500" />
              </h2>
              <p className="text-sm text-zinc-500 flex-1">{t.buyerDesc}</p>
              
              <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center gap-2 text-xs text-zinc-400">
                <UserCircle size={14} className="text-amber-500" /> Demo Buyer Account
              </div>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
