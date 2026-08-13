"use client";

import { Navigation2 } from "lucide-react";

interface HeroGreetingProps {
  onViewMap: () => void;
}

export const HeroGreeting = ({ onViewMap }: HeroGreetingProps) => {
  return (
    <div className="px-6 py-6 pb-2 relative z-10">
      <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-[1.1] mb-1">
        Halo{" "}
        <span className="text-violet-600">Raenaldi!</span>
      </h2>
      <p className="text-sm text-slate-500 font-medium mb-6">
        <span className="font-bold text-slate-700">2.693</span> penerima makan hari ini
        <span className="ml-1.5 inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-amber-100">
          Simulasi
        </span>
      </p>

      <button 
        onClick={onViewMap}
        className="w-full bg-violet-600 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-violet-200 active:scale-[0.97] transition-all cursor-pointer hover:bg-violet-700"
      >
        Lihat Peta Sekolah
        <Navigation2 className="w-4 h-4 rotate-90" />
      </button>
    </div>
  );
};
