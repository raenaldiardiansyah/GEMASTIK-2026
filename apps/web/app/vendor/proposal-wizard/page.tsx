"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Utensils,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Scale,
  FileCheck,
  Building,
  Info,
  Sparkles,
  Calculator
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function VendorProposalWizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [menuNama, setMenuNama] = useState("Paket Nasi Tim Ayam & Sup Sayur Bening");
  const [targetSekolah, setTargetSekolah] = useState("SDN 164 Karang Pawulang");
  const [totalPorsi, setTotalPorsi] = useState(460);

  // Ingredient Grammage per portion
  const [dagingGram, setDagingGram] = useState(90); // Normal: 80-100g
  const [karboGram, setKarboGram] = useState(150); // Normal: 130-160g
  const [sayurGram, setSayurGram] = useState(80);  // Normal: 70-100g
  const [buahGram, setBuahGram] = useState(100);  // Normal: 90-110g

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Calculated values
  const totalDagingKg = ((dagingGram * totalPorsi) / 1000).toFixed(1);
  const totalKarboKg = ((karboGram * totalPorsi) / 1000).toFixed(1);
  const totalSayurKg = ((sayurGram * totalPorsi) / 1000).toFixed(1);

  // Anti-Overreport threshold checks
  const isDagingOverreport = dagingGram > 130; // >130g per portion is anomaly/markup
  const isKarboOverreport = karboGram > 220;
  const isSayurUnderreport = sayurGram < 40;

  const hasAnyOverreportWarning = isDagingOverreport || isKarboOverreport || isSayurUnderreport;

  const handleSubmitProposal = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Proposal Produksi Berhasil Disimpan & Dicatat ke Ledger!");
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Page Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-5 shadow-2xs">
        <PageHeader
          title="Wizard Pengajuan Proposal Produksi & Validation Anti-Overreport AI"
          subtitle="Formulasi takaran bahan baku makanan per porsi dengan pengecekan otomatis batas ambang maksimal untuk mencegah penggelembungan biaya (anti-markup)."
        />
      </div>

      {/* Stepper Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          {[
            { step: 1, title: "1. Info Paket & Target" },
            { step: 2, title: "2. Formulasi Bahan / Porsi" },
            { step: 3, title: "3. Audit AI Anti-Overreport" }
          ].map((s) => (
            <div key={s.step} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-black text-xs transition-colors ${
                  currentStep === s.step
                    ? "bg-amber-600 text-white shadow-sm"
                    : currentStep > s.step
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {currentStep > s.step ? "✓" : s.step}
              </div>
              <span
                className={`text-xs font-bold ${
                  currentStep === s.step ? "text-slate-900" : "text-slate-500"
                }`}
              >
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Form */}
      <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
          
          <AnimatePresence mode="wait">
            {/* STEP 1: Basic Info */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-amber-600" /> Informasi Menu & Target Produksi MBG
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Tentukan rincian menu paket yang akan dimasak dan jumlah target penerima manfaat.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">
                      Nama Paket Makanan Matang
                    </label>
                    <input
                      type="text"
                      value={menuNama}
                      onChange={(e) => setMenuNama(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-600 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">
                        Sekolah Penerima Target
                      </label>
                      <select
                        value={targetSekolah}
                        onChange={(e) => setTargetSekolah(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-600 outline-none"
                      >
                        <option value="SDN 164 Karang Pawulang">SDN 164 Karang Pawulang (460 Porsi)</option>
                        <option value="SMPN 5 Bandung">SMPN 5 Bandung (620 Porsi)</option>
                        <option value="SDN 02 Cisalak">SDN 02 Cisalak (310 Porsi)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">
                        Target Jumlah Porsi
                      </label>
                      <input
                        type="number"
                        value={totalPorsi}
                        onChange={(e) => setTotalPorsi(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-600 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-black text-xs h-11 px-6 rounded-xl flex items-center gap-2"
                  >
                    Lanjut ke Formulasi Bahan <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Ingredient Formulations */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Scale className="w-5 h-5 text-amber-600" /> Formulasi Takaran Bahan (Gram per Porsi)
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Masukkan gramasi per porsi. AI akan mengkalkulasi kebutuhan total bahan baku dan memverifikasi batas wajar.
                  </p>
                </div>

                {/* Grammage Controls Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Protein */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-800">Daging / Protein Utama</span>
                      <span className="text-xs font-mono font-black text-amber-700">{dagingGram} Gram / Porsi</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      step="5"
                      value={dagingGram}
                      onChange={(e) => setDagingGram(Number(e.target.value))}
                      className="w-full accent-amber-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Min: 50g</span>
                      <span>Standar: 80-100g</span>
                      <span>Max: 200g</span>
                    </div>
                  </div>

                  {/* Carbohydrate */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-800">Nasi / Karbohidrat</span>
                      <span className="text-xs font-mono font-black text-amber-700">{karboGram} Gram / Porsi</span>
                    </div>
                    <input
                      type="range"
                      min="80"
                      max="300"
                      step="10"
                      value={karboGram}
                      onChange={(e) => setKarboGram(Number(e.target.value))}
                      className="w-full accent-amber-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Min: 80g</span>
                      <span>Standar: 130-160g</span>
                      <span>Max: 300g</span>
                    </div>
                  </div>

                  {/* Vegetables */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-800">Sayur & Serat</span>
                      <span className="text-xs font-mono font-black text-amber-700">{sayurGram} Gram / Porsi</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="150"
                      step="5"
                      value={sayurGram}
                      onChange={(e) => setSayurGram(Number(e.target.value))}
                      className="w-full accent-amber-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Min: 20g</span>
                      <span>Standar: 70-100g</span>
                      <span>Max: 150g</span>
                    </div>
                  </div>

                  {/* Fruit */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-800">Buah (Pisang/Jeruk)</span>
                      <span className="text-xs font-mono font-black text-amber-700">{buahGram} Gram / Porsi</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      step="10"
                      value={buahGram}
                      onChange={(e) => setBuahGram(Number(e.target.value))}
                      className="w-full accent-amber-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Min: 50g</span>
                      <span>Standar: 100g</span>
                      <span>Max: 150g</span>
                    </div>
                  </div>
                </div>

                {/* Summary Realtime Calculation */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calculator className="w-5 h-5 text-amber-700" />
                    <div>
                      <span className="font-black text-xs text-slate-900 block">Kebutuhan Logistik ({totalPorsi} Porsi)</span>
                      <span className="text-[11px] text-slate-600 font-mono">
                        Protein: <b>{totalDagingKg} kg</b> • Karbo: <b>{totalKarboKg} kg</b> • Sayur: <b>{totalSayurKg} kg</b>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-between">
                  <Button
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="font-bold text-xs h-11 px-5 rounded-xl flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Kembali
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(3)}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-black text-xs h-11 px-6 rounded-xl flex items-center gap-2"
                  >
                    Audit Kepatuhan AI <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: AI Anti-Overreport Audit & Submit */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-600" /> Hasil Audit AI Anti-Overreport
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Sistem mendeteksi deviasi takaran bahan baku untuk memastikan tidak ada biaya yang diamandemen secara tidak wajar.
                  </p>
                </div>

                {/* Audit Warning Panel */}
                {hasAnyOverreportWarning ? (
                  <div className="p-5 rounded-2xl border border-amber-300 bg-amber-50 space-y-3">
                    <div className="flex items-center gap-2 text-amber-900">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      <span className="font-black text-xs uppercase tracking-wider">
                        Peringatan AI Anti-Overreport Terdeteksi
                      </span>
                    </div>
                    <p className="text-xs text-amber-950 leading-relaxed font-medium">
                      Formulasi Anda memiliki parameter di luar rentang standar gizi MBG. Proposal tetap dapat diajukan namun akan diberi bendera <b>"Manual Audit Review"</b> oleh SPPG:
                    </p>
                    <ul className="text-xs text-amber-900 font-mono space-y-1 list-disc pl-5">
                      {isDagingOverreport && (
                        <li>Daging ({dagingGram}g) &gt; 130g (Potensi Overreport/Markup Biaya Daging)</li>
                      )}
                      {isKarboOverreport && (
                        <li>Karbohidrat ({karboGram}g) &gt; 220g (Melebihi batas kalori porsi anak)</li>
                      )}
                      {isSayurUnderreport && (
                        <li>Sayur ({sayurGram}g) &lt; 40g (Di bawah standar kecukupan serat gizi)</li>
                      )}
                    </ul>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl border border-emerald-300 bg-emerald-50 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-950">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="font-black text-xs uppercase tracking-wider">
                        Formulasi Gizi Sesuai Standar (100% Valid)
                      </span>
                    </div>
                    <p className="text-xs text-emerald-900 font-medium">
                      Takaran bahan baku per porsi memenuhi ambang batas aman gizi Badan Gizi Nasional dan tidak terdeteksi indikasi overreport.
                    </p>
                  </div>
                )}

                {/* Proposal Data Summary Table */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between font-bold border-b border-slate-200 pb-2">
                    <span className="text-slate-600">Menu Proposal:</span>
                    <span className="text-slate-900">{menuNama}</span>
                  </div>
                  <div className="flex justify-between font-bold border-b border-slate-200 pb-2">
                    <span className="text-slate-600">Target Sekolah:</span>
                    <span className="text-slate-900">{targetSekolah} ({totalPorsi} Porsi)</span>
                  </div>
                  <div className="flex justify-between font-mono font-bold pt-1">
                    <span className="text-slate-600">Estimasi Total Daging:</span>
                    <span className="text-amber-700">{totalDagingKg} kg</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-between">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    disabled={isSubmitting || isSubmitted}
                    variant="outline"
                    className="font-bold text-xs h-11 px-5 rounded-xl"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Edit Formulasi
                  </Button>
                  <Button
                    onClick={handleSubmitProposal}
                    disabled={isSubmitting || isSubmitted}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs h-11 px-6 rounded-xl flex items-center gap-2 shadow-md shadow-emerald-600/25"
                  >
                    <FileCheck className="w-4 h-4" />
                    {isSubmitted ? "Proposal Terkirim!" : "Kirim Proposal ke SPPG & Record Ledger"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
