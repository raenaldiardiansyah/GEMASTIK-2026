"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCheck2,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ScanLine,
  Building2,
  ShieldCheck,
  Award,
  Lock,
  RefreshCw,
  Eye,
  FileText,
  Search,
  Filter,
  Sparkles,
  ExternalLink,
  ChevronRight,
  UserCheck,
  BadgeAlert,
  Database,
  Cpu,
  Fingerprint,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface DocumentItem {
  id: string;
  namaDokumen: string;
  jenis: "NIB" | "NPWP" | "HALAL" | "HIGIENE" | "KTP_PIC";
  labelJenis: string;
  nomor: string;
  ocrConfidence: number;
  tamperStatus: "clean" | "suspicious" | "tampered";
  tamperReason?: string;
  status: "terverifikasi" | "pending" | "perlu_revisi";
  terakhirDiubah: string;
  fileSize: string;
  matchedApi: {
    namaField: string;
    ocrValue: string;
    govDbValue: string;
    match: boolean;
  }[];
}

interface SupplierCase {
  id: string;
  nama: string;
  kategori: "Katering" | "Supplier Bahan" | "Logistik";
  wilayah: string;
  picNama: string;
  picNik: string;
  noHp: string;
  rekeningBank: string;
  bankName: string;
  sbtStatus: "WHITELISTED" | "MENUNGGU_VERIFIKASI" | "REVISI_DOKUMEN";
  walletAddress: string;
  scoreTrust: number;
  tanggalDaftar: string;
  documents: DocumentItem[];
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_SUPPLIERS: SupplierCase[] = [
  {
    id: "SUP-2026-001",
    nama: "CV Pangan Mandiri Sejahtera",
    kategori: "Katering",
    wilayah: "Subang, Jawa Barat",
    picNama: "H. Hendra Gunawan, S.T.",
    picNik: "3213011208840001",
    noHp: "0812-3456-7890",
    rekeningBank: "131-00-1928371-2",
    bankName: "Bank Mandiri",
    sbtStatus: "MENUNGGU_VERIFIKASI",
    walletAddress: "0x71C928F9b2018A49C82A1B0298B291A7",
    scoreTrust: 96,
    tanggalDaftar: "14 Agu 2026",
    documents: [
      {
        id: "DOC-001",
        namaDokumen: "NIB_CV_Pangan_Mandiri_2026.pdf",
        jenis: "NIB",
        labelJenis: "Nomor Induk Berusaha (OSS RBA)",
        nomor: "9120003419201",
        ocrConfidence: 99.4,
        tamperStatus: "clean",
        status: "terverifikasi",
        terakhirDiubah: "14 Agu 2026, 06:15 WIB",
        fileSize: "1.8 MB",
        matchedApi: [
          { namaField: "Nama Badan Usaha", ocrValue: "CV Pangan Mandiri Sejahtera", govDbValue: "CV Pangan Mandiri Sejahtera", match: true },
          { namaField: "KBLI Terdaftar", ocrValue: "56210 (Jasa Boga / Katering)", govDbValue: "56210 (Jasa Boga / Katering)", match: true },
          { namaField: "Status OSS", ocrValue: "Aktif / Terdaftar", govDbValue: "Aktif / Terdaftar", match: true },
        ],
      },
      {
        id: "DOC-002",
        namaDokumen: "NPWP_Badan_Pangan_Mandiri.pdf",
        jenis: "NPWP",
        labelJenis: "NPWP Badan Usaha (DJP)",
        nomor: "01.234.567.8-439.000",
        ocrConfidence: 98.7,
        tamperStatus: "clean",
        status: "terverifikasi",
        terakhirDiubah: "14 Agu 2026, 06:16 WIB",
        fileSize: "1.2 MB",
        matchedApi: [
          { namaField: "Nomor Pokok Wajib Pajak", ocrValue: "01.234.567.8-439.000", govDbValue: "01.234.567.8-439.000", match: true },
          { namaField: "Status KSWP Pajak", ocrValue: "VALID (Konfirmasi Status WP)", govDbValue: "VALID (Konfirmasi Status WP)", match: true },
        ],
      },
      {
        id: "DOC-003",
        namaDokumen: "Sertifikat_Halal_BPJPH.pdf",
        jenis: "HALAL",
        labelJenis: "Sertifikat Halal (Kemenag BPJPH)",
        nomor: "ID321100004561203",
        ocrConfidence: 94.2,
        tamperStatus: "suspicious",
        tamperReason: "Perbedaan kontras stempel pada baris masa berlaku. Direkomendasikan pengecekan silang.",
        status: "pending",
        terakhirDiubah: "14 Agu 2026, 06:20 WIB",
        fileSize: "2.4 MB",
        matchedApi: [
          { namaField: "Nomor Registrasi Halal", ocrValue: "ID321100004561203", govDbValue: "ID321100004561203", match: true },
          { namaField: "Masa Berlaku", ocrValue: "Hingga 12 Des 2028", govDbValue: "Hingga 12 Des 2028", match: true },
        ],
      },
      {
        id: "DOC-004",
        namaDokumen: "Sertifikat_Laik_Higiene_Sanitasi.pdf",
        jenis: "HIGIENE",
        labelJenis: "Sertifikat Laik Higiene (Dinkes)",
        nomor: "440/128/DINKES/2025",
        ocrConfidence: 97.8,
        tamperStatus: "clean",
        status: "terverifikasi",
        terakhirDiubah: "14 Agu 2026, 06:22 WIB",
        fileSize: "1.5 MB",
        matchedApi: [
          { namaField: "No. Rekomendasi Dinkes", ocrValue: "440/128/DINKES/2025", govDbValue: "440/128/DINKES/2025", match: true },
          { namaField: "Kategori Dapur", ocrValue: "Sentra Pengolahan Pangan Skala Menengah", govDbValue: "Sentra Pengolahan Pangan Skala Menengah", match: true },
        ],
      },
    ],
  },
  {
    id: "SUP-2026-002",
    nama: "PT Berkah Telur Nusantara",
    kategori: "Supplier Bahan",
    wilayah: "Blitar / Jawa Timur",
    picNama: "Ir. Siti Rahmawati",
    picNik: "3505014407870003",
    noHp: "0813-8899-1122",
    rekeningBank: "882-01-928374-1",
    bankName: "Bank BRI",
    sbtStatus: "WHITELISTED",
    walletAddress: "0x89A1209B18C82910298B291A771C928F",
    scoreTrust: 99,
    tanggalDaftar: "10 Agu 2026",
    documents: [
      {
        id: "DOC-101",
        namaDokumen: "NIB_Berkah_Telur_2026.pdf",
        jenis: "NIB",
        labelJenis: "Nomor Induk Berusaha (OSS RBA)",
        nomor: "9120008891023",
        ocrConfidence: 99.8,
        tamperStatus: "clean",
        status: "terverifikasi",
        terakhirDiubah: "10 Agu 2026, 09:00 WIB",
        fileSize: "2.1 MB",
        matchedApi: [
          { namaField: "Nama Badan Usaha", ocrValue: "PT Berkah Telur Nusantara", govDbValue: "PT Berkah Telur Nusantara", match: true },
          { namaField: "KBLI Komoditas", ocrValue: "01461 (Budidaya Ayam Petelur)", govDbValue: "01461 (Budidaya Ayam Petelur)", match: true },
        ],
      },
      {
        id: "DOC-102",
        namaDokumen: "Sertifikat_NKV_Veteriner.pdf",
        jenis: "HIGIENE",
        labelJenis: "Nomor Kontrol Veteriner (NKV)",
        nomor: "NKV-3505-0891-2025",
        ocrConfidence: 98.9,
        tamperStatus: "clean",
        status: "terverifikasi",
        terakhirDiubah: "10 Agu 2026, 09:15 WIB",
        fileSize: "1.9 MB",
        matchedApi: [
          { namaField: "Level NKV", ocrValue: "NKV Level 1 (Sangat Baik)", govDbValue: "NKV Level 1 (Sangat Baik)", match: true },
        ],
      },
    ],
  },
  {
    id: "SUP-2026-003",
    nama: "UD Sayur Segar Lembang",
    kategori: "Supplier Bahan",
    wilayah: "Bandung Barat, Jawa Barat",
    picNama: "Asep Sunandar",
    picNik: "3217011904790002",
    noHp: "0821-1234-5678",
    rekeningBank: "014-98-102938-4",
    bankName: "Bank BJB",
    sbtStatus: "REVISI_DOKUMEN",
    walletAddress: "0x12F8912A09B291A771C928F89A1209B1",
    scoreTrust: 78,
    tanggalDaftar: "13 Agu 2026",
    documents: [
      {
        id: "DOC-201",
        namaDokumen: "NIB_Sayur_Segar_Lembang.pdf",
        jenis: "NIB",
        labelJenis: "Nomor Induk Berusaha",
        nomor: "9120007788192",
        ocrConfidence: 96.2,
        tamperStatus: "clean",
        status: "terverifikasi",
        terakhirDiubah: "13 Agu 2026, 14:10 WIB",
        fileSize: "1.4 MB",
        matchedApi: [
          { namaField: "Nama Usaha", ocrValue: "UD Sayur Segar Lembang", govDbValue: "UD Sayur Segar Lembang", match: true },
        ],
      },
      {
        id: "DOC-202",
        namaDokumen: "Surat_Keterangan_Bebas_Pestisida.pdf",
        jenis: "HIGIENE",
        labelJenis: "Uji Lab Bebas Residu Pestisida",
        nomor: "LAB-AGRO-2026-081",
        ocrConfidence: 89.1,
        tamperStatus: "suspicious",
        tamperReason: "Tanggal hasil uji lab terdeteksi font tidak konsisten dengan barcode sampel.",
        status: "perlu_revisi",
        terakhirDiubah: "13 Agu 2026, 14:20 WIB",
        fileSize: "3.1 MB",
        matchedApi: [
          { namaField: "Hasil Uji Organik", ocrValue: "Bebas Residu < 0.01 ppm", govDbValue: "Data Tidak Ditemukan di Lab Kementan", match: false },
        ],
      },
    ],
  },
];

// ─── Main Component ──────────────────────────────────────────────────────────

export default function VerifikasiSupplierPage() {
  const [suppliers, setSuppliers] = useState<SupplierCase[]>(MOCK_SUPPLIERS);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(MOCK_SUPPLIERS[0].id);
  const [selectedDocId, setSelectedDocId] = useState<string>(MOCK_SUPPLIERS[0].documents[0].id);
  const [isScanning, setIsScanning] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const currentSupplier = useMemo(() => {
    return suppliers.find((s) => s.id === selectedSupplierId) || suppliers[0];
  }, [suppliers, selectedSupplierId]);

  const currentDoc = useMemo(() => {
    return currentSupplier.documents.find((d) => d.id === selectedDocId) || currentSupplier.documents[0];
  }, [currentSupplier, selectedDocId]);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const matchCat = categoryFilter === "all" || s.kategori === categoryFilter;
      const matchSearch = s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.wilayah.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [suppliers, categoryFilter, searchQuery]);

