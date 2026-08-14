"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Thermometer,
  Microscope,
  Sparkles,
  Lock,
  Upload,
  Activity,
  Award
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
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
  { id: "M-4", parameter: "Tingkat Kebersihan Dapur Dapur SPPG", standar: "Skor Hgiene ≥ 90", hasil: "Skor 94/100", status: "pass" },
];

export default function AuditPanganPage() {
  const [metrics, setMetrics] = useState<AuditMetric[]>(AUDIT_METRICS);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublishAudit = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIpfsHash("QmZk9120489128491204812048102481029481204981");
      setIsPublishing(false);
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col">
      {/* Page Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur px-6 py-4">
        <PageHeader
          title="Inspeksi Kualitas Pangan & AI Governance Risk Index"
          subtitle="Pengawasan independen kualitas gizi dan higiene makanan matang dengan pencatatan mutlak ke IPFS & blockchain."
        />
      </div>

      {/* KPI Gauge Header Grid (Zero Gap) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border border-b border-border bg-muted/10">
        
        {/* Gauge Metric 1 */}
        <div className="p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-xl text-emerald-500 font-mono">
            96%
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Food Safety Index</span>
            <span className="text-sm font-bold text-foreground">Sangat Layak & Safe</span>
            <p className="text-[11px] text-muted-foreground">0 Insiden Kontaminasi</p>
          </div>
        </div>

        {/* Gauge Metric 2 */}
        <div className="p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center font-bold text-xl text-blue-500 font-mono">
            94
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Skor Higiene Dapur SPPG</span>
            <span className="text-sm font-bold text-foreground">Akreditasi Grade A</span>
            <p className="text-[11px] text-muted-foreground">Inspeksi Terakhir: Hari ini</p>
          </div>
        </div>

        {/* Gauge Metric 3 */}
        <div className="p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <ShieldAlert className="w-7 h-7 text-emerald-500" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Status AI Governance</span>
            <span className="text-sm font-bold text-emerald-500">HIJAU (BEBAS RISIKO)</span>
            <p className="text-[11px] text-muted-foreground">Rekomendasi: Lanjutkan</p>
          </div>
        </div>

      </div>

      {/* Main Form & Metrics (Zero Gap Grid) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border">
        
        {/* Left Area: Audit Form Matrix (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col bg-background">
          <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Borang Parameter Inspeksi Lapangan</span>
            <Badge variant="outline" className="font-mono text-xs">SPPG-SUBANG-01</Badge>
          </div>

          <div className="divide-y divide-border border-b border-border flex-1">
            {metrics.map((m) => (
              <div key={m.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/20 transition-colors">
                <div className="space-y-0.5">
                  <span className="font-semibold text-sm block">{m.parameter}</span>
                  <span className="text-xs text-muted-foreground font-mono">Standar Acuan: {m.standar}</span>
                </div>

                <div className="flex items-center gap-3 justify-end">
                  <span className="font-mono text-xs font-bold text-foreground bg-muted px-2.5 py-1 rounded border border-border">
                    {m.hasil}
                  </span>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> MEMENUHI
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="p-5 bg-card/20 space-y-3">
            <Button
              onClick={handlePublishAudit}
              disabled={isPublishing || !!ipfsHash}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs h-10 flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {ipfsHash ? "Laporan Terkunci di IPFS & Blockchain" : "Finalisasi & Upload Hasil Audit ke IPFS"}
            </Button>

            {ipfsHash && (
              <div className="p-3 rounded border border-emerald-500/30 bg-emerald-500/10 font-mono text-xs text-emerald-500 flex items-center justify-between">
                <span>IPFS Hash: {ipfsHash.slice(0, 24)}...</span>
                <Lock className="w-4 h-4 text-emerald-500" />
              </div>
            )}
          </div>
        </div>

        {/* Right Area: AI Risk Insights & Lab Attachments (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col bg-card/20 p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <h4 className="font-semibold text-sm">Analisis Prediktif AI Governance</h4>
          </div>

          <div className="p-4 rounded border border-border bg-background space-y-2">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider block">Ringkasan Analisis AI</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Berdasarkan perbandingan histori 30 hari terakhir, parameter suhu makanan dan uji organoleptik SPPG Subang Central konsisten di atas $95\%$. Tidak terdeteksi anomali pada rantai pendingin/pemanas.
            </p>
          </div>

          <div className="p-4 rounded border border-border bg-background space-y-2">
            <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider block flex items-center gap-1">
              <Award className="w-4 h-4 text-emerald-500" /> Sertifikasi Kepatuhan Audit
            </span>
            <p className="text-xs text-muted-foreground">
              SPPG ini berhak memperoleh tambahan +5 Poin Reputasi Soulbound Token (SBT) untuk periode pengadaan bulan depan.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
