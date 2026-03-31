import React from 'react';
import { COMMON_DISEASES } from '../constants';
import { Info, ShieldCheck, AlertTriangle, Thermometer } from 'lucide-react';

export default function DiseaseInfo({ lang }: { lang: 'en' | 'ml' }) {
  const t = {
    en: {
      title: "Disease Awareness Dashboard",
      subtitle: "Stay informed about common crop diseases in the region to ensure early detection and effective prevention.",
      symptoms: "Key Symptoms",
      prevention: "Prevention",
      risk: "Risk Factors",
      framework: "One Health Governance",
      description: "AgriSense Kerala operates on the One Health framework, recognizing that the health of plants, people, and the environment are interconnected. Early detection of crop diseases is the first line of defense against potential agricultural threats."
    },
    ml: {
      title: "രോഗ ബോധവൽക്കരണ ഡാഷ്ബോർഡ്",
      subtitle: "നേരത്തെയുള്ള കണ്ടെത്തലും ഫലപ്രദമായ പ്രതിരോധവും ഉറപ്പാക്കുന്നതിന് മേഖലയിലെ സാധാരണ വിള രോഗങ്ങളെക്കുറിച്ച് അറിഞ്ഞിരിക്കുക.",
      symptoms: "പ്രധാന ലക്ഷണങ്ങൾ",
      prevention: "പ്രതിരോധം",
      risk: "അപകടസാധ്യത ഘടകങ്ങൾ",
      framework: "വൺ ഹെൽത്ത് ഗവേണൻസ്",
      description: "സസ്യങ്ങളുടെയും മനുഷ്യരുടെയും പരിസ്ഥിതിയുടെയും ആരോഗ്യം പരസ്പരബന്ധിതമാണെന്ന് തിരിച്ചറിഞ്ഞ് വൺ ഹെൽത്ത് ചട്ടക്കൂടിലാണ് അഗ്രിസെൻസ് കേരള പ്രവർത്തിക്കുന്നത്. വിള രോഗങ്ങളെ നേരത്തെ കണ്ടെത്തുന്നത് കാർഷിക ഭീഷണികൾക്കെതിരെയുള്ള ആദ്യ പ്രതിരോധ നിരയാണ്."
    }
  }[lang];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">{t.title}</h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COMMON_DISEASES.map((disease, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all group">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-all">
                <Info className="text-emerald-500" size={24} />
              </div>
              <h3 className="font-bold text-white leading-tight">{lang === 'ml' ? disease.name_ml : disease.name}</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                  <Thermometer size={14} className="text-rose-400" />
                  {t.symptoms}
                </h4>
                <ul className="space-y-1.5">
                  {(lang === 'ml' ? disease.symptoms_ml : disease.symptoms).map((s, j) => (
                    <li key={j} className="text-sm text-zinc-400 flex items-start gap-2">
                      <div className="mt-1.5 w-1 h-1 rounded-full bg-zinc-700 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  {t.prevention}
                </h4>
                <ul className="space-y-1.5">
                  {(lang === 'ml' ? disease.prevention_ml : disease.prevention).map((p, j) => (
                    <li key={j} className="text-sm text-zinc-400 flex items-start gap-2">
                      <div className="mt-1.5 w-1 h-1 rounded-full bg-zinc-700 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                  <AlertTriangle size={14} className="text-amber-400" />
                  {t.risk}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(lang === 'ml' ? disease.riskFactors_ml : disease.riskFactors).map((f, j) => (
                    <span key={j} className="px-2 py-1 bg-zinc-800 text-zinc-400 text-[10px] rounded uppercase tracking-wider font-bold">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-bold text-emerald-400 mb-2">{t.framework}</h3>
        <p className="text-zinc-400 text-sm max-w-3xl mx-auto leading-relaxed">
          {t.description}
        </p>
      </div>
    </div>
  );
}
