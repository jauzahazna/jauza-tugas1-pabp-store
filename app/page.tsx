import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/store/useCartStore';
import { Truck, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { FadeUp, MotionGrid } from '@/components/MotionUI';
// Import komponen Client Card yang baru dibuat
import HomeProductCard from '@/components/HomeProductCard';

export default async function BerandaSSG() {
  const res = await fetch('https://dummyjson.com/products?limit=8');
  const data = await res.json();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative p-10 md:p-20 text-center shadow-2xl overflow-hidden isolation">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>

        <FadeUp className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-sm tracking-widest mb-6 border border-emerald-500/30">
            NEXT-GEN E-COMMERCE
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
            Belanja Cerdas <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              di ZaaStore
            </span>
          </h1>
          <p className="text-lg md:text-xl font-medium text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Temukan ribuan produk terbaik dengan pengalaman website super mulus. Halaman ini di-render menggunakan teknologi Static Site Generation (SSG).
          </p>
          <Link href="/explore" className="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-1">
            Mulai Eksplorasi <ArrowRight size={20} />
          </Link>
        </FadeUp>
      </section>

      {/* 2. FEATURES SECTION */}
      <section className="max-w-6xl mx-auto px-4">
        <FadeUp delay={0.2} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "Pengiriman Instan", desc: "Pesanan Anda diproses dan dikirim di hari yang sama." },
            { icon: ShieldCheck, title: "Pembayaran Aman", desc: "Transaksi terenkripsi 100% aman dengan Midtrans." },
            { icon: Truck, title: "Gratis Ongkir", desc: "Nikmati gratis ongkos kirim ke seluruh Indonesia." }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all group">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 group-hover:bg-emerald-50 transition-all duration-300">
                <feature.icon size={28} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </FadeUp>
      </section>

      {/* 3. CATALOG SECTION (Menggunakan HomeProductCard) */}
      <section className="max-w-7xl mx-auto px-4">
        <FadeUp>
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white-800 tracking-tight">Katalog Pilihan</h2>
              <p className="text-white-500 mt-2 font-medium">Koleksi terbaik yang diambil saat proses build (SSG).</p>
            </div>
            <Link href="/explore" className="hidden sm:flex text-emerald-600 font-bold hover:text-emerald-700 items-center gap-1">
              Lihat Semua <ArrowRight size={18} />
            </Link>
          </div>
        </FadeUp>

        <MotionGrid 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {data.products.map((p: Product) => (
            // Gunakan komponen klien di sini
            <HomeProductCard key={p.id} product={p} variants={itemVariants} />
          ))}
        </MotionGrid>
      </section>

      {/* 4. CTA BANNER SECTION */}
      <section className="max-w-6xl mx-auto px-4">
        <FadeUp delay={0.2}>
          <div className="bg-emerald-50 border border-emerald-100 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="relative z-10 max-w-xl text-center md:text-left">
              <h2 className="text-3xl font-extrabold text-emerald-950 mb-4">Jangan Lewatkan Diskon Flash Sale!</h2>
              <p className="text-emerald-700/80 font-medium text-lg">Halaman Flash Sale kami menggunakan Server-Side Rendering (SSR) untuk memastikan harga yang Anda lihat selalu real-time.</p>
            </div>
            <Link href="/flash-sale" className="relative z-10 bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-700 transition-colors shadow-xl shadow-emerald-500/20 whitespace-nowrap flex items-center gap-2">
              Kejar Diskon SSR <Zap size={20} className="fill-emerald-400" />
            </Link>
          </div>
        </FadeUp>
      </section>

    </div>
  );
}