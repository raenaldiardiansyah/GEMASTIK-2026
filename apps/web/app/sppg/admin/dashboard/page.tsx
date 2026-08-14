"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Wallet, 
  Users, 
  ShoppingCart, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Download, 
  Plus, 
  Clock, 
  ExternalLink, 
  Activity,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Search,
  Truck,
  ScanLine,
  Layers,
  Database
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { toast } from "sonner";

const WEEKLY_PROCUREMENT_DATA = [
  { day: "Sen", porsi: 3200, belanjaJuta: 48 },
  { day: "Sel", porsi: 3450, belanjaJuta: 52 },
  { day: "Rab", porsi: 3300, belanjaJuta: 49 },
  { day: "Kam", porsi: 3600, belanjaJuta: 54 },
  { day: "Jum", porsi: 3800, belanjaJuta: 57 },
  { day: "Sab", porsi: 2900, belanjaJuta: 43 },
  { day: "Min", porsi: 1200, belanjaJuta: 18 },
];

const APPROVAL_ITEMS = [
  { 
    id: 1, 
    po: "PO-2026-0811", 
    vendor: "PT. Berkah Pangan Mandiri", 
    category: "Beras & Karbohidrat", 
    type: "Verifikasi Pembayaran", 
    status: "MENUNGGU_BUKTI_TRANSFER", 
    amount: "Rp 28.500.000",
    date: "14 Agu 2026",
    link: "/sppg/verifikasi-pembayaran"
  },
  { 
    id: 2, 
    po: "PO-2026-0812", 
    vendor: "CV Sayur Mayur Sejahtera", 
    category: "Sayur & Serat", 
    type: "QC Bahan Masuk", 
    status: "QC_PASSED", 
    amount: "Rp 14.200.000",
    date: "14 Agu 2026",
    link: "/sppg/admin/tender/progress"
  },
  { 
    id: 3, 
    po: "PO-2026-0813", 
    vendor: "Koperasi Peternak Telur Juara", 
    category: "Protein Hewani", 
    type: "Surat Jalan & Distribusi", 
    status: "IN_TRANSIT", 
    amount: "Rp 19.750.000",
    date: "13 Agu 2026",
    link: "/sppg/admin/tender/progress"
  },
  { 
    id: 4, 
    po: "PO-2026-0814", 
    vendor: "UD Sumber Protein Nabati", 
    category: "Tempe & Tahu", 
    type: "Audit Bukti OCR", 
    status: "PAYMENT_VERIFIED", 
    amount: "Rp 8.400.000",
    date: "12 Agu 2026",
    link: "/sppg/verifikasi-pembayaran"
  }
];

