"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import { Landmark, Store, Box, Truck, School, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "./SectionHeader";
import { PrimaryButton } from "./CustomButtons";

function AnimatedNumber({ value }: { value: string }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const numMatch = value.match(/[\d.,]+/);
    if (!numMatch) return;
    
    const numStrWithCommas = numMatch[0];
    const suffix = value.substring(numMatch.index! + numStrWithCommas.length);
    const prefix = value.substring(0, numMatch.index!);
    
    const cleanNumStr = numStrWithCommas.replace(/,/g, '');
    const target = parseFloat(cleanNumStr);
    const hasDecimals = cleanNumStr.includes('.');
    const hasCommas = numStrWithCommas.includes(',');
    
    const controls = animate(0, target, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (val) => {
        let formattedNum = hasDecimals ? val.toFixed(1) : Math.round(val).toString();
        if (hasCommas) {
           formattedNum = Math.round(val).toLocaleString('en-US');
        }
        setDisplayValue(`${prefix}${formattedNum}${suffix}`);
      }
    });
    
    return controls.stop;
  }, [value]);

  return <>{displayValue}</>;
}

const roleThemes = {
  blue: {
    iconBg: "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800",
    iconColor: "text-blue-500",
    activeBorder: "border-blue-400",
    cardStyle: "border-blue-200 shadow-[0_16px_40px_-12px_rgba(59,130,246,0.15)]",
    indicator: "after:bg-blue-500",
    badge: "bg-blue-50 text-blue-600",
    progress: "bg-blue-500",
    btn: "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white",
    hoverBorder: "hover:border-blue-500/30",
  },
  amber: {
    iconBg: "bg-gradient-to-br from-amber-100 to-amber-200 text-amber-800",
    iconColor: "text-amber-500",
    activeBorder: "border-amber-400",
    cardStyle: "border-amber-200 shadow-[0_16px_40px_-12px_rgba(245,158,11,0.15)]",
    indicator: "after:bg-amber-500",
    badge: "bg-amber-50 text-amber-600",
    progress: "bg-amber-500",
    btn: "bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white",
    hoverBorder: "hover:border-amber-500/30",
  },
  emerald: {
    iconBg: "bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-800",
    iconColor: "text-emerald-500",
    activeBorder: "border-emerald-400",
    cardStyle: "border-emerald-200 shadow-[0_16px_40px_-12px_rgba(16,185,129,0.15)]",
    indicator: "after:bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-600",
    progress: "bg-emerald-500",
    btn: "bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white",
    hoverBorder: "hover:border-emerald-500/30",
  },
  cyan: {
    iconBg: "bg-gradient-to-br from-cyan-100 to-cyan-200 text-cyan-800",
    iconColor: "text-cyan-500",
    activeBorder: "border-cyan-400",
    cardStyle: "border-cyan-200 shadow-[0_16px_40px_-12px_rgba(6,182,212,0.15)]",
    indicator: "after:bg-cyan-500",
    badge: "bg-cyan-50 text-cyan-600",
    progress: "bg-cyan-500",
    btn: "bg-cyan-50 text-cyan-600 hover:bg-cyan-500 hover:text-white",
    hoverBorder: "hover:border-cyan-500/30",
  },
  violet: {
    iconBg: "bg-gradient-to-br from-violet-100 to-violet-200 text-violet-800",
    iconColor: "text-violet-500",
    activeBorder: "border-violet-400",
    cardStyle: "border-violet-200 shadow-[0_16px_40px_-12px_rgba(139,92,246,0.15)]",
    indicator: "after:bg-violet-500",
    badge: "bg-violet-50 text-violet-600",
    progress: "bg-violet-500",
    btn: "bg-violet-50 text-violet-600 hover:bg-violet-500 hover:text-white",
    hoverBorder: "hover:border-violet-500/30",
  },
  pink: {
    iconBg: "bg-gradient-to-br from-pink-100 to-pink-200 text-pink-800",
    iconColor: "text-pink-500",
    activeBorder: "border-pink-400",
    cardStyle: "border-pink-200 shadow-[0_16px_40px_-12px_rgba(236,72,153,0.15)]",
    indicator: "after:bg-pink-500",
    badge: "bg-pink-50 text-pink-600",
    progress: "bg-pink-500",
    btn: "bg-pink-50 text-pink-600 hover:bg-pink-500 hover:text-white",
    hoverBorder: "hover:border-pink-500/30",
  }
};

