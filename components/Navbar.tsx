'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Store, Menu, X } from 'lucide-react'; // Tambahkan Menu & X
import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // State untuk Hamburger Menu
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.cartTotal());
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Tutup menu saat rute berubah
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Beranda (SSG)', href: '/' },
    { name: 'Flash Sale (SSR)', href: '/flashSale' },
    { name: 'Explore (CSR)', href: '/explore' },
  ];

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-black text-emerald-400">
          <Store size={28} />
          <span className="tracking-tighter">ZaaStore</span>
        </Link>

        {/* Desktop Menu (Tampil di md ke atas) */}
        <div className="hidden md:flex gap-8 font-semibold">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-all duration-300 pb-1 border-b-2 ${
                pathname === link.href ? "text-emerald-400 border-emerald-400" : "text-slate-300 border-transparent hover:text-emerald-300"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Icons (Cart & Hamburger) */}
        <div className="flex items-center gap-4">
          <Link href="/checkout" className="relative p-2.5 bg-slate-800 rounded-full hover:bg-slate-700 transition">
            <ShoppingCart size={22} className={mounted && totalItems > 0 ? "text-emerald-400" : "text-white"} />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-lg ring-2 ring-slate-900">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Hamburger Button (Tampil hanya di Mobile) */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white transition"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay (AnimatePresence untuk animasi keluar) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-800 border-t border-slate-700 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-lg font-bold py-2 px-4 rounded-xl ${
                    pathname === link.href ? "bg-emerald-500 text-white" : "text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}