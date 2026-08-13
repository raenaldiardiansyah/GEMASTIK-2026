"use client";

import { Home, Map as MapIcon, Utensils, MessageSquare, Menu } from "lucide-react";

interface FloatingBottomNavProps {
  activeTab: "home" | "map" | "rate" | "messages" | "menu";
  onTabChange: (tab: "home" | "map" | "rate" | "messages" | "menu") => void;
}

export const FloatingBottomNav = ({ activeTab, onTabChange }: FloatingBottomNavProps) => {
  return (
    <div className="fixed bottom-0 sm:bottom-6 left-0 w-full px-0 sm:px-6 z-[60] pointer-events-none pb-[env(safe-area-inset-bottom)] sm:pb-0 bg-gradient-to-t from-slate-100/80 to-transparent sm:from-transparent">
      <div className="w-full max-w-sm mx-auto bg-white/90 backdrop-blur-xl rounded-none sm:rounded-[2rem] p-2 flex items-center justify-between shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] border-t sm:border border-slate-200 pointer-events-auto">
        <button 
          onClick={() => onTabChange("home")}
          className={`p-4 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors ${activeTab === "home" ? "text-violet-600" : "text-slate-400 hover:text-violet-600"}`} 
          aria-label="Home"
        >
          <Home className="w-5 h-5" />
        </button>
        <button 
          onClick={() => onTabChange("map")}
          className={`p-4 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors ${activeTab === "map" ? "text-violet-600" : "text-slate-400 hover:text-violet-600"}`} 
          aria-label="Map"
        >
          <MapIcon className="w-5 h-5" />
        </button>
        
        {/* Central Rate Action Button */}
        <button 
          onClick={() => onTabChange("rate")}
          className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all cursor-pointer ${
            activeTab === "rate" 
              ? "bg-violet-600 scale-105 shadow-violet-200 text-white" 
              : "bg-slate-900 active:scale-95 text-white hover:bg-slate-800"
          }`} 
          aria-label="Rate Food"
        >
          <Utensils className={`w-5 h-5 transition-transform ${activeTab === "rate" ? "scale-110" : ""}`} strokeWidth={2.5} />
        </button>

        <button 
          onClick={() => onTabChange("messages")}
          className={`p-4 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors relative ${activeTab === "messages" ? "text-violet-600" : "text-slate-400 hover:text-violet-600"}`} 
          aria-label="Messages"
        >
          <MessageSquare className="w-5 h-5" />
          <div className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border border-white"></div>
        </button>
        <button 
          onClick={() => onTabChange("menu")}
          className={`p-4 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors ${activeTab === "menu" ? "text-violet-600" : "text-slate-400 hover:text-violet-600"}`} 
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