export default function SppgAdminDashboard() {
  const [activeTab, setActiveTab] = useState<"semua" | "pembayaran" | "qc">("semua");

  const handleDownloadReport = () => {
    toast.success("Mengunduh Rekap Audit SPPG...", {
      description: "Format PDF Eksekutif tervalidasi Hash Ledger Blockchain."
    });
  };

  const filteredItems = APPROVAL_ITEMS.filter((item) => {
    if (activeTab === "pembayaran") return item.type.includes("Pembayaran") || item.type.includes("OCR");
    if (activeTab === "qc") return item.type.includes("QC");
    return true;
  });

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      
      {/* ── HEADER UTAMA ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            SPPG Wilayah Jawa Barat · Satuan Pelayanan MBG
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 leading-tight">
            Dashboard Eksekutif SPPG
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Monitoring Siklus Pengadaan, Audit Pembayaran OCR, dan Distribusi Geofence 50m.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button 
            variant="outline" 
            onClick={handleDownloadReport}
            className="h-10 px-4 rounded-xl border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50 shadow-xs flex items-center gap-2 text-xs"
          >
            <Download size={15} className="text-slate-500" />
            <span>Unduh Laporan Audit</span>
          </Button>

          <Button 
            asChild
            className="h-10 px-4 rounded-xl font-bold text-white bg-[#1E3A5F] hover:bg-[#152a45] shadow-sm flex items-center gap-1.5 text-xs"
          >
            <Link href="/sppg/admin/tender/create">
              <Plus size={16} />
              <span>Buat PO / SPK Baru</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* ── KPI METRICS (4 CARDS) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Anggaran */}
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-xs">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Pagu Realisasi SPPG</p>
                <h3 className="text-2xl font-black mt-1 text-slate-900">Rp 12.5 M</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shadow-2xs">
                <Wallet size={18} />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Sesuai HET / PIHPS
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Terserap 84.2%</span>
            </div>
          </CardContent>
        </Card>

        {/* PO & Kontrak Aktif */}
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-xs">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">PO &amp; Kontrak Aktif</p>
                <h3 className="text-2xl font-black mt-1 text-slate-900">
                  128 <span className="text-xs font-bold text-slate-400">Pesanan</span>
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
                <ShoppingCart size={18} />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <span className="text-slate-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Bulan Berjalan
              </span>
              <Link href="/sppg/admin/tender/progress" className="text-[10px] text-blue-600 hover:underline">
                Lihat Progress ➔
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Terverifikasi */}
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-xs">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Vendor Terverifikasi</p>
                <h3 className="text-2xl font-black mt-1 text-slate-900">
                  42 <span className="text-xs font-bold text-slate-400">Mitra NIB</span>
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-2xs">
                <Users size={18} />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <span className="text-amber-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Whitelist Zero-Trust
              </span>
              <Link href="/sppg/admin/evaluation" className="text-[10px] text-amber-700 hover:underline">
                Evaluasi ➔
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Audit Pembayaran OCR */}
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-xs">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Audit Bukti Transfer</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  99.4% <span className="text-xs font-bold text-emerald-600">Match</span>
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs">
                <ScanLine size={18} />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <span className="text-slate-600 flex items-center gap-1">
                <CheckCircle2 size={12} className="text-emerald-600" />
                AI TrOCR Validated
              </span>
              <Link href="/sppg/verifikasi-pembayaran" className="text-[10px] text-emerald-700 hover:underline">
                Cek Bukti ➔
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── BENTO GRID SECTION UTAMA ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* KOLOM KIRI (8 COLS): Antrean Persetujuan & Grafik Pengadaan */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Antrean Persetujuan */}
          <Card className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <CardHeader className="p-5 pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-black text-slate-900">
                  Antrean Verifikasi &amp; Alur Persetujuan SPPG
                </CardTitle>
                <CardDescription className="text-xs font-medium text-slate-500 mt-0.5">
                  Validasi Purchase Order, Penerimaan QC Bahan Baku, dan Audit Bukti Transfer.
                </CardDescription>
              </div>

              {/* Tab Filters */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab("semua")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "semua" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setActiveTab("pembayaran")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "pembayaran" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Pembayaran OCR
                </button>
                <button
                  onClick={() => setActiveTab("qc")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "qc" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  QC Masuk
                </button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-black text-slate-800 text-xs shrink-0 mt-0.5">
                        #{item.id}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-black text-sm text-slate-900 font-mono">{item.po}</p>
                          <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            {item.amount}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-700 mt-1">{item.vendor}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{item.category} • {item.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      {item.status === "MENUNGGU_BUKTI_TRANSFER" && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 text-[10px] font-black">
                          Menunggu Bukti Transfer
                        </Badge>
                      )}
                      {item.status === "QC_PASSED" && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300 text-[10px] font-black">
                          QC Passed
                        </Badge>
                      )}
                      {item.status === "IN_TRANSIT" && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-300 text-[10px] font-black">
                          Dalam Pengiriman
                        </Badge>
                      )}
                      {item.status === "PAYMENT_VERIFIED" && (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px] font-black">
                          ✓ OCR Match
                        </Badge>
                      )}

                      <Button asChild size="sm" variant="outline" className="h-8 px-3 rounded-xl text-xs font-bold border-slate-200 hover:bg-slate-100">
                        <Link href={item.link}>
                          Proses
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KOLOM KANAN (4 COLS): Status AI Governance & Pintasan Operasional */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Governance & Audit Ledger Status */}
          <Card className="rounded-3xl border border-slate-200 bg-white shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-black text-xs text-slate-900 uppercase tracking-wider">AI Governance &amp; Ledger</span>
              </div>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <ScanLine size={15} className="text-[#1E3A5F]" />
                  <span className="font-bold text-slate-700">TrOCR Bukti Transfer</span>
                </div>
                <span className="font-mono text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  AKTIF (99.4%)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <Database size={15} className="text-[#1E3A5F]" />
                  <span className="font-bold text-slate-700">Audit Trail Immutable</span>
                </div>
                <span className="font-mono text-[10px] font-black text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                  BLOCK #4081
                </span>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <Truck size={15} className="text-[#1E3A5F]" />
                  <span className="font-bold text-slate-700">Haversine Geofence</span>
                </div>
                <span className="font-mono text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  RADIUS ≤ 50m
                </span>
              </div>
            </div>
          </Card>

          {/* Pintasan Alur Pengadaan GIZANTARA */}
          <Card className="rounded-3xl border border-slate-200 bg-white shadow-xs p-5">
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3">
              Pintasan Alur SPPG (13 Langkah)
            </p>
            <div className="space-y-2">
              <Link 
                href="/sppg/admin/tender/create" 
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all border border-slate-100 hover:border-slate-200"
              >
                <span className="flex items-center gap-2">
                  <FileText size={15} className="text-[#1E3A5F]" />
                  1. Buat Purchase Order (PO)
                </span>
                <ArrowUpRight size={14} className="text-slate-400" />
              </Link>

              <Link 
                href="/sppg/verifikasi-pembayaran" 
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all border border-slate-100 hover:border-slate-200"
              >
                <span className="flex items-center gap-2">
                  <ScanLine size={15} className="text-emerald-600" />
                  2. Upload Bukti Transfer &amp; OCR
                </span>
                <ArrowUpRight size={14} className="text-slate-400" />
              </Link>

              <Link 
                href="/sppg/admin/tender/progress" 
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all border border-slate-100 hover:border-slate-200"
              >
                <span className="flex items-center gap-2">
                  <TrendingUp size={15} className="text-blue-600" />
                  3. Tracking QC &amp; Progress PO
                </span>
                <ArrowUpRight size={14} className="text-slate-400" />
              </Link>

              <Link 
                href="/sppg/admin/evaluation" 
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all border border-slate-100 hover:border-slate-200"
              >
                <span className="flex items-center gap-2">
                  <Users size={15} className="text-amber-600" />
                  4. Reputasi Vendor &amp; Sekolah
                </span>
                <ArrowUpRight size={14} className="text-slate-400" />
              </Link>
            </div>
          </Card>

        </div>

      </div>

      {/* ── GRAFIK FULL WIDTH: Volume Produksi MBG vs Belanja Pokok ── */}
      <Card className="rounded-3xl border border-slate-200 bg-white shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <CardTitle className="text-base font-black text-slate-900">
              Volume Produksi MBG vs Realisasi Belanja Bahan Pokok
            </CardTitle>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Pemantauan kapasitas porsi harian untuk mencegah over-reporting bahan pangan dan manipulasi kuantitas.
            </p>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono font-bold bg-slate-50 text-slate-700 w-fit px-3 py-1">
            Data Mingguan Terverifikasi
          </Badge>
        </div>

        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={WEEKLY_PROCUREMENT_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="porsiGradientFull" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E3A5F" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#1E3A5F" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderRadius: '12px', 
                  border: 'none', 
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="porsi" 
                name="Porsi Makanan Matang"
                stroke="#1E3A5F" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#porsiGradientFull)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

    </div>
  );
}

