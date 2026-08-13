"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Building,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Eye,
  Lock,
  Receipt,
  RotateCcw
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PaymentCase {
  id: string;
  poNumber: string;
  vendorNama: string;
  nominalPO: number;
  nominalResi: number;
  refBankNumber: string;
  waktuTransfer: string;
  status: "reconciled" | "pending" | "mismatch";
  bankTujuan: string;
  ocrAccuracy: number;
  antiReplayStatus: "valid" | "duplicate";
}

const MOCK_PAYMENTS: PaymentCase[] = [
  {
    id: "PAY-2026-0811",
    poNumber: "PO-SPPG-JBR-0891",
    vendorNama: "CV Pangan Mandiri Sejahtera",
    nominalPO: 45000000,
    nominalResi: 45000000,
    refBankNumber: "TRX-BCA-9812401928",
    waktuTransfer: "14 Aug 2026, 05:30 WIB",
    status: "reconciled",
    bankTujuan: "Bank Mandiri (131000981245)",
    ocrAccuracy: 99.8,
    antiReplayStatus: "valid"
  },
  {
    id: "PAY-2026-0812",
    poNumber: "PO-SPPG-JBR-0892",
    vendorNama: "PT Ternak Agro Unggul",
    nominalPO: 28500000,
    nominalResi: 28500000,
    refBankNumber: "TRX-BRI-7712391023",
    waktuTransfer: "14 Aug 2026, 06:10 WIB",
    status: "pending",
    bankTujuan: "Bank BNI (0821398123)",
    ocrAccuracy: 97.4,
    antiReplayStatus: "valid"
  },
  {
    id: "PAY-2026-0813",
    poNumber: "PO-SPPG-JBR-0893",
    vendorNama: "Koperasi Tani Makmur Subang",
    nominalPO: 15200000,
    nominalResi: 15000000,
    refBankNumber: "TRX-BSI-1123987123",
    waktuTransfer: "13 Aug 2026, 18:45 WIB",
    status: "mismatch",
    bankTujuan: "Bank BSI (712398123)",
    ocrAccuracy: 92.1,
    antiReplayStatus: "valid"
  }
];

