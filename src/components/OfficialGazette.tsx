import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Download, ExternalLink, Search, Filter, Calendar } from 'lucide-react';

export default function OfficialGazette({ lang }: { lang: 'en' | 'ml' }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const notifications = [
    {
      id: 1,
      title: lang === 'en' ? "Paddy Subsidy 2026 Guidelines" : "നെല്ല് സബ്‌സിഡി 2026 മാർഗ്ഗനിർദ്ദേശങ്ങൾ",
      ref: "G.O (P) No. 42/2026/AD",
      date: "2026-03-15",
      category: "Subsidy",
      desc: "Detailed guidelines for claiming the special monsoon paddy cultivation subsidy."
    },
    {
      id: 2,
      title: lang === 'en' ? "Rice Blast Management Protocol" : "കീട നിയന്ത്രണ പ്രോട്ടോക്കോൾ",
      ref: "Circular No. AG/55/24",
      date: "2026-03-20",
      category: "Technical",
      desc: "Standard operating procedure for the containment of Magnaporthe oryzae outbreaks."
    },
    {
      id: 3,
      title: lang === 'en' ? "Monsoon Crop Insurance Opening" : "മൺസൂൺ വിള ഇൻഷുറൻസ്",
      ref: "MS-450-INS",
      date: "2026-03-28",
      category: "Insurance",
      desc: "Notifications regarding the enrollment window for state-sponsored crop insurance."
    }
  ];

  const t = {
    en: {
      title: "Government Gazette",
      subtitle: "Official circulars, notifications, and technical protocols from the Dept. of Agriculture.",
      searchPlaceholder: "Search circulars...",
      download: "Download PDF",
      view: "View Full Info"
    },
    ml: {
      title: "ഗവൺമെന്റ് ഗസറ്റ്",
      subtitle: "കൃഷി വകുപ്പിൽ നിന്നുള്ള ഔദ്യോഗിക സർക്കുലറുകളും അറിയിപ്പുകളും.",
      searchPlaceholder: "അറിയിപ്പുകൾ തിരയുക...",
      download: "PDF ഡൗൺലോഡ് ചെയ്യുക",
      view: "വിവരങ്ങൾ കാണുക"
    }
  }[lang];

  const filtered = notifications.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <FileText size={160} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
        <p className="text-zinc-500 max-w-xl">{t.subtitle}</p>
        
        <div className="mt-8 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-emerald-500 transition-all outline-none"
            />
          </div>
          <button className="p-4 bg-zinc-800 border border-zinc-700 rounded-2xl text-zinc-400 hover:text-white transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={item.id}
            className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all"
          >
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 flex-shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[9px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded uppercase font-bold tracking-widest">{item.category}</span>
                    <span className="text-[9px] text-zinc-500 font-mono">{item.ref}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                  <p className="text-sm text-zinc-500 max-w-2xl">{item.desc}</p>
                </div>
              </div>
              
              <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-black font-bold rounded-xl text-xs hover:bg-emerald-400 transition-all">
                  <Download size={14} /> {t.download}
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 font-bold rounded-xl text-xs hover:bg-zinc-700 transition-all">
                  <ExternalLink size={14} /> {t.view}
                </button>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-zinc-800 flex items-center text-[10px] text-zinc-500 tracking-widest uppercase gap-4">
              <span className="flex items-center gap-1"><Calendar size={12} /> Issued: {item.date}</span>
              <span className="flex items-center gap-1"><FileText size={12} /> Format: PDF (1.2MB)</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
