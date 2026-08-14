"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function SppgAdminDashboard() {
  const handleDownloadReport = () => {
    toast.success("Mengunduh Laporan Eksekutif Bulanan...", {
      description: "Format PDF & CSV berhasil di-generate dari data audit SPPG."
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            SPPG Wilayah Jawa Barat
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 leading-tight">
            Dashboard Eksekutif SPPG
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Satuan Pelayanan Pangan Gizi · Pemantauan Pengadaan, Logistik, dan Audit Pembayaran.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Button 
            variant="outline" 
            onClick={handleDownloadReport}
            className="h-11 px-4 rounded-2xl border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50 shadow-xs flex items-center gap-2"
          >
            <Download size={16} className="text-slate-500" />
            <span className="hidden sm:inline">Unduh</span> Laporan
          </Button>
          <Button 
            asChild
            className="h-11 px-5 rounded-2xl font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-700/20 flex items-center gap-2"
          >
            <Link href="/sppg/admin/tender/create">
              <Plus size={18} />
              Buat PO / SPK Baru
            </Link>
          </Button>
        </div>
      </div>

      {/* ── QUICK STATS (GRID 4 KOLOM) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Anggaran */}
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-xs hover:border-emerald-200 transition-all">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Anggaran Tersisa</p>
                <h3 className="text-2xl font-black mt-1 text-slate-900">Rp 12.5 M</h3>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shadow-2xs">
                <Wallet size={20} />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Aman hingga Q3
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">Alokasi 84%</span>
            </div>
          </CardContent>
        </Card>

        {/* Vendor */}
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-xs hover:border-amber-200 transition-all">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Vendor Aktif</p>
                <h3 className="text-2xl font-black mt-1 text-slate-900">
                  42 <span className="text-sm font-bold text-slate-400">Mitra</span>
                </h3>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-2xs">
                <Users size={20} />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <span className="text-amber-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                3 Verifikasi Baru
              </span>
              <Link href="/sppg/admin/evaluation" className="text-[10px] text-amber-700 hover:underline">
                Lihat
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* PO Berjalan */}
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-xs hover:border-blue-200 transition-all">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">PO Berjalan</p>
                <h3 className="text-2xl font-black mt-1 text-slate-900">
                  128 <span className="text-sm font-bold text-slate-400">Pesanan</span>
                </h3>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
                <ShoppingCart size={20} />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <span className="text-slate-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Bulan Ini
              </span>
              <Link href="/sppg/admin/tender/progress" className="text-[10px] text-blue-600 hover:underline">
                Pantau
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Anomali */}
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-xs hover:border-red-200 transition-all">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Anomali QC</p>
                <h3 className="text-2xl font-black text-red-600 mt-1">
                  2 <span className="text-sm font-bold text-red-400">Laporan</span>
                </h3>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shadow-2xs">
                <AlertTriangle size={20} />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <span className="text-red-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Perlu Tindakan
              </span>
              <Link href="/sppg/admin/evaluation" className="text-[10px] text-red-600 hover:underline">
                Detail
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── AREA BENTO GRID UTAMA ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolom Kiri: Dokumen Menunggu Persetujuan */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <CardHeader className="p-6 pb-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black text-slate-900">Menunggu Persetujuan</CardTitle>
                <CardDescription className="text-xs font-medium text-slate-500 mt-0.5">
                  Dokumen pesanan dan validasi vendor yang memerlukan tanda tangan admin.
                </CardDescription>
              </div>
              <Link 
                href="/sppg/admin/evaluation" 
                className="text-xs font-black text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 transition-colors"
              >
                Lihat Semua <ArrowRight size={14} />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {[
                  { id: 1, po: "PO-3273-0001", vendor: "PT. Pangan Nusantara", type: "Tagihan Pelunasan", status: "Pending Sign", amount: "Rp 28.500.000" },
                  { id: 2, po: "PO-3273-0002", vendor: "CV Sayur Mayur Sejahtera", type: "Verifikasi QC Masuk", status: "QC Passed", amount: "Rp 14.200.000" },
                  { id: 3, po: "PO-3273-0003", vendor: "Koperasi Tani Makmur", type: "Distribusi Sayur Segar", status: "Pending Sign", amount: "Rp 9.750.000" },
                ].map((item) => (
                  <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-slate-50/70">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center font-black text-emerald-800 text-sm shrink-0">
                        P{item.id}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-black text-sm text-slate-900">{item.po}</p>
                          <span className="text-[11px] font-bold text-slate-500">· {item.amount}</span>
                        </div>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">{item.vendor} • {item.type}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2.5 self-end sm:self-center">
                      <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                        item.status === 'QC Passed' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {item.status}
                      </span>
                      <Button asChild size="sm" variant="outline" className="h-8 px-3 rounded-xl text-xs font-bold text-slate-700 border-slate-200 hover:bg-slate-100">
                        <Link href="/sppg/verifikasi-pembayaran">
                          Review
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Status Node & Pintasan Operasional */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Status Node GIZANTARA */}
          <Card className="rounded-3xl border border-slate-200 bg-white shadow-xs">
            <CardHeader className="p-5 pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-wider">Status Node GIZANTARA</CardTitle>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>D1 Database Sync</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">14ms</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>Audit Pembayaran OCR</span>
                  </div>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">Online</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>Audit Trail Immutable</span>
                  </div>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">Terverifikasi</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pintasan Cepat Menu SPPG */}
          <Card className="rounded-3xl border border-slate-200 bg-white shadow-xs p-5 space-y-3">
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Pintasan Cepat Operasional</p>
            <div className="space-y-2">
              <Link 
                href="/sppg/admin/tender/create" 
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-xs font-bold transition-colors border border-transparent hover:border-emerald-100"
              >
                <span className="flex items-center gap-2">
                  <FileText size={15} className="text-emerald-600" />
                  Penerbitan Kontrak SPK Baru
                </span>
                <ArrowUpRight size={14} className="text-slate-400" />
              </Link>
              <Link 
                href="/sppg/admin/tender/progress" 
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-xs font-bold transition-colors border border-transparent hover:border-emerald-100"
              >
                <span className="flex items-center gap-2">
                  <TrendingUp size={15} className="text-emerald-600" />
                  Monitoring Progress Kontrak
                </span>
                <ArrowUpRight size={14} className="text-slate-400" />
              </Link>
              <Link 
                href="/sppg/admin/evaluation" 
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-xs font-bold transition-colors border border-transparent hover:border-emerald-100"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-emerald-600" />
                  Daftar Penilaian Sekolah
                </span>
                <ArrowUpRight size={14} className="text-slate-400" />
              </Link>
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
}
