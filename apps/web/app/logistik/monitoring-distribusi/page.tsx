"use client";

import dynamic from "next/dynamic";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Truck,
  Thermometer,
  Clock,
  QrCode,
  Compass,
  Radio,
  Search,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QRScannerModal } from "@/components/ui/QRScannerModal";

const MapLibreLogistik = dynamic(
  () => import("@/components/ui/MapLibreLogistik"),
  { ssr: false }
);

interface FleetVehicle {
  id: string;
  driverNama: string;
  platNomor: string;
  asal: string;
  tujuan: string;
  lat: number;
  lng: number;
  status: "dalam_perjalanan" | "tiba" | "tertunda";
  distanceMeters: number;
  etaMinutes: number;
  suhuKontainer: number;
  geofenceRadius: number;
  isGeofenceUnlocked: boolean;
  porsiTotal: number;
}

const FLEETS: FleetVehicle[] = [
  {
    id: "ARM-01",
    driverNama: "Ahmad Rizky",
    platNomor: "D 1892 AB",
    asal: "SPPG Subang Central",
    tujuan: "SDN 164 Karang Pawulang",
    lat: -6.9175,
    lng: 107.6191,
    status: "dalam_perjalanan",
    distanceMeters: 42,
    etaMinutes: 2,
    suhuKontainer: 68.5,
    geofenceRadius: 50,
    isGeofenceUnlocked: true,
    porsiTotal: 460
  },
  {
    id: "ARM-02",
    driverNama: "Budi Santoso",
    platNomor: "D 8812 BC",
    asal: "SPPG Subang Central",
    tujuan: "SMPN 5 Bandung",
    lat: -6.9100,
    lng: 107.6120,
    status: "dalam_perjalanan",
    distanceMeters: 1450,
    etaMinutes: 18,
    suhuKontainer: 65.0,
    geofenceRadius: 50,
    isGeofenceUnlocked: false,
    porsiTotal: 620
  },
  {
    id: "ARM-03",
    driverNama: "Deni Kurniawan",
    platNomor: "D 4102 XY",
    asal: "SPPG Subang Barat",
    tujuan: "SDN 02 Cisalak",
    lat: -6.9280,
    lng: 107.6250,
    status: "tiba",
    distanceMeters: 12,
    etaMinutes: 0,
    suhuKontainer: 69.2,
    geofenceRadius: 50,
    isGeofenceUnlocked: true,
    porsiTotal: 310
  },
  {
    id: "ARM-04",
    driverNama: "Eko Prasetyo",
    platNomor: "D 5521 OP",
    asal: "SPPG Bandung Utara",
    tujuan: "SMAN 3 Bandung",
    lat: -6.9050,
    lng: 107.6145,
    status: "dalam_perjalanan",
    distanceMeters: 890,
    etaMinutes: 11,
    suhuKontainer: 66.8,
    geofenceRadius: 50,
    isGeofenceUnlocked: false,
    porsiTotal: 750
  },
  {
    id: "ARM-05",
    driverNama: "Fajar Nugraha",
    platNomor: "D 7741 KL",
    asal: "SPPG Bandung Selatan",
    tujuan: "SDN 08 Dayeuhkolot",
    lat: -6.9710,
    lng: 107.6280,
    status: "dalam_perjalanan",
    distanceMeters: 38,
    etaMinutes: 1,
    suhuKontainer: 67.4,
    geofenceRadius: 50,
    isGeofenceUnlocked: true,
    porsiTotal: 520
  },
  {
    id: "ARM-06",
    driverNama: "Gilang Ramadhan",
    platNomor: "D 9912 WX",
    asal: "SPPG Cimahi Central",
    tujuan: "SMPN 2 Cimahi",
    lat: -6.8720,
    lng: 107.5410,
    status: "dalam_perjalanan",
    distanceMeters: 2100,
    etaMinutes: 24,
    suhuKontainer: 64.2,
    geofenceRadius: 50,
    isGeofenceUnlocked: false,
    porsiTotal: 480
  },
  {
    id: "ARM-07",
    driverNama: "Hendra Wijaya",
    platNomor: "D 3341 GH",
    asal: "SPPG Lembang Segar",
    tujuan: "SDN 01 Lembang",
    lat: -6.8150,
    lng: 107.6180,
    status: "tiba",
    distanceMeters: 18,
    etaMinutes: 0,
    suhuKontainer: 70.1,
    geofenceRadius: 50,
    isGeofenceUnlocked: true,
    porsiTotal: 390
  },
  {
    id: "ARM-08",
    driverNama: "Irfan Maulana",
    platNomor: "D 1102 BZ",
    asal: "SPPG Sumedang Barat",
    tujuan: "SDN 04 Jatinangor",
    lat: -6.9310,
    lng: 107.7720,
    status: "dalam_perjalanan",
    distanceMeters: 1200,
    etaMinutes: 15,
    suhuKontainer: 66.0,
    geofenceRadius: 50,
    isGeofenceUnlocked: false,
    porsiTotal: 580
  }
];

