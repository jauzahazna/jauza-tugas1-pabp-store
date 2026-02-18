import { Loader2 } from 'lucide-react';

export default function GlobalLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mb-4" />
      <h2 className="text-xl font-bold text-slate-700">Memuat Halaman ZaaStore...</h2>
    </div>
  );
}