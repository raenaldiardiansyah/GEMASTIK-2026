"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import {
  Package, ArrowDownToLine, ShoppingBag, Wallet,
  TrendingUp, TrendingDown, AlertTriangle, ShieldCheck,
  ChevronRight, Star, Medal, ShieldAlert, ArrowRight, Trophy,
  ThumbsUp, ThumbsDown,
} from "lucide-react";
import Link from "next/link";

/* ─── Constants ─── */
const G = "#065F46";
const G_LIGHT = "#D1FAE5";

/* ─── Mock Data ─── */
const PENDAPATAN_DATA = [
  { bulan: "Nov", nilai: 8200000 },
  { bulan: "Des", nilai: 11500000 },
  { bulan: "Jan", nilai: 9800000 },
  { bulan: "Feb", nilai: 14200000 },
  { bulan: "Mar", nilai: 12600000 },
  { bulan: "Apr", nilai: 17400000 },
];

const PO_STATUS_DATA = [
  { name: "Diterima", value: 18, color: G },
  { name: "Menunggu", value: 4, color: "#D97706" },
  { name: "Ditolak", value: 2, color: "#DC2626" },
];

const WEEKLY_PO = [
  { hari: "Sen", jumlah: 2 },
  { hari: "Sel", jumlah: 5 },
  { hari: "Rab", jumlah: 3 },
  { hari: "Kam", jumlah: 7 },
  { hari: "Jum", jumlah: 4 },
  { hari: "Sab", jumlah: 1 },
  { hari: "Min", jumlah: 0 },
];

const PO_TREND_DATA = [
  { bulan: "Nov", diterima: 12, ditolak: 2 },
  { bulan: "Des", diterima: 18, ditolak: 1 },
  { bulan: "Jan", diterima: 14, ditolak: 3 },
  { bulan: "Feb", diterima: 22, ditolak: 0 },
  { bulan: "Mar", diterima: 19, ditolak: 2 },
  { bulan: "Apr", diterima: 24, ditolak: 1 },
];

const TOP_TERLARIS = [
  { nama: "Beras Premium Cap Ramos", qty: 1250, unit: "kg", revenue: 22500000, pos: 12 },
  { nama: "Telur Ayam Ras", qty: 840, unit: "kg", revenue: 24192000, pos: 24 },
  { nama: "Daging Ayam Segar", qty: 320, unit: "kg", revenue: 9600000, pos: 8 },
  { nama: "Sayur Bayam", qty: 200, unit: "kg", revenue: 1200000, pos: 15 },
  { nama: "Tahu Putih", qty: 180, unit: "kg", revenue: 1440000, pos: 9 },
];

const TOP_RATING = [
  { nama: "Telur Ayam Ras", rating: 4.9, ulasan: 38, pos: 54, badge: "Terbaik" },
  { nama: "Beras Premium Cap Ramos", rating: 4.8, ulasan: 54, pos: 72, badge: "Populer" },
  { nama: "Daging Ayam Segar", rating: 4.7, ulasan: 22, pos: 31, badge: null },
  { nama: "Tahu Putih", rating: 4.5, ulasan: 17, pos: 25, badge: null },
  { nama: "Sayur Bayam", rating: 4.3, ulasan: 12, pos: 18, badge: null },
];

/* ─── Helpers ─── */
function currency(v: number) {
  if (v >= 1e9) return `Rp ${(v / 1e9).toFixed(1)}M`;
  if (v >= 1e6) return `Rp ${(v / 1e6).toFixed(1)}Jt`;
  return `Rp ${(v / 1e3).toFixed(0)}Rb`;
}



/* ─── Custom Tooltip ─── */
function PendapatanTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 px-3 py-2">
      <p className="text-[10px] font-bold text-slate-400">{label}</p>
      <p className="text-sm font-extrabold" style={{ color: G }}>{currency(payload[0].value)}</p>
    </div>
  );
}

