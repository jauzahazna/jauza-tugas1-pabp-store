'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product, useCartStore } from '@/store/useCartStore';
import { Loader2, Search, AlertCircle, ShoppingBag } from 'lucide-react';

export default function ExploreCSR() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('phone'); // Default pencarian
  const [error, setError] = useState('');
  
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`https://dummyjson.com/products/search?q=${searchQuery}`);
        if (!res.ok) throw new Error('Gagal mengambil data produk dari server.');
        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        // Perbaikan TypeScript: Memastikan 'err' adalah instance dari Error
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Terjadi kesalahan yang tidak diketahui.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    // Debouncing: Mencegah API terpanggil setiap huruf diketik
    const timeoutId = setTimeout(() => {
      if(searchQuery) fetchProducts();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-transparent-50">
      {/* Header & Search Section */}
      <div className="mb-10 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">
          Explore Produk <span className="text-emerald-500">(CSR)</span>
        </h1>
        <p className="text-slate-500 mb-8 font-medium">
          Pencarian interaktif ini dirender penuh di sisi klien. Coba cari <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">laptop</span> atau <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">perfume</span>.
        </p>
        
        {/* Fitur Search (Interaktif) */}
        <div className="relative max-w-2xl">
          <input 
            type="text" 
            placeholder="Ketik produk impianmu di sini..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-full py-4 px-6 pl-14 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm text-lg"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
        </div>
      </div>

      {/* Error Handling State */}
      {error && (
        <div className="flex items-center gap-3 text-rose-600 bg-rose-50 border border-rose-200 p-5 rounded-2xl font-semibold mb-8 shadow-sm">
          <AlertCircle size={24} /> {error}
        </div>
      )}

      {/* Loading State & Product Grid */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-32 space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
          <p className="text-slate-500 font-medium animate-pulse">Mencari produk...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
              <Search size={48} className="mb-4 opacity-20" />
              <p className="text-xl font-semibold">Produk tidak ditemukan.</p>
              <p className="text-sm mt-2">Coba gunakan kata kunci lain.</p>
            </div>
          ) : (
            products.map((p) => (
              <div 
                key={p.id} 
                className="group bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl border border-transparent hover:border-emerald-100 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1"
              >
                <div>
                  <div className="relative w-full h-48 mb-5 bg-slate-50 rounded-2xl overflow-hidden group-hover:bg-emerald-50/30 transition-colors">
                    <Image 
                      src={p.thumbnail} 
                      alt={p.title} 
                      fill 
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500" 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" 
                    />
                  </div>
                  <h2 className="font-bold text-xl text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">{p.title}</h2>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">{p.description}</p>
                </div>
                
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                  <p className="text-2xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors">${p.price}</p>
                  <button 
                    onClick={() => addToCart(p)}
                    className="bg-slate-100 text-slate-700 hover:bg-emerald-500 hover:text-white p-3 rounded-xl font-bold transition-all duration-300 active:scale-95 shadow-sm hover:shadow-emerald-500/30"
                    title="Tambah ke Keranjang"
                  >
                    <ShoppingBag size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}