"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, MapPin, Sparkles, FileText, ShoppingBag, Receipt, Database, Star } from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "./SectionHeader";

const phasesData = [
  {
    step: 1,
    phaseTag: "FASE 01",
    title: "Verifikasi & Whitelist Vendor",
    subtitle: "AI OCR Dokumen Legalitas (NIB / NPWP / Rekening)",
    description: "Vendor mendaftarkan identitas legal. Engine AI OCR memindai NIB, NPWP, dan nomor rekening secara instan. Pemerintah meninjau data sebelum menerbitkan sertifikat whitelist SBT.",
    features: [
      "Ekstraksi AI OCR 99.8% akurat",
      "Validasi otomatis rekening bank & NIB",
      "Pemerintah approve ke Whitelist B.O.G.A"
    ],
    href: "/goverment/pengajuan",
    align: "left" as const,
    color: "from-blue-600 to-indigo-600",
    badgeBg: "bg-blue-500/10 text-blue-700 border-blue-200",
    // Live Mockup Card (Sisi Kanan)
    mockup: (
      <div className="bg-[#0F172A] border-2 border-slate-800 rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden group hover:border-blue-500/50 transition-colors">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-extrabold text-white">AI OCR Scanner Active</h5>
              <p className="text-[11px] text-slate-400">CV. Tani Makmur Sejahtera</p>
            </div>
          </div>
          <span className="text-[10px] font-black px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            99.8% MATCH
          </span>
        </div>
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400">Nomor NIB:</span>
            <span className="font-mono text-cyan-300 font-bold">1289000142981</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400">NPWP Perusahaan:</span>
            <span className="font-mono text-emerald-300 font-bold">01.345.678.9-012.000</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400">Rekening Verified:</span>
            <span className="font-mono text-amber-300 font-bold">BRI 0234-01-002938-50-1</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Status Whitelist:</span>
          <span className="font-black text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            APPROVED BY GOVERMENT
          </span>
        </div>
      </div>
    )
  },
  {
    step: 2,
    phaseTag: "FASE 02",
    title: "Pengadaan & Purchase Order (PO)",
    subtitle: "Tender Katalog SPPG dengan Batas HET",
    description: "SPPG menerbitkan Purchase Order (PO-2026-0001) berdasarkan katalog vendor ter-whitelist. Batas HET dikunci untuk mencegah penggelembungan harga. Vendor mengirim barang, dan QC SPPG memverifikasi penerimaan.",
    features: [
      "Katalog HET terkunci anti-markup",
      "Penerbitan PO-2026 dengan nomor unik",
      "QC SPPG Inspeksi Goods Received"
    ],
    href: "/sppg/admin/evaluation",
    align: "right" as const,
    color: "from-amber-600 to-orange-600",
    badgeBg: "bg-amber-500/10 text-amber-700 border-amber-200",
    // Live Mockup Card (Sisi Kiri)
    mockup: (
      <div className="bg-[#0F172A] border-2 border-slate-800 rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden group hover:border-amber-500/50 transition-colors">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-extrabold text-white">PO-2026-0001</h5>
              <p className="text-[11px] text-slate-400">SPPG Jakarta Selatan 01</p>
            </div>
          </div>
          <span className="text-[10px] font-black px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
            GOODS RECEIVED
          </span>
        </div>
        <div className="space-y-2.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Telur Ayam Segar Grade A</p>
              <p className="text-[11px] text-slate-400">1.200 Kg &bull; Rp 28.000 / kg</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
              &le; HET Rp 30.000
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Beras Premium Pandan Wangi</p>
              <p className="text-[11px] text-slate-400">2.500 Kg &bull; Rp 14.500 / kg</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
              &le; HET Rp 16.000
            </span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Inspeksi QC SPPG:</span>
          <span className="font-black text-cyan-300">100% Lolos Verifikasi Fisik</span>
        </div>
      </div>
    )
  },
  {
    step: 3,
    phaseTag: "FASE 03",
    title: "Audit Pembayaran via OCR",
    subtitle: "Transfer Bank Manual SPPG + Ekstraksi AI OCR",
    description: "Setelah QC menyetujui barang, SPPG melakukan transfer bank manual ke rekening vendor dan mengunggah bukti transfer. AI OCR membaca tanggal, nominal, pengirim, penerima, dan refID untuk memverifikasi kesesuaian dengan PO.",
    features: [
      "Transfer manual langsung oleh SPPG",
      "OCR ekstraksi nominal, bank & refID",
      "Penetapan status MATCH / UNDERPAID"
    ],
    href: "/vendor/pesanan",
    align: "left" as const,
    color: "from-emerald-600 to-teal-600",
    badgeBg: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
    // Live Mockup Card (Sisi Kanan)
    mockup: (
      <div className="bg-[#0F172A] border-2 border-slate-800 rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-extrabold text-white">OCR Receipt Audit</h5>
              <p className="text-[11px] text-slate-400">Bukti Struk Transfer Bank</p>
            </div>
          </div>
          <span className="text-[10px] font-black px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
            PAYMENT MATCHED
          </span>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400">Nominal Struk OCR:</span>
            <span className="font-mono text-emerald-400 font-black text-sm">Rp 69.850.000</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400">Nominal PO Target:</span>
            <span className="font-mono text-slate-300 font-bold">Rp 69.850.000</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400">Ref ID Bank:</span>
            <span className="font-mono text-cyan-300 font-bold">TRX-2026-9810238</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Hasil Audit OCR:</span>
          <span className="font-black text-emerald-400">0 Mismatch &bull; Siap Masuk Ledger</span>
        </div>
      </div>
    )
  },
  {
    step: 4,
    phaseTag: "FASE 04",
    title: "Ledger Immutable & Skor Reputasi",
    subtitle: "Enkripsi Block Hash & Peringkat Transparansi",
    description: "Setiap riwayat transaksi — verifikasi vendor, penerbitan PO, hasil QC, dan audit OCR — direkam sebagai entri ledger immutabel ber-hash. Skor reputasi vendor dan SPPG diperbarui secara terbuka.",
    features: [
      "Perekaman hash ledger tidak dapat diubah",
      "Pembaruan otomatis Skor Kepatuhan SPPG & Vendor",
      "Transparansi penuh bagi publik & auditor"
    ],
    href: "/vendor/profil",
    align: "right" as const,
    color: "from-purple-600 to-violet-600",
    badgeBg: "bg-purple-500/10 text-purple-700 border-purple-200",
    // Live Mockup Card (Sisi Kiri)
    mockup: (
      <div className="bg-[#0F172A] border-2 border-slate-800 rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden group hover:border-purple-500/50 transition-colors">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-extrabold text-white">Immutable Ledger Entry</h5>
              <p className="text-[11px] text-slate-400">Block #10492 &bull; Immutable</p>
            </div>
          </div>
          <span className="text-[10px] font-black px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            HASH VERIFIED
          </span>
        </div>
        <div className="space-y-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <p className="text-[10px] text-slate-400 mb-1">Block Hash Digest:</p>
            <p className="font-mono text-cyan-300 text-[11px] truncate">0x9f8a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-[10px] text-slate-400">Skor Reputasi Vendor:</p>
              <p className="font-extrabold text-emerald-400 text-sm">98.4 / 100</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-[10px] text-slate-400">SPPG On-Time Rate:</p>
              <p className="font-extrabold text-cyan-400 text-sm">99.1%</p>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Status Audit:</span>
          <span className="font-black text-purple-300">Tersimpan dalam Ledger Publik</span>
        </div>
      </div>
    )
  },
  {
    step: 5,
    phaseTag: "FASE 05",
    title: "Distribusi Geofence & Rating Siswa",
    subtitle: "Validasi GPS <= 50m & Sentimen AI NLP",
    description: "Kurir memindai QR di titik lokasi sekolah. Formula Haversine memverifikasi koordinat GPS ≤ 50m sebelum status distribusi berubah menjadi Verified. Siswa memberikan ulasan gizi yang dikelompokkan oleh AI NLP.",
    features: [
      "Geofencing radius ketat ≤ 50 meter",
      "QR Scan titik serah terima sekolah",
      "Analisis ulasan & kecukupan gizi AI NLP"
    ],
    href: "/sekolah/siswa",
    align: "left" as const,
    color: "from-cyan-600 to-teal-600",
    badgeBg: "bg-cyan-500/10 text-cyan-700 border-cyan-200",
    // Live Mockup Card (Sisi Kanan)
    mockup: (
      <div className="bg-[#0F172A] border-2 border-slate-800 rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-extrabold text-white">Geofence GPS Verified</h5>
              <p className="text-[11px] text-slate-400">SD Negeri 01 Menteng Jakarta</p>
            </div>
          </div>
          <span className="text-[10px] font-black px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            RADIUS 18m (&le;50m)
          </span>
        </div>
        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400">Ulasan & Rating Siswa:</p>
              <div className="flex items-center gap-1 text-amber-400 font-extrabold mt-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="text-white text-xs ml-1 font-extrabold">4.9 / 5.0</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              NLP: Positif (98%)
            </span>
          </div>
          <p className="text-[11px] text-slate-300 italic px-1 leading-relaxed">
            &ldquo;Makanan datang hangat, nasi pulen, lauk pauk segar dan lengkap sesuai standar gizi!&rdquo;
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Status Siklus Audit:</span>
          <span className="font-black text-emerald-400">★ 100% Selesai & Terverifikasi</span>
        </div>
      </div>
    )
  }
];

