"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart, Medal, SlidersHorizontal, MapPin, TrendingUp,
  TrendingDown, Star, Download, CalendarRange, Loader2,
  CheckCircle2, FileText, BarChart3, X, AlertCircle, ShieldCheck
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, Cell, CartesianGrid
} from "recharts";
import type { BarShapeProps } from "recharts/types/cartesian/Bar";
import { PageHeader } from "@/components/ui/page-header";

// ─── Types & Data ───────────────────────────────────────────────────────────

interface VendorRating {
  id: number;
  nama: string;
  kategori: string;
  skor: number;
  previousSkor: number;
  onTimeRate: number;
  totalPengiriman: number;
  pelanggaran: number;
  lat: number;
  lng: number;
  radarData: { subject: string; value: number }[];
  trendData: { week: string; skor: number }[];
}

const VENDOR_RANKINGS: VendorRating[] = [
  {
    id: 1, nama: "Katering Pasundan Berkah", kategori: "Katering",
    skor: 97.4, previousSkor: 96.1, onTimeRate: 97.4, totalPengiriman: 512, pelanggaran: 0,
    lat: -6.9380, lng: 107.6250,
    radarData: [
      { subject: "Ketepatan", value: 97 }, { subject: "Kualitas", value: 96 },
      { subject: "Kepatuhan", value: 100 }, { subject: "Dokumen", value: 98 }, { subject: "Respon", value: 95 },
    ],
    trendData: [
      { week: "W1", skor: 94 }, { week: "W2", skor: 95.5 }, { week: "W3", skor: 96.1 },
      { week: "W4", skor: 97.4 },
    ],
  },
  {
    id: 2, nama: "CV Katering Bandung Juara", kategori: "Katering",
    skor: 96.2, previousSkor: 97.8, onTimeRate: 98.2, totalPengiriman: 442, pelanggaran: 1,
    lat: -6.8850, lng: 107.6130,
    radarData: [
      { subject: "Ketepatan", value: 98 }, { subject: "Kualitas", value: 97 },
      { subject: "Kepatuhan", value: 95 }, { subject: "Dokumen", value: 94 }, { subject: "Respon", value: 97 },
    ],
    trendData: [
      { week: "W1", skor: 98.2 }, { week: "W2", skor: 97.8 }, { week: "W3", skor: 97.8 },
      { week: "W4", skor: 96.2 },
    ],
  },
  {
    id: 3, nama: "Logistik Parahyangan Express", kategori: "Logistik",
    skor: 94.1, previousSkor: 93.5, onTimeRate: 98.8, totalPengiriman: 312, pelanggaran: 0,
    lat: -6.8980, lng: 107.5950,
    radarData: [
      { subject: "Ketepatan", value: 99 }, { subject: "Kualitas", value: 90 },
      { subject: "Kepatuhan", value: 95 }, { subject: "Dokumen", value: 93 }, { subject: "Respon", value: 96 },
    ],
    trendData: [
      { week: "W1", skor: 92 }, { week: "W2", skor: 93 }, { week: "W3", skor: 93.5 },
      { week: "W4", skor: 94.1 },
    ],
  },
  {
    id: 4, nama: "PT Gizi Priangan Utama", kategori: "Katering",
    skor: 91.5, previousSkor: 92.0, onTimeRate: 96.1, totalPengiriman: 215, pelanggaran: 1,
    lat: -6.9450, lng: 107.6320,
    radarData: [
      { subject: "Ketepatan", value: 96 }, { subject: "Kualitas", value: 89 },
      { subject: "Kepatuhan", value: 93 }, { subject: "Dokumen", value: 90 }, { subject: "Respon", value: 88 },
    ],
    trendData: [
      { week: "W1", skor: 93 }, { week: "W2", skor: 92.5 }, { week: "W3", skor: 92 },
      { week: "W4", skor: 91.5 },
    ],
  },
  {
    id: 5, nama: "Agro Lembang Segar", kategori: "Supplier Bahan",
    skor: 88.3, previousSkor: 87.0, onTimeRate: 93.4, totalPengiriman: 167, pelanggaran: 0,
    lat: -6.8150, lng: 107.6180,
    radarData: [
      { subject: "Ketepatan", value: 93 }, { subject: "Kualitas", value: 92 },
      { subject: "Kepatuhan", value: 88 }, { subject: "Dokumen", value: 83 }, { subject: "Respon", value: 85 },
    ],
    trendData: [
      { week: "W1", skor: 85 }, { week: "W2", skor: 86 }, { week: "W3", skor: 87 },
      { week: "W4", skor: 88.3 },
    ],
  },
  {
    id: 6, nama: "CV Food Hub Jabar", kategori: "Katering",
    skor: 54.2, previousSkor: 72.3, onTimeRate: 72.3, totalPengiriman: 45, pelanggaran: 4,
    lat: -6.9550, lng: 107.5850,
    radarData: [
      { subject: "Ketepatan", value: 55 }, { subject: "Kualitas", value: 60 },
      { subject: "Kepatuhan", value: 48 }, { subject: "Dokumen", value: 52 }, { subject: "Respon", value: 57 },
    ],
    trendData: [
      { week: "W1", skor: 72 }, { week: "W2", skor: 68 }, { week: "W3", skor: 60 },
      { week: "W4", skor: 54.2 },
    ],
  },
];