export default function VerifikasiPembayaranPage() {
  const [payments, setPayments] = useState<PaymentCase[]>(MOCK_PAYMENTS);
  const [selectedCase, setSelectedCase] = useState<PaymentCase>(MOCK_PAYMENTS[0]);
  const [isReconciling, setIsReconciling] = useState(false);
  const [escrowReleased, setEscrowReleased] = useState(false);

  const handleRunReconciliation = () => {
    setIsReconciling(true);
    setTimeout(() => {
      const updated = payments.map((p) =>
        p.id === selectedCase.id ? { ...p, status: "reconciled" as const } : p
      );
      setPayments(updated);
      setSelectedCase({ ...selectedCase, status: "reconciled" });
      setIsReconciling(false);
    }, 1500);
  };

  const handleReleaseEscrow = () => {
    setEscrowReleased(true);
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col">
      {/* Page Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur px-6 py-4">
        <PageHeader
          title="Verifikasi Pembayaran & Auto-Reconciliation Escrow"
          description="Pencocokan resi transfer perbankan secara otomatis menggunakan OCR & AI Validation Engine dengan DOKU Escrow Gateway."
        />
      </div>

      {/* KPI Bar - Zero Gap Grid Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-y md:divide-y-0 divide-border border-b border-border bg-muted/10">
        <div className="p-4 flex flex-col justify-center">
          <span className="text-xs text-muted-foreground">Total Tagihan PO Aktif</span>
          <span className="text-lg font-bold font-mono text-foreground">Rp 88.700.000</span>
        </div>
        <div className="p-4 flex flex-col justify-center">
          <span className="text-xs text-muted-foreground">Terekonsiliasi Sah (100% Match)</span>
          <span className="text-lg font-bold font-mono text-emerald-500">Rp 45.000.000</span>
        </div>
        <div className="p-4 flex flex-col justify-center">
          <span className="text-xs text-muted-foreground">Saldo Escrow DOKU Terkunci</span>
          <span className="text-lg font-bold font-mono text-blue-500">Rp 43.700.000</span>
        </div>
        <div className="p-4 flex flex-col justify-center">
          <span className="text-xs text-muted-foreground">Status Anti-Replay Engine</span>
          <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1 mt-1">
            <ShieldCheck className="w-4 h-4" /> 0 Duplikasi Resi
          </span>
        </div>
      </div>

      {/* Main Split-Screen Layout (Zero Gap) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border">
        
        {/* Left Area: Resi Image Previewer & OCR Extractor (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col bg-card/20">
          <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm">Resi Bukti Transfer Perbankan</span>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              Ref: {selectedCase.refBankNumber}
            </Badge>
          </div>

          {/* Image Display Mockup */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-full h-64 bg-background rounded border border-border flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80 z-10" />
                <FileCheck className="w-20 h-20 text-muted-foreground/30 mb-2 group-hover:scale-105 transition-transform" />
                <span className="font-mono text-xs text-foreground font-semibold z-20">BUKTI TRANSFER PERBANKAN</span>
                <span className="font-mono text-xs text-emerald-500 font-bold mt-1 z-20">Rp {selectedCase.nominalResi.toLocaleString("id-ID")}</span>
                
                <div className="absolute top-3 left-3 bg-background/90 border border-border px-2 py-1 rounded text-[10px] font-mono z-20">
                  Waktu: {selectedCase.waktuTransfer}
                </div>
              </div>

              {/* Anti-Replay Check Badge */}
              <div className="p-3 rounded border border-border bg-background/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Pemeriksaan Anti-Replay (Resi Ganda):</span>
                <span className="text-emerald-500 font-semibold font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> UNIK / BELUM PERNAH DIGUNAKAN
                </span>
              </div>
            </div>

            {/* Reconciliation Action Button */}
            <div className="pt-4 border-t border-border mt-4 space-y-2">
              <Button
                onClick={handleRunReconciliation}
                disabled={isReconciling || selectedCase.status === "reconciled"}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs h-10 flex items-center justify-center gap-2"
              >
                {isReconciling ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <FileCheck className="w-4 h-4" />
                )}
                {selectedCase.status === "reconciled" ? "Terekonsiliasi Sah 100%" : "Jalankan Match Engine AI"}
              </Button>

              <Button
                onClick={handleReleaseEscrow}
                disabled={escrowReleased || selectedCase.status !== "reconciled"}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs h-10 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                {escrowReleased ? "Dana DOKU Escrow Berhasil Dicairkan" : "Cairkan Escrow ke Rekening Vendor"}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Area: Reconciliation Table & Parameter Comparison (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col bg-background">
          
          <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Daftar Transaksi Pembayaran Aktif</span>
            <span className="text-xs text-muted-foreground font-mono">DOKU Gateway Interop</span>
          </div>

          {/* List of Payments */}
          <div className="divide-y divide-border border-b border-border">
            {payments.map((p) => {
              const isSelected = selectedCase.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedCase(p)}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected ? "bg-primary/10 border-l-4 border-l-primary" : "hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <CreditCard className={`w-5 h-5 mt-0.5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{p.vendorNama}</span>
                        <span className="text-xs font-mono text-muted-foreground">({p.poNumber})</span>
                      </div>
                      <p className="text-xs font-mono text-muted-foreground mt-0.5">
                        Nominal PO: <span className="text-foreground font-bold">Rp {p.nominalPO.toLocaleString("id-ID")}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-end">
                    {p.status === "reconciled" && (
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-xs">
                        Terekonsiliasi
                      </Badge>
                    )}
                    {p.status === "pending" && (
                      <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-xs">
                        Pending Match
                      </Badge>
                    )}
                    {p.status === "mismatch" && (
                      <Badge className="bg-red-500/10 text-red-500 border-red-500/30 text-xs">
                        Selisih Rp 200rb
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comparison Matrix Panel */}
          <div className="p-5 space-y-4 flex-1 bg-card/20">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Parameter Matching ({selectedCase.poNumber})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded border border-border bg-background space-y-1">
                <span className="text-xs text-muted-foreground block">Nominal Purchase Order (PO)</span>
                <span className="font-mono text-sm font-bold text-foreground">Rp {selectedCase.nominalPO.toLocaleString("id-ID")}</span>
              </div>

              <div className="p-3 rounded border border-border bg-background space-y-1">
                <span className="text-xs text-muted-foreground block">Nominal Terbaca OCR (Resi)</span>
                <span className="font-mono text-sm font-bold text-emerald-500">Rp {selectedCase.nominalResi.toLocaleString("id-ID")}</span>
              </div>

              <div className="p-3 rounded border border-border bg-background space-y-1">
                <span className="text-xs text-muted-foreground block">Nomor Referensi Bank</span>
                <span className="font-mono text-xs text-foreground font-semibold">{selectedCase.refBankNumber}</span>
              </div>

              <div className="p-3 rounded border border-border bg-background space-y-1">
                <span className="text-xs text-muted-foreground block">Rekening Bank Tujuan</span>
                <span className="font-mono text-xs text-foreground font-semibold">{selectedCase.bankTujuan}</span>
              </div>
            </div>

            <div className="p-4 rounded border border-border bg-background/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Akurasi Ekstraksi AI OCR:</span>
                <span className="font-mono font-bold text-emerald-500">{selectedCase.ocrAccuracy}% Match</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Kecocokan Nominal Data PO vs Bank:</span>
                <span className="font-mono font-bold text-emerald-500">EXACT MATCH (0 SELISIH)</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
