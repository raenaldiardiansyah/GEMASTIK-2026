"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  ShieldCheck,
  ShieldAlert,
  AlertOctagon,
  CheckCircle2,
  TrendingUp,
  Search,
  Lock,
  Layers,
  Building,
  UserCheck,
  Ban,
  Eye,
  Star
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
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
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col">
      {/* Page Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur px-6 py-4">
        <PageHeader
          title="Dashboard Reputasi On-Chain & Soulbound Token (SBT)"
          description="Papan peringkat transparan performa entitas ekosistem MBG berbasis token kriptografi absolut yang tidak dapat dimanipulasi."
        />
      </div>

      {/* KPI Header Bar (Zero Gap Grid) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-y md:divide-y-0 divide-border border-b border-border bg-muted/10">
        <div className="p-4 flex flex-col justify-center">
          <span className="text-xs text-muted-foreground">Total SBT Minted</span>
          <span className="text-lg font-bold font-mono text-foreground">1,492 Tokens</span>
        </div>
        <div className="p-4 flex flex-col justify-center">
          <span className="text-xs text-muted-foreground">Rata-Rata Skor Reputasi</span>
          <span className="text-lg font-bold font-mono text-emerald-500">94.8 / 100</span>
        </div>
        <div className="p-4 flex flex-col justify-center">
          <span className="text-xs text-muted-foreground">Entitas Dibekukan (Suspended)</span>
          <span className="text-lg font-bold font-mono text-red-500">1 Entitas</span>
        </div>
        <div className="p-4 flex flex-col justify-center">
          <span className="text-xs text-muted-foreground">Status Jaringan Audit</span>
          <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1 mt-1">
            <Lock className="w-4 h-4" /> BLOCKCHAIN IMMUTABLE
          </span>
        </div>
      </div>

      {/* Search & Action Bar */}
      <div className="p-4 border-b border-border bg-card/20 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama supplier / SPPG..."
            className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded text-xs text-foreground focus:outline-none"
          />
        </div>

        <Badge variant="outline" className="font-mono text-xs">
          Urutan: Skor Reputasi Tertinggi
        </Badge>
      </div>

      {/* Zero Gap DataTable Leaderboard */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider">
              <th className="p-3.5 pl-6">Entitas & SBT Token</th>
              <th className="p-3.5">Kategori</th>
              <th className="p-3.5">Ketepatan Waktu</th>
              <th className="p-3.5">Kualitas Pangan</th>
              <th className="p-3.5">Rating Sekolah</th>
              <th className="p-3.5">Skor SBT</th>
              <th className="p-3.5 pr-6 text-right">Aksi & Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredVendors.map((vendor, idx) => (
              <tr key={vendor.id} className="hover:bg-muted/20 transition-colors">
                <td className="p-3.5 pl-6">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-muted-foreground w-4 text-center">#{idx + 1}</span>
                    <div>
                      <span className="font-semibold text-sm text-foreground block">{vendor.nama}</span>
                      <span className="font-mono text-[11px] text-primary flex items-center gap-1 mt-0.5">
                        <Lock className="w-3 h-3 text-emerald-500" /> {vendor.sbtTokenId}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="p-3.5">
                  <Badge variant="outline" className="font-mono text-[11px]">
                    {vendor.kategori}
                  </Badge>
                </td>

                <td className="p-3.5">
                  <div className="w-28 space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span>On-Time</span>
                      <span className="font-bold">{vendor.onTimeRate}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${vendor.onTimeRate}%` }} />
                    </div>
                  </div>
                </td>

                <td className="p-3.5">
                  <div className="w-28 space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span>Quality</span>
                      <span className="font-bold">{vendor.foodQualityRate}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${vendor.foodQualityRate}%` }} />
                    </div>
                  </div>
                </td>

                <td className="p-3.5 font-mono">
                  <div className="flex items-center gap-1 font-bold text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{vendor.schoolRating} / 5.0</span>
                  </div>
                </td>

                <td className="p-3.5">
                  <span className={`font-mono font-bold text-sm ${vendor.sbtScore >= 90 ? "text-emerald-500" : "text-red-500"}`}>
                    {vendor.sbtScore} Pts
                  </span>
                </td>

                <td className="p-3.5 pr-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      onClick={() => setSelectedVendor(vendor)}
                      variant="outline"
                      className="h-8 px-2.5 text-[11px] flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspeksi SBT
                    </Button>

                    <Button
                      onClick={() => handleToggleFreeze(vendor.id)}
                      className={`h-8 px-2.5 text-[11px] font-medium flex items-center gap-1 ${
                        vendor.status === "suspended"
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                    >
                      <Ban className="w-3.5 h-3.5" />
                      {vendor.status === "suspended" ? "Buka Pembekuan" : "Bekukan Whitelist"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SBT Metadata Inspector Modal */}
      <AnimatePresence>
        {selectedVendor && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-xl w-full max-w-md overflow-hidden shadow-2xl space-y-4 p-6"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-semibold text-sm">Metadata Soulbound Token (SBT)</h3>
                </div>
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="text-xs text-muted-foreground hover:text-foreground font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-muted/40 rounded border border-border space-y-1">
                  <span className="text-muted-foreground block text-[10px]">NAMA ENTITAS AUDITED</span>
                  <span className="font-bold text-foreground text-sm">{selectedVendor.nama}</span>
                </div>

                <div className="p-3 bg-muted/40 rounded border border-border space-y-1">
                  <span className="text-muted-foreground block text-[10px]">SMART CONTRACT SBT TOKEN ID</span>
                  <span className="font-bold text-emerald-500">{selectedVendor.sbtTokenId}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-muted/40 rounded border border-border">
                    <span className="text-muted-foreground block text-[10px]">TOTAL KONTRAK</span>
                    <span className="font-bold text-foreground">{selectedVendor.totalKontrak} Transaksi</span>
                  </div>
                  <div className="p-2.5 bg-muted/40 rounded border border-border">
                    <span className="text-muted-foreground block text-[10px]">SKOR REPUTASI</span>
                    <span className="font-bold text-emerald-500">{selectedVendor.sbtScore} / 100</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setSelectedVendor(null)}
                className="w-full bg-primary text-primary-foreground text-xs h-9"
              >
                Tutup Inspector
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