  // Total metrics across all suppliers
  const stats = useMemo(() => {
    const totalDocs = suppliers.reduce((acc, s) => acc + s.documents.length, 0);
    const verifiedDocs = suppliers.reduce((acc, s) => acc + s.documents.filter((d) => d.status === "terverifikasi").length, 0);
    const pendingDocs = suppliers.reduce((acc, s) => acc + s.documents.filter((d) => d.status !== "terverifikasi").length, 0);
    return {
      totalSuppliers: suppliers.length,
      avgAccuracy: 98.8,
      verifiedDocs,
      pendingDocs,
    };
  }, [suppliers]);

  // Simulate new document scan upload
  const handleSimulateScan = () => {
    setIsScanning(true);
    toast.info("Menjalankan AI TrOCR & YOLO Vision Analyzer...", { duration: 1500 });
    setTimeout(() => {
      const newDoc: DocumentItem = {
        id: `DOC-${Date.now().toString().slice(-3)}`,
        namaDokumen: "KTP_Direktur_Utama_Signed.pdf",
        jenis: "KTP_PIC",
        labelJenis: "KTP Penanggung Jawab Legal",
        nomor: currentSupplier.picNik,
        ocrConfidence: 99.8,
        tamperStatus: "clean",
        status: "terverifikasi",
        terakhirDiubah: "Baru saja",
        fileSize: "1.1 MB",
        matchedApi: [
          { namaField: "NIK Dukcapil", ocrValue: currentSupplier.picNik, govDbValue: currentSupplier.picNik, match: true },
          { namaField: "Nama Lengkap", ocrValue: currentSupplier.picNama, govDbValue: currentSupplier.picNama, match: true },
          { namaField: "Status Kependudukan", ocrValue: "Aktif & Valid", govDbValue: "Aktif & Valid", match: true },
        ],
      };

      setSuppliers((prev) =>
        prev.map((s) => (s.id === currentSupplier.id ? { ...s, documents: [newDoc, ...s.documents] } : s))
      );
      setSelectedDocId(newDoc.id);
      setIsScanning(false);
      toast.success("Dokumen Berhasil Diekstraksi & Diverifikasi oleh AI!", {
        description: "Akurasi 99.8% • Lolos Cek Manipulasi Visual.",
      });
    }, 1800);
  };

