import Image from 'next/image';
import { Product } from '@/store/useCartStore';
import { Zap, Clock, TrendingUp } from 'lucide-react';
import { FadeUp, MotionGrid } from '@/components/MotionUI';
// Kita akan buat komponen ini di langkah selanjutnya
import FlashSaleClientCard from '@/components/FlashSaleClientCard';

export const dynamic = 'force-dynamic'; 

export default async function FlashSaleSSR() {
  try {
    const res = await fetch('https://dummyjson.com/products?limit=8&skip=15', { 
      cache: 'no-store' 
    });
    
    const data = await res.json();
    const productsList = data?.products || [];

    const containerVariants = {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    const itemVariants = {
      hidden: { opacity: 0, scale: 0.9, y: 30 },
      show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
    };

    return (
      <div className="space-y-12 pb-20">
        
        {/* 1. HERO FLASH SALE */}
        <FadeUp>
          <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-10 md:p-16 border border-rose-500/30 shadow-[0_0_50px_-12px_rgba(244,63,94,0.3)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 rounded-full blur-[80px] -mr-20 -mt-20"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="flex items-center gap-2 bg-rose-500 text-white px-4 py-1.5 rounded-full text-sm font-black tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse">
                <Clock size={18} /> Penawaran Terbatas
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 italic tracking-tighter uppercase">
                ⚡ Flash <span className="text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]">Deals</span>
              </h1>
              <p className="text-rose-100/70 font-medium max-w-xl text-lg leading-relaxed">
                Data ditarik secara <span className="text-rose-400 font-bold">Real-Time (SSR)</span>. Tambahkan produk ke keranjang sekarang sebelum kehabisan!
              </p>
            </div>
          </div>
        </FadeUp>

        {/* 2. PRODUCT GRID */}
        {productsList.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
            <h2 className="text-2xl font-bold text-slate-400 italic">Belum ada promo saat ini...</h2>
          </div>
        ) : (
          <MotionGrid 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {productsList.map((p: Product) => (
              <FlashSaleClientCard key={p.id} product={p} variants={itemVariants} />
            ))}
          </MotionGrid>
        )}
      </div>
    );
  } catch (error) {
    console.error("Fetch error:", error);
    return (
      <div className="text-center py-20 flex flex-col items-center">
        <Zap size={48} className="text-rose-500 animate-bounce mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">API Offline</h2>
        <p className="text-slate-500">Gagal memuat produk Flash Sale.</p>
      </div>
    );
  }
}