"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  TrendingUp,
  Activity,
  AlertTriangle,
  FileSearch,
  Lock,
  PieChart,
  BarChart3,
  Award,
  Truck,
  Users,
  Building2,
  CheckCircle2,
  ExternalLink,
  Download,
  Filter,
  RefreshCw,
  Search,
  Sparkles,
  ArrowUpRight,
  Receipt,
  FileText,
  BadgeAlert,
  ChevronRight,
  Layers,
  Fingerprint,
  Cpu
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface RegionalRisk {
  provinsi: string;
  score: number;
  status: "HIJAU" | "KUNING" | "MERAH";
  totalSekolah: number;
  totalPorsi: number;
  serapanPersen: number;
  anomali: number;
}

interface AnomalyCase {
  id: string;
  kategori: "LOGISTIK" | "DOKUMEN" | "PEMBAYARAN" | "KUALITAS";
  judul: string;
  deskripsi: string;
  entitas: string;
  waktu: string;
  tingkatUrgensi: "tinggi" | "sedang" | "rendah";
  status: "aktif" | "investigasi" | "selesai";
  ledgerHash: string;
}

interface BlockAuditFeed {
  height: number;
  tipeAksi: string;
  entitas: string;
  waktu: string;
  status: "VERIFIED" | "IN_PROGRESS";
  hash: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const REGIONAL_RISKS: RegionalRisk[] = [
  {
    provinsi: "Jawa Barat",
    score: 98.2,
    status: "HIJAU",
    totalSekolah: 8420,
    totalPorsi: 480000,
    serapanPersen: 99.1,
    anomali: 1,
  },
  {
    provinsi: "Jawa Tengah",
    score: 96.8,
    status: "HIJAU",
    totalSekolah: 7190,
    totalPorsi: 395000,
    serapanPersen: 98.4,
    anomali: 0,
  },
  {
    provinsi: "Jawa Timur",
    score: 97.4,
    status: "HIJAU",
    totalSekolah: 7950,
    totalPorsi: 420000,
    serapanPersen: 98.8,
    anomali: 0,
  },
  {
    provinsi: "Nusa Tenggara Timur",
    score: 89.4,
    status: "KUNING",
    totalSekolah: 2014,
    totalPorsi: 110000,
    serapanPersen: 94.2,
    anomali: 1,
  },
];

const INITIAL_ANOMALIES: AnomalyCase[] = [
  {
    id: "CASE-LOG-01",
    kategori: "LOGISTIK",
    judul: "Deviasi Titik Geofencing Pengiriman (> 50m)",
    deskripsi: "Armada TRK-081 terdeteksi berhenti di radius 72 meter dari gerbang SDN 061 Cihampelas sebelum status serah terima disahkan.",
    entitas: "PT Logistik Pangan Nusantara (TRK-081)",
    waktu: "15 Agu 2026, 06:45 WIB",
    tingkatUrgensi: "sedang",
    status: "aktif",
    ledgerHash: "0x8f2a910d8e2193b4a56c7d8e9f0a1b2c",
  },
  {
    id: "CASE-DOC-02",
    kategori: "DOKUMEN",
    judul: "Peringatan Kedaluwarsa Sertifikat Laik Higiene (< 14 Hari)",
    deskripsi: "Sertifikat laik higiene sanitasi dapur katering CV Rasa Mulia akan berakhir pada 28 Agustus 2026. Notifikasi otomatis telah dikirimkan.",
    entitas: "CV Rasa Mulia Katering",
    waktu: "15 Agu 2026, 05:30 WIB",
    tingkatUrgensi: "rendah",
    status: "investigasi",
    ledgerHash: "0x3e1a800c7d1082a3945b6c7d8e9f0a1b",
  },
];

const BLOCK_FEEDS: BlockAuditFeed[] = [
  {
    height: 10498,
    tipeAksi: "GEOFENCE_HANDOVER_VERIFIED",
    entitas: "SDN 164 Karang Pawulang",
    waktu: "15 Agu 2026, 07:12 WIB",
    status: "VERIFIED",
    hash: "0x7a91b...4c2d",
  },
  {
    height: 10497,
    tipeAksi: "OCR_PAYMENT_PROOF_MATCH",
    entitas: "SPPG Sentra Gizi 01 Subang",
    waktu: "15 Agu 2026, 07:05 WIB",
    status: "VERIFIED",
    hash: "0x3b89e...91fa",
  },
  {
    height: 10496,
    tipeAksi: "FOOD_SAFETY_AUDIT_IPFS",
    entitas: "Auditor Pangan Dinas Kesehatan",
    waktu: "15 Agu 2026, 06:50 WIB",
    status: "VERIFIED",
    hash: "0x8f10a...7c3b",
  },
  {
    height: 10495,
    tipeAksi: "SBT_WHITELIST_MINTED",
    entitas: "PT Berkah Telur Nusantara",
    waktu: "15 Agu 2026, 06:30 WIB",
    status: "VERIFIED",
    hash: "0x2c4d6...8e0f",
  },
];

// ─── Main Component ──────────────────────────────────────────────────────────

export default function DashboardAuditPage() {
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [anomalies, setAnomalies] = useState<AnomalyCase[]>(INITIAL_ANOMALIES);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedCase, setSelectedCase] = useState<AnomalyCase | null>(null);

