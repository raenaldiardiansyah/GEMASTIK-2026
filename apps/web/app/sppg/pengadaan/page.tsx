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
    <div className="w-full min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      {/* Page Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-5 shadow-2xs">
        <PageHeader
          title="Pengadaan & Penerimaan Barang (Audit Trail Digital)"
          subtitle="Pencatatan transaksi pengadaan bahan baku, validasi kuantitas & kualitas QC dapur SPPG, serta pencatatan hash ledger audit."
        />
      </div>

      {/* KPI Header Bar (Zero Gap Grid) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-y md:divide-y-0 divide-slate-200 border-b border-slate-200 bg-white">
        <div className="p-4 flex flex-col justify-center">
          <span className="text-xs font-bold text-slate-600">Total Transaksi Pengadaan</span>
          <span className="text-xl font-black font-mono text-slate-900 mt-0.5">Rp 88.700.000</span>
        </div>
        <div className="p-4 flex flex-col justify-center">
          <span className="text-xs font-bold text-slate-600">Status Penerimaan Bahan</span>
          <span className="text-xl font-black font-mono text-emerald-700 mt-0.5">2 Transaksi Sah</span>
        </div>
        <div className="p-4 flex flex-col justify-center">
          <span className="text-xs font-bold text-slate-600">Verifikasi Kualitas (QC)</span>
          <span className="text-xl font-black font-mono text-cyan-900 mt-0.5">100% Lolos QC</span>
        </div>
        <div className="p-4 flex flex-col justify-center">
          <span className="text-xs font-bold text-slate-600">Audit Trail Ledger</span>
          <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5 mt-1 bg-emerald-100 w-fit px-2.5 py-1 rounded-md border border-emerald-300">
            <Lock className="w-3.5 h-3.5" /> IMMUTABLE LEDGER
          </span>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        
        {/* Left List (5 Cols) */}
        <div className="lg:col-span-5 bg-white flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-100/60 flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nomor PO / Supplier..."
                className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-cyan-500 shadow-2xs"
              />
            </div>
            <Button className="h-9 text-xs bg-cyan-600 hover:bg-cyan-700 text-white font-black rounded-xl flex items-center gap-1 shadow-md shadow-cyan-600/20 px-3">
              <Plus className="w-3.5 h-3.5" /> Buat PO
            </Button>
          </div>

          <div className="divide-y divide-slate-200 flex-1 overflow-y-auto">
            {filteredOrders.map((order) => {
              const isSelected = activeOrder.id === order.id;
              return (
                <div
                  key={order.id}
                  onClick={() => setActiveOrder(order)}
                  className={`p-4 flex flex-col gap-1.5 cursor-pointer transition-colors ${
                    isSelected ? "bg-cyan-50/70 border-l-4 border-l-cyan-600" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-xs text-cyan-900 bg-cyan-100 px-2 py-0.5 rounded border border-cyan-300">{order.poNumber}</span>
                    <Badge variant={order.statusPenerimaan === "Diterima Sah" ? "default" : "outline"} className={`text-[10px] font-black ${order.statusPenerimaan === "Diterima Sah" ? "bg-emerald-600 text-white" : "border-slate-300 text-slate-700"}`}>
                      {order.statusPenerimaan}
                    </Badge>
                  </div>
                  <h4 className="font-black text-sm text-slate-900 mt-1">{order.supplierNama}</h4>
                  <div className="flex items-center justify-between text-xs text-slate-600 font-mono pt-1">
                    <span className="font-bold text-slate-800">Total: Rp {order.totalNilai.toLocaleString("id-ID")}</span>
                    <span>{order.tanggalPO}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Panel (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-100/60 p-6 space-y-6">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs flex items-start justify-between">
            <div>
              <span className="text-xs font-mono text-cyan-900 font-black bg-cyan-100 px-2.5 py-1 rounded-md border border-cyan-300">{activeOrder.poNumber}</span>
              <h3 className="text-xl font-black text-slate-900 mt-2.5">{activeOrder.supplierNama}</h3>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">Transaksi Penerimaan Bahan Pangan Masuk ke Dapur SPPG</p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-950 border-emerald-300 font-black text-xs px-3 py-1">
              ✓ QC Passed
            </Badge>
          </div>

          {/* Item List Table */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
              Manifest Bahan &amp; Hasil Uji Fisik QC
            </span>

            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/90 text-slate-900 font-black">
                    <th className="p-3.5">Nama Komoditas</th>
                    <th className="p-3.5">Volume PO</th>
                    <th className="p-3.5">Volume Diterima</th>
                    <th className="p-3.5 text-right">Status QC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-cyan-50/30">
                    <td className="p-3.5 font-black text-slate-900">Beras Organik Premium (Subang)</td>
                    <td className="p-3.5 font-mono font-bold text-slate-700">500 Kg</td>
                    <td className="p-3.5 font-mono text-emerald-800 font-black">500 Kg</td>
                    <td className="p-3.5 text-right">
                      <span className="text-emerald-800 font-black flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Sesuai
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-cyan-50/30">
                    <td className="p-3.5 font-black text-slate-900">Daging Ayam Broiler Segar</td>
                    <td className="p-3.5 font-mono font-bold text-slate-700">250 Kg</td>
                    <td className="p-3.5 font-mono text-emerald-800 font-black">250 Kg</td>
                    <td className="p-3.5 text-right">
                      <span className="text-emerald-800 font-black flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Sesuai
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-cyan-50/30">
                    <td className="p-3.5 font-black text-slate-900">Sayur Wortel &amp; Buncis Segar</td>
                    <td className="p-3.5 font-mono font-bold text-slate-700">150 Kg</td>
                    <td className="p-3.5 font-mono text-emerald-800 font-black">150 Kg</td>
                    <td className="p-3.5 text-right">
                      <span className="text-emerald-800 font-black flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Sesuai
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Blockchain Audit Hash Box */}
          <div className="p-4 rounded-2xl border border-emerald-300 bg-emerald-100/70 space-y-1">
            <span className="text-[10px] font-mono text-emerald-950 font-black uppercase tracking-wider block">
              BLOCKCHAIN AUDIT TRAIL RECORDED
            </span>
            <div className="flex items-center justify-between text-xs font-mono text-emerald-950 font-black">
              <span>Hash: {activeOrder.blockchainHash}</span>
              <Lock className="w-4 h-4 text-emerald-800" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
