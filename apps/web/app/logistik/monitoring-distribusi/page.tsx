"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Truck,
  ShieldCheck,
  Navigation,
  Thermometer,
  Clock,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Compass,
  Radio
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  geofenceRadius: number; // 50m
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
    distanceMeters: 42, // Under 50m!
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
  }
];

export default function MonitoringDistribusiPage() {
  const [fleets, setFleets] = useState<FleetVehicle[]>(FLEETS);
  const [activeFleet, setActiveFleet] = useState<FleetVehicle>(FLEETS[0]);
  const [qrScanned, setQrScanned] = useState(false);

  const handleSimulateScan = () => {
    setQrScanned(true);
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Page Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-5 shadow-2xs">
        <PageHeader
          title="Monitoring Distribusi Spasial &amp; Haversine Geofencing (Radius 50m)"
          subtitle="Pelacakan armada pengiriman makanan matang real-time dengan validasi radius geofencing 50 meter saat serah terima di sekolah."
        />
      </div>

      {/* Main Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 relative overflow-hidden border-b border-slate-200">
        
        {/* Left Sidebar: Fleet List (4 Cols) */}
        <div className="lg:col-span-4 bg-white border-r border-slate-200 flex flex-col z-20">
          <div className="p-4 border-b border-slate-200 bg-slate-100/60 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900">
              <Truck className="w-5 h-5 text-emerald-700" />
              <span className="font-black text-xs">Armada Pengiriman MBG Aktif</span>
            </div>
            <Badge variant="outline" className="font-mono text-[10px] font-black bg-emerald-100 text-emerald-950 border-emerald-300 flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" /> LIVE GPS
            </Badge>
          </div>

          <div className="divide-y divide-slate-200 flex-1 overflow-y-auto">
            {fleets.map((fleet) => {
              const isSelected = activeFleet.id === fleet.id;
              return (
                <div
                  key={fleet.id}
                  onClick={() => setActiveFleet(fleet)}
                  className={`p-4 flex flex-col gap-2 cursor-pointer transition-colors ${
                    isSelected ? "bg-emerald-50/70 border-l-4 border-l-emerald-600" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900">{fleet.platNomor}</span>
                      <span className="text-xs font-mono font-bold text-slate-500">({fleet.driverNama})</span>
                    </div>
                    {fleet.isGeofenceUnlocked ? (
                      <Badge className="bg-emerald-100 text-emerald-950 border-emerald-300 text-[10px] font-black">
                        Geofence Unlocked
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] font-bold border-slate-300 text-slate-700">
                        Transit ({fleet.distanceMeters}m)
                      </Badge>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" /> Tujuan: <span className="text-slate-900 font-bold">{fleet.tujuan}</span>
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="flex items-center gap-1 font-mono font-bold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-slate-500" /> ETA: {fleet.etaMinutes} Min
                      </span>
                      <span className="flex items-center gap-1 font-mono text-emerald-800 font-black">
                        <Thermometer className="w-3.5 h-3.5 text-emerald-600" /> {fleet.suhuKontainer}°C
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Area: Interactive Spatial Map Canvas (8 Cols) */}
        <div className="lg:col-span-8 relative bg-slate-950 flex flex-col justify-between overflow-hidden min-h-[520px]">
          
          {/* MapLibre Interactive Map Background */}
          <div className="absolute inset-0 z-0">
            <MapLibreLogistik
              focusLocation={{
                lat: activeFleet?.lat ?? -6.9175,
                lng: activeFleet?.lng ?? 107.6191,
                zoom: activeFleet?.isGeofenceUnlocked ? 17 : 14
              }}
            />
          </div>

          {/* Map Floating HUD Header */}
          <div className="relative z-10 p-4 m-4 rounded-2xl bg-white/95 backdrop-blur border border-slate-200 shadow-lg flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-3">
              <Compass className="w-5 h-5 text-emerald-700 animate-spin" />
              <div>
                <h4 className="font-black text-xs text-slate-900">Haversine Geofencing Engine (MapLibre GL)</h4>
                <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                  Posisi GPS Armada: {activeFleet.lat}, {activeFleet.lng} • Target: {activeFleet.tujuan}
                </p>
              </div>
            </div>

            <Badge
              className={`font-mono text-xs font-black transition-colors ${
                activeFleet.isGeofenceUnlocked
                  ? "bg-emerald-600 text-white border-emerald-700 shadow-md"
                  : "bg-amber-100 text-amber-950 border-amber-300"
              }`}
            >
              Jarak: {activeFleet.distanceMeters}m {activeFleet.isGeofenceUnlocked ? "(✓ Radius 50m Unlocked)" : "(Terkunci)"}
            </Badge>
          </div>

          {/* Visual Geofence Circle Overlay (Dynamic Scaling Radar) */}
          <div className="relative z-10 flex-1 flex items-center justify-center p-6 pointer-events-none">
            <motion.div
              animate={{
                scale: activeFleet.isGeofenceUnlocked ? 1.25 : 1
              }}
              transition={{ duration: 0.8 }}
              className={`relative rounded-full border-2 border-dashed transition-all duration-700 flex items-center justify-center backdrop-blur-[1px] ${
                activeFleet.isGeofenceUnlocked
                  ? "w-80 h-80 border-emerald-400 bg-emerald-500/25 shadow-[0_0_40px_rgba(16,185,129,0.4)]"
                  : "w-64 h-64 border-emerald-500/60 bg-emerald-500/10"
              }`}
            >
              {/* Radius Label */}
              <div className="absolute top-2 text-[10px] font-mono font-black text-emerald-950 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-sm">
                {activeFleet.isGeofenceUnlocked ? "GEOFENCE UNLOCKED (RADIUS ≤ 50m)" : "RADAR GEOFENCE (RADIUS 50m)"}
              </div>

              {/* Destination Marker */}
              <div className="flex flex-col items-center">
                <div className={`w-11 h-11 rounded-full text-white flex items-center justify-center shadow-lg transition-transform ${activeFleet.isGeofenceUnlocked ? "bg-emerald-600 scale-110" : "bg-slate-700"}`}>
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-black text-slate-900 mt-1 bg-white/95 px-3 py-1 rounded-md border border-slate-200 shadow-sm">
                  {activeFleet.tujuan}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Bottom Drawer: Handover & QR Handshake Panel */}
          <div className="relative z-10 p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-slate-900">Status Serah Terima Makanan Matang</span>
                {activeFleet.isGeofenceUnlocked ? (
                  <Badge className="bg-emerald-100 text-emerald-950 border-emerald-300 text-xs font-black">
                    ✓ Kamera QR Diizinkan
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs font-bold text-amber-800 border-amber-300 bg-amber-50">
                    Kamera Terkunci (&gt;50m)
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Total Manifest: <span className="font-black text-slate-900 font-mono">{activeFleet.porsiTotal} Porsi</span> • Suhu Kontainer: <span className="font-black text-emerald-700 font-mono">{activeFleet.suhuKontainer}°C</span>
              </p>
            </div>

            <Button
              onClick={handleSimulateScan}
              disabled={!activeFleet.isGeofenceUnlocked || qrScanned}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs h-11 px-5 rounded-xl shadow-md shadow-emerald-600/25 flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              {qrScanned ? "Serah Terima Berhasil (Tercatat di Ledger)" : "Pindai Barcode Serah Terima"}
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
}