  const filteredRegions = useMemo(() => {
    if (regionFilter === "all") return REGIONAL_RISKS;
    return REGIONAL_RISKS.filter((r) => r.provinsi.toLowerCase().includes(regionFilter.toLowerCase()));
  }, [regionFilter]);

  const handleExportLHP = () => {
    setIsExporting(true);
    toast.loading("Mengompilasi Berita Acara & LHP Audit Eksekutif (PDF)...", { id: "export-lhp" });
    setTimeout(() => {
      setIsExporting(false);
      toast.success("LHP Audit Eksekutif Berhasil Diterbitkan!", {
        id: "export-lhp",
        description: "Dokumen LHP-MBG-2026-Q3.pdf telah terenkripsi dengan Tanda Tangan Elektronik BPKP/KPK.",
      });
    }, 1600);
  };

  const handleResolveAnomaly = (caseId: string) => {
    setAnomalies((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, status: "selesai" } : c))
    );
    toast.success("Anomali Berhasil Diselesaikan & Dicatat di Audit Trail!", {
      description: `Kasus ${caseId} telah terverifikasi oleh tim auditor BGN.`,
    });
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* ── Top Header ────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 sm:py-5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <Badge className="bg-slate-900 text-white border-slate-700 text-[10px] font-mono font-black px-2.5 py-0.5">
                ● GIZANTARA AUDIT COMMAND CENTER
              </Badge>
              <span className="text-slate-500 text-xs font-mono font-semibold">BGN • BPKP • KPK Oversight Matrix</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 truncate">
              Dashboard Audit Komando & Pengawasan Ekosistem
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 sm:line-clamp-none">
              Pusat pemantauan makro terpadu: Indeks Risiko AI Governance, validasi serapan APBN, audit trail blockchain, dan deteksi anomali real-time.
            </p>
          </div>

          {/* Export & Security Seal */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="text-left">
                <p className="text-[9px] font-black uppercase text-emerald-800">Integritas Ledger</p>
                <p className="text-xs font-black text-emerald-700 font-mono">100% IMMUTABLE</p>
              </div>
            </div>

            <Button
              onClick={handleExportLHP}
              disabled={isExporting}
              size="sm"
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl h-10 px-4 gap-2 cursor-pointer shadow-sm"
            >
              {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileSearch className="w-4 h-4 text-emerald-400" />}
              <span>{isExporting ? "Menyusun LHP..." : "Unduh LHP Audit (PDF)"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Top Executive KPI Bar ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black shrink-0">
              <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-wider truncate">Alokasi APBN MBG</p>
              <p className="text-sm sm:text-base lg:text-lg font-black text-slate-900 truncate">Rp 5.24 M <span className="text-[10px] sm:text-xs font-bold text-emerald-600">98.2%</span></p>
            </div>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black shrink-0">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-wider truncate">Volume Porsi Terkirim</p>
              <p className="text-sm sm:text-base lg:text-lg font-black text-emerald-700 truncate">1.248.500 <span className="text-[10px] sm:text-xs font-semibold text-slate-500">Porsi</span></p>
            </div>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-black shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-wider truncate">Indeks Integritas AI</p>
              <p className="text-sm sm:text-base lg:text-lg font-black text-slate-900 truncate">98.9 / 100 <span className="text-[10px] sm:text-xs font-bold text-emerald-600">Prima</span></p>
            </div>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black shrink-0">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-wider truncate">Anomali Flagged</p>
              <p className="text-sm sm:text-base lg:text-lg font-black text-amber-700 truncate">{anomalies.filter(a => a.status !== "selesai").length} Kasus <span className="text-[10px] sm:text-xs font-bold text-emerald-600">0 Fraud</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Layout Workspace ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 flex-1 flex flex-col gap-5 sm:gap-6">
        
        {/* Filter & Live State Row */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto min-w-0 flex-1 pb-1 sm:pb-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1 shrink-0">Filter Wilayah:</span>
            {["all", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Nusa Tenggara Timur"].map((reg) => (
              <button
                key={reg}
                onClick={() => setRegionFilter(reg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  regionFilter === reg
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200/80"
                }`}
              >
                {reg === "all" ? "Semua Wilayah (Nasional)" : reg}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-mono font-bold flex items-center gap-1.5 px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Monitoring Stream
            </Badge>
          </div>
        </div>

        {/* Two-Column Grid: Macro Analytics & Anomaly Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          
          {/* Left Section (7 Cols) — Regional Risk Map & Blockchain Block Feeds */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            
            {/* Regional Risk Matrix Cards */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-emerald-600 shrink-0" />
                    Indeks Integritas & Kepatuhan Gizi Per Wilayah
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Evaluasi komprehensif berdasarkan ketepatan waktu distribusi, OCR bukti pembayaran, dan higienitas pangan.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredRegions.map((reg) => (
                  <div
                    key={reg.provinsi}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">{reg.provinsi}</span>
                      <Badge
                        className={
                          reg.status === "HIJAU"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-bold"
                            : "bg-amber-100 text-amber-800 border-amber-200 text-[10px] font-bold"
                        }
                      >
                        {reg.status === "HIJAU" ? "Bebas Risiko ✓" : "Review Terjadwal"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Skor AI Risk</span>
                        <span className="text-base font-black text-emerald-700 font-mono">{reg.score} / 100</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Serapan Anggaran</span>
                        <span className="text-sm font-bold text-slate-800">{reg.serapanPersen}% Sesuai</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>🏫 {reg.totalSekolah.toLocaleString("id-ID")} Sekolah</span>
                      <span>🍱 {(reg.totalPorsi / 1000).toFixed(0)}k Porsi/Hari</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blockchain Audit Block Feeds */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
                    Feed Blok Audit Trail Terverifikasi (On-Chain)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Transaksi audit tervalidasi oleh konsensus Zero-Trust dan tersimpan permanen di Immutable Ledger.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {BLOCK_FEEDS.map((block) => (
                  <div key={block.height} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-bold text-slate-700 text-xs shrink-0">
                        #{block.height}
                      </div>
                      <div>
                        <p className="font-mono text-xs font-bold text-slate-900">{block.tipeAksi}</p>
                        <p className="text-[11px] text-slate-500">Entitas: <span className="font-semibold text-slate-700">{block.entitas}</span></p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 justify-between sm:justify-end text-xs">
                      <span className="text-[11px] text-slate-400 font-mono">{block.waktu}</span>
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-mono font-bold">
                        {block.hash}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Section (5 Cols) — System-Flagged Anomaly Cases & Action Hub */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            
            {/* Anomaly Cases Box */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <h3 className="text-base font-black text-slate-900">Deteksi Dini & Anomali Sistem</h3>
                    <p className="text-xs text-slate-500">Kasus peringatan dini yang memerlukan tindak lanjut auditor.</p>
                  </div>
                </div>
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs font-bold shrink-0">
                  {anomalies.filter(a => a.status !== "selesai").length} Kasus Aktif
                </Badge>
              </div>

              <div className="space-y-3.5">
                {anomalies.map((c) => {
                  const isDone = c.status === "selesai";
                  return (
                    <div
                      key={c.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isDone
                          ? "bg-slate-50 border-slate-200 opacity-60"
                          : "bg-amber-50/60 border-amber-200 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-xs font-bold text-slate-700">{c.id}</span>
                        <Badge
                          className={
                            isDone
                              ? "bg-emerald-100 text-emerald-800 text-[10px]"
                              : "bg-amber-500 text-white text-[10px] font-bold"
                          }
                        >
                          {isDone ? "Terselesaikan ✓" : `Urgensi: ${c.tingkatUrgensi.toUpperCase()}`}
                        </Badge>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 mb-1">{c.judul}</h4>
                      <p className="text-xs text-slate-600 mb-2 leading-relaxed">{c.deskripsi}</p>
                      
                      <div className="p-2 bg-white/80 rounded-xl border border-slate-200/60 text-[11px] space-y-1 mb-3">
                        <p className="text-slate-500">Pihak Terkait: <span className="font-semibold text-slate-800">{c.entitas}</span></p>
                        <p className="font-mono text-slate-400 text-[10px]">Audit Hash: {c.ledgerHash}</p>
                      </div>

                      {!isDone && (
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleResolveAnomaly(c.id)}
                            size="sm"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl h-8 cursor-pointer gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Validasi & Selesaikan Kasus
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Action Matrix Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tindakan Cepat Auditor</h4>
              
              <div className="space-y-2">
                <Button
                  onClick={handleExportLHP}
                  variant="outline"
                  className="w-full justify-between text-xs font-bold rounded-xl h-10 border-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    LHP Komprehensif Triwulan III (PDF)
                  </span>
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                </Button>

                <Button
                  onClick={() => toast.info("Audit Trail Hash Sinkron dengan 14 Node Validator BGN.")}
                  variant="outline"
                  className="w-full justify-between text-xs font-bold rounded-xl h-10 border-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-emerald-600" />
                    Verifikasi Merkle Root Validator
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </Button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