const rolePreviews: Record<string, { widgetTitle: string; badgeText: string; items: { label: string; val: string; highlight?: boolean }[] }> = {
  Pemerintah: {
    widgetTitle: "Supervisi & Whitelist Vendor",
    badgeText: "SBT Active",
    items: [
      { label: "Status Whitelist", val: "1,240 Vendor Verifikasi", highlight: true },
      { label: "Audit Kepatuhan", val: "98% Compliance Rate" },
      { label: "Ledger Synced", val: "Real-time Block #4092" },
    ]
  },
  Vendor: {
    widgetTitle: "Pengadaan & Katalis HET",
    badgeText: "OCR Ready",
    items: [
      { label: "Surat Jalan (PO-2026-0001)", val: "Verified by SPPG", highlight: true },
      { label: "Bukti Transfer OCR", val: "MATCHED (Rp 15M)" },
      { label: "Stok Logistik Pangan", val: "12.5 Ton Terdistribusi" },
    ]
  },
  SPPG: {
    widgetTitle: "Penjaminan Pangan & Gizi",
    badgeText: "QC Approved",
    items: [
      { label: "Target Gizi Siswa", val: "3.2 Juta Porsi/Hari", highlight: true },
      { label: "Status PO Aktif", val: "PO-2026-0001 (Goods Received)" },
      { label: "Takaran Porsi Maksimal", val: "Valid / Anti-Overreport" },
    ]
  },
  Logistik: {
    widgetTitle: "Tracking Distribution & Geofence",
    badgeText: "< 50m GPS Valid",
    items: [
      { label: "Titik Radius Geofence", val: "Verified <= 50m", highlight: true },
      { label: "Status Armada", val: "452 Pengiriman Transit" },
      { label: "QR Scan Handover", val: "Terautentikasi" },
    ]
  },
  "Admin Sekolah": {
    widgetTitle: "Verifikasi Menu & Pelaporan",
    badgeText: "Daily Log",
    items: [
      { label: "Penerimaan Porsi", val: "1,205 Siswa Terlayani", highlight: true },
      { label: "Kesesuaian Jadwal", val: "Tepat Waktu (07:30 WIB)" },
      { label: "Foto & Laporan QC", val: "Tergugah ke System" },
    ]
  },
  Siswa: {
    widgetTitle: "Ulasan Gizi & Feedback",
    badgeText: "Ulasan Terverifikasi",
    items: [
      { label: "Rating Menu Hari Ini", val: "4.9 / 5.0 (Sangat Layak)", highlight: true },
      { label: "Sentimen Ulasan", val: "Rasa & Kebersihan Baik" },
      { label: "Status Kehadiran", val: "5/5 Hari Aktif" },
    ]
  }
};