  // Simulate Minting Soulbound Token (SBT) to Immutable Ledger
  const handleMintSBT = () => {
    setIsMinting(true);
    toast.loading("Menerbitkan Soulbound Token (SBT) ke Immutable Ledger...", { id: "sbt-mint" });

    setTimeout(() => {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === currentSupplier.id ? { ...s, sbtStatus: "WHITELISTED", scoreTrust: 100 } : s))
      );
      setIsMinting(false);
      toast.success("SBT Berhasil Diterbitkan!", {
        id: "sbt-mint",
        description: `Supplier ${currentSupplier.nama} resmi masuk Whitelist Ledger B.O.G.A (Block #10495).`,
      });
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* ── Top Header ────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 sm:py-5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 text-[10px] font-mono font-black px-2.5 py-0.5">
                ● GIZANTARA AI GOVERNANCE ENGINE
              </Badge>
              <span className="text-slate-500 text-xs font-mono font-semibold">TrOCR-v3 & YOLO Document Verifier</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 truncate">
              Verifikasi Legalitas Supplier & Whitelist SBT
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 sm:line-clamp-none">
              Validasi otomatis dokumen hukum supplier, proteksi anti-tamper AI, dan pencatatan token reputasi (SBT) ke Immutable Ledger.
            </p>
          </div>

