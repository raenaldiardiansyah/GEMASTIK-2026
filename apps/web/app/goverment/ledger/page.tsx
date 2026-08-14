"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  ShieldCheck,
  Search,
  Filter,
  ExternalLink,
  Lock,
  CheckCircle2,
  FileText,
  Building2,
  Truck,
  Receipt,
  Layers,
  ArrowRight,
  Hash,
  Clock,
  ChevronRight,
  X
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LedgerBlock {
  height: number;
  hash: string;
  previousHash: string;
  timestamp: string;
  actor: string;
  actorType: "Vendor" | "SPPG" | "Pemerintah" | "Sekolah" | "Logistik";
  actionType: "REGISTRATION_WHITELIST" | "PO_CREATED" | "DELIVERY_GENERATE" | "OCR_PAYMENT_MATCH" | "GEOFENCE_HANDOVER" | "STUDENT_RATING";
  referenceId: string; // e.g. PO-2026-0891, VND-901
  status: "VERIFIED" | "PENDING";
  merkleRoot: string;
  signature: string;
  dataPayload: Record<string, string | number>;
}

const MOCK_BLOCKS: LedgerBlock[] = [
  {
    height: 10492,
    hash: "0x8f2a910d8e2193b4a56c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a",
    previousHash: "0x7e1a800c7d1082a3945b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f",
    timestamp: "14 Aug 2026, 06:12:45 WIB",
    actor: "SDN 164 Karang Pawulang",
    actorType: "Sekolah",
    actionType: "GEOFENCE_HANDOVER",
    referenceId: "TRIP-ARM-01-2026",
    status: "VERIFIED",
    merkleRoot: "0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    signature: "sig_ed25519_88192038190283901283",
    dataPayload: {
      "Suhu Kontainer": "68.5°C",
      "Radius Haversine": "42 Meter",
      "Jumlah Porsi": "460 Porsi",
      "Status Geofence": "Unlocked & Verified"
    }
  },
  {
    height: 10491,
    hash: "0x7e1a800c7d1082a3945b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f",
    previousHash: "0x6d0a700b6c0f7192834a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e",
    timestamp: "14 Aug 2026, 05:45:10 WIB",
    actor: "SPPG Central Bandung",
    actorType: "SPPG",
    actionType: "OCR_PAYMENT_MATCH",
    referenceId: "PAY-2026-0811",
    status: "VERIFIED",
    merkleRoot: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
    signature: "sig_ed25519_77192837190283129384",
    dataPayload: {
      "Nominal Transfer": "Rp 45.000.000",
      "No. Ref Bank": "TRX-BCA-9812401928",
      "OCR Accuracy Score": "99.8%",
      "Anti-Replay Verification": "PASSED (0 Duplikasi)"
    }
  },
  {
    height: 10490,
    hash: "0x6d0a700b6c0f7192834a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e",
    previousHash: "0x5c9a600a5b0e6081723a4b5c6d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6d",
    timestamp: "13 Aug 2026, 17:30:22 WIB",
    actor: "CV Pangan Mandiri Sejahtera",
    actorType: "Vendor",
    actionType: "DELIVERY_GENERATE",
    referenceId: "PO-SPPG-JBR-0891",
    status: "VERIFIED",
    merkleRoot: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    signature: "sig_ed25519_66182736180192837465",
    dataPayload: {
      "Surat Jalan Hash": "0x90a1b2c3d4e5",
      "Manifest Porsi": "460 Porsi Makanan Matang",
      "Waktu Berangkat": "14 Aug 2026, 05:15 WIB"
    }
  },
  {
    height: 10489,
    hash: "0x5c9a600a5b0e6081723a4b5c6d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6d",
    previousHash: "0x4b8a50094a0d5070612a3b4c5d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6c",
    timestamp: "13 Aug 2026, 14:10:00 WIB",
    actor: "SPPG Central Bandung",
    actorType: "SPPG",
    actionType: "PO_CREATED",
    referenceId: "PO-SPPG-JBR-0891",
    status: "VERIFIED",
    merkleRoot: "0x0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a",
    signature: "sig_ed25519_55172635170081726354",
    dataPayload: {
      "Target Sekolah": "SDN 164 Karang Pawulang",
      "Total Anggaran PO": "Rp 45.000.000",
      "Tolak Ukur HET/PIHPS": "Sesuai Standar PIHPS Jabar"
    }
  },
  {
    height: 10488,
    hash: "0x4b8a50094a0d5070612a3b4c5d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6c",
    previousHash: "0x3a7a40083a0c4060501a2b3c4d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5b",
    timestamp: "12 Aug 2026, 09:00:15 WIB",
    actor: "Dinas Pendidikan & Badan Gizi",
    actorType: "Pemerintah",
    actionType: "REGISTRATION_WHITELIST",
    referenceId: "VND-BANDUNG-001",
    status: "VERIFIED",
    merkleRoot: "0xfe0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a",
    signature: "sig_ed25519_44162534160070615243",
    dataPayload: {
      "Nama Vendor": "CV Pangan Mandiri Sejahtera",
      "NIB / Sertifikasi Halal": "NIB 912039120931 / Halal ID3211000",
      "SBT Whitelist Standard": "PASSED (Rating 98.4%)"
    }
  }
];

