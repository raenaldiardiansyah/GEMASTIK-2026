"use client";

import { Crown, Flame, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VendorRanking from "@/components/ui/vendorranking";

export const StatsAndLeaderboard = () => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <div className="py-2 space-y-8 relative z-10">
      {/* Gamified Leaderboard */}
      <div className="px-6">
        <div className="bg-slate-900 rounded-2xl p-5 shadow-sm relative overflow-hidden border border-slate-800">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" fill="currentColor" />
                <h3 className="text-base font-bold text-white tracking-tight">Battle Leaderboard</h3>
              </div>
              <span className="bg-violet-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                Simulasi
              </span>
            </div>
            <p className="text-slate-400 text-[11px] mb-4">Siapa SPPG dan Vendor top 1 saat ini?</p>
            
            <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between mb-4 border border-white/5">
               <div>
                 <p className="text-[9px] font-bold text-amber-400 uppercase tracking-widest mb-0.5">Rank #1 Hari Ini</p>
                 <p className="text-xs font-bold text-white flex items-center gap-1.5">
                   Boga Utama <Flame className="w-3.5 h-3.5 text-orange-500" fill="currentColor" />
                 </p>
               </div>
               <div className="w-8 h-8 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-slate-950 font-black text-sm">
                 1
               </div>
            </div>

            <button 
               onClick={() => setShowLeaderboard(!showLeaderboard)}
               className="w-full bg-white text-slate-900 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer hover:bg-slate-50"
            >
              {showLeaderboard ? "Tutup Ranking" : "Cek Semua Ranking"}{" "}
              <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${showLeaderboard ? 'rotate-90' : ''}`} />
            </button>
          </div>

          <AnimatePresence>
            {showLeaderboard && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                  <div className="max-h-[60vh] overflow-y-auto rounded-xl mt-4 bg-slate-950/40 p-2 border border-white/5">
                     <VendorRanking type="vendor" mobileOnly={true} />
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
