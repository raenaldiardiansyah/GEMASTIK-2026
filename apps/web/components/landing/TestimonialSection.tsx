"use client";

import { motion } from "framer-motion";
import { Landmark, Box, Store, ShieldCheck } from "lucide-react";

export function TestimonialSection() {
  return (
    <section className="relative py-[clamp(60px,8vh,100px)] px-[clamp(1.5rem,5vw,4rem)] bg-[#F8FAFC] overflow-hidden">
      {/* Tailark Color Boundary Cut (RoleGateways #FFFFFF to TestimonialSection #F8FAFC) */}
      <div className="absolute top-0 left-0 right-0 h-7 pointer-events-none z-10 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1200 28" preserveAspectRatio="none">
          <path
            d="M 0 0 L 40 0 C 80 0, 100 24, 160 24 L 1040 24 C 1100 24, 1120 0, 1160 0 L 1200 0 L 1200 0 L 0 0 Z"
            fill="#FFFFFF"
          />
          <path
            d="M 0 0 L 40 0 C 80 0, 100 24, 160 24 L 1040 24 C 1100 24, 1120 0, 1160 0 L 1200 0"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div className="max-w-[1140px] mx-auto relative z-10">
        
        {/* Header Grid: Title on Left, Subtitle on Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 items-end mb-10 lg:mb-12">
          <div>
            <span className="text-xs font-bold tracking-widest text-indigo-500 uppercase mb-3 block">
              TESTIMONI
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.1]">
              Berada di Jaringan<br />Tepercaya
            </h2>
          </div>
          <div>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium md:max-w-md md:ml-auto">
              Bergabung dengan jaringan mitra dan pengawas yang mengandalkan GIZANTARA untuk verifikasi vendor, audit pengadaan, dan validasi logistik presisi.
            </p>
          </div>
        </div>

        {/* Tailark Architectural Guideline Connector with Node Points */}
        <div className="relative w-full mb-10 hidden lg:block">
          <div className="border-t border-dashed border-slate-300/80 w-full" />
          <div className="absolute left-1/4 -top-1.5 w-3 h-3 rounded-full border border-slate-400 bg-white flex items-center justify-center text-[7px] text-slate-500 font-mono">+</div>
          <div className="absolute left-1/2 -top-1.5 w-3 h-3 rounded-full border border-slate-400 bg-white flex items-center justify-center text-[7px] text-slate-500 font-mono">+</div>
          <div className="absolute left-3/4 -top-1.5 w-3 h-3 rounded-full border border-slate-400 bg-white flex items-center justify-center text-[7px] text-slate-500 font-mono">+</div>
        </div>

        {/* Staggered 2-Column Layout matching screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* Left Column */}
          <div className="space-y-6">
            
            {/* Card 1 (White Card with Shadow & Border) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-slate-200/80 rounded-3xl p-7 md:p-8 shadow-sm hover:shadow-md transition-all"
            >
              {/* Company / Role Brand Header */}
              <div className="flex items-center gap-2.5 mb-6 text-slate-900 font-extrabold text-base tracking-tight">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Landmark className="w-4 h-4" />
                </div>
                <span>BPKP Audit</span>
              </div>

              {/* Quote */}
              <p className="text-slate-700 text-sm md:text-[15px] leading-relaxed font-medium mb-8">
                &ldquo;Sekarang setiap Purchase Order tercatat lengkap dari verifikasi OCR vendor hingga bukti pembayaran. Waktu audit pengawasan program MBG jadi 10x lebih cepat dan transparan.&rdquo;
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                  SR
                </div>
                <div className="leading-tight">
                  <h4 className="text-sm font-extrabold text-slate-900">Dra. Siti Rahmawati</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Inspektur Audit · BPKP (Simulasi)</p>
                </div>
              </div>
            </motion.div>

            {/* Card 2 (Light Slate Background Card) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#F1F5F9]/80 border border-slate-200/60 rounded-3xl p-7 md:p-8 hover:shadow-md transition-all"
            >
              {/* Brand Header */}
              <div className="flex items-center gap-2.5 mb-6 text-emerald-600 font-extrabold text-base tracking-tight">
                <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center">
                  <Box className="w-4 h-4" />
                </div>
                <span className="text-slate-900">SPPG Manager</span>
              </div>

              {/* Quote */}
              <p className="text-slate-700 text-sm md:text-[15px] leading-relaxed font-medium mb-8">
                &ldquo;Transfer bank manual tetap dikontrol ketat oleh sistem OCR otomatis. Nominal bukti transfer langsung cocok dengan PO, menghilangkan risiko penggelembungan harga HET.&rdquo;
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                  AF
                </div>
                <div className="leading-tight">
                  <h4 className="text-sm font-extrabold text-slate-900">Bpk. Ahmad Fauzi</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Kepala SPPG · Jakarta Selatan</p>
                </div>
              </div>
            </motion.div>

            {/* Decorative Placeholder Box (matching screenshot bottom left) */}
            <div aria-hidden="true" className="bg-slate-200/40 border border-slate-200/40 rounded-3xl h-24 w-2/3" />

          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Decorative Placeholder Box (matching screenshot top right) */}
            <div aria-hidden="true" className="bg-slate-200/40 border border-slate-200/40 rounded-3xl h-32 w-full" />

            {/* Card 3 (Light Slate Background Card) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-[#F1F5F9]/80 border border-slate-200/60 rounded-3xl p-7 md:p-8 hover:shadow-md transition-all"
            >
              {/* Brand Header */}
              <div className="flex items-center gap-2.5 mb-6 text-slate-900 font-extrabold text-base tracking-tight">
                <div className="w-8 h-8 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center">
                  <Store className="w-4 h-4" />
                </div>
                <span>Logistik Presisi</span>
              </div>

              {/* Quote */}
              <p className="text-slate-700 text-sm md:text-[15px] leading-relaxed font-medium mb-8">
                &ldquo;Sistem geofencing ketat radius 50m memastikan pengiriman makanan tepat sampai di titik lokasi sekolah. Data penerimaan real-time tanpa ada risiko overreport.&rdquo;
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                  RW
                </div>
                <div className="leading-tight">
                  <h4 className="text-sm font-extrabold text-slate-900">Ibu Ratna Wulandari</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Manajer Logistik &amp; Distribusi</p>
                </div>
              </div>
            </motion.div>

            {/* Card 4 (White Card with Shadow & Border) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white border border-slate-200/80 rounded-3xl p-7 md:p-8 shadow-sm hover:shadow-md transition-all"
            >
              {/* Brand Header */}
              <div className="flex items-center gap-2.5 mb-6 text-slate-900 font-extrabold text-base tracking-tight">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>Vendor Whitelist</span>
              </div>

              {/* Quote */}
              <p className="text-slate-700 text-sm md:text-[15px] leading-relaxed font-medium mb-8">
                &ldquo;Proses registrasi vendor sangat cepat lewat pemindaian OCR otomatis pada NIB, NPWP, dan rekening. Tidak ada kekhawatiran karena seluruh transaksi tercatat di immutable ledger.&rdquo;
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                  BS
                </div>
                <div className="leading-tight">
                  <h4 className="text-sm font-extrabold text-slate-900">Bpk. Bambang Setiawan</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Direktur CV Tani Makmur</p>
                </div>
              </div>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}