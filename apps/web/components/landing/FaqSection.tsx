"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const faqs = [
  {
    q: "Apa itu GIZANTARA?",
    a: "GIZANTARA adalah platform end-to-end traceability untuk program Makan Bergizi Gratis (MBG): verifikasi vendor, pengadaan, audit pembayaran via OCR, distribusi geofencing, hingga reputasi vendor dan SPPG pada immutable ledger.",
  },
  {
    q: "Bagaimana alur pembayaran bekerja?",
    a: "Setelah QC SPPG menyetujui barang (Goods Received), SPPG melakukan transfer manual ke rekening vendor lalu mengunggah bukti transfer. OCR membaca tanggal, nominal, pengirim, penerima, bank, dan refID untuk mencocokkan dengan PO — hasilnya MATCH, UNDERPAID, atau MANUAL REVIEW.",
  },
  {
    q: "Apakah platform menangani pembayaran secara otomatis?",
    a: "Tidak. GIZANTARA tidak menyentuh APBN langsung dan bukan payment gateway. Dana dikelola secara manual oleh SPPG; platform hanya memverifikasi bukti pembayaran dan mencatatnya di ledger audit.",
  },
  {
    q: "Bagaimana distribusi makanan divalidasi?",
    a: "Setiap titik distribusi divalidasi dengan QR scan dan GPS. Haversine menghitung jarak dari lokasi yang seharusnya; tanpa (atau melewati) radius 50 meter, titik dinyatakan Rejected.",
  },
  {
    q: "Apakah data di demo ini nyata?",
    a: "Tidak. Semua angka dan proses di situs ini adalah simulasi (mock) untuk memvisualkan alur kerja — tidak ada transaksi riil yang diproses.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative py-[clamp(60px,7vh,90px)] px-[clamp(1.5rem,5vw,4rem)] bg-white overflow-hidden"
    >
      {/* Tailark Color Boundary Cut (TestimonialSection #F8FAFC to FaqSection #FFFFFF) */}
      <div className="absolute top-0 left-0 right-0 h-7 pointer-events-none z-10 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1200 28" preserveAspectRatio="none">
          <path
            d="M 0 0 L 960 0 C 1040 0, 1080 24, 1160 24 L 1200 24 L 1200 0 L 0 0 Z"
            fill="#F8FAFC"
          />
          <path
            d="M 0 0 L 960 0 C 1040 0, 1080 24, 1160 24 L 1200 24"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div className="max-w-[900px] mx-auto relative z-10">
        <SectionHeader
          label="FAQ"
          headline="Pertanyaan yang Sering Diajukan."
          centered
          className="mb-6 [&_h2]:text-[clamp(1.5rem,4vw,3.5rem)] [&_h2]:text-slate-900"
        />

        {/* Tailark Architectural Guideline Connector with Node Points */}
        <div className="relative w-full mb-10 hidden lg:block">
          <div className="border-t border-dashed border-slate-300/80 w-full" />
          <div className="absolute left-1/4 -top-1.5 w-3 h-3 rounded-full border border-slate-400 bg-white flex items-center justify-center text-[7px] text-slate-500 font-mono">+</div>
          <div className="absolute left-1/2 -top-1.5 w-3 h-3 rounded-full border border-slate-400 bg-white flex items-center justify-center text-[7px] text-slate-500 font-mono">+</div>
          <div className="absolute left-3/4 -top-1.5 w-3 h-3 rounded-full border border-slate-400 bg-white flex items-center justify-center text-[7px] text-slate-500 font-mono">+</div>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const open = openIndex === i;
            return (
              <div
                key={faq.q}
                className={`rounded-2xl border-2 transition-all duration-200 ${
                  open
                    ? "border-[#1E3A5F] bg-white shadow-lg"
                    : "border-slate-300 bg-white hover:border-slate-400 shadow-sm"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-base md:text-lg font-black text-slate-900">
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center border-2 ${
                      open ? "bg-[#1E3A5F] text-white border-[#1E3A5F]" : "bg-slate-100 border-slate-300 text-slate-600"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-sm md:text-base text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}