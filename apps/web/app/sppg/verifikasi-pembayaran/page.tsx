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
  RotateCcw,
  Scan,
  Database
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
  const [isScanningOCR, setIsScanningOCR] = useState(false);
  const [isLoggedToLedger, setIsLoggedToLedger] = useState(false);

  const handleRunOCRScan = () => {
    setIsScanningOCR(true);
    setTimeout(() => {
      const updated = payments.map((p) =>
        p.id === selectedCase.id ? { ...p, status: "reconciled" as const } : p
      );
      setPayments(updated);
      setSelectedCase({ ...selectedCase, status: "reconciled" });
      setIsScanningOCR(false);
    }, 1500);
  };

  const handleLogToLedger = () => {
    setIsLoggedToLedger(true);
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Page Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-5 shadow-2xs">
        <PageHeader
          title="Audit OCR Bukti Pembayaran & Transparansi Ledger"
          subtitle="Verifikasi bukti transfer manual ke vendor secara visual menggunakan AI-OCR TrOCR untuk mencegah manipulasi dokumen."
        />
      </div>

      {/* KPI Bar - Zero Gap Grid Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-y md:divide-y-0 divide-slate-200 border-b border-slate-200 bg-white">
        <div className="p-4 flex flex-col justify-center">
          <span className="text-xs font-bold text-slate-600">Total Tagihan PO Aktif</span>
          <span className="text-xl font-black font-mono text-slate-900 mt-0.5">Rp 88.700.000</span>
        </div>
        <div className="p-4 flex flex-col justify-center">
          <span className="text-xs font-bold text-slate-600">Tervalidasi OCR (Match 100%)</span>
          <span className="text-xl font-black font-mono text-emerald-700 mt-0.5">Rp 45.000.000</span>
        </div>
        <div className="p-4 flex flex-col justify-center">
          <span className="text-xs font-bold text-slate-600">Menunggu Validasi (Underpaid)</span>
          <span className="text-xl font-black font-mono text-amber-700 mt-0.5">Rp 15.200.000</span>
        </div>
        <div className="p-4 flex flex-col justify-center">
          <span className="text-xs font-bold text-slate-600">Keamanan Dokumen Anti-Replay</span>
          <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5 mt-1 bg-emerald-100 w-fit px-2.5 py-1 rounded-md border border-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" /> 0 Duplikasi (Aman)
          </span>
        </div>
      </div>

      {/* Main Split-Screen Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        
        {/* Left Area: Resi Image Previewer & OCR Extractor (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col bg-slate-100/60">
          <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900">
              <Receipt className="w-4 h-4 text-cyan-700" />
              <span className="font-black text-xs">Resi Bukti Transfer Manual SPPG</span>
            </div>
            <Badge variant="outline" className="font-mono text-[10px] font-black bg-cyan-100 text-cyan-950 border-cyan-300">
              Ref: {selectedCase.refBankNumber}
            </Badge>
          </div>

          {/* Image Display Mockup */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-full h-64 bg-white rounded-2xl border border-slate-300 flex flex-col items-center justify-center p-4 relative overflow-hidden group shadow-xs">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-100 via-transparent to-transparent opacity-80 z-10" />
                <FileCheck className="w-20 h-20 text-slate-300 mb-2 group-hover:scale-105 transition-transform" />
                <span className="font-mono text-xs text-slate-900 font-black z-20">FOTO BUKTI TRANSFER</span>
                <span className="font-mono text-sm text-emerald-800 font-black mt-1 z-20">Rp {selectedCase.nominalResi.toLocaleString("id-ID")}</span>
                
                <div className="absolute top-3 left-3 bg-white border border-slate-300 px-2.5 py-1 rounded-md text-[10px] font-mono z-20 text-slate-700 font-bold shadow-2xs">
                  Waktu: {selectedCase.waktuTransfer}
                </div>
              </div>

              {/* Anti-Replay Check Badge */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center justify-between text-xs">
                <span className="text-slate-600 font-bold">Pemeriksaan Gambar (YOLO26):</span>
                <span className="text-emerald-800 font-black font-mono flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> FOTO ASLI (BUKAN EDITED)
                </span>
              </div>
            </div>

            {/* Reconciliation Action Button */}
            <div className="pt-6 border-t border-slate-200 mt-6 space-y-3">
              <Button
                onClick={handleRunOCRScan}
                disabled={isScanningOCR || selectedCase.status === "reconciled"}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs h-11 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-cyan-600/25"
              >
                {isScanningOCR ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Scan className="w-4 h-4" />
                )}
                {selectedCase.status === "reconciled" ? "Selesai Diekstrak OCR" : "Ekstraksi AI-OCR TrOCR"}
              </Button>

              <Button
                onClick={handleLogToLedger}
                disabled={isLoggedToLedger || selectedCase.status !== "reconciled"}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs h-11 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25"
              >
                <Database className="w-4 h-4" />
                {isLoggedToLedger ? "Tercatat di Blockchain Ledger" : "Catat Pembayaran ke Ledger Audit"}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Area: Reconciliation Table & Parameter Comparison (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col bg-white">
          
          <div className="p-4 border-b border-slate-200 bg-slate-100/60 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-700">Daftar Pemeriksaan Pembayaran</span>
            <span className="text-[10px] font-black text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-300">Status: Menunggu Pemeriksaan</span>
          </div>

          {/* List of Payments */}
          <div className="divide-y divide-slate-200 border-b border-slate-200">
            {payments.map((p) => {
              const isSelected = selectedCase.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedCase(p)}
                  className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected ? "bg-cyan-50/70 border-l-4 border-l-cyan-600" : "hover:bg-slate-50 border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isSelected ? "bg-cyan-100 text-cyan-800" : "bg-slate-100 text-slate-500"}`}>
                       <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">{p.vendorNama}</span>
                        <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded bg-cyan-100 text-cyan-950 border border-cyan-300">{p.poNumber}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-600 mt-1">
                        Nilai PO: <span className="text-slate-900 font-black font-mono">Rp {p.nominalPO.toLocaleString("id-ID")}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-end">
                    {p.status === "reconciled" && (
                      <Badge className="bg-emerald-100 text-emerald-950 border-emerald-300 hover:bg-emerald-200 text-[10px] font-black uppercase px-3 py-1">
                        Match (Valid)
                      </Badge>
                    )}
                    {p.status === "pending" && (
                      <Badge className="bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200 text-[10px] font-black uppercase px-3 py-1">
                        Menunggu Scan
                      </Badge>
                    )}
                    {p.status === "mismatch" && (
                      <Badge className="bg-amber-100 text-amber-950 border-amber-300 hover:bg-amber-200 text-[10px] font-black uppercase px-3 py-1">
                        Underpaid / Manual Review
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comparison Matrix Panel */}
          <div className="p-6 space-y-6 flex-1 bg-slate-100/50">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-700 flex items-center gap-2">
              <Scan size={14} className="text-cyan-700" /> Parameter Matching AI ({selectedCase.poNumber})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Nominal PO Resmi</span>
                <span className="font-mono text-sm font-black text-cyan-950">Rp {selectedCase.nominalPO.toLocaleString("id-ID")}</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Nominal Terbaca OCR</span>
                <span className="font-mono text-sm font-black text-emerald-700">Rp {selectedCase.nominalResi.toLocaleString("id-ID")}</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">No. Referensi Transfer</span>
                <span className="font-mono text-xs text-slate-900 font-bold">{selectedCase.refBankNumber}</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Bank Penerima (Vendor)</span>
                <span className="font-mono text-xs text-slate-900 font-bold">{selectedCase.bankTujuan}</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-emerald-300 bg-emerald-100/70 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-950 font-bold">Confidence Score (AI OCR):</span>
                <span className="font-mono font-black text-emerald-950 bg-white px-2.5 py-1 rounded border border-emerald-300 shadow-2xs">{selectedCase.ocrAccuracy}% MATCH</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-950 font-bold">Audit Trail Status:</span>
                <span className="font-mono font-black text-emerald-950 bg-white px-2.5 py-1 rounded border border-emerald-300 shadow-2xs">SIAP DICATAT (Zero-Trust)</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
