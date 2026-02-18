'use client';

import Image from 'next/image';
import { Product, useCartStore } from '@/store/useCartStore';
import { ShoppingCart } from 'lucide-react';
import { MotionItem } from '@/components/MotionUI';
import { Variants } from 'framer-motion';

interface HomeProductCardProps {
  product: Product;
  variants: Variants;
}

export default function HomeProductCard({ product, variants }: HomeProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <MotionItem 
      variants={variants} 
      className="group bg-white rounded-[2rem] p-5 shadow-sm hover:shadow-2xl border border-slate-100 hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        <div className="relative w-full h-52 mb-6 bg-slate-50 rounded-2xl overflow-hidden group-hover:bg-emerald-50/50 transition-colors">
          <Image 
            src={product.thumbnail} 
            alt={product.title} 
            fill 
            className="object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out" 
            sizes="(max-width: 768px) 100vw, 25vw" 
          />
        </div>
        <h3 className="font-bold text-lg text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
          {product.title}
        </h3>
        <p className="text-sm text-slate-500 mt-2 line-clamp-2">
          {product.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <p className="text-2xl font-black text-slate-900">${product.price}</p>
        
        {/* Tombol Tambah Keranjang */}
        <button 
          onClick={() => addToCart(product)}
          className="bg-slate-100 hover:bg-emerald-500 text-slate-600 hover:text-white p-3 rounded-xl transition-all duration-300 active:scale-90 shadow-sm hover:shadow-emerald-500/30"
          title="Tambah ke Keranjang"
        >
          <ShoppingCart size={20} />
        </button>
      </div>
    </MotionItem>
  );
}