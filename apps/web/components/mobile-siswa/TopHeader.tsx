"use client";

import { Bell } from "lucide-react";

export const TopHeader = ({ onNotificationClick }: { onNotificationClick?: () => void }) => {
  return (
    <div className="flex items-center justify-between px-6 pt-8 pb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-black text-lg relative shadow-md shadow-violet-200">
          R
          <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
        </div>
        <div>
          <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">
            GIZANTARA
          </h1>
          <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
            Portal Guru
          </p>
        </div>
      </div>
      <button
        onClick={onNotificationClick}
        className="relative w-10 h-10 min-w-[44px] min-h-[44px] rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-violet-600 hover:border-violet-200 transition-colors cursor-pointer"
        aria-label="Notifikasi"
      >
        <Bell className="w-5 h-5" />
        <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
      </button>
    </div>
  );
};
