'use client';

import Image from 'next/image';
import { Product, useCartStore } from '@/store/useCartStore';
import { TrendingUp, ShoppingBasket } from 'lucide-react';
import { MotionItem } from '@/components/MotionUI';
// 1. Import tipe Variants dari framer-motion
import { Variants } from 'framer-motion';

// 2. Ganti 'any' menjadi 'Variants'
interface FlashSaleCardProps {
  product: Product;
  variants: Variants; 
}

export default function FlashSaleClientCard({ product, variants }: FlashSaleCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  
  // Hitung harga diskon (50%)
  const discountedPrice = product.price / 2;

  return (
    <MotionItem variants={variants} className="group relative h-full">
      <div className="bg-slate-900 rounded-[2.5rem] p-5 shadow-2xl border border-slate-800 transition-all duration-500 hover:border-rose-500/40 flex flex-col h-full overflow-hidden relative">
        
        {/* Shine Effect - Memberikan kesan premium saat hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

        {/* Discount Badge */}
        <div className="absolute top-5 right-5 z-20">
          <div className="bg-rose-600 text-white text-[10px] font-black px-3 py-1 rounded-lg shadow-lg border border-rose-400/30 flex items-center gap-1 uppercase tracking-tighter">
            <TrendingUp size={12} /> -50% OFF
          </div>
        </div>

        {/* Image Container */}
        <div className="relative w-full h-52 mb-6 bg-white rounded-3xl p-6 overflow-hidden transition-all duration-500 shadow-inner group-hover:shadow-rose-500/10">
          <Image 
            src={product.thumbnail} 
            alt={product.title} 
            fill 
            className="object-contain group-hover:scale-110 transition-transform duration-700 ease-out" 
            sizes="(max-width: 768px) 100vw, 25vw" 
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-grow px-2">
          <h2 className="font-bold text-lg text-white truncate mb-2 group-hover:text-rose-400 transition-colors">
            {product.title}
          </h2>
          
          <div className="mt-auto pt-4 border-t border-slate-800/50 flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              {/* Harga Diskon dengan efek Glow */}
              <p className="text-rose-500 font-black text-3xl tracking-tight drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]">
                ${discountedPrice.toFixed(2)}
              </p>
              {/* Harga Asli */}
              <p className="text-slate-500 line-through text-xs font-bold opacity-60">
                ${product.price}
              </p>
            </div>
          </div>

          {/* Tombol Tambah Keranjang dengan Interaksi Tactile */}
          <button 
            onClick={() => {
              // Pastikan harga yang masuk ke keranjang adalah harga diskon
              addToCart({ ...product, price: discountedPrice });
            }}
            className="mt-6 w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-rose-900/40 hover:bg-rose-500 hover:shadow-rose-600/60 active:scale-95 transition-all duration-200"
          >
            <ShoppingBasket size={18} />
            Tambah Keranjang
          </button>
        </div>
      </div>
    </MotionItem>
  );
}