"use client";

import { Info, UtensilsCrossed, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NUTRITION_INFO = [
  { label: "Kalori", value: "450 kkal" },
  { label: "Protein", value: "18g" },
  { label: "Karbohidrat", value: "62g" },
  { label: "Lemak", value: "12g" },
];

export const TodayMenuCard = () => {
  const [showNutrisi, setShowNutrisi] = useState(false);

  return (
    <div className="px-6 mb-2 relative z-10">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center border border-violet-100">
              <UtensilsCrossed className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-[13px] tracking-tight">Menu Makan Siang</h3>
              <p className="text-[10px] font-medium text-slate-400">Jadwal Gizi Nasional</p>
            </div>
          </div>
          <span className="bg-violet-600 text-white text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full">
            HARI INI
          </span>
        </div>

        {/* Menu Item */}
        <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-3xl shrink-0 border border-slate-100 shadow-sm">
            🍱
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-slate-900 leading-tight mb-1">Nasi Bento Ayam Teriyaki</p>
            <p className="text-[10px] font-medium text-slate-500 leading-relaxed">
              Nasi Putih &bull; Ayam Tumis Teriyaki &bull; Sayur Bayam Jagung &bull; Susu UHT Rasa Cokelat
            </p>
          </div>
        </div>

        {/* Nutrisi Toggle */}
        <button
          onClick={() => setShowNutrisi(!showNutrisi)}
          className="w-full mt-3 flex items-center justify-center gap-2 text-[11px] font-bold text-violet-600 uppercase tracking-wider py-2.5 rounded-xl bg-violet-50 hover:bg-violet-100 border border-violet-100 transition-colors active:scale-[0.97] cursor-pointer"
        >
          {showNutrisi ? "Sembunyikan" : "Lihat Info Nutrisi"}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showNutrisi ? "rotate-180" : ""}`} />
        </button>

        {/* Nutrisi Panel */}
        <AnimatePresence>
          {showNutrisi && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-4 gap-2 mt-3">
                {NUTRITION_INFO.map((n) => (
                  <div key={n.label} className="text-center bg-slate-50 rounded-lg py-2.5 px-1 border border-slate-100">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">{n.label}</p>
                    <p className="text-xs font-bold text-slate-800">{n.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-[9px] text-slate-400 font-medium mt-2 flex items-center justify-center gap-1">
                <Info className="w-3 h-3" /> Data nutrisi simulasi
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
