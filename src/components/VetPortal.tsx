import React, { useState } from 'react';
import { KERALA_DISTRICTS, KERALA_DISTRICTS_ML } from '../constants';
import { ClipboardCheck, CheckCircle2, MapPin, Stethoscope } from 'lucide-react';
import { motion } from 'motion/react';

export default function VetPortal({ lang }: { lang: 'en' | 'ml' }) {
  const t = {
    en: {
      title: "Agricultural Inspection Log",
      subtitle: "Record field inspections and confirm crop disease cases.",
      district: "District",
      selectDistrict: "Select District",
      location: "Specific Location",
      locationPlaceholder: "Village/Farm Name",
      inspectionType: "Inspection Type",
      observations: "Field Observations",
      observationsPlaceholder: "Describe leaf discoloration, fungal growth, pest intensity, etc.",
      confirm: "Confirm Suspected Crop Disease",
      suspected: "Suspected Disease",
      suspectedPlaceholder: "e.g. Rice Blast",
      submit: "Submit Inspection Log",
      submitting: "Submitting...",
      success: "Inspection Log Saved",
      types: {
        'Routine Field Visit': 'Routine Field Visit',
        'Pest Outbreak Call': 'Pest Outbreak Call',
        'Soil Health Check': 'Soil Health Check',
        'Disease Verification': 'Disease Verification'
      }
    },
    ml: {
      title: "കാർഷിക പരിശോധനാ ലോഗ്",
      subtitle: "ഫീൽഡ് പരിശോധനകൾ രേഖപ്പെടുത്തുകയും വിള രോഗങ്ങൾ സ്ഥിരീകരിക്കുകയും ചെയ്യുക.",
      district: "ജില്ല",
      selectDistrict: "ജില്ല തിരഞ്ഞെടുക്കുക",
      location: "കൃത്യമായ സ്ഥലം",
      locationPlaceholder: "ഗ്രാമം/ഫാം പേര്",
      inspectionType: "പരിശോധന തരം",
      observations: "ഫീൽഡ് നിരീക്ഷണങ്ങൾ",
      observationsPlaceholder: "ഇലകളുടെ നിറം മാറുന്നത്, കുമിൾ വളർച്ച, കീടങ്ങളുടെ തീവ്രത തുടങ്ങിയവ വിവരിക്കുക.",
      confirm: "സംശയിക്കുന്ന വിള രോഗം സ്ഥിരീകരിക്കുക",
      suspected: "സംശയിക്കുന്ന രോഗം",
      suspectedPlaceholder: "ഉദാഹരണത്തിന്: നെല്ലിലെ കുമിൾ രോഗം",
      submit: "പരിശോധനാ ലോഗ് സമർപ്പിക്കുക",
      submitting: "സമർപ്പിക്കുന്നു...",
      success: "പരിശോധനാ ലോഗ് സംരക്ഷിച്ചു",
      types: {
        'Routine Field Visit': 'പതിവ് സന്ദർശനം',
        'Pest Outbreak Call': 'കീടബാധ റിപ്പോർട്ട്',
        'Soil Health Check': 'മണ്ണ് പരിശോധന',
        'Disease Verification': 'രോഗം സ്ഥിരീകരിക്കൽ'
      }
    }
  }[lang];

  const [formData, setFormData] = useState({
    district: '',
    location: '',
    inspectionType: 'Routine Field Visit',
    findings: '',
    confirmedCase: false,
    diseaseSuspected: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const res = await fetch('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
        setFormData({ district: '', location: '', inspectionType: 'Routine Field Visit', findings: '', confirmedCase: false, diseaseSuspected: '' });
      }
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl backdrop-blur-sm">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{t.title}</h2>
          <p className="text-zinc-400">{t.subtitle}</p>
        </div>
        <div className="bg-blue-500/10 p-3 rounded-full">
          <Stethoscope className="text-blue-400" size={32} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{t.district}</label>
            <select 
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.district}
              onChange={e => setFormData({...formData, district: e.target.value})}
            >
              <option value="">{t.selectDistrict}</option>
              {KERALA_DISTRICTS.map(d => <option key={d} value={d}>{lang === 'ml' ? KERALA_DISTRICTS_ML[d as keyof typeof KERALA_DISTRICTS_ML] : d}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{t.location}</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 text-zinc-500" size={18} />
              <input 
                type="text"
                required
                placeholder={t.locationPlaceholder}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 pl-10 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{t.inspectionType}</label>
          <div className="flex flex-wrap gap-3">
            {Object.keys(t.types).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({...formData, inspectionType: type})}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  formData.inspectionType === type 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                {t.types[type as keyof typeof t.types]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{t.observations}</label>
          <textarea 
            required
            placeholder={t.observationsPlaceholder}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white h-32 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            value={formData.findings}
            onChange={e => setFormData({...formData, findings: e.target.value})}
          />
        </div>

        <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/50 space-y-4">
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="confirm"
              className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-blue-500"
              checked={formData.confirmedCase}
              onChange={e => setFormData({...formData, confirmedCase: e.target.checked})}
            />
            <label htmlFor="confirm" className="text-sm font-bold text-white cursor-pointer">
              {t.confirm}
            </label>
          </div>
          
          {formData.confirmedCase && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 pt-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{t.suspected}</label>
              <input 
                type="text"
                placeholder={t.suspectedPlaceholder}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                value={formData.diseaseSuspected}
                onChange={e => setFormData({...formData, diseaseSuspected: e.target.value})}
              />
            </motion.div>
          )}
        </div>

        <button 
          disabled={status !== 'idle'}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            status === 'success' ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-500'
          }`}
        >
          {status === 'submitting' ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
          ) : status === 'success' ? (
            <><CheckCircle2 size={20} /> {t.success}</>
          ) : (
            <><ClipboardCheck size={20} /> {t.submit}</>
          )}
        </button>
      </form>
    </div>
  );
}
