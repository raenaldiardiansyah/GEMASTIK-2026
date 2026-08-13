"use client";

import { motion } from "framer-motion";
import { ChevronDown, Info } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "./CustomButtons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-24 md:pt-28 pb-16 flex items-center justify-center overflow-hidden bg-[#0F172A]">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 py-2 lg:py-4 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-8 items-center">
        {/* Left: Copy */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-left"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold uppercase tracking-wider mb-4 shadow-md backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Audit Logistik & Pembayaran MBG
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.06] tracking-tight text-white mb-4"
          >
            Penelusuran <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">End-to-End</span> <br />
            Platform MBG.
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-slate-300 leading-relaxed max-w-xl mb-6 font-normal"
          >
            Memverifikasi vendor, memantau pengadaan, mengaudit pembayaran via OCR bukti transfer, hingga memvalidasi distribusi geofence 50m dalam immutable ledger.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <PrimaryButton href="/auth/login" className="w-full sm:w-auto px-8 py-3 text-sm bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:brightness-110 shadow-lg shadow-cyan-500/25">
              Masuk Simulasi
            </PrimaryButton>
            <SecondaryButton href="#how-it-works" dark className="w-full sm:w-auto text-sm border-slate-700 text-slate-200 hover:bg-slate-800 py-3">
              Lihat 5 Fase Alur
            </SecondaryButton>
          </motion.div>
        </motion.div>

        {/* Right: Interactive Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
          className="relative hidden lg:block"
        >
          {/* Mockup Container */}
          <div className="relative w-full aspect-[4/3] rounded-2xl bg-[#0B1120] border border-slate-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden">
            {/* Window Topbar */}
            <div className="h-10 border-b border-slate-800 bg-[#0F172A] flex items-center px-4 gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <div className="flex-1 text-center">
                <div className="inline-block bg-[#0B1120] px-4 py-1 rounded-md text-[10px] text-slate-400 font-mono border border-slate-800/80">boga.app/ledger/audit-ocr</div>
              </div>
            </div>
            
            {/* Mockup Body */}
            <div className="p-5 flex flex-col h-[calc(100%-2.5rem)]">
              {/* Header with Popover explanation 1: Komputer Bisa Baca Struk (OCR Otomatis) */}
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800 cursor-pointer hover:bg-slate-900/60 p-2 rounded-xl transition-all group">
                    <div>
                      <p className="text-[13px] font-bold text-white flex items-center gap-2 group-hover:text-cyan-300 transition-colors">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Audit Pembayaran (OCR Engine)
                        <Info className="w-3.5 h-3.5 text-cyan-400 opacity-70 group-hover:opacity-100 ml-1" />
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">PO-2026-0001 • Immutable Ledger</p>
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[9px] font-extrabold uppercase tracking-wider shadow-sm">
                      MATCHED (100%)
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4 shadow-2xl bg-[#0F172A] border border-cyan-500/40 text-white z-50">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      Komputer Bisa Baca Struk (OCR Otomatis)
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      Sistem ini bisa melihat dan membaca foto bukti transfer pembayaran secara otomatis. Komputer langsung memastikan uang yang ditransfer sudah cocok 100% dengan nota tagihannya, jadi tidak perlu lagi repot mengecek secara manual.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
              
              {/* Rows */}
              <div className="flex-1 flex flex-col justify-center gap-2 py-2">
                {/* Rows 1, 2, 3: Aliran Dana Transparan */}
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="space-y-2 cursor-pointer group">
                      {[
                        { label: "Pengirim", value: "SPPG Kota Bandung", icon: "🏦" },
                        { label: "Penerima", value: "PT Vendor Pangan Berkah", icon: "🏢" },
                        { label: "Nominal PO", value: "Rp 15.000.000", icon: "💰", match: true }
                      ].map((row, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 group-hover:border-blue-500/40 transition-colors">
                          <div className="flex items-center gap-2.5">
                            <span className="text-sm">{row.icon}</span>
                            <span className="text-[11px] font-medium text-slate-300">{row.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] ${row.match ? 'text-emerald-400 font-bold' : 'text-white font-semibold'}`}>{row.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4 shadow-2xl bg-[#0F172A] border border-blue-500/40 text-white z-50">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        Aliran Dana Transparan
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">
                        Kelihatan sangat jelas siapa yang membayar (SPPG Kota Bandung), kepada siapa uang itu dibayarkan (PT Vendor Pangan Berkah), dan nominal pastinya (Rp 15.000.000).
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Row 4: Buku Catatan Anti-Korupsi (Ledger & Hash) */}
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex items-center justify-between bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 hover:border-purple-500/50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm">🔗</span>
                        <span className="text-[11px] font-medium text-slate-300 group-hover:text-purple-300 transition-colors">Hash Ledger</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-400 group-hover:text-purple-300 transition-colors">0x8F2a...39bE91c</span>
                        <Info className="w-3 h-3 text-purple-400 opacity-70 group-hover:opacity-100" />
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-84 p-4 shadow-2xl bg-[#0F172A] border border-purple-500/40 text-white z-50">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                        Buku Catatan Anti-Korupsi (Ledger & Hash)
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">
                        Semua catatan pembayaran ini &ldquo;digembok&rdquo; menggunakan sistem keamanan tingkat tinggi (kode huruf dan angka acak di bagian bawah layar). Artinya, setelah data masuk ke sistem, tidak ada satu orang pun yang bisa menghapus, mengedit, atau memalsukan bukti bayar tersebut.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Mini Distribution Chart */}
              <div className="h-10 flex items-end gap-1.5 px-1 pt-1">
                {[45, 75, 50, 95, 70, 100, 85].map((h, i) => (
                  <div key={i} className="flex-1 bg-cyan-500/20 rounded-t border-t border-cyan-500/50 relative overflow-hidden group" style={{ height: `${h}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-cyan-500/20 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Floating Element 1: Pelacak Lokasi Akurat (Geofence) */}
          <Popover>
            <PopoverTrigger asChild>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-5 -left-6 bg-[#0F172A] border border-slate-700 p-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-30 cursor-pointer hover:border-emerald-500/50 hover:scale-105 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm border border-emerald-500/30 font-black group-hover:bg-emerald-500 group-hover:text-white transition-colors">✓</div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    Distribusi Logistik
                    <Info className="w-2.5 h-2.5 text-emerald-400 opacity-70 group-hover:opacity-100" />
                  </p>
                  <p className="text-[11px] font-mono text-white font-bold">Geofence: &le; 50m Verified</p>
                </div>
              </motion.div>
            </PopoverTrigger>
            <PopoverContent className="w-84 p-4 shadow-2xl bg-[#0F172A] border border-emerald-500/40 text-white z-50">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Pelacak Lokasi Akurat (Geofence)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Ini berfungsi seperti sistem absen berbasis GPS. Sistem akan mengunci dan memastikan kurir pembawa logistik benar-benar sudah berada di titik lokasi tujuan (dengan jarak maksimal 50 meter). Jadi, tidak ada celah untuk berbohong mengatakan &ldquo;barang sudah dikirim&rdquo; padahal truknya masih ada di jalan atau gudang.
                </p>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Floating Element 2: Komputer Bisa Baca Struk (OCR Otomatis) */}
          <Popover>
            <PopoverTrigger asChild>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -top-5 -right-5 bg-[#0F172A] border border-slate-700 p-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-30 cursor-pointer hover:border-cyan-500/50 hover:scale-105 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm border border-cyan-500/30 font-bold group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    Bukti Transfer
                    <Info className="w-2.5 h-2.5 text-cyan-400 opacity-70 group-hover:opacity-100" />
                  </p>
                  <p className="text-[11px] font-mono text-white font-bold">OCR Validated</p>
                </div>
              </motion.div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 shadow-2xl bg-[#0F172A] border border-cyan-500/40 text-white z-50">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  Komputer Bisa Baca Struk (OCR Otomatis)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Sistem ini bisa melihat dan membaca foto bukti transfer pembayaran secara otomatis. Komputer langsung memastikan uang yang ditransfer sudah cocok 100% dengan nota tagihannya, jadi tidak perlu lagi repot mengecek secara manual.
                </p>
              </div>
            </PopoverContent>
          </Popover>

        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="hidden lg:flex flex-col items-center gap-2 text-slate-400">
          <ChevronDown className="w-5 h-5 animate-[bounceSlow_2s_ease-in-out_infinite]" />
        </div>
      </motion.div>
    </section>
  );
}