import React from 'react';
import { motion } from 'motion/react';
import { 
  Sprout, 
  ShieldCheck, 
  Zap, 
  Users, 
  ArrowRight, 
  Quote,
  Activity,
  CloudSun,
  ScanSearch,
  MessageSquare,
  ShoppingBag
} from 'lucide-react';

interface WelcomeDashboardProps {
  lang: 'en' | 'ml';
  userName?: string;
  onNavigate: (portal: any) => void;
}

export default function WelcomeDashboard({ lang, userName = "Ajay", onNavigate }: WelcomeDashboardProps) {
  const hour = new Date().getHours();
  
  const t = {
    en: {
      greeting: hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening",
      welcome: "Welcome to AgriSentinel AI",
      quote: "Agriculture is our wisest pursuit, because it will in the end contribute most to real wealth, good morals, and happiness.",
      quoteAuthor: "Thomas Jefferson",
      howItWorks: "How it Works",
      steps: [
        {
          title: "Report Signals",
          desc: "Farmers report crop health anomalies directly from the field.",
          icon: Sprout,
          color: "text-emerald-500",
          bg: "bg-emerald-500/10"
        },
        {
          title: "AI Analysis",
          desc: "Our agentic AI analyzes patterns to predict potential outbreaks.",
          icon: Zap,
          color: "text-amber-500",
          bg: "bg-amber-500/10"
        },
        {
          title: "Expert Verification",
          desc: "Agricultural officers verify reports and confirm disease cases.",
          icon: ShieldCheck,
          color: "text-blue-500",
          bg: "bg-blue-500/10"
        },
        {
          title: "Regional Action",
          desc: "Authorities issue advisories and manage regional responses.",
          icon: Users,
          color: "text-purple-500",
          bg: "bg-purple-500/10"
        }
      ],
      quickActions: "Quick Actions",
      actions: [
        { id: 'detect', label: 'Scan Disease', icon: ScanSearch, color: 'bg-rose-500' },
        { id: 'weather', label: 'Weather Forecast', icon: CloudSun, color: 'bg-blue-500' },
        { id: 'exchange', label: 'Agri Exchange', icon: ShoppingBag, color: 'bg-emerald-500' },
        { id: 'chat', label: 'Ask AI Assistant', icon: MessageSquare, color: 'bg-amber-500' }
      ]
    },
    ml: {
      greeting: hour < 12 ? "സുപ്രഭാതം" : hour < 17 ? "ശുഭദിനം" : "ശുഭസായാഹ്നം",
      welcome: "അഗ്രിസെന്റിനൽ AI-ലേക്ക് സ്വാഗതം",
      quote: "കൃഷി നമ്മുടെ ഏറ്റവും വിവേകപൂർണ്ണമായ പ്രവർത്തനമാണ്, കാരണം അത് ആത്യന്തികമായി യഥാർത്ഥ സമ്പത്തിനും നല്ല ധാർമ്മികതയ്ക്കും സന്തോഷത്തിനും ഏറ്റവും കൂടുതൽ സംഭാവന നൽകും.",
      quoteAuthor: "തോമസ് ജെഫേഴ്സൺ",
      howItWorks: "ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു",
      steps: [
        {
          title: "സിഗ്നലുകൾ റിപ്പോർട്ട് ചെയ്യുക",
          desc: "കർഷകർ പാടത്തുനിന്ന് നേരിട്ട് വിളകളുടെ ആരോഗ്യ പ്രശ്നങ്ങൾ റിപ്പോർട്ട് ചെയ്യുന്നു.",
          icon: Sprout,
          color: "text-emerald-500",
          bg: "bg-emerald-500/10"
        },
        {
          title: "AI വിശകലനം",
          desc: "രോഗബാധകൾ പ്രവചിക്കാൻ ഞങ്ങളുടെ AI പാറ്റേണുകൾ വിശകലനം ചെയ്യുന്നു.",
          icon: Zap,
          color: "text-amber-500",
          bg: "bg-amber-500/10"
        },
        {
          title: "വിദഗ്ദ്ധ പരിശോധന",
          desc: "ഉദ്യോഗസ്ഥർ റിപ്പോർട്ടുകൾ പരിശോധിച്ച് രോഗങ്ങൾ സ്ഥിരീകരിക്കുന്നു.",
          icon: ShieldCheck,
          color: "text-blue-500",
          bg: "bg-blue-500/10"
        },
        {
          title: "പ്രാദേശിക നടപടി",
          desc: "അധികൃതർ നിർദ്ദേശങ്ങൾ നൽകുകയും പ്രതിരോധ പ്രവർത്തനങ്ങൾ നിയന്ത്രിക്കുകയും ചെയ്യുന്നു.",
          icon: Users,
          color: "text-purple-500",
          bg: "bg-purple-500/10"
        }
      ],
      quickActions: "ദ്രുത നടപടികൾ",
      actions: [
        { id: 'detect', label: 'രോഗനിർണ്ണയം', icon: ScanSearch, color: 'bg-rose-500' },
        { id: 'weather', label: 'കാലാവസ്ഥ', icon: CloudSun, color: 'bg-blue-500' },
        { id: 'exchange', label: 'അഗ്രി എക്സ്ചേഞ്ച്', icon: ShoppingBag, color: 'bg-emerald-500' },
        { id: 'chat', label: 'AI സഹായം', icon: MessageSquare, color: 'bg-amber-500' }
      ]
    }
  }[lang];

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-8 md:p-12">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Sprout size={200} />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t.greeting}, <span className="text-emerald-500">{userName}</span>
            </h1>
            <p className="text-xl text-zinc-400 mb-8">
              {t.welcome}. Kerala's first AI-driven One Health surveillance system for agriculture.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => onNavigate('farmer')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all flex items-center gap-2"
              >
                Get Started <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => onNavigate('info')}
                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-all"
              >
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-2 bg-emerald-500/5 border border-emerald-500/10 p-8 rounded-3xl relative">
          <Quote className="absolute top-6 left-6 text-emerald-500/20" size={40} />
          <div className="relative z-10 pl-12">
            <p className="text-xl md:text-2xl font-serif italic text-zinc-200 mb-4 leading-relaxed">
              "{t.quote}"
            </p>
            <p className="text-emerald-500 font-bold">— {t.quoteAuthor}</p>
          </div>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Activity className="text-emerald-500" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">98.4%</h3>
          <p className="text-zinc-500 text-sm uppercase tracking-widest">Prediction Accuracy</p>
        </div>
      </section>

      {/* How it Works */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">{t.howItWorks}</h2>
          <div className="h-px bg-zinc-800 flex-1" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl group hover:border-zinc-700 transition-all"
            >
              <div className={`w-12 h-12 ${step.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <step.icon className={step.color} size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white">{t.quickActions}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {t.actions.map((action) => (
            <button
              key={action.id}
              onClick={() => onNavigate(action.id)}
              className="flex flex-col items-center justify-center p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-all gap-3"
            >
              <div className={`p-3 ${action.color} rounded-xl text-white`}>
                <action.icon size={24} />
              </div>
              <span className="text-sm font-bold text-zinc-300">{action.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
