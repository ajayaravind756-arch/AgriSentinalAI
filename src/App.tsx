import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  UserCircle, 
  Stethoscope, 
  ShieldCheck, 
  Menu, 
  X,
  Activity,
  Bell,
  Search,
  MessageSquare, 
  CloudSun, 
  TrendingUp as MarketIcon, 
  ScanSearch,
  MapPin,
  Info,
  ShoppingBag,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { KERALA_DISTRICTS, COMMON_DISEASES, CROPS } from './constants';
import AuthorityDashboard from './components/AuthorityDashboard';
import BroadcastBanner from './components/BroadcastBanner';
import FarmerPortal from './components/FarmerPortal';
import VetPortal from './components/VetPortal';
import DiseaseInfo from './components/DiseaseInfo';
import FarmerChat from './components/FarmerChat';
import WeatherIrrigation from './components/WeatherIrrigation';
import MarketInsights from './components/MarketInsights';
import DiseaseDetection from './components/DiseaseDetection';
import WelcomeDashboard from './components/WelcomeDashboard';
import AgriExchange from './components/AgriExchange';
import OfficialGazette from './components/OfficialGazette';
import Login from './components/Login';

type Portal = 'welcome' | 'authority' | 'farmer' | 'vet' | 'info' | 'chat' | 'weather' | 'market' | 'detect' | 'exchange' | 'gazette';

