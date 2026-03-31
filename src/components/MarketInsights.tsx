import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, ShoppingBag, 
  ArrowUpRight, MapPin, Calendar, Search, 
  BarChart3, BrainCircuit, Bell, Info,
  CheckCircle2, AlertCircle, ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { getMarketForecast } from '../services/geminiService';

export default function MarketInsights({ lang }: { lang: 'en' | 'ml' }) {
  const [marketData, setMarketData] = useState<any>(null);
  const [selectedCrop, setSelectedCrop] = useState('Banana');
  const [forecast, setForecast] = useState<any>(null);
  const [loadingForecast, setLoadingForecast] = useState(false);

  const t = {
    en: {
      market: "Market Insights",
      forecast: "Price Forecast (30 Days)",
      predict: "Predict",
      buyers: "Direct Buyer Matches",
      schemes: "Schemes & Subsidies",
      sellTiming: "Optimal Sell Timing",
      bestPrice: "BEST PRICE",
      verified: "Verified",
      viewAll: "View All eNAM Listings",
      listProduce: "List My Produce",
      trends: "Regional Market Trends",
      volatility: "Volatility",
      demand: "Demand"
    },
    ml: {
      market: "വിപണി വിവരങ്ങൾ",
      forecast: "വില പ്രവചനം (30 ദിവസം)",
      predict: "പ്രവചിക്കുക",
      buyers: "നേരിട്ടുള്ള വ്യാപാരികൾ",
      schemes: "പദ്ധതികളും സബ്‌സിഡികളും",
      sellTiming: "വിൽപ്പന സമയം",
      bestPrice: "മികച്ച വില",
      verified: "സ്ഥിരീകരിച്ചത്",
      viewAll: "എല്ലാ ഇ-നാം ലിസ്റ്റിംഗുകളും",
      listProduce: "എന്റെ വിളകൾ ലിസ്റ്റ് ചെയ്യുക",
      trends: "പ്രാദേശിക വിപണി പ്രവണതകൾ",
      volatility: "അസ്ഥിരത",
      demand: "ആവശ്യം"
    }
  }[lang];

  useEffect(() => {
    fetch('/api/market')
      .then(res => res.json())
      .then(data => setMarketData(data));
  }, []);

  const runForecast = async () => {
    setLoadingForecast(true);
    const data = await getMarketForecast(selectedCrop);
    if (data) {
      const chartData = data.trend.map((price: number, i: number) => ({
        day: i + 1,
        price: price
      }));
      setForecast({ ...data, chartData });
    }
    setLoadingForecast(false);
  };

  if (!marketData) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">{t.market}</h1>
      </div>

      {/* Price Ticker with Alerts */}
      <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
        {marketData.prices.map((item: any) => (
          <div key={item.crop} className="min-w-[240px] bg-zinc-900 border border-zinc-800 p-4 rounded-xl shrink-0 relative group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-bold text-white">{item.crop}</span>
              {item.trend === 'up' ? (
                <TrendingUp size={16} className="text-emerald-500" />
              ) : (
                <TrendingDown size={16} className="text-rose-500" />
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">₹{item.current}</span>
              <span className="text-[10px] text-zinc-500">/{item.unit}</span>
            </div>
            
            {/* Sell Timing Alert */}
            <div className={`mt-3 p-2 border rounded-lg flex items-center gap-2 ${
              item.trend === 'up' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'
            }`}>
              <AlertCircle size={12} className={item.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'} />
              <span className={`text-[10px] font-bold uppercase tracking-tight ${
                item.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {item.alert}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Market Trends Dashboard */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp size={20} className="text-emerald-500" />
          {t.trends}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {marketData.trends.map((trend: any, i: number) => (
            <div key={i} className="p-4 bg-zinc-800/30 border border-zinc-700/50 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-zinc-400">{trend.district}</span>
                <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {trend.crop}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500">{t.volatility}</span>
                  <span className={`text-[10px] font-bold ${
                    trend.volatility === 'Low' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>{trend.volatility}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500">{t.demand}</span>
                  <span className="text-[10px] font-bold text-blue-400">{trend.demand}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Forecast Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BarChart3 size={20} className="text-emerald-500" />
                {t.forecast}
              </h2>
              <div className="flex gap-2">
                <select 
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                  value={selectedCrop}
                  onChange={e => setSelectedCrop(e.target.value)}
                >
                  {marketData.prices.map((p: any) => <option key={p.crop}>{p.crop}</option>)}
                </select>
                <button 
                  onClick={runForecast}
                  disabled={loadingForecast}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
                >
                  {loadingForecast ? <BrainCircuit size={14} className="animate-spin" /> : <BrainCircuit size={14} />}
                  {t.predict}
                </button>
              </div>
            </div>

            {forecast ? (
              <div className="space-y-6">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecast.chartData}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="day" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="price" stroke="#10b981" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="font-bold text-emerald-400">AI Summary:</span> {forecast.summary}
                  </p>
                  <p className="text-sm text-zinc-300 mt-2">
                    <span className="font-bold text-emerald-400">Recommendation:</span> {forecast.recommendation}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-zinc-500 space-y-4">
                <ShoppingBag size={48} className="opacity-20" />
                <p>Select a crop and run AI prediction for market insights.</p>
              </div>
            )}
          </div>

          {/* Scheme Alerts Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Bell size={20} className="text-amber-500" />
              {t.schemes} (AgriStack)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {marketData.schemes.map((scheme: any) => (
                <div key={scheme.id} className="p-4 bg-zinc-800/30 border border-zinc-700/50 rounded-xl hover:border-amber-500/50 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded uppercase">
                      {scheme.type}
                    </span>
                    <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={12} className="text-zinc-500 group-hover:text-white transition-colors" />
                    </a>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{scheme.title}</h3>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{scheme.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Buyer Matches */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <ShoppingBag size={20} className="text-blue-500" />
            {t.buyers}
          </h2>
          
          <div className="space-y-4">
            <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 mb-4">
              <BrainCircuit size={16} />
              {t.listProduce}
            </button>

            {marketData.buyers.map((buyer: any, i: number) => (
              <div key={i} className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 hover:border-zinc-500 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{buyer.name}</h3>
                    {buyer.verified && (
                      <CheckCircle2 size={12} className="text-blue-500" />
                    )}
                  </div>
                  <a href={`tel:${buyer.contact}`} className="p-1.5 bg-zinc-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={14} className="text-white" />
                  </a>
                </div>
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-400">{buyer.crop}</p>
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500 uppercase">
                      <MapPin size={10} /> {buyer.distance}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">₹{buyer.price}</p>
                    <p className="text-[10px] text-emerald-500 font-bold">{t.bestPrice}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
            {t.viewAll}
          </button>
        </div>
      </div>
    </div>
  );
}
