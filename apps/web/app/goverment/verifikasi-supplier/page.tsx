"use client";

import { useState } from "react";
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
  ArrowRight,
  RefreshCw,
  Eye,
  FileText
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface VerificationDoc {
  id: string;
  namaDokumen: string;
  jenis: string;
  nomor: string;
  status: "terverifikasi" | "pending" | "ditolak";
  ocrConfidence: number;
  tamperCheck: "pass" | "warning" | "fail";
  terakhirDiubah: string;
}

const INITIAL_DOCS: VerificationDoc[] = [
  {
    id: "DOC-001",
    namaDokumen: "NIB_CV_Pangan_Mandiri.pdf",
    jenis: "Nomor Induk Berusaha (NIB)",
    nomor: "9120003419201",
    status: "terverifikasi",
    ocrConfidence: 99.4,
    tamperCheck: "pass",
    terakhirDiubah: "14 Aug 2026, 06:15 WIB"
  },
  {
    id: "DOC-002",
    namaDokumen: "NPWP_Perusahaan_Signed.pdf",
    jenis: "NPWP Badan Usaha",
    nomor: "01.234.567.8-012.000",
    status: "terverifikasi",
    ocrConfidence: 98.7,
    tamperCheck: "pass",
    terakhirDiubah: "14 Aug 2026, 06:16 WIB"
  },
  {
    id: "DOC-003",
    namaDokumen: "Sertifikat_Halal_MUI_2026.pdf",
    jenis: "Sertifikat Halal BPJPH",
    nomor: "ID321100004561203",
    status: "pending",
    ocrConfidence: 94.2,
    tamperCheck: "warning",
    terakhirDiubah: "14 Aug 2026, 06:20 WIB"
  },
  {
    id: "DOC-004",
    namaDokumen: "Sertifikat_Higiene_Sanitasi.pdf",
    jenis: "Sertifikat Laik Higiene",
    nomor: "440/128/DINKES/2025",
    status: "terverifikasi",
    ocrConfidence: 97.8,
    tamperCheck: "pass",
    terakhirDiubah: "14 Aug 2026, 06:22 WIB"
  }
];