const roles = [
  { 
    name: "Pemerintah", 
    icon: Landmark, 
    theme: roleThemes.blue, 
    href: "/goverment/dashboard",
    status: "Aktif",
    desc: "Monitoring & evaluasi program pendidikan nasional secara real-time.",
    stats: [{ value: "1,240", label: "Sekolah (Simulasi)" }, { value: "98%", label: "Coverage (Simulasi)" }],
    progress: "w-[92%]"
  },
  { 
    name: "Vendor", 
    icon: Store, 
    theme: roleThemes.amber, 
    href: "/vendor/dashboard",
    status: "Proses",
    desc: "Pengelolaan pengadaan, distribusi, dan stok logistik pangan.",
    stats: [{ value: "86", label: "Supplier (Simulasi)" }, { value: "12.5T", label: "Distribusi (Simulasi)" }],
    progress: "w-[78%]"
  },
  { 
    name: "SPPG", 
    icon: Box, 
    theme: roleThemes.emerald, 
    href: "/sppg/dashboard",
    status: "Aktif",
    desc: "Sistem Penjaminan Pangan Gizi untuk program makan bergizi gratis.",
    stats: [{ value: "3.2M", label: "Siswa (Simulasi)" }, { value: "85%", label: "Tercover (Simulasi)" }],
    progress: "w-[85%]"
  },
  { 
    name: "Logistik", 
    icon: Truck, 
    theme: roleThemes.cyan, 
    href: "/logistik/dashboard",
    status: "Transit",
    desc: "Tracking pengiriman, rute distribusi, dan manajemen gudang.",
    stats: [{ value: "452", label: "Pengiriman (Simulasi)" }, { value: "64%", label: "Terkirim (Simulasi)" }],
    progress: "w-[64%]"
  },
  { 
    name: "Admin Sekolah", 
    icon: School, 
    theme: roleThemes.violet, 
    href: "/sekolah/admin",
    status: "Aktif",
    desc: "Verifikasi data siswa, pelaporan harian, dan koordinasi program.",
    stats: [{ value: "48", label: "Kelas (Simulasi)" }, { value: "1,205", label: "Siswa (Simulasi)" }],
    progress: "w-[88%]"
  },
  { 
    name: "Siswa", 
    icon: Users, 
    theme: roleThemes.pink, 
    href: "/sekolah/siswa",
    status: "Online",
    desc: "Akses jadwal makan, laporan gizi, dan informasi program.",
    stats: [{ value: "5/5", label: "Hari Aktif (Simulasi)" }, { value: "96%", label: "Kehadiran (Simulasi)" }],
    progress: "w-[96%]"
  },
];

