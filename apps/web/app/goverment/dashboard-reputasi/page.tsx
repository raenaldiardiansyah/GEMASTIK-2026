"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  ShieldCheck,
  Search,
  Lock,
  Ban,
  Eye,
  Star,
  CheckCircle2,
  AlertOctagon,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface VendorReputation {
  id: string;
  nama: string;
  kategori: "Supplier Bahan" | "SPPG Dapur";
  sbtScore: number;
  onTimeRate: number;
  foodQualityRate: number;
  schoolRating: number;
  sbtTokenId: string;
  status: "aktif" | "suspended" | "pending";
  totalKontrak: number;
}

const REPUTATIONS: VendorReputation[] = [
  {
    id: "REP-001",
    nama: "CV Pangan Mandiri Sejahtera",
    kategori: "Supplier Bahan",
    sbtScore: 98.4,
    onTimeRate: 99.2,
    foodQualityRate: 98.0,
    schoolRating: 4.9,
    sbtTokenId: "0x891f...c91a #1042",
    status: "aktif",
    totalKontrak: 24
  },
  {
    id: "REP-002",
    nama: "SPPG Subang Central 01",
    kategori: "SPPG Dapur",
    sbtScore: 96.1,
    onTimeRate: 97.5,
    foodQualityRate: 95.8,
    schoolRating: 4.8,
    sbtTokenId: "0x772a...d01f #0891",
    status: "aktif",
    totalKontrak: 18
  },
  {
    id: "REP-003",
    nama: "PT Agro Ternak Mandiri",
    kategori: "Supplier Bahan",
    sbtScore: 91.0,
    onTimeRate: 92.0,
    foodQualityRate: 90.5,
    schoolRating: 4.5,
    sbtTokenId: "0x331b...a09e #0412",
    status: "aktif",
    totalKontrak: 12
  },
  {
    id: "REP-004",
    nama: "CV Catering Nusantara",
    kategori: "SPPG Dapur",
    sbtScore: 64.5,
    onTimeRate: 71.0,
    foodQualityRate: 60.0,
    schoolRating: 3.2,
    sbtTokenId: "0x9901...b881 #0104",
    status: "suspended",
    totalKontrak: 6
  }
];