// ─── Export Modal ────────────────────────────────────────────────────────────

function ExportModal({ onClose }: { onClose: () => void }) {
  const [rentang, setRentang] = useState<"mingguan" | "bulanan">("mingguan");
  const [cakupan, setCakupan] = useState<"logistik" | "anggaran" | "keduanya">("keduanya");
  const [format, setFormat] = useState<"pdf" | "csv">("pdf");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const transaksiCount = rentang === "mingguan" ? 28 : 112;
  const dateRange = rentang === "mingguan" ? "07 – 13 Apr 2025" : "Mar – Apr 2025";

  const handleDownload = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setDone(true);
    setTimeout(onClose, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Unduh Laporan Otomatis</p>
            <h3 className="text-base font-black text-slate-900">Konfigurasi Laporan</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          {done ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-700" />
              </div>
              <p className="text-sm font-black text-emerald-900">Laporan Berhasil Diunduh!</p>
            </div>
          ) : (
            <>
              {/* Rentang */}
              <div>
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest block mb-2">
                  <CalendarRange className="w-3.5 h-3.5 inline mr-1" /> Rentang Waktu
                </label>
                <div className="flex gap-2">
                  {(["mingguan", "bulanan"] as const).map(r => (
                    <button key={r} onClick={() => setRentang(r)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all ${rentang === r ? "border-[#213555] bg-[#213555] text-white shadow-xs" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
                    >{r}</button>
                  ))}
                </div>
              </div>

              {/* Cakupan */}
              <div>
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest block mb-2">
                  <BarChart3 className="w-3.5 h-3.5 inline mr-1" /> Cakupan Data
                </label>
                <div className="flex gap-2">
                  {(["logistik", "anggaran", "keduanya"] as const).map(c => (
                    <button key={c} onClick={() => setCakupan(c)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all ${cakupan === c ? "border-[#213555] bg-[#213555] text-white shadow-xs" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
                    >{c}</button>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div>
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest block mb-2">
                  <FileText className="w-3.5 h-3.5 inline mr-1" /> Format File
                </label>
                <div className="flex gap-2">
                  {(["pdf", "csv"] as const).map(f => (
                    <button key={f} onClick={() => setFormat(f)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all ${format === f ? "border-[#213555] bg-[#213555] text-white shadow-xs" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
                    >
                      {f === "pdf" ? "📄 PDF — Presentasi" : "📊 CSV — Analisis"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 font-bold leading-relaxed">
                Laporan ini mencakup{" "}
                <strong className="text-slate-900 font-black">{transaksiCount} transaksi</strong> dari{" "}
                <strong className="text-slate-900 font-black">{dateRange}</strong>.
                Cakupan: <strong className="text-slate-900 font-black">{cakupan}</strong>. Format:{" "}
                <strong className="text-slate-900 font-black">{format.toUpperCase()}</strong>.
              </div>

              <button
                onClick={handleDownload}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#213555] hover:bg-[#1b2b45] disabled:opacity-70 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyiapkan...</>
                  : <><Download className="w-4 h-4" /> Unduh Laporan</>
                }
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Inline Vendor Detail Panel ─────────────────────────────────────────────

function VendorDetailInline({ vendor, onClose }: { vendor: VendorRating; onClose: () => void }) {
  const router = useRouter();
  const delta = vendor.skor - vendor.previousSkor;

  return (
    <div className="bg-white rounded-3xl border border-[#213555]/30 p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#213555] text-white flex items-center justify-center font-black text-xs">
            #{vendor.id}
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">{vendor.nama}</h3>
            <p className="text-xs font-bold text-slate-600 mt-0.5">Detail Profil & Audit Reputasi Vendor · {vendor.kategori}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          type="button"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors border border-slate-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Row 1: Key Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Skor Indeks */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Indeks Performa</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-slate-900 tabular-nums">{vendor.skor}</span>
            <span className={`flex items-center gap-0.5 text-xs font-black tabular-nums ${delta >= 0 ? "text-emerald-700" : "text-red-700"}`}>
              {delta >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {delta >= 0 ? "+" : ""}{delta.toFixed(1)}
            </span>
          </div>
        </div>

        {/* On Time Rate */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Ketepatan On-Time</p>
          <p className="text-3xl font-black text-emerald-700 tabular-nums mt-2">{vendor.onTimeRate}%</p>
        </div>

        {/* Total Pengiriman */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Total Pengiriman</p>
          <p className="text-3xl font-black text-[#213555] tabular-nums mt-2">{vendor.totalPengiriman}</p>
        </div>

        {/* Pelanggaran */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Catatan Pelanggaran</p>
          <p className={`text-3xl font-black tabular-nums mt-2 ${vendor.pelanggaran > 0 ? "text-red-700" : "text-emerald-700"}`}>
            {vendor.pelanggaran}
          </p>
        </div>
      </div>

      {/* Row 2: 5 Dimensions Breakdown Cards */}
      <div>
        <p className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">Breakdown Dimensi Penilaian BGN</p>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {vendor.radarData.map((d) => {
            const ok = d.value >= 90;
            const warn = d.value < 70;
            const badgeBg = ok ? "bg-emerald-100 text-emerald-800 border-emerald-200" : warn ? "bg-red-100 text-red-800 border-red-200" : "bg-amber-100 text-amber-800 border-amber-200";
            const barBg = ok ? "bg-emerald-600" : warn ? "bg-red-600" : "bg-amber-500";
            return (
              <div key={d.subject} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">{d.subject}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border tabular-nums ${badgeBg}`}>
                    {d.value}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${d.value}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${barBg}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 3: Tren & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
        <div className="lg:col-span-2 space-y-2">
          <p className="text-xs font-black text-slate-900 uppercase tracking-wider">Tren Indeks Reputasi (4 Minggu Terakhir)</p>
          <div className="h-28 bg-slate-50 rounded-2xl border border-slate-200 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={vendor.trendData} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendGradInline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#213555" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#213555" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#475569", fontWeight: 700 }} />
                <Tooltip contentStyle={{ fontSize: 11, fontWeight: 700, borderRadius: 10, border: "1px solid #cbd5e1" }} />
                <Area type="monotone" dataKey="skor" stroke="#213555" strokeWidth={2.5} fill="url(#trendGradInline)" dot={{ r: 3, fill: "#213555" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => router.push(`/goverment/pengawasan?vendor=${vendor.id}`)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#213555] hover:bg-[#1b2b45] text-white text-xs font-black uppercase tracking-wider transition-all shadow-xs"
          >
            <MapPin className="w-4 h-4" /> Lihat Armada Aktif Vendor Ini
          </button>

          {vendor.pelanggaran > 0 && (
            <button
              type="button"
              onClick={() => router.push("/goverment/verifikasi")}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 text-red-700 bg-red-50/50 hover:bg-red-100 text-xs font-bold uppercase tracking-wider transition-all"
            >
              <AlertCircle className="w-3.5 h-3.5" /> Lihat Catatan Pelanggaran ({vendor.pelanggaran})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function StatistikPage() {
  const router = useRouter();
  const [filterKategori, setFilterKategori] = useState("SEMUA");
  const [selectedVendor, setSelectedVendor] = useState<VendorRating | null>(null);
  const [showExport, setShowExport] = useState(false);

  const filteredVendors = useMemo(() =>
    VENDOR_RANKINGS.filter(v =>
      filterKategori === "SEMUA" || v.kategori === filterKategori
    ).sort((a, b) => b.skor - a.skor),
    [filterKategori]);

  const categories = ["SEMUA", ...Array.from(new Set(VENDOR_RANKINGS.map(v => v.kategori)))];

  return (
    <div className="p-6 space-y-6 min-h-full bg-background text-foreground w-full">

      {/* Page Header */}
      <PageHeader
        title={
          <span className="inline-flex items-center gap-2.5">
            <span className="size-6 inline-flex items-center justify-center rounded-xl bg-[#213555] text-white shadow-xs">
              <PieChart className="size-4" aria-hidden />
            </span>
            <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-900">Statistik & Reputasi Vendor</span>
          </span>
        }
        subtitle="Papan peringkat reputasi vendor, audit performa operasional, dan unduh laporan otomatis"
        actions={
          <button
            type="button"
            onClick={() => setShowExport(true)}
            className="flex items-center gap-2 px-4.5 py-2.5 bg-[#213555] hover:bg-[#1b2b45] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-xs"
          >
            <Download className="w-4 h-4" /> Unduh Laporan
          </button>
        }
      />

      {/* Filter Kategori */}
      <div className="flex items-center gap-3">
        <SlidersHorizontal className="w-4 h-4 text-slate-600" />
        <div className="flex gap-1.5 bg-slate-200/60 p-1.5 rounded-2xl border border-slate-300/60">
          {categories.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => { setFilterKategori(c); setSelectedVendor(null); }}
              className={`px-4 py-1.5 text-xs font-black rounded-xl transition-all uppercase tracking-wider ${
                filterKategori === c ? "bg-[#213555] text-white shadow-xs" : "text-slate-700 hover:text-slate-900"
              }`}
            >
              {c === "SEMUA" ? "Semua Kategori" : c}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Bar Chart Overview + Full-Width Leaderboard */}
      <div className="space-y-6 w-full">
        {/* Bar Chart Overview (bklit.com style) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 w-full">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <p className="text-xs font-black text-slate-900 uppercase tracking-wider">Indeks Performa Semua Vendor (Bklit Visualizer)</p>
              <p className="text-xs font-bold text-slate-600 mt-0.5">Klik batang grafik atau kartu vendor untuk membuka detail profil</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="text-xs font-bold text-slate-800">Sangat Baik (≥ 90)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-xs font-bold text-slate-800">Cukup (≥ 70)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
                <span className="text-xs font-bold text-slate-800">Perlu Evaluasi (&lt; 70)</span>
              </div>
            </div>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredVendors}
                margin={{ top: 12, right: 10, left: -10, bottom: 5 }}
                onClick={(d) => {
                  const name = d?.activeLabel as string | undefined;
                  if (name) setSelectedVendor(filteredVendors.find((v) => v.nama === name) || null);
                }}
              >
                <defs>
                  {filteredVendors.map((v) => {
                    const color = v.skor >= 90 ? ["#059669", "#34d399"] : v.skor >= 70 ? ["#d97706", "#fcd34d"] : ["#dc2626", "#fca5a5"];
                    return (
                      <linearGradient key={v.id} id={`grad-${v.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color[0]} stopOpacity={0.95} />
                        <stop offset="100%" stopColor={color[1]} stopOpacity={0.7} />
                      </linearGradient>
                    );
                  })}
                </defs>
                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis
                  dataKey="nama"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fontWeight: 700, fill: "#1e293b" }}
                  tickFormatter={(val: string) => val.split(" ").slice(-1)[0]}
                  tickMargin={8}
                />
                <YAxis
                  domain={[40, 100]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fontWeight: 700, fill: "#475569" }}
                  tickCount={4}
                />
                <Tooltip
                  cursor={{ fill: "#f1f5f9", radius: 10 }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const v = payload[0].payload as typeof filteredVendors[0];
                    const color = v.skor >= 90 ? "text-emerald-700" : v.skor >= 70 ? "text-amber-700" : "text-red-700";
                    return (
                      <div className="bg-white border border-slate-300 rounded-2xl px-4 py-3 text-left">
                        <p className="text-xs font-extrabold text-slate-900 mb-1 max-w-[160px] truncate">{v.nama}</p>
                        <p className={`text-xl font-black tabular-nums ${color}`}>{v.skor}</p>
                        <p className="text-[10px] font-bold text-slate-600">{v.kategori}</p>
                      </div>
                    );
                  }}
                />
                <Bar
                  dataKey="skor"
                  radius={[10, 10, 0, 0]}
                  cursor="pointer"
                  maxBarSize={56}
                  shape={(props: BarShapeProps) => {
                    const idx = filteredVendors.findIndex((v) => v.nama === (props as any).nama);
                    const v = filteredVendors[idx];
                    const isHighest = v?.skor === Math.max(...filteredVendors.map((fv) => fv.skor));
                    const fillColor = v?.skor >= 90 ? "#059669" : v?.skor >= 70 ? "#d97706" : "#dc2626";
                    const { x, y, width, height } = props as any;
                    return isHighest ? (
                      <rect
                        x={x} y={y} width={width} height={height}
                        rx={10} ry={10}
                        fill={`url(#grad-${v?.id})`}
                        fillOpacity={0.9}
                        stroke={fillColor}
                        strokeWidth={2.5}
                        strokeDasharray="6 4"
                      />
                    ) : (
                      <rect
                        x={x} y={y} width={width} height={height}
                        rx={10} ry={10}
                        fill={`url(#grad-${v?.id})`}
                      />
                    );
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <p className="text-xs font-bold text-slate-700">
              Batang dengan batas garis putus-putus mewakili skor tertinggi saat ini. Data bersumber dari audit ledger immutable BGN.
            </p>
          </div>
        </div>

        {/* Rankings List with Inline Expandable Detail Drawer */}
        <div className="space-y-4 w-full">
          {filteredVendors.map((vendor, index) => {
            const rank = index + 1;
            const delta = vendor.skor - vendor.previousSkor;
            const isSelected = selectedVendor?.id === vendor.id;

            return (
              <div key={vendor.id} className="space-y-3 w-full">
                <button
                  type="button"
                  onClick={() => setSelectedVendor(isSelected ? null : vendor)}
                  className={`w-full text-left bg-white rounded-2xl border px-5 py-4 flex items-center gap-4 hover:border-[#213555] hover:bg-slate-50/80 transition-all ${
                    isSelected
                      ? "border-[#213555] bg-slate-50/80 ring-2 ring-[#213555]/15"
                      : "border-slate-200"
                  }`}
                >
                  {/* Rank / Initials Badge */}
                  <div className={`flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm border shadow-xs ${
                    rank === 1 ? "bg-amber-100 text-amber-900 border-amber-300" : rank === 2 ? "bg-slate-200 text-slate-900 border-slate-300" : rank === 3 ? "bg-amber-200/60 text-amber-900 border-amber-400" : "bg-slate-100 text-slate-800 border-slate-200"
                  }`}>
                    #{rank}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-black text-slate-900 truncate">{vendor.nama}</p>
                      <span className="text-[10px] font-black px-2.5 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 rounded-full flex-shrink-0">
                        {vendor.kategori}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-700">{vendor.totalPengiriman} pengiriman</span>
                      {vendor.pelanggaran > 0 && (
                        <span className="text-xs font-extrabold text-red-700 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {vendor.pelanggaran} pelanggaran
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Score + Trend */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-black text-slate-900 tabular-nums">
                      {vendor.skor}
                    </p>
                    <span className={`text-xs font-extrabold flex items-center gap-0.5 justify-end tabular-nums ${delta >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                      {delta >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {delta >= 0 ? "+" : ""}{delta.toFixed(1)}
                    </span>
                  </div>

                  {/* MapPin */}
                  <div
                    onClick={e => { e.stopPropagation(); router.push(`/goverment/pengawasan?vendor=${vendor.id}`); }}
                    className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-[#213555] hover:bg-slate-200 border border-slate-200 transition-all"
                    title="Lihat di peta"
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                </button>

                {/* Inline Expandable Detail Drawer directly underneath the vendor item */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -8 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden w-full"
                    >
                      <VendorDetailInline vendor={vendor} onClose={() => setSelectedVendor(null)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {showExport && <ExportModal onClose={() => setShowExport(false)} />}
      </AnimatePresence>
    </div>
  );
}

