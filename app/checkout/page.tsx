"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { useCartStore } from "@/store/useCartStore";
import { Loader2, ShieldCheck, ShoppingCart, ArrowRight, Trash2, User, Phone, MapPin, Mail, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion"; // Untuk animasi modal hapus

interface SnapResult {
  transaction_id: string;
  transaction_status: string;
  order_id: string;
  gross_amount: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: any) => void;
    };
  }
}

export default function CheckoutCSR() {
  const { cart, cartTotalPrice, clearCart, removeFromCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // State untuk Form Pelanggan
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [formError, setFormError] = useState("");

  // State untuk Modal Konfirmasi Hapus
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalBelanja = cartTotalPrice();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError(""); // Hapus error saat user mulai mengetik
  };

  const executeDelete = () => {
    if (itemToDelete !== null) {
      removeFromCart(itemToDelete);
      setItemToDelete(null);
    }
  };

  const handleCheckout = async () => {
    // 1. Validasi Form
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setFormError("Mohon lengkapi semua data pengiriman & kontak!");
      return;
    }
    
    if (cart.length === 0) return alert("Keranjang masih kosong!");
    setLoading(true);

    try {
      const itemsWithIdr = cart.map((item) => ({
        id: item.id.toString(),
        price: Math.round(item.price * 15000),
        quantity: 1,
        name: item.title.substring(0, 50),
      }));

      const finalGrossAmount = itemsWithIdr.reduce((acc, item) => acc + item.price, 0);

      const orderData = {
        order_id: `ZAASTORE-${Date.now()}`,
        gross_amount: finalGrossAmount,
        items: itemsWithIdr,
        customer_details: {
          first_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          billing_address: { address: formData.address },
          shipping_address: { address: formData.address }
        },
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat transaksi");

      window.snap.pay(data.token, {
        onSuccess: function () {
          alert("Pembayaran Berhasil! Pesanan akan segera dikirim.");
          clearCart();
        },
      });
    } catch (err) {
      alert(`Terjadi kesalahan: ${err instanceof Error ? err.message : "Checkout gagal"}`);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 relative">
      <Script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} strategy="lazyOnload" />

      {/* MODAL KONFIRMASI HAPUS (Framer Motion) */}
      <AnimatePresence>
        {itemToDelete !== null && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white p-6 md:p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Hapus Produk?</h3>
              <p className="text-slate-500 mb-8 text-sm">Produk ini akan dikeluarkan dari keranjang belanja Anda.</p>
              <div className="flex gap-3">
                <button onClick={() => setItemToDelete(null)} className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition">Batal</button>
                <button onClick={executeDelete} className="flex-1 py-3 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/30 transition">Hapus</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* KOLOM KIRI: Form Pengiriman */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-200">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-500"><ShoppingCart size={28} strokeWidth={2.5} /></div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Checkout</h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Selesaikan data Anda untuk pengiriman</p>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4 border-slate-100">Data Pengiriman</h2>
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nama Lengkap" className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-slate-700" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Alamat Email" className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-slate-700" />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 text-slate-400" size={20} />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Nomor WhatsApp" className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-slate-700" />
                </div>
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="Alamat Lengkap Pengiriman..." rows={3} className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-slate-700 resize-none"></textarea>
              </div>
              
              {formError && (
                <p className="text-rose-500 font-medium text-sm mt-2 flex items-center gap-1 bg-rose-50 p-3 rounded-lg"><AlertTriangle size={16} /> {formError}</p>
              )}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Ringkasan Keranjang */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 p-6 sm:p-8 rounded-[2.5rem] shadow-2xl sticky top-28 text-white">
            <h2 className="text-xl font-bold mb-6 flex justify-between items-center">
              Ringkasan <span className="text-xs bg-emerald-500 text-white px-3 py-1 rounded-full">{cart.length} Item</span>
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-700 rounded-2xl">
                <p className="text-slate-400 font-medium mb-4">Keranjang kosong</p>
                <Link href="/explore" className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:text-emerald-300 transition">Belanja Dulu <ArrowRight size={18} /></Link>
              </div>
            ) : (
              <>
                <ul className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map((item, index) => (
                    <li key={index} className="flex justify-between items-center group bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <button 
                          onClick={() => setItemToDelete(index)} // Pemicu Modal
                          className="text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 p-1.5 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Trash2 size={18} />
                        </button>
                        <span className="truncate font-medium text-sm text-slate-200">{item.title}</span>
                      </div>
                      <span className="font-bold text-emerald-400 text-sm whitespace-nowrap ml-2">
                        Rp {Math.round(item.price * 15000).toLocaleString("id-ID")}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-slate-700 pt-6 mt-6 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400 text-sm">Ongkos Kirim</span>
                    <span className="text-emerald-400 font-bold text-sm">Gratis</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 font-bold">Total Bayar</span>
                    <span className="text-2xl font-black text-white">Rp {totalBelanja.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading || cart.length === 0}
                  className="w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-900 py-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                >
                  {loading ? <Loader2 className="animate-spin text-slate-900" /> : <ShieldCheck />}
                  {loading ? "Memproses..." : "Bayar Sekarang"}
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}