const ITEMS_PER_PAGE = 5;

export default function MonitoringDistribusiPage() {
  const [fleets] = useState<FleetVehicle[]>(FLEETS);
  const [activeFleet, setActiveFleet] = useState<FleetVehicle>(FLEETS[0]);
  const [qrScanned, setQrScanned] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredFleets = useMemo(() => {
    return fleets.filter(
      (f) =>
        f.driverNama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.platNomor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.tujuan.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [fleets, searchQuery]);

  const totalPages = Math.ceil(filteredFleets.length / ITEMS_PER_PAGE);

  const paginatedFleets = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFleets.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredFleets, currentPage]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSimulateScan = () => {
    setQrScanned(true);
  };

  useEffect(() => {
    setQrScanned(false);
  }, [activeFleet]);

  return (
    <div className="w-full h-[100dvh] bg-slate-50 text-slate-900 flex flex-col font-sans overflow-hidden">
      {/* Main Full-Height Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-0 relative overflow-hidden">
        
        {/* Left Sidebar: Fleet List (4 Cols) */}
        <div className="lg:col-span-4 bg-white border-r border-slate-200 flex flex-col h-full min-h-0 z-20 shadow-xs">
          {/* Sidebar Header & Search */}
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
            <div>
               <h1 className="font-black text-sm text-[#1E3A5F]">Monitoring Distribusi</h1>
               <p className="text-[10px] text-slate-500 font-bold mt-0.5">Validasi Haversine Geofence (50m)</p>
            </div>
            <Badge variant="outline" className="font-mono text-[10px] font-bold bg-emerald-50 text-emerald-800 border-emerald-300 flex items-center gap-1 shadow-sm">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" /> LIVE GPS
            </Badge>
          </div>

          <div className="p-3 border-b border-slate-200 bg-white shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Cari Sopir, Plat, atau Sekolah..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-8 pr-3 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] transition-all"
              />
            </div>
          </div>

          {/* Fleet List Scroll */}
          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto min-h-0">
            {paginatedFleets.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 font-medium">
                Tidak ada armada yang sesuai kueri pencarian.
              </div>
            ) : (
              paginatedFleets.map((fleet) => {
                const isSelected = activeFleet.id === fleet.id;
                return (
                  <div
                    key={fleet.id}
                    onClick={() => setActiveFleet(fleet)}
                    className={`p-3 flex flex-col gap-1.5 cursor-pointer transition-colors ${
                      isSelected ? "bg-emerald-50/80 border-l-4 border-l-emerald-600" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs text-slate-900">{fleet.platNomor}</span>
                        <span className="text-[10px] font-mono text-slate-500 font-semibold">({fleet.driverNama})</span>
                      </div>
                      {fleet.isGeofenceUnlocked ? (
                        <Badge className="bg-emerald-100 text-emerald-950 border-emerald-300 text-[9px] font-extrabold px-1.5 py-0.5">
                          Unlocked (≤50m)
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[9px] font-bold border-slate-300 text-slate-700 px-1.5 py-0.5">
                          Transit ({fleet.distanceMeters}m)
                        </Badge>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <p className="flex items-center gap-1.5 font-medium truncate">
                        <MapPin className="w-3 h-3 text-emerald-700 shrink-0" /> Tujuan: <span className="text-slate-900 font-bold truncate">{fleet.tujuan}</span>
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="flex items-center gap-1 font-mono font-bold text-slate-600 text-[10px]">
                          <Clock className="w-3 h-3 text-slate-400" /> ETA: {fleet.etaMinutes} Min
                        </span>
                        <span className="flex items-center gap-1 font-mono text-emerald-800 font-black text-[10px]">
                          <Thermometer className="w-3 h-3 text-emerald-600" /> {fleet.suhuKontainer}°C
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700 shrink-0">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-lg border border-slate-300 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <span className="font-mono text-[11px]">
                Halaman {currentPage} dari {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-lg border border-slate-300 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-all"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Area: Interactive Spatial Map Canvas (8 Cols) */}
        <div className="lg:col-span-8 relative bg-slate-950 flex flex-col justify-between overflow-hidden h-full min-h-0">
          
          {/* MapLibre Canvas */}
          <div className="absolute inset-0 z-0">
            <MapLibreLogistik
              hideControls={true}
              focusLocation={{
                lat: activeFleet?.lat ?? -6.9175,
                lng: activeFleet?.lng ?? 107.6191,
                zoom: activeFleet?.isGeofenceUnlocked ? 17 : 14
              }}
            />
          </div>

          {/* Map Top Slim HUD (1-line pill) */}
          <div className="relative z-10 p-2 m-2.5 rounded-xl bg-white/95 backdrop-blur border border-slate-200 shadow-xs flex items-center justify-between text-xs pointer-events-none">
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-emerald-700 animate-spin" />
              <span className="font-black text-slate-900 text-[11px]">
                GPS: {activeFleet.platNomor} ({activeFleet.driverNama}) ➔ {activeFleet.tujuan}
              </span>
            </div>

            <Badge
              className={`font-mono text-[10px] font-bold px-2 py-0.5 ${
                activeFleet.isGeofenceUnlocked
                  ? "bg-emerald-600 text-white border-emerald-700"
                  : "bg-amber-100 text-amber-950 border-amber-300"
              }`}
            >
              Jarak: {activeFleet.distanceMeters}m {activeFleet.isGeofenceUnlocked ? "(✓ RADIUS 50M UNLOCKED)" : "(TERKUNCI)"}
            </Badge>
          </div>

          {/* Visual Geofence Circle Overlay (Compact Radar) */}
          <div className="relative z-10 flex-1 flex items-center justify-center p-2 pointer-events-none min-h-0">
            <motion.div
              animate={{
                scale: activeFleet.isGeofenceUnlocked ? 1.15 : 1
              }}
              transition={{ duration: 0.8 }}
              className={`relative rounded-full border-2 border-dashed transition-all duration-700 flex items-center justify-center backdrop-blur-[1px] ${
                activeFleet.isGeofenceUnlocked
                  ? "w-48 h-48 sm:w-56 sm:h-56 border-emerald-400 bg-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.35)]"
                  : "w-40 h-40 sm:w-48 sm:h-48 border-emerald-500/50 bg-emerald-500/10"
              }`}
            >
              <div className="absolute top-1.5 text-[9px] font-mono font-black text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
                {activeFleet.isGeofenceUnlocked ? "GEOFENCE UNLOCKED (RADIUS ≤ 50m)" : "RADAR GEOFENCE (RADIUS 50m)"}
              </div>

              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center shadow-md transition-transform ${activeFleet.isGeofenceUnlocked ? "bg-emerald-600 scale-110" : "bg-slate-700"}`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black text-slate-900 mt-1 bg-white/95 px-2.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                  {activeFleet.tujuan}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Slim Bottom Handover Drawer */}
          <div className="relative z-10 p-2.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs shadow-lg">
            <div className="flex items-center gap-3">
              <div>
                <span className="font-bold text-slate-900 block text-xs">Serah Terima Makanan Matang</span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Manifest: <span className="font-bold text-slate-800">{activeFleet.porsiTotal} Porsi</span> • Suhu: <span className="font-bold text-emerald-700 font-mono">{activeFleet.suhuKontainer}°C</span>
                </span>
              </div>
            </div>

            <Button
              onClick={() => setIsScanModalOpen(true)}
              disabled={!activeFleet.isGeofenceUnlocked || qrScanned}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8 px-4 rounded-xl shadow-2xs flex items-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5" />
              {qrScanned ? "Serah Terima Berhasil" : "Pindai Barcode Serah Terima"}
            </Button>
          </div>

        </div>

      </div>

      <QRScannerModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onScan={(data) => {
          setQrScanned(true);
        }}
      />
    </div>
  );
}