          {/* Quick Stat Pill */}
          <div className="flex items-center gap-2 sm:gap-3 bg-slate-100 p-1.5 sm:p-2 rounded-2xl border border-slate-200/80 shrink-0">
            <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-white rounded-xl shadow-2xs border border-slate-200/60">
              <Cpu className="w-4 h-4 text-emerald-600 animate-pulse shrink-0" />
              <div className="text-left">
                <p className="text-[9px] font-black uppercase text-slate-400">Engine AI</p>
                <p className="text-xs font-black text-slate-800 whitespace-nowrap">ONLINE (98.8%)</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-white rounded-xl shadow-2xs border border-slate-200/60">
              <Fingerprint className="w-4 h-4 text-primary shrink-0" />
              <div className="text-left">
                <p className="text-[9px] font-black uppercase text-slate-400">SBT Whitelist</p>
                <p className="text-xs font-black text-slate-800 whitespace-nowrap">{suppliers.filter(s => s.sbtStatus === "WHITELISTED").length} / {suppliers.length} Vendor</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Summary Cards ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black shrink-0">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-wider truncate">Total Supplier</p>
              <p className="text-sm sm:text-base lg:text-lg font-black text-slate-900 truncate">{stats.totalSuppliers} <span className="text-[10px] sm:text-xs font-semibold text-slate-500">Badan Usaha</span></p>
            </div>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-wider truncate">Akurasi AI OCR</p>
              <p className="text-sm sm:text-base lg:text-lg font-black text-emerald-700 truncate">{stats.avgAccuracy}% <span className="text-[10px] sm:text-xs font-bold text-emerald-600">Optimal</span></p>
            </div>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-black shrink-0">
              <FileCheck2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-wider truncate">Dokumen Sah</p>
              <p className="text-sm sm:text-base lg:text-lg font-black text-slate-900 truncate">{stats.verifiedDocs} <span className="text-[10px] sm:text-xs font-semibold text-slate-500">Berkas</span></p>
            </div>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black shrink-0">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-wider truncate">Perlu Review</p>
              <p className="text-sm sm:text-base lg:text-lg font-black text-amber-700 truncate">{stats.pendingDocs} <span className="text-[10px] sm:text-xs font-semibold text-amber-600">Dokumen</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Interactive Layout ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 flex-1 flex flex-col gap-5 sm:gap-6">
        
