import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area
} from 'recharts';
import { ShieldAlert, TrendingUp, Activity, Map as MapIcon, ChevronRight, BrainCircuit } from 'lucide-react';
import RiskMap from './RiskMap';
import { motion } from 'motion/react';

import { KERALA_DISTRICTS_ML } from '../constants';

export default function AuthorityDashboard({ lang }: { lang: 'en' | 'ml' }) {
  const t = {
    en: {
      stats: {
        active: "Active Signals",
        riskZones: "High Risk Zones",
        vets: "Vet Interventions",
        avgRisk: "Avg Risk Score"
      },
      heatmap: "Regional Monitoring Heatmap",
      low: "Low Risk",
      medium: "Medium",
      high: "High Risk",
      trends: "Disease Outbreak Trends",
      volatility: "Regional Price Volatility",
      volatilityLabel: "Volatility",
      demandLabel: "Demand",
      aiTitle: "AI Disease Prediction",
      aiDesc: "Analyze current signals to predict potential outbreaks.",
      aiButton: "Run Agentic Analysis",
      aiRunning: "Analyzing...",
      aiConfidence: "Conf.",
      aiSignals: "Detected Signals",
      aiRecs: "Governance Recommendations",
      aiForecast: "Outbreak Spread Forecast",
      recentReports: "Recent Reports",
      noReports: "No recent reports",
      live: "Live"
    },
    ml: {
      stats: {
        active: "സജീവ സിഗ്നലുകൾ",
        riskZones: "ഉയർന്ന അപകടസാധ്യതയുള്ള മേഖലകൾ",
        vets: "വെറ്ററിനറി ഇടപെടലുകൾ",
        avgRisk: "ശരാശരി റിസ്ക് സ്കോർ"
      },
      heatmap: "പ്രാദേശിക നിരീക്ഷണ ഹീറ്റ്മാപ്പ്",
      low: "കുറഞ്ഞ റിസ്ക്",
      medium: "മിതമായ",
      high: "ഉയർന്ന റിസ്ക്",
      trends: "രോഗ വ്യാപന പ്രവണതകൾ",
      volatility: "പ്രാദേശിക വില വ്യതിയാനം",
      volatilityLabel: "വ്യതിയാനം",
      demandLabel: "ആവശ്യം",
      aiTitle: "AI രോഗ പ്രവചനം",
      aiDesc: "നിലവിലെ സിഗ്നലുകൾ വിശകലനം ചെയ്ത് രോഗബാധകൾ പ്രവചിക്കുക.",
      aiButton: "ഏജന്റിക് വിശകലനം നടത്തുക",
      aiRunning: "വിശകലനം ചെയ്യുന്നു...",
      aiConfidence: "ഉറപ്പ്",
      aiSignals: "കണ്ടെത്തിയ സിഗ്നലുകൾ",
      aiRecs: "ഭരണപരമായ ശുപാർശകൾ",
      aiForecast: "രോഗ വ്യാപന പ്രവചനം",
      recentReports: "സമീപകാല റിപ്പോർട്ടുകൾ",
      noReports: "സമീപകാല റിപ്പോർട്ടുകൾ ലഭ്യമല്ല",
      live: "തത്സമയം"
    }
  }[lang];

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);

  const [marketTrends, setMarketTrends] = useState<any[]>([]);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchData(), fetchMarketData()]);
        setError(null);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  const fetchData = async () => {
    const res = await fetch('/api/data');
    if (!res.ok) throw new Error("Failed to fetch dashboard data");
    const json = await res.json();
    setData(json);
  };

  const fetchMarketData = async () => {
    const res = await fetch('/api/market');
    if (!res.ok) throw new Error("Failed to fetch market data");
    const json = await res.json();
    setMarketTrends(json.trends);
  };

  const generatePrediction = async () => {
    setLoadingPrediction(true);
    setTimeout(() => {
      setPrediction({
        disease: "Rice Blast (Magnaporthe oryzae)",
        confidence: 78,
        signals: [
          "Spindle-shaped leaf spots reported in Palakkad",
          "High humidity levels in Kuttanad region",
          "Sudden yield drop alerts from Alappuzha",
          "Rising demand for systemic fungicides"
        ],
        recommendations: [
          "Issue immediate advisory for paddy farmers in Palakkad",
          "Deploy agricultural officers for field verification",
          "Ensure availability of resistant seed varieties",
          "Monitor night temperatures in central districts"
        ],
        spreadProbability: 55
      });
      setLoadingPrediction(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
          className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full" 
        />
        <p className="text-zinc-500 font-medium animate-pulse">
          {lang === 'en' ? "Loading regional monitoring data..." : "പ്രാദേശിക നിരീക്ഷണ ഡാറ്റ ലോഡ് ചെയ്യുന്നു..."}
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center px-4">
        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center">
          <ShieldAlert className="text-rose-500" size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">
            {lang === 'en' ? "Connection Error" : "കണക്ഷൻ പിശക്"}
          </h3>
          <p className="text-zinc-500 max-w-md">
            {lang === 'en' 
              ? "We're having trouble connecting to the regional monitoring service. This might be a temporary issue."
              : "പ്രാദേശിക നിരീക്ഷണ സേവനവുമായി ബന്ധിപ്പിക്കുന്നതിൽ ഞങ്ങൾക്ക് ബുദ്ധിമുട്ടുണ്ട്. ഇത് ഒരു താത്കാലിക പ്രശ്നമാകാം."}
          </p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all"
        >
          {lang === 'en' ? "Retry Connection" : "വീണ്ടും ശ്രമിക്കുക"}
        </button>
      </div>
    );
  }

  const trendData = [
    { name: 'Mon', reports: 12, risk: 20 },
    { name: 'Tue', reports: 19, risk: 25 },
    { name: 'Wed', reports: 15, risk: 30 },
    { name: 'Thu', reports: 22, risk: 45 },
    { name: 'Fri', reports: 30, risk: 55 },
    { name: 'Sat', reports: 45, risk: 65 },
    { name: 'Sun', reports: 38, risk: 60 },
  ];

  const radarData = [
    { subject: 'Pathanamthitta', A: 30, fullMark: 100 },
    { subject: 'Kottayam', A: 50, fullMark: 100 },
    { subject: 'Idukki', A: 20, fullMark: 100 },
    { subject: 'Ernakulam', A: 80, fullMark: 100 },
    { subject: 'Thrissur', A: 60, fullMark: 100 },
    { subject: 'Palakkad', A: 90, fullMark: 100 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: t.stats.active, value: data.reports.length + 42, icon: Activity, color: 'text-emerald-400' },
          { label: t.stats.riskZones, value: Object.values(data.riskLevels).filter((v: any) => v > 50).length, icon: ShieldAlert, color: 'text-rose-400' },
          { label: t.stats.vets, value: data.inspections.length + 12, icon: TrendingUp, color: 'text-blue-400' },
          { label: t.stats.avgRisk, value: Math.round(Object.values(data.riskLevels).reduce((a: any, b: any) => a + b, 0) as number / 14), icon: MapIcon, color: 'text-amber-400' },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl"
          >
            <div className="flex justify-between items-start mb-4">
              <stat.icon className={stat.color} size={24} />
              <span className="text-xs font-mono text-zinc-500 uppercase">{t.live}</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-zinc-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Map Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MapIcon size={20} className="text-emerald-500" />
                {t.heatmap}
              </h2>
              <div className="flex gap-4 text-xs font-mono">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> {t.low}</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> {t.medium}</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500" /> {t.high}</span>
              </div>
            </div>
            <RiskMap 
              riskLevels={data.riskLevels} 
              selectedDistrict={selectedDistrict}
              onSelectDistrict={setSelectedDistrict}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-500" />
                {t.trends}
              </h2>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="risk" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp size={18} className="text-amber-500" />
                {t.volatility}
              </h2>
              <div className="space-y-4">
                {marketTrends.map((trend: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-xl border border-zinc-700/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        trend.volatility === 'High' ? 'bg-rose-500' : trend.volatility === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      <div>
                        <p className="text-sm font-bold text-white">{lang === 'ml' ? KERALA_DISTRICTS_ML[trend.district as keyof typeof KERALA_DISTRICTS_ML] : trend.district}</p>
                        <p className="text-[10px] text-zinc-500">{trend.crop}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-bold ${
                        trend.volatility === 'High' ? 'text-rose-400' : 'text-emerald-400'
                      }`}>{trend.volatility} {t.volatilityLabel}</p>
                      <p className="text-[10px] text-blue-400">{trend.demand} {t.demandLabel}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights Sidebar */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BrainCircuit size={80} />
            </div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <BrainCircuit size={20} className="text-purple-500" />
              {t.aiTitle}
            </h2>
            
            {!prediction ? (
              <div className="py-8 text-center">
                <p className="text-zinc-500 text-sm mb-6">{t.aiDesc}</p>
                <button 
                  onClick={generatePrediction}
                  disabled={loadingPrediction}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  {loadingPrediction ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <>{t.aiButton}</>
                  )}
                </button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-rose-400">{prediction.disease}</h3>
                    <span className="text-xs font-mono bg-rose-500 text-white px-2 py-0.5 rounded">{prediction.confidence}% {t.aiConfidence}</span>
                  </div>
                  <p className="text-xs text-zinc-400">Detected abnormal patterns in central districts.</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{t.aiSignals}</h4>
                  <ul className="space-y-2">
                    {prediction.signals.map((s: string, i: number) => (
                      <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{t.aiRecs}</h4>
                  <ul className="space-y-2">
                    {prediction.recommendations.map((r: string, i: number) => (
                      <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                        <ChevronRight size={14} className="mt-0.5 text-emerald-500 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-zinc-800">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">{t.aiForecast}</h4>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="#27272a" />
                        <PolarAngleAxis dataKey="subject" stroke="#71717a" fontSize={10} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="Risk" dataKey="A" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">{t.recentReports}</h2>
            <div className="space-y-4">
              {data.reports.slice(-3).reverse().map((report: any) => (
                <div key={report.id} className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                  <div className="flex justify-between text-xs text-zinc-500 mb-1">
                    <span>{lang === 'ml' ? KERALA_DISTRICTS_ML[report.district as keyof typeof KERALA_DISTRICTS_ML] : report.district}</span>
                    <span>{new Date(report.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm text-zinc-300 line-clamp-2">{report.symptoms}</p>
                </div>
              ))}
              {data.reports.length === 0 && <p className="text-zinc-500 text-sm text-center py-4">{t.noReports}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
