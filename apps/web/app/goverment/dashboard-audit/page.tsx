"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
  Building
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DashboardAuditPage() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col">
      {/* Page Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur px-6 py-4">
        <PageHeader
          title="Dashboard Audit Komando & Pengawasan Ekosistem (BGN / KPK)"
          subtitle="Pusat pemantauan makro terpadu: Visualisasi operasional, agregasi AI Risk Index, status distribusi real-time, reputasi SBT, dan audit trail blockchain."
        />
      </div>

      {/* Top Level Metric Grid (Zero Gap) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-y md:divide-y-0 divide-border border-b border-border bg-muted/10">
        <div className="p-5 flex flex-col justify-center">
          <span className="text-xs text-muted-foreground">Total Serapan APBN MBG</span>
          <span className="text-xl font-bold font-mono text-foreground">Rp 5.240.000.000</span>
          <span className="text-[11px] text-emerald-500 font-semibold mt-0.5">↑ 98.2% Sesuai Alokasi</span>
        </div>

        <div className="p-5 flex flex-col justify-center">
          <span className="text-xs text-muted-foreground">Volume Porsi Terdistribusi</span>
          <span className="text-xl font-bold font-mono text-emerald-500">1,248,500 Porsi</span>
          <span className="text-[11px] text-muted-foreground mt-0.5">25.574 Sekolah Terjangkau</span>
        </div>

        <div className="p-5 flex flex-col justify-center">
          <span className="text-xs text-muted-foreground">Kasus Anomali (System-Flagged)</span>
          <span className="text-xl font-bold font-mono text-amber-500">2 Kasus Aktif</span>
          <span className="text-[11px] text-muted-foreground mt-0.5">0 Insiden Korupsi / Fraud</span>
        </div>

        <div className="p-5 flex flex-col justify-center">
          <span className="text-xs text-muted-foreground">Integritas Audit Trail</span>
          <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1 mt-1 font-mono">
            <Lock className="w-4 h-4" /> 100% IMMUTABLE ON-CHAIN
          </span>
        </div>
      </div>

      {/* Main Audit Grid (Zero Gap 12 Cols) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border">
        
        {/* Left Section: AI Risk Map & Operational Analytics (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col bg-background p-6 space-y-6">
          
          {/* Executive Overview Banner */}
          <div className="p-5 rounded-lg border border-border bg-card/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">Status Kesehatan Ekosistem: SANGAT BAIK</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Semua parameter pengadaan, gizi, dan distribusi terpantau stabil.</p>
              </div>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-mono text-xs">
              LIVE MONITORING
            </Badge>
          </div>

          {/* AI Risk Score Distribution */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Distribusi Skor Risiko AI Governance Per Wilayah
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded border border-border bg-card/20 space-y-1">
                <span className="text-xs text-muted-foreground block">Jawa Barat</span>
                <span className="text-lg font-bold font-mono text-emerald-500">98.2 / 100</span>
                <span className="text-[10px] text-muted-foreground block">Status: Hijau (Bebas Risiko)</span>
              </div>

              <div className="p-4 rounded border border-border bg-card/20 space-y-1">
                <span className="text-xs text-muted-foreground block">Jawa Tengah</span>
                <span className="text-lg font-bold font-mono text-emerald-500">96.8 / 100</span>
                <span className="text-[10px] text-muted-foreground block">Status: Hijau (Bebas Risiko)</span>
              </div>

              <div className="p-4 rounded border border-border bg-card/20 space-y-1">
                <span className="text-xs text-muted-foreground block">Nusa Tenggara Timur</span>
                <span className="text-lg font-bold font-mono text-amber-500">89.4 / 100</span>
                <span className="text-[10px] text-amber-500 block font-semibold">Status: Review Logistik</span>
              </div>
            </div>
          </div>

          {/* Real-time Audit Trail Feeds */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Log Transaksi Audit Trail Terbaru (Blockchain Block Feed)
            </span>

            <div className="divide-y divide-border border border-border rounded-lg bg-card/10 overflow-hidden">
              <div className="p-3 flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-500 font-semibold">[BLOCK #98124] Bukti Transfer Valid via OCR</span>
                <span className="text-muted-foreground">14 Aug 2026, 06:22:10 WIB</span>
              </div>
              <div className="p-3 flex items-center justify-between text-xs font-mono">
                <span className="text-blue-500 font-semibold">[BLOCK #98123] Food Safety Audit IPFS Published</span>
                <span className="text-muted-foreground">14 Aug 2026, 06:20:05 WIB</span>
              </div>
              <div className="p-3 flex items-center justify-between text-xs font-mono">
                <span className="text-primary font-semibold">[BLOCK #98122] Supplier Legal Whitelisted</span>
                <span className="text-muted-foreground">14 Aug 2026, 06:15:40 WIB</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Section: System-Flagged Anomaly Cases (5 Cols) */}
        <div className="lg:col-span-5 bg-card/20 p-6 flex flex-col space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h4 className="font-semibold text-sm">System-Flagged Anomaly Cases</h4>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              2 Active
            </Badge>
          </div>

          {/* Anomaly Case Item 1 */}
          <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-amber-500">CASE-ARB-001</span>
              <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 text-[10px]">
                Review Logistik
              </Badge>
              <div className="flex gap-4">
                <div className="mt-1"><AlertTriangle className="w-5 h-5 text-amber-500" /></div>
                <div>
                  <h4 className="font-semibold text-slate-800">Distribusi Telat 45 Menit (PO-192)</h4>
                  <p className="text-sm text-slate-500 mt-1">
                    Armada tertahan di titik km 12. Sistem menahan rekomendasi pencatatan ledger.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Anomaly Case Item 2 */}
          <div className="p-4 rounded-lg border border-border bg-card/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-primary">CASE-SUP-002</span>
              <Badge variant="outline" className="text-[10px]">
                Review Dokumen
              </Badge>
            </div>
            <p className="text-xs text-foreground font-semibold">
              Pembaruan sertifikat laik higiene sanitasi supplier CV Catering Nusantara.
            </p>
            <p className="text-[11px] text-muted-foreground">
              OCR membaca masa berlaku berakhir dalam 7 hari. Notifikasi peringatan terkirim.
            </p>
          </div>

          {/* Quick Action Hub */}
          <div className="pt-4 border-t border-border mt-auto space-y-2">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs h-10 flex items-center justify-center gap-2">
              <FileSearch className="w-4 h-4" /> Unduh Laporan LHP Audit Eksekutif (PDF)
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
}
