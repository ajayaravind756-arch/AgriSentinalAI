import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { AlertCircle, Info, AlertTriangle, X, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Broadcast {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  targetDistrict: string;
  timestamp: any;
}

export default function BroadcastBanner({ lang, userType }: { lang: 'en' | 'ml', userType: 'farmer' | 'buyer' | 'officer' | null }) {
  const [broadcast, setBroadcast] = useState<Broadcast | null>(null);
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch for farmers and buyers (officers send them!)
    if (userType === 'officer' || !userType) return;

    const q = query(
      collection(db, 'broadcasts'),
      orderBy('timestamp', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data();
        
        // Hide if older than 24 hours
        const now = new Date().getTime();
        const broadcastTime = data.timestamp?.toMillis() || now;
        if (now - broadcastTime > 24 * 60 * 60 * 1000) {
          setBroadcast(null);
          return;
        }

        const newBroadcast = {
          id: doc.id,
          ...data
        } as Broadcast;

        setBroadcast(newBroadcast);
      } else {
        setBroadcast(null);
      }
    });

    return () => unsubscribe();
  }, [userType]);

  if (!broadcast || broadcast.id === dismissedId || userType === 'officer') {
    return null;
  }

  const getStyle = () => {
    switch (broadcast.severity) {
      case 'critical':
        return 'bg-rose-500/10 border-rose-500/50 text-rose-500';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/50 text-amber-500';
      default:
        return 'bg-blue-500/10 border-blue-500/50 text-blue-500';
    }
  };

  const getIcon = () => {
    switch (broadcast.severity) {
      case 'critical': return <AlertCircle size={20} />;
      case 'warning': return <AlertTriangle size={20} />;
      default: return <Info size={20} />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`m-4 p-4 rounded-2xl border flex items-start sm:items-center justify-between gap-4 backdrop-blur-md shadow-2xl relative z-50 ${getStyle()}`}
      >
        <div className="flex items-start sm:items-center gap-4">
          <div className="mt-1 sm:mt-0 animate-pulse">
            <Radio size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              {getIcon()}
              <span className="font-bold text-sm tracking-widest uppercase">
                {lang === 'ml' ? "സർക്കാർ മുന്നറിയിപ്പ്" : "Govt Advisory"}
                {broadcast.targetDistrict !== 'All' && ` • ${broadcast.targetDistrict}`}
              </span>
            </div>
            <p className="text-sm font-medium text-white">{broadcast.message}</p>
          </div>
        </div>
        <button 
          onClick={() => setDismissedId(broadcast.id)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
        >
          <X size={20} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