export default function VerifikasiSupplierPage() {
  const [docs, setDocs] = useState<VerificationDoc[]>(INITIAL_DOCS);
  const [isScanning, setIsScanning] = useState(false);
  const [activeDoc, setActiveDoc] = useState<VerificationDoc>(INITIAL_DOCS[0]);
  const [walletWhitelisted, setWalletWhitelisted] = useState(false);

  const handleSimulateUpload = () => {
    setIsScanning(true);
    setTimeout(() => {
      const newDoc: VerificationDoc = {
        id: `DOC-00${docs.length + 1}`,
        namaDokumen: "KTP_Direktur_Utama.pdf",
        jenis: "KTP Penanggung Jawab",
        nomor: "3273012903880002",
        status: "terverifikasi",
        ocrConfidence: 99.8,
        tamperCheck: "pass",
        terakhirDiubah: "Baru saja"
      };
      setDocs([newDoc, ...docs]);
      setActiveDoc(newDoc);
      setIsScanning(false);
    }, 1800);
  };

  const handleWhitelistWallet = () => {
    setWalletWhitelisted(true);
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col">
      {/* Page Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur px-6 py-4">
        <PageHeader
          title="Verifikasi Legalitas Supplier (AI OCR & Whitelisting)"
          subtitle="Otomatisasi validasi dokumen hukum supplier menggunakan OCR, AI Vision tamper-check, dan pendaftaran wallet on-chain."
        />
      </div>

      {/* Main Container - Zero Gap Grid Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border">
        
        {/* Left Panel: Dropzone & Document Viewer (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col bg-card/30">
          
          {/* Upload Dropzone Header */}
          <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm">Upload & Scan Dokumen</span>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              AI Vision Engine v2.4
            </Badge>
          </div>

          {/* Dropzone Box */}
          <div className="p-5 border-b border-border">
            <div 
              onClick={handleSimulateUpload}
              className="border-2 border-dashed border-primary/40 hover:border-primary transition-colors rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer bg-background/50 hover:bg-accent/10 relative overflow-hidden group"
            >
              {isScanning && (
                <motion.div 
                  initial={{ top: 0 }}
                  animate={{ top: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent z-10 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                />
              )}
              
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                {isScanning ? (
                  <RefreshCw className="w-6 h-6 text-primary animate-spin" />
                ) : (
                  <ScanLine className="w-6 h-6 text-primary" />
                )}
              </div>
              <p className="text-sm font-medium text-center">
                {isScanning ? "Memindai & Meng-ekstraksi Dokumen..." : "Klik atau Seret Dokumen Legalitas (PDF/PNG)"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                NIB, NPWP, KTP, Halal BPJPH (Maks 10MB)
              </p>
            </div>
          </div>

          {/* Document Preview & OCR Metadata */}
          <div className="flex-1 p-5 flex flex-col justify-between bg-card/10">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pratinjau Berkas Aktif</span>
                <span className="text-xs font-mono text-primary flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {activeDoc.namaDokumen}
                </span>
              </div>

              {/* Document Visual Display Placeholder */}
              <div className="w-full h-48 bg-muted/40 rounded border border-border flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <FileText className="w-16 h-16 text-muted-foreground/40 mb-2" />
                <span className="font-mono text-xs text-foreground font-semibold">{activeDoc.jenis}</span>
                <span className="font-mono text-xs text-muted-foreground mt-1">No: {activeDoc.nomor}</span>
                
                {/* Confidence Badge Overlay */}
                <div className="absolute top-3 right-3 bg-background/90 border border-border px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  <span>Conf: {activeDoc.ocrConfidence}%</span>
                </div>
              </div>

              {/* Tamper Check Result */}
              <div className="p-3 rounded border border-border bg-background/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Pengecekan Integritas Visual AI:</span>
                {activeDoc.tamperCheck === "pass" && (
                  <span className="text-emerald-500 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Bebas Manipulasi Piksel
                  </span>
                )}
                {activeDoc.tamperCheck === "warning" && (
                  <span className="text-amber-500 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Perlu Review Manual Stamp
                  </span>
                )}
              </div>
            </div>

            {/* Smart Contract Whitelist Action */}
            <div className="pt-4 border-t border-border mt-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-mono">Wallet Whitelist Status:</span>
                </div>
                <Badge variant={walletWhitelisted ? "default" : "outline"} className={walletWhitelisted ? "bg-emerald-600" : ""}>
                  {walletWhitelisted ? "REGISTERED ON-CHAIN" : "PENDING AUTHORIZATION"}
                </Badge>
              </div>

              <Button
                onClick={handleWhitelistWallet}
                disabled={walletWhitelisted}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs h-10 flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                {walletWhitelisted ? "Wallet Terdaftar di Smart Contract B.O.G.A" : "Otorisasi & Daftarkan Wallet ke Whitelist"}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel: Extraction Matrix & Document List (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col bg-background">
          
          {/* Supplier Header Info */}
          <div className="p-5 border-b border-border bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base leading-none">CV Pangan Mandiri Sejahtera</h3>
                <p className="text-xs text-muted-foreground mt-1">ID Supplier: <span className="font-mono">SUP-8921-JBR</span> • Subang, Jawa Barat</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 px-3 py-1 font-mono text-xs">
                Status: TERVERIFIKASI
              </Badge>
            </div>
          </div>

          {/* Extracted Form & Verification Table (Zero Gap List) */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Matrix Ekstraksi & Validasi Dokumen</span>
              <span className="text-xs text-muted-foreground">Total: {docs.length} Dokumen</span>
            </div>

            <div className="divide-y divide-border border-b border-border">
              {docs.map((doc) => {
                const isSelected = activeDoc.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setActiveDoc(doc)}
                    className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isSelected ? "bg-primary/10 border-l-4 border-l-primary" : "hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <FileCheck2 className={`w-5 h-5 mt-0.5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{doc.jenis}</span>
                          <span className="text-xs font-mono text-muted-foreground">({doc.namaDokumen})</span>
                        </div>
                        <p className="text-xs font-mono text-muted-foreground mt-0.5">
                          No: <span className="text-foreground font-semibold">{doc.nomor}</span>
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          Diperbarui: {doc.terakhirDiubah}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 justify-end">
                      <div className="text-right hidden sm:block">
                        <span className="text-xs font-mono block">Akurasi OCR</span>
                        <span className="text-xs font-bold text-emerald-500">{doc.ocrConfidence}%</span>
                      </div>

                      {doc.status === "terverifikasi" && (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Sah
                        </Badge>
                      )}
                      {doc.status === "pending" && (
                        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs gap-1">
                          <AlertTriangle className="w-3 h-3" /> Review
                        </Badge>
                      )}
                      {doc.status === "ditolak" && (
                        <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-xs gap-1">
                          <XCircle className="w-3 h-3" /> Ditolak
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Extracted Form Inputs */}
            <div className="p-5 space-y-4 bg-card/20">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Detail Ekstraksi Dokumen Terpilih ({activeDoc.jenis})
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Nomor Registrasi Resmikan</label>
                  <input
                    type="text"
                    readOnly
                    value={activeDoc.nomor}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Tingkat Kepercayaan AI (OCR Confidence)</label>
                  <input
                    type="text"
                    readOnly
                    value={`${activeDoc.ocrConfidence}% (Tingkat Akurasi Tinggi)`}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-xs font-mono text-emerald-500 font-semibold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Hasil Uji Manipulasi Foto/Pixel</label>
                  <input
                    type="text"
                    readOnly
                    value={activeDoc.tamperCheck === "pass" ? "Lolos (Tidak Ditemukan Bekas Editing)" : "Peringatan Stempel Terpotong"}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Sinkronisasi API Kemendag / Kemenkeu</label>
                  <input
                    type="text"
                    readOnly
                    value="TERHUBUNG & MATCH 100%"
                    className="w-full bg-background border border-border rounded px-3 py-2 text-xs font-mono text-emerald-500 font-semibold focus:outline-none"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
