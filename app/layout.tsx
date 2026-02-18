import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 1. IMPORT NAVBAR DAN GLOBAL TOAST
import Navbar from "@/components/Navbar"; 
import GlobalToast from "@/components/GlobalToast"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZaaStore | Next-Gen E-Commerce",
  description: "Toko online modern dengan SSG, SSR, dan CSR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        {/* Navbar muncul di semua halaman */}
        <Navbar />
        
        {/* Konten Halaman Utama */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* 2. PASANG GLOBAL TOAST DI SINI */}
        <GlobalToast />
        
      </body>
    </html>
  );
}