export default function GovernmentLedgerPage() {
  const [blocks] = useState<LedgerBlock[]>(MOCK_BLOCKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<LedgerBlock | null>(null);
  const [selectedActionFilter, setSelectedActionFilter] = useState<string>("ALL");

  const filteredBlocks = useMemo(() => {
    return blocks.filter((b) => {
      const matchQuery =
        b.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.actor.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchFilter =
        selectedActionFilter === "ALL" || b.actionType === selectedActionFilter;

      return matchQuery && matchFilter;
    });
  }, [blocks, searchQuery, selectedActionFilter]);

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header - Clean Light Canvas for contrast with sidebar */}
      <div className="bg-white border-b border-slate-200 px-6 py-6 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 text-[10px] font-mono font-black px-2.5 py-0.5">
                ● IMMUTABLE LEDGER ENGINE v2.6
              </Badge>
              <span className="text-slate-500 text-xs font-mono font-semibold">SHA-256 / Merkle Tree</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Blockchain Audit Ledger Program MBG
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed font-medium">
              Buku besar digital terenkripsi yang mencatat setiap alur verifikasi vendor, PO, OCR bukti transfer manual, hingga serah terima geofencing secara transparan dan anti-tamper.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-right shadow-2xs">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-extrabold block">Status Konsensus</span>
              <span className="text-xs font-mono font-black text-emerald-700 flex items-center justify-end gap-1.5 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Synchronized (Zero-Trust)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Bar - Clean 60-30-10 Bento Grid */}
      <div className="bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-200">
          <div className="p-5 flex flex-col justify-center bg-white">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Database className="w-4 h-4 text-[#1E3A5F]" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Total Block Height</span>
            </div>
            <span className="text-2xl font-black font-mono text-[#1E3A5F]">#10,492</span>
          </div>

          <div className="p-5 flex flex-col justify-center bg-emerald-50/40">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Integritas Ledger</span>
            </div>
            <span className="text-2xl font-black font-mono text-emerald-700">100% Immutable</span>
          </div>

          <div className="p-5 flex flex-col justify-center bg-white">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Lock className="w-4 h-4 text-[#1E3A5F]" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Algoritma Enkripsi</span>
            </div>
            <span className="text-base font-black font-mono text-slate-800">SHA-256 + Ed25519</span>
          </div>

          <div className="p-5 flex flex-col justify-center bg-white">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Clock className="w-4 h-4 text-[#1E3A5F]" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Terakhir Diperbarui</span>
            </div>
            <span className="text-xs font-bold font-mono text-slate-700">
              14 Aug 2026, 06:12 WIB
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="max-w-7xl mx-auto w-full flex-1 p-4 md:p-6 space-y-5">
        {/* Control Filter Bar */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Hash, No. PO, atau Entitas..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-9 pr-4 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] transition-all"
            />
          </div>

          {/* Action Type Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5 text-slate-600" /> Filter:
            </span>
            {[
              { id: "ALL", label: "Semua Block" },
              { id: "OCR_PAYMENT_MATCH", label: "OCR Transfer" },
              { id: "GEOFENCE_HANDOVER", label: "Geofence 50m" },
              { id: "PO_CREATED", label: "PO SPPG" },
              { id: "REGISTRATION_WHITELIST", label: "Whitelist Vendor" }
            ].map((f) => {
              const isActive = selectedActionFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedActionFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                    isActive
                      ? "bg-[#1E3A5F] text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Block Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-100/70 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#1E3A5F] flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" /> Rantai Blok Audit MBG ({filteredBlocks.length} Blok)
            </span>
            <Badge variant="outline" className="font-mono text-[10px] bg-white border-slate-300 text-slate-700">
              Simulasi Ledger Hash (SHA-256)
            </Badge>
          </div>

          {/* Block Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-600 tracking-wider">
                  <th className="p-4">Height</th>
                  <th className="p-4">Block Hash (SHA-256)</th>
                  <th className="p-4">Tipe Transaksi</th>
                  <th className="p-4">Aktor / Entitas</th>
                  <th className="p-4">Referensi</th>
                  <th className="p-4">Waktu Ledger</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredBlocks.map((block) => (
                  <tr
                    key={block.height}
                    className="hover:bg-emerald-50/30 transition-colors group"
                  >
                    <td className="p-4 font-mono font-black text-emerald-700">
                      #{block.height}
                    </td>

                    <td className="p-4 font-mono font-bold text-slate-800 max-w-[190px] truncate" title={block.hash}>
                      {block.hash.substring(0, 16)}...
                    </td>

                    <td className="p-4">
                      {block.actionType === "GEOFENCE_HANDOVER" && (
                        <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px] font-bold">
                          <Truck className="w-3 h-3 mr-1 text-emerald-600" /> Geofence Handover
                        </Badge>
                      )}
                      {block.actionType === "OCR_PAYMENT_MATCH" && (
                        <Badge className="bg-sky-50 text-sky-900 border-sky-300 text-[10px] font-bold">
                          <Receipt className="w-3 h-3 mr-1 text-sky-600" /> OCR Payment Match
                        </Badge>
                      )}
                      {block.actionType === "DELIVERY_GENERATE" && (
                        <Badge className="bg-slate-100 text-slate-800 border-slate-300 text-[10px] font-bold">
                          <FileText className="w-3 h-3 mr-1 text-slate-600" /> Surat Jalan
                        </Badge>
                      )}
                      {block.actionType === "PO_CREATED" && (
                        <Badge className="bg-amber-50 text-amber-900 border-amber-300 text-[10px] font-bold">
                          <Building2 className="w-3 h-3 mr-1 text-amber-600" /> PO SPPG
                        </Badge>
                      )}
                      {block.actionType === "REGISTRATION_WHITELIST" && (
                        <Badge className="bg-emerald-100 text-emerald-950 border-emerald-300 text-[10px] font-bold">
                          <ShieldCheck className="w-3 h-3 mr-1 text-emerald-700" /> SBT Whitelist
                        </Badge>
                      )}
                    </td>

                    <td className="p-4 font-bold text-slate-900">
                      {block.actor}
                    </td>

                    <td className="p-4 font-mono font-bold text-slate-700">
                      {block.referenceId}
                    </td>

                    <td className="p-4 text-slate-600 font-medium">
                      {block.timestamp}
                    </td>

                    <td className="p-4 text-right">
                      <Button
                        onClick={() => setSelectedBlock(block)}
                        variant="outline"
                        size="sm"
                        className="h-8 text-[11px] font-bold border-slate-300 text-slate-800 hover:bg-[#1E3A5F] hover:text-white hover:border-[#1E3A5F] transition-all"
                      >
                        Inspeksi Payload <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Block Inspection Drawer / Modal */}
      <AnimatePresence>
        {selectedBlock && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-800 bg-[#1E3A5F] text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-mono font-black">
                    #{selectedBlock.height}
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-white">Inspeksi Block Audit Ledger</h3>
                    <p className="text-[11px] text-slate-300 font-mono">Tipe: {selectedBlock.actionType}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedBlock(null)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh] bg-slate-50">
                {/* Hash Details */}
                <div className="space-y-3">
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-2xs">
                    <span className="text-[10px] font-black uppercase text-slate-500 block">Current Block Hash (SHA-256)</span>
                    <span className="font-mono text-xs font-black text-emerald-700 break-all">{selectedBlock.hash}</span>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-2xs">
                    <span className="text-[10px] font-black uppercase text-slate-500 block">Previous Block Hash</span>
                    <span className="font-mono text-xs font-bold text-slate-600 break-all">{selectedBlock.previousHash}</span>
                  </div>
                </div>

                {/* Merkle & Signature */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-2xs">
                    <span className="text-[10px] font-black uppercase text-slate-500 block">Merkle Tree Root</span>
                    <span className="font-mono text-xs font-bold text-slate-800 break-all">{selectedBlock.merkleRoot}</span>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-2xs">
                    <span className="text-[10px] font-black uppercase text-slate-500 block">Digital Signature (Ed25519)</span>
                    <span className="font-mono text-xs font-bold text-slate-800 break-all">{selectedBlock.signature}</span>
                  </div>
                </div>

                {/* Data Payload JSON Visualizer */}
                <div className="p-4 bg-[#0F172A] rounded-xl text-white space-y-2 border border-slate-800">
                  <span className="text-[10px] font-mono font-black uppercase text-emerald-400 block tracking-widest">
                    // Immutable Data Payload:
                  </span>
                  <div className="space-y-1.5 font-mono text-xs text-slate-300">
                    {Object.entries(selectedBlock.dataPayload).map(([key, val]) => (
                      <div key={key} className="flex justify-between border-b border-slate-800/80 pb-1">
                        <span className="text-slate-400">{key}:</span>
                        <span className="text-emerald-300 font-bold">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Terverifikasi Kriptografis
                </span>

                <Button
                  onClick={() => setSelectedBlock(null)}
                  className="bg-[#1E3A5F] hover:bg-slate-800 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-xs"
                >
                  Tutup Inspeksi
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
