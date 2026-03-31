import React, { useState, useEffect } from 'react';
import { 
  CloudRain, Thermometer, Droplets, Wind, 
  Calendar, Info, AlertTriangle, CheckCircle2,
  Activity, ShieldAlert
} from 'lucide-react';
import { motion } from 'motion/react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { KERALA_DISTRICTS } from '../constants';

export default function WeatherIrrigation({ district: initialDistrict, lang }: { district: string, lang: 'en' | 'ml' }) {
  const [district, setDistrict] = useState(initialDistrict || 'Kollam');
  const [weather, setWeather] = useState<any>(null);
  const [soil, setSoil] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const t = {
    en: {
      weather: "Weather Planning",
      irrigation: "Smart Irrigation",
      soil: "Soil Health Insights",
      live: "Live IMD Data",
      temp: "Temp",
      humidity: "Humidity",
      rainfall: "Rainfall",
      wind: "Wind",
      next: "Next Irrigation",
      quantity: "Quantity",
      recommendation: "Fertilizer Recommendation"
    },
    ml: {
      weather: "കാലാവസ്ഥാ ആസൂത്രണം",
      irrigation: "സ്മാർട്ട് ജലസേചനം",
      soil: "മണ്ണിന്റെ ആരോഗ്യം",
      live: "തത്സമയ IMD ഡാറ്റ",
      temp: "താപനില",
      humidity: "ആർദ്രത",
      rainfall: "മഴ",
      wind: "കാറ്റ്",
      next: "അടുത്ത ജലസേചനം",
      quantity: "അളവ്",
      recommendation: "വളപ്രയോഗ ശുപാർശ"
    }
  }[lang];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [wRes, sRes] = await Promise.all([
          fetch(`/api/weather/${district}`),
          fetch(`/api/soil/${district}`)
        ]);
        setWeather(await wRes.json());
        setSoil(await sRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [district]);

  if (loading) return <div className="p-12 text-center text-zinc-500">Fetching live data for {district}...</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <select 
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 px-4 py-1.5 rounded-full text-xs font-bold text-white outline-none"
          >
            {KERALA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Card */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{t.weather}</h2>
              <p className="text-zinc-500 text-sm">{district}, Kerala</p>
            </div>
            <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-mono">
              {t.live}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase tracking-wider">
                <Thermometer size={14} /> {t.temp}
              </div>
              <p className="text-2xl font-bold text-white">{weather.temp}°C</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase tracking-wider">
                <Droplets size={14} /> {t.humidity}
              </div>
              <p className="text-2xl font-bold text-white">{weather.humidity}%</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase tracking-wider">
                <CloudRain size={14} /> {t.rainfall}
              </div>
              <p className="text-lg font-bold text-emerald-400">{weather.rainfall}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase tracking-wider">
                <Wind size={14} /> {t.wind}
              </div>
              <p className="text-2xl font-bold text-white">12 km/h</p>
            </div>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weather.forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="day" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="temp" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="rain" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Irrigation Advice */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Droplets size={20} className="text-blue-500" />
            {t.irrigation}
          </h3>
          
          <div className="flex-1 space-y-6">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-zinc-400 uppercase tracking-wider">{t.humidity}</span>
                <span className="text-sm font-bold text-blue-400">{soil.moisture}%</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${soil.moisture}%` }}
                  className="bg-blue-500 h-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-zinc-800 rounded-lg">
                  <Calendar size={18} className="text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t.next}</p>
                  <p className="text-xs text-zinc-500">Tomorrow, 6:30 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-zinc-800 rounded-lg">
                  <Info size={18} className="text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t.quantity}</p>
                  <p className="text-xs text-zinc-500">15L per acre (Paddy)</p>
                </div>
              </div>
            </div>

            <div className="mt-auto p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-300 leading-relaxed">
                {weather.humidity > 80 ? "High humidity detected. Reduce irrigation to prevent fungal growth." : "Optimal conditions for irrigation. Follow schedule."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Soil Health Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Activity size={20} className="text-amber-500" />
            {t.soil}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
              <p className="text-xs text-zinc-500 uppercase mb-1">Soil pH</p>
              <p className="text-xl font-bold text-white">{soil.ph.toFixed(1)}</p>
              <p className="text-[10px] text-amber-400 mt-1">Slightly Acidic</p>
            </div>
            <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
              <p className="text-xs text-zinc-500 uppercase mb-1">Nitrogen (N)</p>
              <p className="text-xl font-bold text-white">{soil.nitrogen}</p>
            </div>
            <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
              <p className="text-xs text-zinc-500 uppercase mb-1">Phosphorus (P)</p>
              <p className="text-xl font-bold text-rose-400">{soil.phosphorus}</p>
            </div>
            <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
              <p className="text-xs text-zinc-500 uppercase mb-1">Potassium (K)</p>
              <p className="text-xl font-bold text-white">{soil.potassium}</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-4">
            <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-1" />
            <div>
              <p className="text-sm font-bold text-white mb-1">{t.recommendation}</p>
              <p className="text-sm text-zinc-400">{soil.recommendation}</p>
            </div>
          </div>
        </div>

        {/* AgriStack Land Records */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <ShieldAlert size={20} className="text-purple-500" />
            AgriStack Status
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-zinc-500">Digital Land Survey</span>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">VERIFIED</span>
              </div>
              <p className="text-sm font-bold text-white">Survey ID: KL-782-901</p>
              <p className="text-[10px] text-zinc-500 mt-1">Last updated: March 15, 2026</p>
            </div>
            <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-zinc-500">Crop Insurance</span>
                <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">PENDING</span>
              </div>
              <p className="text-sm font-bold text-white">PMFBY Policy #9012</p>
              <p className="text-[10px] text-zinc-500 mt-1">Action Required: Upload Sowing Certificate</p>
            </div>
            <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold transition-all">
              Sync with AgriStack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
