"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, BadgeCheck, Sun, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface BriefingData {
  porsiHariIni: number;
  sengketaAktif: number;
  vendorMenunggu: number;
  urgentHref: string;
}

const SESSION_KEY = "boga_daily_briefing_dismissed";

export function DailyBriefing({ data }: { data: BriefingData }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    const isDismissed = sessionStorage.getItem(SESSION_KEY) === "true";
    if (hour < 12 && !isDismissed) setVisible(true);
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem(SESSION_KEY, "true");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -16, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -12, height: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full"
        >
          <div className="flex items-center gap-3 px-4 py-2.5 bg-role-surface border border-border rounded-xl shadow-xs">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-role-primary flex items-center justify-center text-white shadow-card">
              <Sun className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-slate-800 uppercase tracking-wider mb-0.5">
                Briefing Pagi
              </p>
              <p className="text-xs font-bold text-slate-900 leading-snug">
                Hari ini:{" "}
                <span className="font-semibold tabular-nums">
                  {data.porsiHariIni.toLocaleString("id-ID")} porsi
                </span>{" "}
                dijadwalkan —{" "}
                {data.sengketaAktif > 0 ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-status-danger">
                    <AlertCircle className="w-3 h-3" />
                    {data.sengketaAktif} sengketa
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-semibold text-status-success">
                    <BadgeCheck className="w-3 h-3" />
                    Tidak ada sengketa
                  </span>
                )}{" "}
                —{" "}
                <span className="font-semibold text-status-warning">
                  {data.vendorMenunggu} vendor baru
                </span>
              </p>
            </div>

            <Button
              onClick={() => router.push(data.urgentHref)}
              className="flex-shrink-0 h-7.5 px-3 gap-1.5 text-[11px] font-semibold uppercase tracking-wider"
            >
              Review
              <ArrowRight className="w-3 h-3" />
            </Button>

            <button
              onClick={handleDismiss}
              className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-muted hover:text-foreground hover:bg-muted-bg transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

