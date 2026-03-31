import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Plus, 
  Search, 
  MapPin, 
  Calendar, 
  MessageCircle, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  Filter,
  BarChart3,
  LogIn,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { KERALA_DISTRICTS, CROPS, KERALA_DISTRICTS_ML } from '../constants';
import { db, auth } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot, 
  updateDoc, 
  deleteDoc,
  doc, 
  serverTimestamp,
  Timestamp,
  getDocFromServer
} from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface SupplyItem {
  id: string;
  farmerId: string;
  farmerName: string;
  crop: string;
  quantity: number;
  unit: string;
  price: number;
  harvestDate: string;
  district: string;
  contact: string;
  status: 'available' | 'reserved' | 'sold';
  createdAt?: any;
  matches?: DemandItem[];
}

interface DemandItem {
  id: string;
  buyerId: string;
  buyerName: string;
  crop: string;
  quantity: number;
  unit: string;
  maxPrice: number;
  district: string;
  contact: string;
  createdAt?: any;
}

export default function AgriExchange({ lang, userType }: { lang: 'en' | 'ml', userType: 'farmer' | 'officer' | 'buyer' | null }) {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'demand' | 'my-listings' | 'my-reservations'>('marketplace');
  const [supply, setSupply] = useState<SupplyItem[]>([]);
  const [demand, setDemand] = useState<DemandItem[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddSupply, setShowAddSupply] = useState(false);
  const [showAddDemand, setShowAddDemand] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [notification, setNotification] = useState<string | null>(null);
  
  const user = useMemo(() => {
    if (userType === 'farmer') return { uid: 'demo_farmer_id', displayName: 'Raghavan Nair (Demo)', email: 'farmer@demo.com' };
    if (userType === 'buyer') return { uid: 'demo_buyer_id', displayName: 'Kerala Fresh (Demo)', email: 'buyer@demo.com' };
    if (userType === 'officer') return { uid: 'demo_officer_id', displayName: 'Officer (Demo)', email: 'officer@demo.com' };
    return null;
  }, [userType]);
  
  const [newSupply, setNewSupply] = useState({
    crop: 'Paddy',
    district: 'Palakkad',
    quantity: '',
    price: '',
    harvestDate: '',
    unit: 'kg'
  });

  const [newDemand, setNewDemand] = useState({
    crop: 'Paddy',
    district: 'Palakkad',
    quantity: '',
    maxPrice: '',
    unit: 'kg'
  });

  const t = {
    en: {
      marketplace: "Farmer Marketplace",
      demand: "Buyer Requests",
      myListings: "My Listings",
      myReservations: "My Reservations",
      addSupply: "List My Crop",
      addDemand: "Post Requirement",
      matching: "Smart Matches Found",
      reserve: "Pre-order / Reserve",
      contact: "Contact via WhatsApp",
      harvest: "Harvest Date",
      price: "Price",
      quantity: "Quantity",
      location: "Location",
      trends: "Demand Heatmap",
      noResults: "No listings found matching your criteria.",
      confirm: "Confirm Listing",
      post: "Post Requirement",
      loginRequired: "Please login to access the exchange.",
      login: "Login with Google",
      logout: "Logout",
      delete: "Delete",
      cancel: "Cancel",
      searchPlaceholder: "Search crops...",
      allDistricts: "All Districts",
      seedDemo: "Seed Demo Data"
    },
    ml: {
      marketplace: "കർഷക വിപണി",
      demand: "വാങ്ങുന്നവരുടെ ആവശ്യങ്ങൾ",
      myListings: "എന്റെ ലിസ്റ്റിംഗുകൾ",
      myReservations: "എന്റെ റിസർവേഷനുകൾ",
      addSupply: "വിള ലിസ്റ്റ് ചെയ്യുക",
      addDemand: "ആവശ്യം പോസ്റ്റ് ചെയ്യുക",
      matching: "സ്മാർട്ട് മാച്ചുകൾ കണ്ടെത്തി",
      reserve: "പ്രീ-ഓർഡർ / റിസർവ്",
      contact: "വാട്ട്‌സ്ആപ്പ് വഴി ബന്ധപ്പെടുക",
      harvest: "വിളവെടുപ്പ് തീയതി",
      price: "വില",
      quantity: "അളവ്",
      location: "സ്ഥലം",
      trends: "ഡിമാൻഡ് ഹീറ്റ്മാപ്പ്",
      noResults: "നിങ്ങളുടെ മാനദണ്ഡങ്ങളുമായി പൊരുത്തപ്പെടുന്ന ലിസ്റ്റിംഗുകളൊന്നുമില്ല.",
      confirm: "ലിസ്റ്റിംഗ് സ്ഥിരീകരിക്കുക",
      post: "ആവശ്യം പോസ്റ്റ് ചെയ്യുക",
      loginRequired: "എക്സ്ചേഞ്ച് ആക്സസ് ചെയ്യാൻ ദയവായി ലോഗിൻ ചെയ്യുക.",
      login: "ഗൂഗിൾ ഉപയോഗിച്ച് ലോഗിൻ ചെയ്യുക",
      logout: "ലോഗൗട്ട്",
      delete: "ഇല്ലാതാക്കുക",
      cancel: "റദ്ദാക്കുക",
      searchPlaceholder: "വിളകൾ തിരയുക...",
      allDistricts: "എല്ലാ ജില്ലകളും",
      seedDemo: "ഡെമോ ഡാറ്റ ചേർക്കുക"
    }
  }[lang];

  useEffect(() => {
    import('firebase/auth').then(({ signInAnonymously }) => {
      signInAnonymously(auth).catch((err) => {
        console.error("Anonymous auth failed:", err);
      });
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    const supplyQuery = query(collection(db, 'listings'));
    const demandQuery = query(collection(db, 'demands'));
    const reservationsQuery = query(collection(db, 'reservations'));

    const unsubscribeSupply = onSnapshot(supplyQuery, (snapshot) => {
      const supplyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SupplyItem[];
      setSupply(supplyData);
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.GET, 'listings'));

    const unsubscribeDemand = onSnapshot(demandQuery, (snapshot) => {
      const demandData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DemandItem[];
      setDemand(demandData);
    }, (err) => handleFirestoreError(err, OperationType.GET, 'demands'));

    const unsubscribeReservations = onSnapshot(reservationsQuery, (snapshot) => {
      const resData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReservations(resData);
    }, (err) => handleFirestoreError(err, OperationType.GET, 'reservations'));

    return () => {
      unsubscribeSupply();
      unsubscribeDemand();
      unsubscribeReservations();
    };
  }, [user]);

  useEffect(() => {
    if (supply.length > 0 && !notification) {
      const timer = setTimeout(() => {
        setNotification("🔥 New buyer request matched for your banana");
        setTimeout(() => setNotification(null), 5000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [supply]);

  // Google login handlers removed as we are using simulated demo user logic

  const handleReserve = async (supplyId: string) => {
    if (!user) return;
    try {
      const supplyRef = doc(db, 'listings', supplyId);
      await updateDoc(supplyRef, {
        status: 'reserved'
      });
      
      await addDoc(collection(db, 'reservations'), {
        listingId: supplyId,
        buyerId: user.uid,
        buyerName: user.displayName || 'Anonymous',
        status: 'pending',
        timestamp: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `listings/${supplyId}`);
    }
  };

  const handleSubmitSupply = async () => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'listings'), {
        farmerId: user.uid,
        farmerName: user.displayName || 'Anonymous',
        crop: newSupply.crop,
        district: newSupply.district,
        quantity: Number(newSupply.quantity),
        price: Number(newSupply.price),
        harvestDate: newSupply.harvestDate,
        unit: newSupply.unit,
        contact: user.email || '', // Simplified contact
        status: 'available',
        createdAt: serverTimestamp()
      });
      setShowAddSupply(false);
      setNewSupply({
        crop: 'Paddy',
        district: 'Palakkad',
        quantity: '',
        price: '',
        harvestDate: '',
        unit: 'kg'
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'listings');
    }
  };

  const handleSubmitDemand = async () => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'demands'), {
        buyerId: user.uid,
        buyerName: user.displayName || 'Anonymous',
        crop: newDemand.crop,
        district: newDemand.district,
        quantity: Number(newDemand.quantity),
        maxPrice: Number(newDemand.maxPrice),
        unit: newDemand.unit,
        contact: user.email || '',
        createdAt: serverTimestamp()
      });
      setShowAddDemand(false);
      setNewDemand({
        crop: 'Paddy',
        district: 'Palakkad',
        quantity: '',
        maxPrice: '',
        unit: 'kg'
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'demands');
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      await deleteDoc(doc(db, 'listings', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `listings/${id}`);
    }
  };

  const handleDeleteDemand = async (id: string) => {
    if (!confirm('Are you sure you want to delete this requirement?')) return;
    try {
      await deleteDoc(doc(db, 'demands', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `demands/${id}`);
    }
  };

  const handleConfirmReservation = async (resId: string, listingId: string) => {
    try {
      await updateDoc(doc(db, 'reservations', resId), { status: 'confirmed' });
      await updateDoc(doc(db, 'listings', listingId), { status: 'sold' });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `reservations/${resId}`);
    }
  };

  const handleCancelReservation = async (resId: string, listingId: string) => {
    if (!confirm('Cancel this reservation?')) return;
    try {
      await updateDoc(doc(db, 'reservations', resId), { status: 'cancelled' });
      await updateDoc(doc(db, 'listings', listingId), { status: 'available' });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `reservations/${resId}`);
    }
  };

  const seedDemoData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const demoListings = [
        { farmerId: 'demo1', farmerName: 'Raghavan Nair', crop: 'Paddy', district: 'Palakkad', quantity: 500, price: 28, harvestDate: '2026-04-15', unit: 'kg', contact: '9876543210', status: 'available', createdAt: serverTimestamp() },
        { farmerId: 'demo2', farmerName: 'Mary Joseph', crop: 'Banana', district: 'Thrissur', quantity: 200, price: 42, harvestDate: '2026-04-10', unit: 'kg', contact: '9876543211', status: 'available', createdAt: serverTimestamp() },
        { farmerId: 'demo3', farmerName: 'Sukumaran P.', crop: 'Coconut', district: 'Kozhikode', quantity: 1000, price: 30, harvestDate: '2026-04-20', unit: 'pcs', contact: '9876543212', status: 'available', createdAt: serverTimestamp() },
      ];

      const demoDemands = [
        { buyerId: 'demo_b1', buyerName: 'Kerala Rice Mills', crop: 'Paddy', district: 'Palakkad', quantity: 5000, maxPrice: 30, unit: 'kg', contact: '9876543213', createdAt: serverTimestamp() },
        { buyerId: 'demo_b2', buyerName: 'Fresh Fruits Co.', crop: 'Banana', district: 'Any', quantity: 800, maxPrice: 45, unit: 'kg', contact: '9876543214', createdAt: serverTimestamp() },
        { buyerId: 'demo_b3', buyerName: 'Coconut Traders', crop: 'Coconut', district: 'Kozhikode', quantity: 5000, maxPrice: 35, unit: 'pcs', contact: '9876543215', createdAt: serverTimestamp() },
      ];

      for (const l of demoListings) {
        await addDoc(collection(db, 'listings'), l);
      }
      for (const d of demoDemands) {
        await addDoc(collection(db, 'demands'), d);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to seed demo data.");
    } finally {
      setLoading(false);
    }
  };

  // Matching Logic Engine
  const matchedSupply = useMemo(() => {
    let filtered = supply.map(s => {
      const matches = demand.filter(d => 
        d.crop === s.crop && 
        d.maxPrice >= s.price &&
        (d.district === s.district || d.district === "Any")
      );
      return { ...s, matches };
    });

    if (searchQuery) {
      filtered = filtered.filter(s => 
        s.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.farmerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (districtFilter !== 'All') {
      filtered = filtered.filter(s => s.district === districtFilter);
    }

    return filtered;
  }, [supply, demand, searchQuery, districtFilter]);

  const filteredSupply = useMemo(() => {
    let list = matchedSupply;
    if (activeTab === 'my-listings') {
      list = matchedSupply.filter(s => s.farmerId === user?.uid);
    }
    
    return list.map(s => {
      const reservation = reservations.find(r => r.listingId === s.id && r.status === 'pending');
      return { ...s, reservation };
    });
  }, [matchedSupply, activeTab, user, reservations]);

  const myReservations = useMemo(() => {
    return reservations
      .filter(r => r.buyerId === user?.uid)
      .map(r => {
        const listing = supply.find(s => s.id === r.listingId);
        return { ...r, listing };
      });
  }, [reservations, supply, user]);

  const heatmapData = useMemo(() => {
    const districtDemand = demand.reduce((acc, d) => {
      acc[d.district] = (acc[d.district] || 0) + d.quantity;
      return acc;
    }, {} as Record<string, number>);

    // Ensure demo districts are present for visual impact
    if (Object.keys(districtDemand).length > 0) {
      if (!districtDemand['Palakkad']) districtDemand['Palakkad'] = 5000;
      if (!districtDemand['Ernakulam']) districtDemand['Ernakulam'] = 2500;
      if (!districtDemand['Kozhikode']) districtDemand['Kozhikode'] = 1200;
    }

    return Object.entries(districtDemand)
      .filter(([d]) => d !== 'Any')
      .map(([district, total]) => ({
        district,
        total,
        label: lang === 'ml' ? (KERALA_DISTRICTS_ML[district as keyof typeof KERALA_DISTRICTS_ML] || district) : district
      }))
      .sort((a, b) => (b.total as number) - (a.total as number))
      .slice(0, 8);
  }, [demand, lang]);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8 pb-12">
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-500 text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          {[
            { id: 'marketplace', label: t.marketplace, icon: ShoppingBag },
            { id: 'demand', label: t.demand, icon: Users },
            ...(userType === 'farmer' ? [{ id: 'my-listings', label: t.myListings, icon: TrendingUp }] : []),
            ...(userType === 'buyer' ? [{ id: 'my-reservations', label: t.myReservations, icon: CheckCircle2 }] : [])
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          {userType === 'farmer' && (
            <button 
              onClick={() => setShowAddSupply(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-sm font-bold hover:bg-emerald-500/20 transition-all"
            >
              <Plus size={16} />
              {t.addSupply}
            </button>
          )}
          {userType === 'buyer' && (
            <button 
              onClick={() => setShowAddDemand(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-xl text-sm font-bold hover:bg-blue-500/20 transition-all"
            >
              <Plus size={16} />
              {t.addDemand}
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-white outline-none focus:border-emerald-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-2xl px-4 py-3 shadow-sm">
          <Filter size={18} className="text-zinc-400" />
          <select 
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="bg-transparent text-black outline-none text-sm font-medium"
          >
            <option value="All" className="text-black">{t.allDistricts}</option>
            {KERALA_DISTRICTS.map(d => <option key={d} value={d} className="text-black">{d}</option>)}
          </select>
        </div>
      </div>

      {/* Marketplace Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(activeTab === 'marketplace' || activeTab === 'my-listings') && filteredSupply.map(item => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={item.id}
                  className={`bg-zinc-900 border ${item.status === 'reserved' ? 'border-amber-500/30' : 'border-zinc-800'} rounded-2xl p-6 relative group overflow-hidden`}
                >
                  {item.status === 'reserved' && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                      Reserved
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{lang === 'ml' ? (CROPS.find(c => c.name === item.crop)?.name_ml || item.crop) : item.crop}</h3>
                      <p className="text-sm text-zinc-500 flex items-center gap-1">
                        <MapPin size={12} /> {lang === 'ml' ? KERALA_DISTRICTS_ML[item.district as keyof typeof KERALA_DISTRICTS_ML] : item.district}
                      </p>
                      <p className="text-[10px] text-zinc-600 mt-1">By {item.farmerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-400">₹{item.price}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">per {item.unit}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/30">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">{t.quantity}</p>
                      <p className="text-sm font-bold text-zinc-200">{item.quantity} {item.unit}</p>
                    </div>
                    <div className="bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/30">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">{t.harvest}</p>
                      <p className="text-sm font-bold text-zinc-200">{new Date(item.harvestDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {item.matches && item.matches.length > 0 && (
                    <div className="mb-6 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
                          <CheckCircle2 size={12} /> {item.matches.length} buyers matched
                        </p>
                        <span className="text-[9px] bg-emerald-500 text-black px-2 py-0.5 rounded-full font-bold animate-pulse">
                          🔥 High demand
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-medium mb-2">Best price: ₹{Math.max(...item.matches.map(m => m.maxPrice))}/kg</p>
                      <div className="flex -space-x-2">
                        {item.matches.map((m, i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-400" title={m.buyerName}>
                            {m.buyerName[0]}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.reservation && (
                    <div className="mb-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                      <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-2">Pending Reservation</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-zinc-300">{item.reservation.buyerName}</span>
                        <button 
                          onClick={() => handleConfirmReservation(item.reservation.id, item.id)}
                          className="px-3 py-1 bg-emerald-500 text-black text-[10px] font-bold rounded-lg hover:bg-emerald-400 transition-all"
                        >
                          Confirm Sale
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {item.farmerId === user.uid && (
                      <button 
                        onClick={() => handleDeleteListing(item.id)}
                        className="flex-1 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-bold hover:bg-rose-500/20 transition-all"
                      >
                        {t.delete}
                      </button>
                    )}
                    {userType === 'buyer' && (
                      <button 
                        onClick={() => handleReserve(item.id)}
                        disabled={item.status === 'reserved'}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          item.status === 'reserved'
                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                            : 'bg-white text-black hover:bg-zinc-200'
                        }`}
                      >
                        <Clock size={16} />
                        {t.reserve}
                      </button>
                    )}
                    <a 
                      href={`https://wa.me/${item.contact.replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all"
                    >
                      <MessageCircle size={20} />
                    </a>
                  </div>
                </motion.div>
              ))}

              {activeTab === 'demand' && demand.map(item => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={item.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{lang === 'ml' ? (CROPS.find(c => c.name === item.crop)?.name_ml || item.crop) : item.crop}</h3>
                      <p className="text-sm text-zinc-500 flex items-center gap-1">
                        <Users size={12} /> {item.buyerName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-400">₹{item.maxPrice}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Max per {item.unit}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-zinc-400 mb-6">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {item.district}</span>
                    <span className="flex items-center gap-1"><ArrowRight size={14} /> {item.quantity} {item.unit}</span>
                  </div>

                  <div className="flex gap-2">
                    {item.buyerId === user.uid && (
                      <button 
                        onClick={() => handleDeleteDemand(item.id)}
                        className="flex-1 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-bold hover:bg-rose-500/20 transition-all"
                      >
                        {t.delete}
                      </button>
                    )}
                    {userType === 'farmer' && (
                      <button 
                        className="flex-1 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition-all"
                        onClick={() => alert("Sale accepted! An AgriExchange agent will coordinate the pickup.")}
                      >
                        Accept / Sell
                      </button>
                    )}
                    <a 
                      href={`https://wa.me/${item.contact.replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-xl text-xs font-bold hover:bg-blue-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={16} />
                      {t.contact}
                    </a>
                  </div>
                </motion.div>
              ))}
              
              {activeTab === 'my-reservations' && myReservations.map(res => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={res.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {res.listing ? (lang === 'ml' ? (CROPS.find(c => c.name === res.listing.crop)?.name_ml || res.listing.crop) : res.listing.crop) : 'Unknown Crop'}
                      </h3>
                      <p className="text-sm text-zinc-500">Status: <span className={`capitalize ${res.status === 'confirmed' ? 'text-emerald-500' : res.status === 'cancelled' ? 'text-rose-500' : 'text-amber-500'}`}>{res.status}</span></p>
                    </div>
                    {res.listing && (
                      <div className="text-right">
                        <p className="text-xl font-bold text-emerald-400">₹{res.listing.price}</p>
                        <p className="text-[10px] text-zinc-500">per {res.listing.unit}</p>
                      </div>
                    )}
                  </div>

                  {res.listing && (
                    <div className="bg-zinc-800/30 p-4 rounded-xl mb-6 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-500">Farmer:</span>
                        <span className="text-zinc-300">{res.listing.farmerName}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-500">Quantity:</span>
                        <span className="text-zinc-300">{res.listing.quantity} {res.listing.unit}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-500">District:</span>
                        <span className="text-zinc-300">{res.listing.district}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {res.status === 'pending' && (
                      <button 
                        onClick={() => handleCancelReservation(res.id, res.listingId)}
                        className="flex-1 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-bold hover:bg-rose-500/20 transition-all"
                      >
                        {t.cancel}
                      </button>
                    )}
                    {res.listing && (
                      <a 
                        href={`https://wa.me/${res.listing.contact.replace(/\s+/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={16} />
                        {t.contact}
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}

              {((activeTab === 'marketplace' && supply.length === 0) || 
                (activeTab === 'demand' && demand.length === 0) ||
                (activeTab === 'my-listings' && filteredSupply.length === 0) ||
                (activeTab === 'my-reservations' && myReservations.length === 0)) && (
                <div className="col-span-full py-20 text-center space-y-4">
                  <p className="text-zinc-500">{t.noResults}</p>
                  {(activeTab === 'marketplace' || activeTab === 'demand') && (
                    <button 
                      onClick={seedDemoData}
                      className="px-6 py-2 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all text-sm"
                    >
                      {t.seedDemo}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 size={18} className="text-emerald-500" />
              {t.trends}
            </h2>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={heatmapData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="label" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717a', fontSize: 10 }}
                    width={80}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                    {heatmapData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#10b98144'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-3">
              {heatmapData.slice(0, 3).map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">{item.label}</span>
                  <span className="text-emerald-400 font-mono font-bold">{item.total} kg</span>
                </div>
              ))}
              {demand.length === 0 && (
                <p className="text-xs text-zinc-600 italic">No demand data available yet.</p>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-800">
              <button 
                onClick={seedDemoData}
                disabled={loading}
                className="w-full py-3 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-xl text-xs font-bold hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={14} />
                {t.seedDemo}
              </button>
              <p className="text-[9px] text-zinc-600 text-center mt-2 uppercase tracking-widest">Demo Control Panel</p>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp size={80} />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Market Insight</h2>
            <p className="text-sm text-zinc-500 mb-4">
              👉 Paddy demand expected to increase in 3 days — list now for higher profit.
            </p>
            <button className="text-xs font-bold text-emerald-500 flex items-center gap-1 hover:gap-2 transition-all">
              View Detailed Analysis <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Fake Notification Popup */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, x: 100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-8 right-8 z-[200] bg-zinc-900 border border-emerald-500/50 p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-sm"
          >
            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{notification}</p>
              <p className="text-[10px] text-zinc-500">Just now • Smart Match Engine</p>
            </div>
            <button onClick={() => setNotification(null)} className="text-zinc-500 hover:text-white">
              <Plus className="rotate-45" size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Supply Modal */}
      <AnimatePresence>
        {showAddSupply && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddSupply(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6">{t.addSupply}</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest">Crop</label>
                    <select 
                      value={newSupply.crop}
                      onChange={e => setNewSupply({...newSupply, crop: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-emerald-500"
                    >
                      {CROPS.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest">District</label>
                    <select 
                      value={newSupply.district}
                      onChange={e => setNewSupply({...newSupply, district: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-emerald-500"
                    >
                      {KERALA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest">Quantity ({newSupply.unit})</label>
                    <input 
                      type="number" 
                      value={newSupply.quantity}
                      onChange={e => setNewSupply({...newSupply, quantity: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-emerald-500" 
                      placeholder="500" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest">Price (per {newSupply.unit})</label>
                    <input 
                      type="number" 
                      value={newSupply.price}
                      onChange={e => setNewSupply({...newSupply, price: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-emerald-500" 
                      placeholder="30" 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest">Harvest Date</label>
                  <input 
                    type="date" 
                    value={newSupply.harvestDate}
                    onChange={e => setNewSupply({...newSupply, harvestDate: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-emerald-500" 
                  />
                </div>
                <button 
                  onClick={handleSubmitSupply}
                  className="w-full py-4 bg-emerald-500 text-black font-bold rounded-2xl mt-4 hover:bg-emerald-400 transition-all"
                >
                  {t.confirm}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Demand Modal */}
      <AnimatePresence>
        {showAddDemand && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddDemand(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6">{t.addDemand}</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest">Crop</label>
                    <select 
                      value={newDemand.crop}
                      onChange={e => setNewDemand({...newDemand, crop: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-emerald-500"
                    >
                      {CROPS.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest">District</label>
                    <select 
                      value={newDemand.district}
                      onChange={e => setNewDemand({...newDemand, district: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-emerald-500"
                    >
                      <option value="Any">Anywhere</option>
                      {KERALA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest">Quantity ({newDemand.unit})</label>
                    <input 
                      type="number" 
                      value={newDemand.quantity}
                      onChange={e => setNewDemand({...newDemand, quantity: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-emerald-500" 
                      placeholder="1000" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest">Max Price (per {newDemand.unit})</label>
                    <input 
                      type="number" 
                      value={newDemand.maxPrice}
                      onChange={e => setNewDemand({...newDemand, maxPrice: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-emerald-500" 
                      placeholder="35" 
                    />
                  </div>
                </div>
                <button 
                  onClick={handleSubmitDemand}
                  className="w-full py-4 bg-blue-500 text-white font-bold rounded-2xl mt-4 hover:bg-blue-400 transition-all"
                >
                  {t.post}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
