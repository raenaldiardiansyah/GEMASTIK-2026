"use client";

import { useState } from "react";
import {
  ShieldAlert,
  CheckCircle2,
  FileSpreadsheet,
  Thermometer,
  Microscope,
  Sparkles,
  Lock,
  Upload,
  Award
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AuditMetric {
  id: string;
  parameter: string;
  standar: string;
  hasil: string;
  status: "pass" | "warning" | "fail";
}

const AUDIT_METRICS: AuditMetric[] = [
  { id: "M-1", parameter: "Suhu Makanan Matang Saat Pengiriman", standar: "≥ 65°C", hasil: "68.5°C", status: "pass" },
  { id: "M-2", parameter: "Uji Organoleptic (Aroma & Warna)", standar: "Segar / Tidak Berbau Asam", hasil: "Sesuai Standar Gizi", status: "pass" },
  { id: "M-3", parameter: "Kandungan Kontaminan / Cemaran", standar: "0% (Negatif)", hasil: "Negatif", status: "pass" },
  { id: "M-4", parameter: "Tingkat Kebersihan Dapur SPPG", standar: "Skor Hygiene ≥ 90", hasil: "Skor 94/100", status: "pass" },
];

export default function AuditPanganPage() {
  const [metrics] = useState<AuditMetric[]>(AUDIT_METRICS);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublishAudit = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIpfsHash("QmZk9120489128491204812048102481029481204981");
      setIsPublishing(false);
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header - Clean Light Canvas for contrast with dark sidebar */}
      <div className="bg-white border-b border-slate-200 px-6 py-6 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 text-[10px] font-mono font-black px-2.5 py-0.5">
                ● GIZANTARA FOOD SAFETY ENGINE
              </Badge>
              <span className="text-slate-500 text-xs font-mono font-semibold">ISO 22000 / HACCP Standard</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Inspeksi Kualitas Pangan & AI Risk Index
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed font-medium">
              Pengawasan independen kualitas gizi, suhu penyimpanan, dan kebersihan makanan matang dengan pencatatan terverifikasi ke IPFS & Blockchain Ledger.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-right shadow-2xs">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-extrabold block">Akreditasi SPPG</span>
              <span className="text-xs font-mono font-black text-emerald-700 flex items-center justify-end gap-1.5 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> GRADE A (96/100)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Bar - Clean 60-30-10 Bento Grid */}
      <div className="bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          
          <div className="p-5 flex items-center gap-4 bg-white">
            <div className="w-13 h-13 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-center font-black text-xl text-emerald-700 font-mono shadow-2xs">
              96%
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold block">Food Safety Index</span>
              <span className="text-sm font-black text-slate-900">Sangat Layak & Safe</span>
              <p className="text-xs text-slate-500 font-medium mt-0.5">0 Insiden Kontaminasi Pangan</p>
            </div>
          </div>

          <div className="p-5 flex items-center gap-4 bg-white">
            <div className="w-13 h-13 rounded-2xl bg-sky-50 border border-sky-300 flex items-center justify-center font-black text-xl text-sky-800 font-mono shadow-2xs">
              94
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold block">Skor Higiene Dapur</span>
              <span className="text-sm font-black text-slate-900">Standar Steril SPPG</span>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Inspeksi Lapangan: Hari Ini</p>
            </div>
          </div>

          <div className="p-5 flex items-center gap-4 bg-emerald-50/30">
            <div className="w-13 h-13 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center shadow-2xs">
              <ShieldAlert className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold block">AI Governance Risk</span>
              <span className="text-sm font-black text-emerald-700 flex items-center gap-1">
                HIJAU (BEBAS RISIKO)
              </span>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Rekomendasi: Distribusi Lanjut</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto w-full flex-1 p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Parameter Matrix (7 cols) */}
          <div className="lg:col-span-7 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-100/70 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#1E3A5F] flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Borang Parameter Inspeksi Lapangan
              </span>
              <Badge variant="outline" className="font-mono text-[10px] bg-white border-slate-300 text-slate-700">
                SPPG-SUBANG-01
              </Badge>
            </div>

            <div className="divide-y divide-slate-100 flex-1">
              {metrics.map((m) => (
                <div key={m.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-emerald-50/30 transition-colors">
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-slate-900 block">{m.parameter}</span>
                    <span className="text-[11px] text-slate-500 font-mono">Standar Acuan: {m.standar}</span>
                  </div>

                  <div className="flex items-center gap-3 justify-end">
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                      {m.hasil}
                    </span>
                    <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> MEMENUHI
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Form Actions */}
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <Button
                onClick={handlePublishAudit}
                disabled={isPublishing || !!ipfsHash}
                className="w-full bg-[#1E3A5F] hover:bg-slate-800 text-white font-bold text-xs h-10 shadow-xs flex items-center justify-center gap-2 rounded-xl"
              >
                <Upload className="w-4 h-4" />
                {isPublishing
                  ? "Mengenkripsi Data & Mengunggah..."
                  : ipfsHash
                  ? "Laporan Terkunci di IPFS & Ledger"
                  : "Finalisasi & Upload Hasil Audit ke IPFS"}
              </Button>

              {ipfsHash && (
                <div className="p-3 rounded-xl border border-emerald-300 bg-emerald-50 font-mono text-xs text-emerald-900 flex items-center justify-between shadow-2xs">
                  <span className="truncate font-bold">IPFS Hash: {ipfsHash}</span>
                  <Lock className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: AI Risk Insights & Lab Certificates (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sparkles className="w-4 h-4 text-[#1E3A5F]" />
                <h3 className="font-extrabold text-sm text-slate-900">Analisis Prediktif AI Governance</h3>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="text-[10px] font-black text-[#1E3A5F] uppercase tracking-wider block">Ringkasan Analisis Sistem</span>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Berdasarkan histori 30 hari terakhir, parameter suhu pengiriman dan kebersihan dapur SPPG Subang Central secara konsisten berada di atas 95%. Tidak terdeteksi anomali pada rantai penyimpanan pendingin.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/60 space-y-2">
                <span className="text-[10px] font-black text-emerald-900 uppercase tracking-wider block flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" /> Sertifikasi Kepatuhan Audit
                </span>
                <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                  SPPG ini berhak memperoleh insentif tambahan +5 Poin Reputasi Soulbound Token (SBT) untuk periode pengadaan bulan depan.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Metode Pengujian Terverifikasi</span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <Thermometer className="w-4 h-4 text-[#1E3A5F] mb-1" />
                  <p className="font-bold text-slate-900">Sensor Thermal</p>
                  <p className="text-[10px] text-slate-500">Live GPS Container</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <Microscope className="w-4 h-4 text-[#1E3A5F] mb-1" />
                  <p className="font-bold text-slate-900">Lab Organoleptik</p>
                  <p className="text-[10px] text-slate-500">Uji Sterilisasi SPPG</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