/* ─── KPI Card ─── */
function KpiCard({ icon: Icon, label, value, sub, color, trend, href }: {
  icon: React.ElementType; label: string; value: string; sub: string;
  color: string; trend?: "up" | "down"; href?: string;
}) {
  const content = (
    <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm flex items-start gap-3 active:scale-[0.98] transition-transform">
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: color + "20" }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-lg font-extrabold text-slate-800 leading-tight mt-0.5">{value}</p>
        <div className="flex items-center gap-1 mt-0.5">
          {trend === "up" && <TrendingUp size={9} className="text-emerald-500" />}
          {trend === "down" && <TrendingDown size={9} className="text-red-500" />}
          <p className="text-[10px] text-slate-400">{sub}</p>
        </div>
      </div>
      {href && <ChevronRight size={14} className="text-slate-300 mt-1 shrink-0" />}
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

/* ─── Section Title ─── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-0.5">{children}</p>;
}

/* ─── Main Dashboard ─── */
export default function VendorDashboardPage() {
  const [vendorId, setVendorId] = useState<string>("1");
  const [stats, setStats] = useState({
    total_revenue: 0,
    active_orders: 0,
    active_products: 0,
    total_inbound: 0
  });
  const [loading, setLoading] = useState(true);

  const [periodIdx, setPeriodIdx] = useState(1); // Default 30 Hari
  const periods = ["7 Hari", "30 Hari", "3 Bulan", "1 Tahun"];

  useEffect(() => {
    const id = localStorage.getItem("boga_vendor_id") || "1";
    setVendorId(id);
    
    // Simulate loading
    setTimeout(() => {
      const { getVendorDashboardStats } = require("@/lib/mbgdummydata");
      const dummyStats = getVendorDashboardStats(Number(id) || 1);
      setStats({
        total_revenue: dummyStats?.totalRevenue || 18500000,
        active_orders: dummyStats?.activeOrders || 4,
        active_products: dummyStats?.activeProducts || 12,
        total_inbound: dummyStats?.totalInbound || 8
      });
      setLoading(false);
    }, 500);
  }, []);

  const getDisplayData = () => {
    // Simulasi data grafik berdasarkan periode
    const trendMultipliers = [0.8, 1.2, 1.5, 2.0];
    const baseTrend = trendMultipliers[periodIdx] || 1.2;
    const baseRevenue = stats.total_revenue || 18500000;

    return {
      total: baseRevenue * baseTrend,
      trend: 12.5 + (periodIdx * 3),
      orders: stats.active_orders || 4,
      chart: PENDAPATAN_DATA.map(d => ({ ...d, label: d.bulan, nilai: d.nilai * (0.8 + Math.random() * 0.4) })),
      weekly: WEEKLY_PO.map(d => ({ 
        hari: d.hari, 
        diterima: Math.floor(d.jumlah * baseTrend) + 1,
        ditolak: Math.floor(Math.random() * 2),
        jumlah: Math.floor(d.jumlah * baseTrend),
        tawaran: Math.floor(Math.random() * 10) + 2
      }))
    };
  };

  const activeData = getDisplayData();

  return (
    <div className="min-h-svh bg-slate-50 w-full" data-role="vendor">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-100">
        <div className="w-full px-4 py-3 md:px-6 flex items-center justify-between">
          <div>
            <h1 className="text-base font-extrabold text-slate-800 leading-none">Dashboard Vendor</h1>
            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
              <ShieldCheck size={10} className="text-emerald-500" />
              Terverifikasi · Identitas Digital Permanen
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-600">Live</span>
          </div>
        </div>
      </div>

      <div className="w-full px-4 py-5 md:px-6 space-y-5 pb-24">

        {/* ── Rating & Reputasi (Paling Atas) ── */}
        <div>
          <SectionTitle>Reputasi Vendor</SectionTitle>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-black" style={{ color: G }}>4.7</p>
                <div className="flex gap-0.5 mt-1 justify-center">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} size={10} fill={i <= 4 ? "#F59E0B" : "none"}
                      stroke={i <= 4 ? "#F59E0B" : "#D1D5DB"} />
                  ))}
                </div>
                <p className="text-[9px] text-slate-400 mt-0.5">dari 5.0</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {[
                  { label: "Ketepatan Harga", val: 96 },
                  { label: "Kualitas Barang", val: 91 },
                  { label: "Kecepatan Siap", val: 88 },
                  { label: "Kelengkapan PO", val: 100 },
                ].map(r => (
                  <div key={r.label} className="flex items-center gap-2">
                    <p className="text-[9px] text-slate-500 w-28 shrink-0">{r.label}</p>
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full bg-amber-400"
                        initial={{ width: 0 }} animate={{ width: `${r.val}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }} />
                    </div>
                    <p className="text-[9px] font-bold text-slate-500 w-7 text-right">{r.val}%</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-emerald-500" />
                <p className="text-[10px] font-bold text-emerald-600">Identitas Digital Terverifikasi</p>
              </div>
              <p className="text-[9px] font-mono text-slate-400">SBT · #VDR-5E1F</p>
            </div>

            {/* ── Sentiment Summary Cards ── */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Kualitas", sub: "Bahan Segar", type: "pos", icon: ThumbsUp },
                { label: "Respon", sub: "Sangat Cepat", type: "pos", icon: ThumbsUp },
                { label: "Packing", sub: "Perlu Rapih", type: "neg", icon: ThumbsDown },
                { label: "Waktu", sub: "Sering Telat", type: "neg", icon: ThumbsDown },
              ].map((s, i) => (
                <div key={i} className={`p-2 rounded-2xl border ${s.type === 'pos' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-red-50/50 border-red-100'}`}>
                  <div className="flex items-center gap-1 mb-1">
                    <s.icon size={10} className={s.type === 'pos' ? 'text-emerald-600' : 'text-red-600'} />
                    <p className={`text-[8px] font-black uppercase tracking-tighter ${s.type === 'pos' ? 'text-emerald-700' : 'text-red-700'}`}>{s.label}</p>
                  </div>
                  <p className="text-[9px] font-bold text-slate-600 leading-none">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Global Period Switcher ── */}
        <div className="bg-white rounded-2xl border border-slate-100 p-1.5 flex gap-1 shadow-sm">
          {periods.map((p, i) => (
            <button key={p} onClick={() => setPeriodIdx(i)}
              className={`flex-1 text-[10px] font-black py-2 rounded-xl transition-all ${periodIdx === i ? "text-white shadow-md shadow-emerald-900/20" : "text-slate-400 hover:bg-slate-50"}`}
              style={periodIdx === i ? { background: G } : {}}>
              {p}
            </button>
          ))}
        </div>

        {/* ── Ringkasan Utama (KPI Grid) ── */}
        <div>
          <SectionTitle>Ringkasan Real-Time</SectionTitle>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard icon={Wallet} label="Total Pendapatan" value={currency(stats.total_revenue)}
              sub="Diterima & Selesai" color="#065F46" trend="up" />
            <KpiCard icon={ShoppingBag} label="Pesanan Masuk" value={String(stats.active_orders)}
              sub="PO Aktif" color="#D97706" trend="up" href="/vendor/pesanan" />
            <KpiCard icon={Package} label="Produk Aktif" value={String(stats.active_products)}
              sub="di E-Katalog" color="#0891B2" href="/vendor/katalog" />
            <KpiCard icon={ArrowDownToLine} label="Penerimaan Stok" value={String(stats.total_inbound) + "x"}
              sub="Total Inbound" color="#7C3AED" href="/vendor/inbound" />
          </div>
        </div>

        {/* ── Grid Dua Kolom: Tren Keuangan & Aktivitas PO ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Kolom Kiri: Pendapatan & Volume */}
          <div className="space-y-4 flex flex-col">
            {/* ── Grafik Pendapatan ── */}
            <div>
              <SectionTitle>Tren Pendapatan ({periods[periodIdx]})</SectionTitle>
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 h-full">
                <div className="mb-3">
                  <p className="text-[10px] text-slate-400 font-medium">Total Periode Ini</p>
                  <p className="text-xl font-extrabold" style={{ color: G }}>{currency(activeData.total)}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <TrendingUp size={10} className="text-emerald-500" />
                    <p className="text-[10px] text-emerald-600 font-semibold">+{activeData.trend}% dari periode sebelumnya</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={activeData.chart} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="pendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={G} stopOpacity={0.25} />
                        <stop offset="100%" stopColor={G} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#94A3B8", fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip content={<PendapatanTooltip />} />
                    <Area type="monotone" dataKey="nilai" stroke={G} strokeWidth={2.5}
                      fill="url(#pendGrad)" dot={false} activeDot={{ r: 4, fill: G, strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── Volume & Alur Amanah (Tawaran Masuk - Pending) ── */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <SectionTitle>Volume Penyaluran Makanan ({periods[periodIdx]})</SectionTitle>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                  <ShoppingBag size={10} className="text-emerald-600" />
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">Tawaran Baru</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 relative overflow-hidden">
                <div className="mb-4">
                  <p className="text-[10px] text-slate-400 font-medium">Total Tawaran Periode Ini</p>
                  <p className="text-2xl font-black text-slate-800">
                    {activeData.weekly.reduce((s, d) => s + d.tawaran, 0)}
                    <span className="text-xs font-bold text-slate-400 ml-1.5 uppercase tracking-widest">Tawaran</span>
                  </p>
                </div>

                <div className="h-[140px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activeData.weekly} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis dataKey="hari" tick={{ fontSize: 9, fill: "#94A3B8", fontWeight: 700 }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (!active || !payload?.length) return null;
                          return (
                            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 px-3 py-2 animate-in fade-in zoom-in-95 duration-200">
                              <p className="text-[10px] font-bold text-slate-400">{label}</p>
                              <p className="text-sm font-extrabold text-emerald-600">{payload[0].value} Tawaran</p>
                            </div>
                          );
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="tawaran"
                        stroke="#10B981"
                        strokeWidth={3}
                        fill="url(#orderGrad)"
                        dot={{ fill: "#10B981", r: 3, strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: "#10B981", strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Tren Alur Pesanan & Kendala PO */}
          <div className="space-y-4 flex flex-col">
            {/* ── Tren Alur Pesanan (Hasil Keputusan: Diterima vs Ditolak) ── */}
            <div>
              <SectionTitle>Tren Alur Pesanan ({periods[periodIdx]})</SectionTitle>
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: G }} />
                    <p className="text-[10px] font-semibold text-slate-500 uppercase">Diterima</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <p className="text-[10px] font-semibold text-slate-500 uppercase">Ditolak</p>
                  </div>
                  <p className="ml-auto text-[9px] font-black text-slate-400 uppercase tracking-tighter">Keputusan Vendor</p>
                </div>
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={activeData.weekly} margin={{ top: 5, right: 4, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="hari" tick={{ fontSize: 9, fill: "#94A3B8", fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip
                      content={({ active, payload, label }) => active && payload?.length ? (
                        <div className="bg-white rounded-xl shadow-lg border border-slate-100 px-3 py-2">
                          <p className="text-[9px] font-bold text-slate-400 mb-1">{label}</p>
                          {payload.map((p) => (
                            <p key={p.dataKey as string} className="text-xs font-extrabold" style={{ color: p.color }}>
                              {p.dataKey === "diterima" ? "Diterima" : "Ditolak"}: {p.value} PO
                            </p>
                          ))}
                        </div>
                      ) : null}
                    />
                    <Line type="monotone" dataKey="diterima" stroke={G} strokeWidth={3}
                      dot={{ fill: G, r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="ditolak" stroke="#EF4444" strokeWidth={2}
                      strokeDasharray="4 3" dot={{ fill: "#EF4444", r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── Seksi Himbauan & Kendala PO (Global) ── */}
            <div className="grid grid-cols-1 gap-3.5 flex-1">
              {/* Kartu 1: Tawaran PO Baru */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-amber-500/10 transition-colors" />
                <div className="flex items-start gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
                    <ShoppingBag size={20} className="text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">Tawaran PO Menunggu</h3>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">
                      Terdapat <span className="font-bold text-amber-600">{activeData.orders} pesanan baru</span> yang memerlukan persetujuan Anda.
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Estimasi Nilai</p>
                        <p className="text-xs font-black text-slate-700">{currency(activeData.total / 4)}</p>
                      </div>
                      <Link href="/vendor/pesanan" className="flex items-center gap-1 text-[9px] font-black text-amber-600 bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-100 hover:bg-amber-100 transition-colors">
                        Respon Sekarang <ArrowRight size={10} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kartu 2: Kendala Proses */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-red-500/10 transition-colors" />
                <div className="flex items-start gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                    <ShieldAlert size={20} className="text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">Kendala Verifikasi Pembayaran</h3>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">
                      Ada <span className="font-bold text-red-600">2 pesanan</span> menunggu verifikasi QC/Admin.
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {[1, 2].map(i => (
                          <div key={i} className="w-5 h-5 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[7px] font-bold text-slate-400">
                            PO
                          </div>
                        ))}
                        <div className="w-5 h-5 rounded-full bg-red-100 border-2 border-white flex items-center justify-center text-[7px] font-black text-red-600">
                          !
                        </div>
                      </div>
                      <Link href="/vendor/pesanan" className="flex items-center gap-1 text-[9px] font-black text-red-600 bg-red-50 px-2.5 py-1.5 rounded-xl border border-red-100 hover:bg-red-100 transition-colors">
                        Cek Status <ArrowRight size={10} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Grid Dua Kolom: Produk Terlaris & Rating Tertinggi ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* ── Top Barang Terlaris ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <SectionTitle>Barang Paling Banyak Dibeli</SectionTitle>
              <Link href="/vendor/katalog" className="text-[10px] font-bold" style={{ color: G }}>Lihat Semua</Link>
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              {TOP_TERLARIS.map((item, idx) => {
                const bgClass = idx === 0 ? "bg-amber-100/50" : 
                               idx === 1 ? "bg-slate-100/50" : 
                               idx === 2 ? "bg-orange-100/50" : "bg-white";
                
                const iconColor = idx === 0 ? "#F59E0B" : "transparent";

                return (
                  <div key={item.nama}
                    className={`flex items-center gap-4 px-4 py-4 relative overflow-hidden ${idx < TOP_TERLARIS.length - 1 ? "border-b border-slate-50" : ""} ${bgClass}`}>
                    
                    {idx === 0 && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-6 opacity-[0.15]">
                        <Trophy size={110} color={iconColor} strokeWidth={1} />
                      </div>
                    )}

                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-[11px] font-black shrink-0 relative z-10
                      ${idx === 0 ? "bg-amber-500 text-white shadow-md shadow-amber-200" : 
                        idx === 1 ? "bg-slate-400 text-white" : 
                        idx === 2 ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0 relative z-10">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black text-slate-800 truncate">{item.nama}</p>
                        {idx === 0 && <span className="text-[8px] font-black px-1.5 py-0.5 rounded-lg uppercase tracking-tighter shadow-sm" style={{ background: G_LIGHT, color: G }}>TERLARIS</span>}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{item.qty.toLocaleString("id-ID")} {item.unit} · {item.pos} Pesanan</p>
                    </div>
                    
                    <div className="text-right shrink-0 relative z-10">
                      <div className="flex items-center gap-1 bg-white/60 px-2 py-1 rounded-xl shadow-sm">
                        <Wallet size={10} className="text-emerald-600" />
                        <p className="text-xs font-black text-slate-700">{currency(item.revenue)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Top Rating ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <SectionTitle>Barang Rating Tertinggi</SectionTitle>
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              {TOP_RATING.map((item, idx) => {
                const bgClass = idx === 0 ? "bg-amber-100/50" : 
                               idx === 1 ? "bg-slate-100/50" : 
                               idx === 2 ? "bg-orange-100/50" : "bg-white";
                
                const iconColor = idx === 0 ? "#F59E0B" : "transparent";

                return (
                  <div key={item.nama}
                    className={`flex items-center gap-4 px-4 py-4 relative overflow-hidden ${idx < TOP_RATING.length - 1 ? "border-b border-slate-50" : ""} ${bgClass}`}>
                    
                    {idx === 0 && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-6 opacity-[0.15]">
                        <Star size={110} fill={iconColor} strokeWidth={0} />
                      </div>
                    )}

                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-[11px] font-black shrink-0 relative z-10
                      ${idx === 0 ? "bg-amber-500 text-white shadow-md shadow-amber-200" : 
                        idx === 1 ? "bg-slate-400 text-white" : 
                        idx === 2 ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0 relative z-10">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black text-slate-800 truncate">{item.nama}</p>
                        {idx === 0 && <span className="text-[8px] font-black px-1.5 py-0.5 rounded-lg uppercase tracking-tighter shadow-sm" style={{ background: G_LIGHT, color: G }}>TERBAIK</span>}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{item.ulasan} Ulasan · {item.pos} Pesanan</p>
                    </div>
                    
                    <div className="text-right shrink-0 relative z-10">
                      <div className="flex items-center gap-1 bg-white/60 px-2 py-1 rounded-xl shadow-sm">
                        <Star size={10} fill="#F59E0B" strokeWidth={0} />
                        <p className="text-xs font-black text-slate-700">{item.rating}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
