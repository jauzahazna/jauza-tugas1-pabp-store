'use client';

import { useCartStore } from '@/store/useCartStore';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function GlobalToast() {
  const notification = useCartStore((state) => state.notification);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          // Animasi Spring (Membal) agar terasa organik
          initial={{ opacity: 0, y: 100, x: '-50%', scale: 0.8 }}
          animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
          exit={{ opacity: 0, y: 50, x: '-50%', scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-10 left-1/2 z-[100] min-w-[320px] max-w-[90vw]"
        >
          {/* Container Utama dengan Glassmorphism */}
          <div className="relative overflow-hidden bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4">
            
            {/* Ikon Animasi */}
            <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
              <ShoppingBag className="text-emerald-400 animate-bounce" size={24} />
            </div>

            {/* Teks Informasi */}
            <div className="flex-grow">
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-emerald-400 mb-0.5">
                Added to Cart
              </p>
              <p className="text-white font-bold text-sm line-clamp-1">
                {notification}
              </p>
            </div>

            {/* Ikon Status */}
            <div className="flex-shrink-0 pr-1">
              <CheckCircle2 className="text-emerald-400" size={20} />
            </div>

            {/* Progress Bar (Timer Visual) */}
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 3, ease: "linear" }}
              className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-emerald-500 to-teal-400"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}