export function RoleGateways() {
  const [activeRoleName, setActiveRoleName] = useState(roles[0].name);
  const activeRole = roles.find(r => r.name === activeRoleName) || roles[0];

  return (
    <section id="roles" className="relative pt-[clamp(60px,7vh,90px)] pb-[clamp(80px,10vh,140px)] px-[clamp(1.5rem,5vw,4rem)] bg-white overflow-hidden">
      {/* Tailark Color Boundary Cut (PhaseTimeline #F8FAFC to RoleGateways #FFFFFF) */}
      <div className="absolute top-0 left-0 right-0 h-7 pointer-events-none z-10 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1200 28" preserveAspectRatio="none">
          <path
            d="M 0 24 C 80 24, 120 0, 240 0 L 1200 0 L 1200 0 L 0 0 Z"
            fill="#F8FAFC"
          />
          <path
            d="M 0 24 C 80 24, 120 0, 240 0 L 1200 0"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div className="max-w-[1280px] mx-auto relative z-10">
        <SectionHeader 
          label="AKSES PERAN" 
          headline="Akses Tersegmentasi, Kolaborasi Tersinkronisasi." 
          centered 
          className="mb-6 lg:mb-8 [&_h2]:text-[clamp(1.5rem,4vw,3.5rem)] [&_h2]:text-slate-900" 
        />
        <p className="hidden lg:block text-slate-600 text-lg leading-relaxed text-center max-w-[700px] mx-auto mb-8 font-medium">Setiap peran memiliki ruang kerja spesifik yang dirancang untuk menjaga integritas data dan efisiensi alur operasional B.O.G.A secara menyeluruh.</p>
        
        {/* Tailark Architectural Guideline Connector with Node Points */}
        <div className="relative w-full mb-8 hidden lg:block">
          <div className="border-t border-dashed border-slate-300/80 w-full" />
          <div className="absolute left-1/6 -top-1.5 w-3 h-3 rounded-full border border-slate-400 bg-white flex items-center justify-center text-[7px] text-slate-500 font-mono">+</div>
          <div className="absolute left-1/2 -top-1.5 w-3 h-3 rounded-full border border-slate-400 bg-white flex items-center justify-center text-[7px] text-slate-500 font-mono">+</div>
          <div className="absolute left-5/6 -top-1.5 w-3 h-3 rounded-full border border-slate-400 bg-white flex items-center justify-center text-[7px] text-slate-500 font-mono">+</div>
        </div>
        
        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-3 mb-8 pb-4 pt-2 justify-center">
          {roles.map((role) => {
            const isActive = role.name === activeRoleName;
            return (
              <button
                key={role.name}
                onClick={() => setActiveRoleName(role.name)}
                className={`flex items-center justify-center ${isActive ? 'gap-2.5 px-6 shadow-md' : 'px-5'} py-3.5 rounded-2xl transition-all duration-300 flex-shrink-0 border-2 ${
                  isActive 
                    ? `bg-[#0F172A] border-[#0F172A] text-white` 
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                }`}
              >
                <role.icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <AnimatePresence mode="popLayout">
                  {isActive && (
                    <motion.span 
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="font-bold text-[15px] whitespace-nowrap text-white overflow-hidden origin-left"
                    >
                      {role.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )
          })}
        </div>

        {/* Full Width Content Card */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRole.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white border-2 border-slate-300 shadow-xl rounded-[28px] p-6 sm:p-8 lg:p-12 w-full"
            >
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                {/* Left Column */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-5 sm:mb-6">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[20px] flex items-center justify-center relative ${activeRole.theme.iconBg} after:content-[''] after:absolute after:-top-1 after:-right-1 after:w-3.5 after:h-3.5 sm:after:w-4 sm:after:h-4 after:rounded-full after:border-[2.5px] sm:after:border-[3px] after:border-white ${activeRole.theme.indicator}`}>
                      <activeRole.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <span className={`text-[11px] sm:text-[13px] font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full tracking-wide ${activeRole.theme.badge}`}>
                      Status: {activeRole.status}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 tracking-tight">{activeRole.name} Portal</h3>
                  <p className="text-[14px] sm:text-[15px] lg:text-[17px] text-slate-500 font-medium leading-relaxed max-w-lg mb-6 lg:mb-0">
                    {activeRole.desc}
                  </p>
                </div>

                {/* Right Column: KokonutUI Style Bento Widget */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* Live Widget Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                        <span className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">
                          {rolePreviews[activeRole.name]?.widgetTitle || "Live Operasional"}
                        </span>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-[10px] font-bold px-3 py-1">
                        {rolePreviews[activeRole.name]?.badgeText || "Simulasi"}
                      </span>
                    </div>

                    {/* Bento Mini Feature List */}
                    <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 mb-6 border border-slate-800 shadow-lg text-white space-y-3">
                      {rolePreviews[activeRole.name]?.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
                          <span className="text-xs font-medium text-slate-300">{item.label}</span>
                          <span className={`text-xs font-mono font-bold ${item.highlight ? 'text-[#16A34A]' : 'text-slate-100'}`}>
                            {item.val}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Stats Summary */}
                    <div className="flex items-center gap-4 sm:gap-6 py-4 px-5 bg-slate-50 rounded-2xl mb-6 border border-slate-200">
                      <div className="flex flex-col flex-1">
                        <span className="text-2xl md:text-3xl font-black text-slate-900 leading-none mb-1 tracking-tight">
                          <AnimatedNumber value={activeRole.stats[0].value} />
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-slate-500 font-extrabold uppercase tracking-wider">{activeRole.stats[0].label}</span>
                      </div>
                      <div className="w-px h-10 bg-slate-200" />
                      <div className="flex flex-col flex-1 pl-2 sm:pl-4">
                        <span className="text-2xl md:text-3xl font-black text-slate-900 leading-none mb-1 tracking-tight">
                          <AnimatedNumber value={activeRole.stats[1].value} />
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-slate-500 font-extrabold uppercase tracking-wider">{activeRole.stats[1].label}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Capaian Operasional</span>
                      <span className="text-sm font-black text-slate-900">
                        <AnimatedNumber value={activeRole.progress.replace('w-[','').replace(']','')} />
                      </span>
                    </div>
                    <div className="h-3 rounded-full mb-6 overflow-hidden bg-slate-200 shadow-inner relative">
                      <motion.div 
                        key={`bar-${activeRole.name}`}
                        initial={{ width: 0 }}
                        animate={{ width: activeRole.progress.replace('w-[','').replace(']','') }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="h-full rounded-full bg-[#1E3A5F] absolute top-0 left-0" 
                      />
                    </div>
                    <Link href={activeRole.href} className="flex items-center justify-between px-6 py-4 rounded-xl text-sm font-black transition-all duration-300 group shadow-md bg-[#0F172A] text-white hover:bg-[#1E3A5F]">
                      <span>Masuk Modul {activeRole.name}</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