export default function App() {
  const [activePortal, setActivePortal] = useState<Portal>('welcome');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [lang, setLang] = useState<'en' | 'ml'>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [userType, setUserType] = useState<'farmer' | 'officer' | 'buyer' | null>(null);

  const userEmail = userType === 'officer' ? "officer@kerala.gov.in" : userType === 'buyer' ? "buyer@kerala.in" : "farmer@kerala.in";
  const userName = userEmail.split('@')[0].split('.')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].split('.')[0].slice(1);

  const t = {
    en: {
      welcome: 'Overview',
      regional: 'Regional Monitoring',
      weather: 'Weather & Irrigation',
      detect: 'Disease Detection',
      market: 'Market Predictions',
      exchange: 'Agri Exchange',
      chat: 'AgriSense Chat',
      farmer: 'Farmer Portal',
      expert: 'Expert Portal',
      knowledge: 'Crop Knowledge',
      gazette: 'Govt Gazette'
    },
    ml: {
      welcome: 'അവലോകനം',
      regional: 'പ്രാദേശിക നിരീക്ഷണം',
      weather: 'കാലാവസ്ഥയും ജലസേചനവും',
      detect: 'രോഗനിർണ്ണയം',
      market: 'വിപണി പ്രവചനങ്ങൾ',
      exchange: 'അഗ്രി എക്സ്ചേഞ്ച്',
      chat: 'അഗ്രിസെൻസ് ചാറ്റ്',
      farmer: 'കർഷക പോർട്ടൽ',
      expert: 'വിദഗ്ദ്ധ പോർട്ടൽ',
      knowledge: 'വിള അറിവ്',
      gazette: 'ഗവൺമെന്റ് ഗസറ്റ്'
    }
  }[lang];

  const allNavItems = [
    { id: 'welcome', label: t.welcome, icon: LayoutDashboard, color: 'text-emerald-500' },
    { id: 'authority', label: t.regional, icon: Activity, color: 'text-emerald-500' },
    { id: 'weather', label: t.weather, icon: CloudSun, color: 'text-blue-400' },
    { id: 'detect', label: t.detect, icon: ScanSearch, color: 'text-rose-400' },
    { id: 'market', label: t.market, icon: MarketIcon, color: 'text-amber-400' },
    { id: 'exchange', label: t.exchange, icon: ShoppingBag, color: 'text-emerald-400' },
    { id: 'chat', label: t.chat, icon: MessageSquare, color: 'text-emerald-400' },
    { id: 'farmer', label: t.farmer, icon: UserCircle, color: 'text-zinc-400' },
    { id: 'vet', label: t.expert, icon: Stethoscope, color: 'text-blue-500' },
    { id: 'info', label: t.knowledge, icon: ShieldCheck, color: 'text-purple-500' },
    { id: 'gazette', label: t.gazette, icon: FileText, color: 'text-emerald-500' },
  ];

  const navItems = userType === 'officer' 
    ? allNavItems.filter(item => item.id === 'authority')
    : userType === 'buyer'
      ? allNavItems.filter(item => ['welcome', 'exchange', 'market', 'info', 'gazette'].includes(item.id))
      : allNavItems.filter(item => item.id !== 'vet' && item.id !== 'authority');

  const searchResults = searchQuery.trim().length > 1 ? [
    ...navItems.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase())).map(item => ({
      type: 'nav',
      id: item.id,
      label: item.label,
      icon: item.icon,
      color: item.color
    })),
    ...KERALA_DISTRICTS.filter(d => d.toLowerCase().includes(searchQuery.toLowerCase())).map(d => ({
      type: 'district',
      id: d,
      label: d,
      icon: MapPin,
      color: 'text-blue-400'
    })),
    ...COMMON_DISEASES.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.name_ml.includes(searchQuery)).map(d => ({
      type: 'disease',
      id: d.name,
      label: lang === 'en' ? d.name : d.name_ml,
      icon: Info,
      color: 'text-purple-400'
    }))
  ].slice(0, 8) : [];

  const handleResultClick = (result: any) => {
    if (result.type === 'nav') {
      setActivePortal(result.id);
    } else if (result.type === 'district') {
      setSelectedDistrict(result.id);
      setActivePortal('weather');
    } else if (result.type === 'disease') {
      setActivePortal('info');
    }
    setSearchQuery('');
    setShowSearchResults(false);
  };

  if (!userType) {
    return <Login onLogin={(role) => {
      setUserType(role);
      setActivePortal(role === 'officer' ? 'authority' : 'welcome');
    }} lang={lang} />;
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-full bg-zinc-950 border-r border-zinc-900 transition-all duration-300 z-50 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-6 flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
            <Activity className="text-black" size={20} />
          </div>
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="font-bold text-xl tracking-tight"
            >
              AgriSentinel<span className="text-emerald-500">AI</span>
            </motion.span>
          )}
        </div>

        <nav className="px-3 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePortal(item.id as Portal)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${
                activePortal === item.id 
                  ? 'bg-zinc-900 text-white' 
                  : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300'
              }`}
            >
              <item.icon 
                size={22} 
                className={activePortal === item.id ? item.color : 'group-hover:text-zinc-300'} 
              />
              {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
              {activePortal === item.id && isSidebarOpen && (
                <motion.div layoutId="active" className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-0 w-full px-6">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center gap-3 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            {isSidebarOpen && <span className="text-sm font-medium">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-20'}`}>
        {/* Top Header */}
        <header className="h-20 border-b border-zinc-900 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md sticky top-0 z-40">
          <div className="relative">
            <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-full w-96 focus-within:border-emerald-500/50 transition-all">
              <Search size={18} className="text-zinc-500" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                placeholder={lang === 'en' ? "Search districts, diseases, reports..." : "ജില്ലകൾ, രോഗങ്ങൾ, റിപ്പോർട്ടുകൾ തിരയുക..."}
                className="bg-transparent border-none outline-none text-sm w-full text-zinc-300"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-zinc-500 hover:text-zinc-300">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {showSearchResults && searchResults.length > 0 && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowSearchResults(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-2">
                      {searchResults.map((result, i) => (
                        <button
                          key={i}
                          onClick={() => handleResultClick(result)}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800 transition-all text-left group"
                        >
                          <div className={`p-2 rounded-lg bg-zinc-800 group-hover:bg-zinc-700 transition-colors`}>
                            <result.icon size={16} className={result.color} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-zinc-200">{result.label}</p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{result.type}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setLang(lang === 'en' ? 'ml' : 'en')}
              className="bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-400 hover:bg-zinc-800 transition-all"
            >
              {lang === 'en' ? 'മലയാളം' : 'English'}
            </button>
            <button className="relative text-zinc-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-black" />
            </button>
            <div className="h-8 w-px bg-zinc-800" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white">Kerala OneHealth</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{userType === 'officer' ? 'Authority Node' : userType === 'buyer' ? 'Buyer Node' : 'Farmer Node'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-black">
                {userType === 'officer' ? 'KO' : userType === 'buyer' ? 'BY' : 'FA'}
              </div>
              <button 
                onClick={() => setUserType(null)}
                className="text-xs text-zinc-400 hover:text-white ml-2 transition-colors uppercase tracking-widest"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Portal Content */}
        <div className="p-8 max-w-7xl mx-auto">
          <BroadcastBanner lang={lang} userType={userType} />
          <AnimatePresence mode="wait">
            <motion.div
              key={activePortal}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activePortal === 'welcome' && <WelcomeDashboard lang={lang} userName={userName} onNavigate={setActivePortal} />}
              {activePortal === 'authority' && <AuthorityDashboard lang={lang} />}
              {activePortal === 'farmer' && <FarmerPortal lang={lang} />}
              {activePortal === 'vet' && <VetPortal lang={lang} />}
              {activePortal === 'info' && <DiseaseInfo lang={lang} />}
              {activePortal === 'chat' && <FarmerChat lang={lang} />}
              {activePortal === 'weather' && <WeatherIrrigation district={selectedDistrict} lang={lang} />}
              {activePortal === 'market' && <MarketInsights lang={lang} />}
              {activePortal === 'exchange' && <AgriExchange lang={lang} userType={userType} />}
              {activePortal === 'detect' && <DiseaseDetection lang={lang} />}
              {activePortal === 'gazette' && <OfficialGazette lang={lang} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className={`fixed bottom-0 right-0 h-8 bg-zinc-950 border-t border-zinc-900 flex items-center px-6 text-[10px] font-mono text-zinc-500 z-40 transition-all duration-300 ${isSidebarOpen ? 'left-64' : 'left-20'}`}>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            System Online
          </span>
          <span>•</span>
          <span>Last Sync: {new Date().toLocaleTimeString()}</span>
          <span>•</span>
          <span className="text-emerald-500/80">One Health Governance Node: KERALA-01</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <span>v1.0.4-stable</span>
          <span className="text-zinc-700">|</span>
          <span>AgriSentinel AI Surveillance</span>
        </div>
      </footer>
    </div>
  );
}