        {/* Supplier Selection Row */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 min-w-0 flex-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1 shrink-0">Pilih Supplier:</span>
            {suppliers.map((sup) => {
              const isSelected = sup.id === currentSupplier.id;
              return (
                <button
                  key={sup.id}
                  onClick={() => {
                    setSelectedSupplierId(sup.id);
                    setSelectedDocId(sup.documents[0].id);
                  }}
                  className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200/80"
                  }`}
                >
                  <Building2 className={`w-3.5 h-3.5 ${isSelected ? "text-emerald-400" : "text-slate-400"}`} />
                  <span className="max-w-[150px] sm:max-w-none truncate">{sup.nama}</span>
                  {sup.sbtStatus === "WHITELISTED" ? (
                    <Badge className="bg-emerald-500 text-white text-[9px] px-1.5 py-0">SBT</Badge>
                  ) : (
                    <Badge className="bg-amber-500/20 text-amber-700 text-[9px] px-1.5 py-0">Review</Badge>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={handleSimulateScan}
              disabled={isScanning}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl h-9 px-3.5 gap-2 cursor-pointer shadow-sm shadow-emerald-600/20 whitespace-nowrap"
            >
              {isScanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
              <span>{isScanning ? "Memindai AI..." : "Simulasi Upload & Scan"}</span>
            </Button>
          </div>
        </div>

        {/* Two-Column Grid Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          
          {/* Left Column (5 Cols) — Visual AI Scanner & Document Canvas */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            
            {/* Visual Document Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-3.5 sm:p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <ScanLine className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700 truncate">Canvas AI OCR & Pratinjau</span>
                </div>
                <Badge className="bg-slate-200 text-slate-800 text-[10px] font-mono shrink-0">
                  {currentDoc.ocrConfidence}% Acc
                </Badge>
              </div>

              {/* Document Interactive Preview Frame */}
              <div className="p-4 sm:p-5 bg-slate-900 text-white relative flex flex-col items-center justify-center min-h-[260px] overflow-hidden">
                {/* Laser Scanning Animation Overlay */}
                {isScanning && (
                  <motion.div
                    initial={{ top: "0%" }}
                    animate={{ top: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent z-20 shadow-[0_0_15px_#10b981]"
                  />
                )}

                {/* Document Mock Sheet */}
                <div className="w-full max-w-[340px] sm:max-w-sm bg-white text-slate-900 rounded-xl p-3.5 sm:p-4 shadow-xl border border-slate-200/40 relative font-mono text-[11px] leading-relaxed">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-emerald-600 rounded-md flex items-center justify-center text-white font-black text-[9px]">G</div>
                      <span className="font-bold text-[10px] text-slate-800">REPUBLIK INDONESIA</span>
                    </div>
                    <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold">{currentDoc.jenis}</span>
                  </div>

                  {/* Bounding Box Simulation */}
                  <div className="space-y-2">
                    <div className="p-1.5 rounded bg-emerald-50 border border-emerald-300 relative group">
                      <span className="text-[8px] bg-emerald-600 text-white px-1 rounded absolute -top-2 left-1 font-bold">OCR: NAMA ENTITAS</span>
                      <p className="font-bold text-slate-900 text-xs mt-0.5 truncate">{currentSupplier.nama}</p>
                    </div>

                    <div className="p-1.5 rounded bg-blue-50 border border-blue-300 relative">
                      <span className="text-[8px] bg-blue-600 text-white px-1 rounded absolute -top-2 left-1 font-bold">OCR: NOMOR REGISTRASI</span>
                      <p className="font-bold text-blue-900 text-xs mt-0.5 truncate">{currentDoc.nomor}</p>
                    </div>

                    <div className="p-1.5 rounded bg-slate-100 border border-slate-200 text-[10px] text-slate-600">
                      <p className="font-sans truncate">Penanggung Jawab: <span className="font-bold text-slate-800">{currentSupplier.picNama}</span></p>
                      <p className="font-sans text-[9px] text-slate-500 mt-0.5 truncate">Wilayah: {currentSupplier.wilayah}</p>
                    </div>
                  </div>

                  {/* Stamp Verification Badge */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[9px]">
                    <span className="text-slate-400">Status Visual:</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Stempel & Barcode Sah
                    </span>
                  </div>
                </div>
              </div>

              {/* Tamper Analysis Bar */}
              <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="font-bold text-slate-700">Integritas Piksel AI:</span>
                </div>
                {currentDoc.tamperStatus === "clean" ? (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[11px] gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Bebas Manipulasi
                  </Badge>
                ) : (
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[11px] gap-1 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Warning Tamper
                  </Badge>
                )}
              </div>

              {/* Whitelist SBT Action Box */}
              <div className="p-4 sm:p-5 bg-white border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-700">Status Token SBT</span>
                  </div>
                  <Badge
                    className={
                      currentSupplier.sbtStatus === "WHITELISTED"
                        ? "bg-emerald-600 text-white font-bold"
                        : "bg-amber-100 text-amber-800 font-bold border-amber-200"
                    }
                  >
                    {currentSupplier.sbtStatus}
                  </Badge>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-500 font-mono truncate">
                  Wallet On-Chain: <span className="text-slate-800 font-bold">{currentSupplier.walletAddress}</span>
                </p>

                <Button
                  onClick={handleMintSBT}
                  disabled={isMinting || currentSupplier.sbtStatus === "WHITELISTED"}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-10 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  {currentSupplier.sbtStatus === "WHITELISTED"
                    ? "Tercatat di Whitelist Ledger B.O.G.A ✓"
                    : isMinting
                    ? "Menerbitkan Token SBT..."
                    : "Otorisasi & Terbitkan SBT Whitelist"}
                </Button>
              </div>
            </div>

          </div>

          {/* Right Column (7 Cols) — Matrix Ekstraksi & Daftar Berkas */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            
            {/* Supplier Profile Header Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center font-black text-emerald-700 text-base shrink-0">
                    {currentSupplier.nama.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm sm:text-base font-black text-slate-900 truncate">{currentSupplier.nama}</h2>
                      <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-[10px] font-bold">
                        {currentSupplier.kategori}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      📍 {currentSupplier.wilayah} • ID: <span className="font-mono font-bold text-slate-700">{currentSupplier.id}</span>
                    </p>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trust Score AI</span>
                  <span className="text-lg sm:text-xl font-black text-emerald-600">{currentSupplier.scoreTrust} / 100</span>
                </div>
              </div>

              {/* PIC Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 text-xs">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Penanggung Jawab (PIC)</span>
                  <span className="font-bold text-slate-800 truncate block">{currentSupplier.picNama}</span>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NIK Terdaftar</span>
                  <span className="font-mono font-bold text-slate-800 truncate block">{currentSupplier.picNik}</span>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rekening Bank</span>
                  <span className="font-bold text-slate-800 truncate block">{currentSupplier.bankName} - {currentSupplier.rekeningBank}</span>
                </div>
              </div>
            </div>

            {/* Document Tabs / List */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-3.5 sm:p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-700 truncate">
                  Daftar Berkas Hukum ({currentSupplier.documents.length} Dokumen)
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">Pilih berkas untuk pratinjau</span>
              </div>

              <div className="divide-y divide-slate-100">
                {currentSupplier.documents.map((doc) => {
                  const isSelected = doc.id === currentDoc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDocId(doc.id)}
                      className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? "bg-emerald-50/70 border-l-4 border-l-emerald-600"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${isSelected ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 truncate">{doc.labelJenis}</span>
                            <span className="text-[11px] font-mono text-slate-400">({doc.fileSize})</span>
                          </div>
                          <p className="text-xs font-mono text-slate-500 mt-0.5 truncate">
                            Nomor: <span className="font-bold text-slate-800">{doc.nomor}</span>
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Diperbarui: {doc.terakhirDiubah}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 justify-end shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-slate-400 block">AI Acc</span>
                          <span className="text-xs font-black text-emerald-600">{doc.ocrConfidence}%</span>
                        </div>
                        {doc.status === "terverifikasi" ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs font-bold gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Sah
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs font-bold gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-600" /> Review
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* ── Full Width Section: Extracted OCR vs Central Database Cross-Match Matrix ── */}
        <div className="w-full bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3.5 gap-2">
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600 shrink-0" />
                Cross-Check AI OCR vs Basis Data Pemerintah
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Membandingkan hasil bacaan optik ({currentDoc.jenis}) langsung ke API Kemenkumham AHU, DJP Pajak, BPJPH, & Dukcapil secara real-time.
              </p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs font-bold px-3 py-1 self-start sm:self-auto shrink-0">
              MATCH 100% TERVERIFIKASI
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {currentDoc.matchedApi.map((item, idx) => (
              <div key={idx} className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between gap-3 transition-all hover:border-slate-300">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block truncate">{item.namaField}</span>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Valid</span>
                    </div>
                  </div>
                  <div className="space-y-1 pt-1 min-w-0">
                    <p className="text-xs font-mono font-bold text-slate-900 flex items-center gap-1.5 min-w-0">
                      <span className="text-[9px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-bold shrink-0">Dokumen:</span>
                      <span className="truncate">{item.ocrValue}</span>
                    </p>
                    <p className="text-xs font-mono text-emerald-700 flex items-center gap-1.5 min-w-0">
                      <span className="text-[9px] bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-800 font-bold shrink-0">Gov DB:</span>
                      <span className="truncate">{item.govDbValue}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