export function PhaseTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const clipPathValue = useTransform(scrollYProgress, [0, 1], ["inset(0 0 100% 0)", "inset(0 0 0% 0)"]);

  return (
    <section id="how-it-works" className="relative pt-[clamp(60px,7vh,90px)] pb-[clamp(70px,9vh,120px)] px-[clamp(1.5rem,5vw,4rem)] bg-[#F8FAFC] overflow-hidden">
      {/* Tailark Color Boundary Cut (Hero #0F172A to PhaseTimeline #F8FAFC) */}
      <div className="absolute top-0 left-0 right-0 h-7 pointer-events-none z-10 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1200 28" preserveAspectRatio="none">
          <path
            d="M 0 0 L 40 0 C 80 0, 100 24, 160 24 L 1040 24 C 1100 24, 1120 0, 1160 0 L 1200 0 L 1200 0 L 0 0 Z"
            fill="#0F172A"
          />
          <path
            d="M 0 0 L 40 0 C 80 0, 100 24, 160 24 L 1040 24 C 1100 24, 1120 0, 1160 0 L 1200 0"
            fill="none"
            stroke="#334155"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div className="max-w-[1240px] mx-auto relative z-10">
        <SectionHeader 
          label="ALUR AUDIT ALUR KERJA" 
          headline="5 Fase Operasional Dari Verifikasi Dokumen Hingga Ulasan Siswa." 
          centered 
          className="mb-4 [&_h2]:text-[clamp(1.5rem,4vw,3.5rem)] [&_h2]:text-slate-900" 
        />
        <p className="text-slate-600 text-base md:text-lg leading-relaxed text-center max-w-[780px] mx-auto mb-10 font-medium">
          Setiap fase dikunci oleh satu bukti otentik yang terdokumentasi — dari verifikasi AI OCR, batas HET PO, audit struk transfer manual, perekaman ledger, hingga validasi titik GPS geofence.
        </p>

        {/* Tailark Architectural Guideline Connector with Node Points */}
        <div className="relative w-full mb-12 hidden lg:block">
          <div className="border-t border-dashed border-slate-300/80 w-full" />
          <div className="absolute left-1/4 -top-1.5 w-3 h-3 rounded-full border border-slate-400 bg-white flex items-center justify-center text-[7px] text-slate-500 font-mono">+</div>
          <div className="absolute left-1/2 -top-1.5 w-3 h-3 rounded-full border border-slate-400 bg-white flex items-center justify-center text-[7px] text-slate-500 font-mono">+</div>
          <div className="absolute left-3/4 -top-1.5 w-3 h-3 rounded-full border border-slate-400 bg-white flex items-center justify-center text-[7px] text-slate-500 font-mono">+</div>
        </div>

        {/* Winding Feature Layout Grid */}
        <div ref={containerRef} className="space-y-16 lg:space-y-24 relative py-10 lg:py-0">
          
          {/* Desktop Winding SVG Line */}
          <div className="absolute inset-0 z-0 hidden lg:block" aria-hidden="true" style={{ top: '2rem', bottom: '2rem' }}>
            {/* Filled Water Tube (Solid, clipped by scroll) */}
            <motion.svg 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none" 
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ clipPath: clipPathValue }}
            >
              <path 
                d="M 50 0 L 50 2 C 50 5, 85 5, 85 8 L 85 12 C 85 20, 15 20, 15 28 L 15 32 C 15 40, 85 40, 85 48 L 85 52 C 85 60, 15 60, 15 68 L 15 72 C 15 80, 85 80, 85 88 L 85 92 C 85 96, 50 96, 50 100"
                fill="none"
                stroke="url(#glowDesktop)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              <defs>
                <linearGradient id="glowDesktop" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </motion.svg>
          </div>

          {/* Mobile Straight SVG Line */}
          <div className="absolute inset-0 z-0 lg:hidden flex justify-center" aria-hidden="true" style={{ top: '1rem', bottom: '1rem' }}>
            <motion.svg 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none" 
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ clipPath: clipPathValue }}
            >
              <path 
                d="M 50 0 L 50 100"
                fill="none"
                stroke="url(#glowMobile)"
                strokeWidth="8"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <defs>
                <linearGradient id="glowMobile" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </motion.svg>
          </div>

          {phasesData.map((item, index) => {
            const isLeft = item.align === "left";
            return (
              <div key={item.step} className="relative z-10">

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: "100% 0px -40% 0px" }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center ${
                    isLeft ? "" : "lg:grid-flow-dense"
                  }`}
                >
                  {/* Text Column */}
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0, x: isLeft ? -30 : 30 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } }
                    }}
                    className={isLeft ? "lg:pr-4" : "lg:col-start-2 lg:pl-4"}
                  >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-4 border shadow-sm bg-white text-[#1E3A5F] border-slate-200">
                      <span className="w-2 h-2 rounded-full bg-[#1E3A5F]" />
                      {item.phaseTag}
                    </div>

                    <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm lg:text-base font-bold text-[#1E3A5F] mb-4">
                      {item.subtitle}
                    </p>
                    <p className="text-slate-600 text-sm lg:text-base leading-relaxed mb-6 font-medium">
                      {item.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2.5 mb-8">
                      {item.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-3 text-xs lg:text-sm font-bold text-slate-800">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-[#1E3A5F] hover:bg-slate-900 text-white font-extrabold text-xs shadow-md transition-all hover:translate-x-1"
                    >
                      <span>Buka Modul {item.phaseTag}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>

                  {/* Live Visual Mockup Column */}
                  <motion.div 
                    variants={{
                      hidden: { 
                        opacity: 1, 
                        scale: 0.98,
                        transition: { duration: 0.3 }
                      },
                      visible: { 
                        opacity: 1, 
                        scale: 1,
                        transition: { duration: 0.3 }
                      }
                    }}
                    className={`${isLeft ? "lg:pl-4" : "lg:col-start-1 lg:pr-4"} relative`}
                  >
                    {/* Container Mockup dengan conditional inner content animation */}
                    <div className="relative">
                      {/* Inner Content Animation (Hanya muncul ketika in view) */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, filter: "blur(4px)" },
                          visible: { opacity: 1, filter: "blur(0px)", transition: { delay: 0.15, duration: 0.4 } }
                        }}
                      >
                        {item.mockup}
                      </motion.div>

                      {/* Skeleton Cover (Polos) */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 1 },
                          visible: { opacity: 0, transition: { duration: 0.3 } }
                        }}
                        className="absolute inset-0 bg-[#0F172A] border-2 border-slate-800 rounded-3xl pointer-events-none flex flex-col justify-between p-6 overflow-hidden"
                      >
                        <div className="flex items-center justify-between pb-4 border-b border-slate-850">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-slate-800 animate-pulse" />
                            <div className="space-y-2">
                              <div className="h-4 w-28 bg-slate-800 rounded animate-pulse" />
                              <div className="h-3 w-20 bg-slate-800 rounded animate-pulse" />
                            </div>
                          </div>
                          <div className="h-6 w-20 bg-slate-800 rounded-full animate-pulse" />
                        </div>
                        <div className="space-y-3 my-4 flex-1 justify-center flex flex-col">
                          <div className="h-8 w-full bg-slate-800 rounded animate-pulse" />
                          <div className="h-8 w-full bg-slate-800 rounded animate-pulse" />
                        </div>
                        <div className="border-t border-slate-850 pt-3 flex items-center justify-between">
                          <div className="h-3 w-20 bg-slate-800 rounded animate-pulse" />
                          <div className="h-3 w-32 bg-slate-800 rounded animate-pulse" />
                        </div>
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite] pointer-events-none" />
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}



