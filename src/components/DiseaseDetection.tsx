import React, { useState, useRef } from 'react';
import { Camera, Upload, Search, ShieldCheck, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { detectCropDisease } from '../services/geminiService';

export default function DiseaseDetection({ lang }: { lang: 'en' | 'ml' }) {
  const t = {
    en: {
      title: "AI Crop Disease Detection",
      subtitle: "Upload a photo of the affected leaf or plant for instant diagnosis.",
      upload: "Click to Upload",
      drag: "or drag and drop leaf image",
      change: "Change Photo",
      analyze: "Identify Disease",
      analyzing: "Analyzing Signals...",
      empty: "Analysis results will appear here after upload.",
      match: "Match",
      symptoms: "Observed Symptoms",
      organic: "Organic Treatment",
      chemical: "Chemical Treatment"
    },
    ml: {
      title: "AI വിള രോഗ നിർണ്ണയം",
      subtitle: "രോഗം ബാധിച്ച ഇലയുടെയോ ചെടിയുടെയോ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക.",
      upload: "അപ്‌ലോഡ് ചെയ്യാൻ ക്ലിക്ക് ചെയ്യുക",
      drag: "അല്ലെങ്കിൽ ഇലയുടെ ചിത്രം വലിച്ചിടുക",
      change: "ഫോട്ടോ മാറ്റുക",
      analyze: "രോഗം തിരിച്ചറിയുക",
      analyzing: "പരിശോധിക്കുന്നു...",
      empty: "അപ്‌ലോഡ് ചെയ്ത ശേഷം ഫലങ്ങൾ ഇവിടെ കാണാം.",
      match: "പൊരുത്തം",
      symptoms: "നിരീക്ഷിച്ച ലക്ഷണങ്ങൾ",
      organic: "ജൈവ ചികിത്സ",
      chemical: "രാസ ചികിത്സ"
    }
  }[lang];

  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    setAnalyzing(true);
    const base64 = image.split(',')[1];
    const data = await detectCropDisease(base64);
    setResult(data);
    setAnalyzing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">{t.title}</h2>
        <p className="text-zinc-400">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Area */}
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative ${
              image ? 'border-emerald-500/50' : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900/50'
            }`}
          >
            {image ? (
              <>
                <img src={image} alt="Crop" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-bold flex items-center gap-2">
                    <Upload size={18} /> {t.change}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera size={32} className="text-zinc-500" />
                </div>
                <p className="text-zinc-300 font-bold mb-1">{t.upload}</p>
                <p className="text-zinc-500 text-xs">{t.drag}</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="hidden" 
              accept="image/*" 
            />
          </div>

          <button 
            onClick={analyzeImage}
            disabled={!image || analyzing}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <><Loader2 size={20} className="animate-spin" /> {t.analyzing}</>
            ) : (
              <><Search size={20} /> {t.analyze}</>
            )}
          </button>
        </div>

        {/* Results Area */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-zinc-500 text-center space-y-4"
              >
                <ShieldCheck size={64} className="opacity-10" />
                <p className="text-sm">{t.empty}</p>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{result.disease}</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-zinc-800 h-1.5 w-24 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${result.confidence}%` }} />
                      </div>
                      <span className="text-xs font-mono text-emerald-500">{result.confidence}% {t.match}</span>
                    </div>
                  </div>
                  <div className="p-2 bg-rose-500/10 rounded-lg">
                    <AlertCircle className="text-rose-500" size={24} />
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{t.symptoms}</h4>
                  <ul className="space-y-2">
                    {result.symptoms.map((s: string, i: number) => (
                      <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-500">{t.organic}</h4>
                    <p className="text-sm text-zinc-300 leading-relaxed">{result.organicTreatment}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-500">{t.chemical}</h4>
                    <p className="text-sm text-zinc-300 leading-relaxed">{result.chemicalTreatment}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
