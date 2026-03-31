import React, { useState } from 'react';
import { KERALA_DISTRICTS, CROPS, KERALA_DISTRICTS_ML } from '../constants';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function FarmerPortal({ lang }: { lang: 'en' | 'ml' }) {
  const t = {
    en: {
      title: "Crop Health Report",
      subtitle: "Submit crop health signals for early disease detection.",
      district: "District",
      selectDistrict: "Select District",
      cropType: "Crop Type",
      symptoms: "Symptoms Observed",
      symptomsPlaceholder: "Describe leaf spots, wilting, root rot, pests, etc.",
      yieldImpact: "Significant impact on expected yield or crop growth",
      contact: "Contact Number",
      contactPlaceholder: "+91 XXXXX XXXXX",
      submit: "Submit Crop Health Report",
      submitting: "Submitting...",
      success: "Report Submitted"
    },
    ml: {
      title: "വിള ആരോഗ്യ റിപ്പോർട്ട്",
      subtitle: "രോഗങ്ങൾ നേരത്തെ കണ്ടെത്തുന്നതിനായി വിള ആരോഗ്യ സൂചനകൾ സമർപ്പിക്കുക.",
      district: "ജില്ല",
      selectDistrict: "ജില്ല തിരഞ്ഞെടുക്കുക",
      cropType: "വിളയുടെ ഇനം",
      symptoms: "നിരീക്ഷിച്ച ലക്ഷണങ്ങൾ",
      symptomsPlaceholder: "ഇലകളിലെ പുള്ളികൾ, വാട്ടം, വേര് ചീഞ്ഞഴുകൽ, കീടങ്ങൾ തുടങ്ങിയവ വിവരിക്കുക.",
      yieldImpact: "പ്രതീക്ഷിക്കുന്ന വിളവിനെയോ വിള വളർച്ചയെയോ കാര്യമായി ബാധിക്കുന്നു",
      contact: "ബന്ധപ്പെടാനുള്ള നമ്പർ",
      contactPlaceholder: "+91 XXXXX XXXXX",
      submit: "വിള ആരോഗ്യ റിപ്പോർട്ട് സമർപ്പിക്കുക",
      submitting: "സമർപ്പിക്കുന്നു...",
      success: "റിപ്പോർട്ട് സമർപ്പിച്ചു"
    }
  }[lang];

  const [formData, setFormData] = useState({
    district: '',
    cropType: 'Paddy',
    symptoms: '',
    yieldImpact: false,
    contact: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
        setFormData({ district: '', cropType: 'Paddy', symptoms: '', yieldImpact: false, contact: '' });
      }
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl backdrop-blur-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">{t.title}</h2>
        <p className="text-zinc-400">{t.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{t.district}</label>
            <select 
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={formData.district}
              onChange={e => setFormData({...formData, district: e.target.value})}
            >
              <option value="">{t.selectDistrict}</option>
              {KERALA_DISTRICTS.map(d => <option key={d} value={d}>{lang === 'ml' ? KERALA_DISTRICTS_ML[d as keyof typeof KERALA_DISTRICTS_ML] : d}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{t.cropType}</label>
            <select 
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={formData.cropType}
              onChange={e => setFormData({...formData, cropType: e.target.value})}
            >
              {CROPS.map(c => <option key={c.id} value={c.name}>{lang === 'ml' ? c.name_ml : c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{t.symptoms}</label>
          <textarea 
            required
            placeholder={t.symptomsPlaceholder}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white h-32 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
            value={formData.symptoms}
            onChange={e => setFormData({...formData, symptoms: e.target.value})}
          />
        </div>

        <div className="flex items-center gap-3 p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/50">
          <input 
            type="checkbox" 
            id="prod"
            className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
            checked={formData.yieldImpact}
            onChange={e => setFormData({...formData, yieldImpact: e.target.checked})}
          />
          <label htmlFor="prod" className="text-sm text-zinc-300 cursor-pointer">
            {t.yieldImpact}
          </label>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{t.contact}</label>
          <input 
            type="tel"
            required
            placeholder={t.contactPlaceholder}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={formData.contact}
            onChange={e => setFormData({...formData, contact: e.target.value})}
          />
        </div>

        <button 
          disabled={status !== 'idle'}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            status === 'success' ? 'bg-emerald-500 text-white' : 'bg-white text-black hover:bg-zinc-200'
          }`}
        >
          {status === 'submitting' ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-zinc-400 border-t-zinc-900 rounded-full" />
          ) : status === 'success' ? (
            <><CheckCircle2 size={20} /> {t.success}</>
          ) : (
            <><Send size={20} /> {t.submit}</>
          )}
        </button>
      </form>
    </div>
  );
}
