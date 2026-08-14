"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  PackageCheck,
  Building,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Layers,
  Search,
  FileCheck,
  Plus,
  Lock,
  QrCode
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProcurementOrder {
  id: string;
  poNumber: string;
  supplierNama: string;
  tanggalPO: string;
  totalNilai: number;
  statusPenerimaan: "Diterima Sah" | "Dalam Pengiriman" | "Pending Konfirmasi";
  itemCount: number;
  qcVerified: boolean;
  blockchainHash: string;
}

const ORDERS: ProcurementOrder[] = [
  {
    id: "PO-001",
    poNumber: "PO-SPPG-SUB-0891",
    supplierNama: "CV Pangan Mandiri Sejahtera",
    tanggalPO: "14 Aug 2026",
    totalNilai: 45000000,
    statusPenerimaan: "Diterima Sah",
    itemCount: 4,
    qcVerified: true,
    blockchainHash: "0x891f...c91a #1042"
  },
  {
    id: "PO-002",
    poNumber: "PO-SPPG-SUB-0892",
    supplierNama: "PT Ternak Agro Unggul",
    tanggalPO: "14 Aug 2026",
    totalNilai: 28500000,
    statusPenerimaan: "Dalam Pengiriman",
    itemCount: 2,
    qcVerified: false,
    blockchainHash: "0x772a...d01f #0891"
  },
  {
    id: "PO-003",
    poNumber: "PO-SPPG-SUB-0893",
    tanggalPO: "13 Aug 2026",
    supplierNama: "Koperasi Tani Makmur Subang",
    totalNilai: 15200000,
    statusPenerimaan: "Diterima Sah",
    itemCount: 3,
    qcVerified: true,
    blockchainHash: "0x331b...a09e #0412"
  }
];

export default function PengadaanPenerimaanPage() {
  const [orders, setOrders] = useState<ProcurementOrder[]>(ORDERS);
  const [activeOrder, setActiveOrder] = useState<ProcurementOrder>(ORDERS[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter((o) =>
    o.supplierNama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.poNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col">
      {/* Page Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur px-6 py-4">
        <PageHeader
          title="Pengadaan & Penerimaan Barang (Audit Trail Digital)"
          subtitle="Pencatatan transaksi pengadaan bahan baku, validasi jumlah & kualitas QC, serta penyimpanan rekam jejak pada blockchain."
        />
      </div>

      {/* KPI Header Bar (Zero Gap Grid) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-y md:divide-y-0 divide-border border-b border-border bg-muted/10">
        <div className="p-4 flex flex-col justify-center">
          <span className="text-xs text-muted-foreground">Total Transaksi Pengadaan</span>
          <span className="text-lg font-bold font-mono text-foreground">Rp 88.700.000</span>
        </div>
        <div className="p-4 flex flex-col justify-center">
          <span className="text-xs text-muted-foreground">Status Penerimaan Barang</span>
          <span className="text-lg font-bold font-mono text-emerald-500">2 Transaksi Sah</span>
        </div>
        <div className="p-4 flex flex-col justify-center">
          <span className="text-xs text-muted-foreground">Verifikasi Kualitas (QC)</span>
          <span className="text-lg font-bold font-mono text-blue-500">100% Lolos QC</span>
        </div>
        <div className="p-4 flex flex-col justify-center">
          <span className="text-xs text-muted-foreground">Audit Trail Blockchain</span>
          <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1 mt-1">
            <Lock className="w-4 h-4" /> IMMUTABLE LEDGER
          </span>
        </div>
      </div>

      {/* Main Split Layout (Zero Gap Grid) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border">
        
        {/* Left List (5 Cols) */}
        <div className="lg:col-span-5 bg-card/20 flex flex-col">
          <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari PO / Supplier..."
                className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded text-xs text-foreground focus:outline-none"
              />
            </div>
            <Button className="h-8 text-xs bg-primary text-primary-foreground flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Buat PO
            </Button>
          </div>

          <div className="divide-y divide-border flex-1 overflow-y-auto">
            {filteredOrders.map((order) => {
              const isSelected = activeOrder.id === order.id;
              return (
                <div
                  key={order.id}
                  onClick={() => setActiveOrder(order)}
                  className={`p-4 flex flex-col gap-2 cursor-pointer transition-colors ${
                    isSelected ? "bg-primary/10 border-l-4 border-l-primary" : "hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-primary">{order.poNumber}</span>
                    <Badge variant={order.statusPenerimaan === "Diterima Sah" ? "default" : "outline"} className={order.statusPenerimaan === "Diterima Sah" ? "bg-emerald-600" : ""}>
                      {order.statusPenerimaan}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm text-foreground">{order.supplierNama}</h4>
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-mono pt-1">
                    <span>Total: Rp {order.totalNilai.toLocaleString("id-ID")}</span>
                    <span>{order.tanggalPO}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Panel (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col bg-background p-6 space-y-6">
          <div className="p-5 rounded-lg border border-border bg-card/40 flex items-start justify-between">
            <div>
              <span className="text-xs font-mono text-primary font-bold">{activeOrder.poNumber}</span>
              <h3 className="text-lg font-bold text-foreground mt-1">{activeOrder.supplierNama}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Transaksi Pengadaan Bahan Pangan Masuk</p>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-mono text-xs">
              QC Passed
            </Badge>
          </div>

          {/* Item List Table */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Manifest Barang & Kualitas Penerimaan
            </span>

            <table className="w-full text-left border-collapse text-xs border border-border">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                  <th className="p-3">Nama Komoditas</th>
                  <th className="p-3">Volume PO</th>
                  <th className="p-3">Volume Diterima</th>
                  <th className="p-3 text-right">Status QC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/20">
                  <td className="p-3 font-semibold">Beras Organik Premium (Subang)</td>
                  <td className="p-3 font-mono">500 Kg</td>
                  <td className="p-3 font-mono text-emerald-500 font-bold">500 Kg</td>
                  <td className="p-3 text-right">
                    <span className="text-emerald-500 font-semibold flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Sesuai
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-muted/20">
                  <td className="p-3 font-semibold">Daging Ayam Broiler Segar</td>
                  <td className="p-3 font-mono">250 Kg</td>
                  <td className="p-3 font-mono text-emerald-500 font-bold">250 Kg</td>
                  <td className="p-3 text-right">
                    <span className="text-emerald-500 font-semibold flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Sesuai
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-muted/20">
                  <td className="p-3 font-semibold">Sayur Wortel & Buncis Segar</td>
                  <td className="p-3 font-mono">150 Kg</td>
                  <td className="p-3 font-mono text-emerald-500 font-bold">150 Kg</td>
                  <td className="p-3 text-right">
                    <span className="text-emerald-500 font-semibold flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Sesuai
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Blockchain Audit Hash Box */}
          <div className="p-4 rounded border border-emerald-500/30 bg-emerald-500/10 space-y-1">
            <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-wider block">
              BLOCKCHAIN AUDIT TRAIL RECORDED
            </span>
            <div className="flex items-center justify-between text-xs font-mono text-emerald-500 font-bold">
              <span>Hash: {activeOrder.blockchainHash}</span>
              <Lock className="w-4 h-4" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