export default function DashboardReputasiPage() {
  const [vendorList, setVendorList] = useState<VendorReputation[]>(REPUTATIONS);
  const [selectedVendor, setSelectedVendor] = useState<VendorReputation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVendors = vendorList.filter((v) =>
    v.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleFreeze = (id: string) => {
    setVendorList((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, status: v.status === "suspended" ? "aktif" : "suspended" }
          : v
      )
    );
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header - Clean Light Canvas for contrast with dark sidebar */}
      <div className="bg-white border-b border-slate-200 px-6 py-6 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 text-[10px] font-mono font-black px-2.5 py-0.5">
                ● SOULBOUND TOKEN (SBT) ENGINE
              </Badge>
              <span className="text-slate-500 text-xs font-mono font-semibold">On-Chain Reputation Protocol</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Dashboard Reputasi & Akreditasi Entitas MBG
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed font-medium">
              Papan peringkat transparan performa vendor dan SPPG berbasis token kriptografi absolut yang mencatat histori ketepatan pengiriman dan ulasan sekolah.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-right shadow-2xs">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-extrabold block">Status Jaringan Audit</span>
              <span className="text-xs font-mono font-black text-emerald-700 flex items-center justify-end gap-1.5 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Immutable Consensus
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Bar - Clean 60-30-10 Bento Grid */}
      <div className="bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-200">
          <div className="p-5 flex flex-col justify-center bg-white">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Total SBT Minted</span>
            <span className="text-2xl font-black font-mono text-[#1E3A5F]">1,492 Tokens</span>
          </div>

          <div className="p-5 flex flex-col justify-center bg-emerald-50/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Rata-Rata Skor Reputasi</span>
            <span className="text-2xl font-black font-mono text-emerald-700">94.8 / 100</span>
          </div>

          <div className="p-5 flex flex-col justify-center bg-white">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Entitas Dibekukan</span>
            <span className="text-2xl font-black font-mono text-red-600">
              {vendorList.filter((v) => v.status === "suspended").length} Entitas
            </span>
          </div>

          <div className="p-5 flex flex-col justify-center bg-white">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Insentif Pengadaan</span>
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-300 w-fit">
              +5 SBT Points
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto w-full flex-1 p-4 md:p-6 space-y-5">
        {/* Search & Action Bar */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama supplier / SPPG..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-9 pr-4 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] transition-all"
            />
          </div>

          <Badge variant="outline" className="font-mono text-xs bg-slate-50 text-slate-700 border-slate-300">
            Urutan: Skor Reputasi Tertinggi
          </Badge>
        </div>

        {/* DataTable Leaderboard Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-600 tracking-wider">
                  <th className="p-4 pl-6">Entitas & SBT Token</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Ketepatan Waktu</th>
                  <th className="p-4">Kualitas Pangan</th>
                  <th className="p-4">Rating Sekolah</th>
                  <th className="p-4">Skor SBT</th>
                  <th className="p-4 pr-6 text-right">Aksi & Kontrol Auditor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVendors.map((vendor, idx) => (
                  <tr key={vendor.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-black text-slate-400 w-5 text-center">#{idx + 1}</span>
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">{vendor.nama}</span>
                          <span className="font-mono text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                            <Lock className="w-3 h-3 text-emerald-600" /> {vendor.sbtTokenId}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <Badge variant="outline" className="font-mono text-[10px] bg-slate-50 text-slate-700 border-slate-300">
                        {vendor.kategori}
                      </Badge>
                    </td>

                    <td className="p-4">
                      <div className="w-28 space-y-1">
                        <div className="flex justify-between text-[11px] font-mono text-slate-700 font-semibold">
                          <span>On-Time</span>
                          <span className="font-extrabold">{vendor.onTimeRate}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${vendor.onTimeRate}%` }} />
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="w-28 space-y-1">
                        <div className="flex justify-between text-[11px] font-mono text-slate-700 font-semibold">
                          <span>Quality</span>
                          <span className="font-extrabold">{vendor.foodQualityRate}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-sky-500 rounded-full" style={{ width: `${vendor.foodQualityRate}%` }} />
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono font-bold">
                      <div className="flex items-center gap-1 text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{vendor.schoolRating} / 5.0</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`font-mono font-black text-sm ${vendor.sbtScore >= 90 ? "text-emerald-700" : "text-red-600"}`}>
                        {vendor.sbtScore} Pts
                      </span>
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => setSelectedVendor(vendor)}
                          variant="outline"
                          size="sm"
                          className="h-8 text-[11px] font-bold border-slate-300 text-slate-800 hover:bg-[#1E3A5F] hover:text-white transition-all"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" /> Inspeksi SBT
                        </Button>

                        <Button
                          onClick={() => handleToggleFreeze(vendor.id)}
                          size="sm"
                          className={`h-8 text-[11px] font-bold shadow-xs transition-all ${
                            vendor.status === "suspended"
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                              : "bg-red-600 hover:bg-red-700 text-white"
                          }`}
                        >
                          <Ban className="w-3.5 h-3.5 mr-1" />
                          {vendor.status === "suspended" ? "Buka Pembekuan" : "Bekukan Whitelist"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SBT Metadata Inspector Modal */}
      <AnimatePresence>
        {selectedVendor && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-4"
            >
              <div className="p-5 border-b border-slate-800 bg-[#1E3A5F] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-black text-sm text-white">Metadata Soulbound Token (SBT)</h3>
                </div>
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-6 py-2 space-y-3 font-mono text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 block text-[10px] font-black uppercase">NAMA ENTITAS AUDITED</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedVendor.nama}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 block text-[10px] font-black uppercase">BLOCKCHAIN SBT TOKEN ID</span>
                  <span className="font-mono font-black text-emerald-700">{selectedVendor.sbtTokenId}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px] font-black uppercase">TOTAL KONTRAK</span>
                    <span className="font-bold text-slate-900">{selectedVendor.totalKontrak} Transaksi</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px] font-black uppercase">SKOR REPUTASI</span>
                    <span className="font-bold text-emerald-700">{selectedVendor.sbtScore} / 100</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50">
                <Button
                  onClick={() => setSelectedVendor(null)}
                  className="w-full bg-[#1E3A5F] hover:bg-slate-800 text-white font-bold text-xs h-9 rounded-xl shadow-xs"
                >
                  Tutup Inspector
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
