"use client";

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

interface FleetVehicle {
  id: string;
  driverNama: string;
  platNomor: string;
  asal: string;
  tujuan: string;
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
    status: "dalam_perjalanan",
    distanceMeters: 42, // Under 50m!
    etaMinutes: 2,
    suhuKontainer: 68.5, // 68.5 Celcius hot meal
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
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col">
      {/* Page Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur px-6 py-4">
        <PageHeader
          title="Monitoring Distribusi Spasial & Haversine Geofencing"
          description="Pelacakan armada pengiriman makanan matang real-time dengan validasi radius geofencing 50 meter saat serah terima."
        />
      </div>

      {/* Main Container - Zero Gap Grid (Map + Fleet Sidebar) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 relative overflow-hidden">
        
        {/* Left Sidebar: Fleet List (4 Cols) */}
        <div className="lg:col-span-4 bg-card/30 border-r border-border flex flex-col z-20">
          <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm">Armada Pengiriman Aktif</span>
            </div>
            <Badge variant="outline" className="font-mono text-xs flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-500 animate-pulse" /> LIVE GPS
            </Badge>
          </div>

          <div className="divide-y divide-border flex-1 overflow-y-auto">
            {fleets.map((fleet) => {
              const isSelected = activeFleet.id === fleet.id;
              return (
                <div
                  key={fleet.id}
                  onClick={() => setActiveFleet(fleet)}
                  className={`p-4 flex flex-col gap-2 cursor-pointer transition-colors ${
                    isSelected ? "bg-primary/10 border-l-4 border-l-primary" : "hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{fleet.platNomor}</span>
                      <span className="text-xs font-mono text-muted-foreground">({fleet.driverNama})</span>
                    </div>
                    {fleet.isGeofenceUnlocked ? (
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[10px]">
                        Geofence Unlocked
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">
                        Transit ({fleet.distanceMeters}m)
                      </Badge>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> Tujuan: <span className="text-foreground font-medium">{fleet.tujuan}</span>
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" /> ETA: {fleet.etaMinutes} Min
                      </span>
                      <span className="flex items-center gap-1 font-mono text-emerald-500">
                        <Thermometer className="w-3 h-3" /> {fleet.suhuKontainer}°C
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Area: Interactive Spatial Map Canvas (8 Cols) */}
        <div className="lg:col-span-8 relative bg-slate-950 flex flex-col justify-between overflow-hidden">
          
          {/* Mock Interactive Map Canvas Display */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

          {/* Map Floating HUD Header */}
          <div className="relative z-10 p-4 m-4 rounded bg-background/90 backdrop-blur border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Compass className="w-5 h-5 text-primary animate-spin" />
              <div>
                <h4 className="font-semibold text-xs leading-none">Radius Haversine Geofencing Engine</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                  Posisi GPS Armada: -6.9247, 107.6321 • Radius Kunci: 50 Meter
                </p>
              </div>
            </div>

            <Badge variant="outline" className="font-mono text-xs bg-background">
              Jarak Aktual: {activeFleet.distanceMeters} Meter
            </Badge>
          </div>

          {/* Visual Geofence Circle Simulation */}
          <div className="relative z-10 flex-1 flex items-center justify-center p-6">
            <div className="relative w-72 h-72 rounded-full border-2 border-dashed border-primary/50 bg-primary/5 flex items-center justify-center">
              {/* Radius Label */}
              <div className="absolute top-2 text-[10px] font-mono text-primary bg-background/80 px-2 py-0.5 rounded border border-border">
                GEOFENCE BOUNDARY (50m)
              </div>

              {/* Destination School Marker */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-500 shadow-lg">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-white mt-1 bg-background/90 px-2 py-0.5 rounded border border-border">
                  {activeFleet.tujuan}
                </span>
              </div>

              {/* Vehicle Animated Position */}
              <motion.div
                animate={{
                  x: activeFleet.isGeofenceUnlocked ? 10 : 120,
                  y: activeFleet.isGeofenceUnlocked ? -10 : -80
                }}
                transition={{ duration: 1 }}
                className="absolute z-20 flex flex-col items-center"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold text-white bg-blue-600 px-1.5 py-0.5 rounded mt-0.5">
                  {activeFleet.platNomor}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Bottom Drawer: Handover & QR Handshake Panel */}
          <div className="relative z-10 p-5 bg-background border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Status Serah Terima Makanan Matang</span>
                {activeFleet.isGeofenceUnlocked ? (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-xs">
                    Kamera QR Diizinkan
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs text-amber-500 border-amber-500/30">
                    Kamera Terkunci (&gt;50m)
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total Manifes: <span className="font-bold text-foreground font-mono">{activeFleet.porsiTotal} Porsi</span> • Suhu Penyimpanan: <span className="font-bold text-emerald-500 font-mono">{activeFleet.suhuKontainer}°C</span>
              </p>
            </div>

            <Button
              onClick={handleSimulateScan}
              disabled={!activeFleet.isGeofenceUnlocked || qrScanned}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs h-10 px-5 flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              {qrScanned ? "Serah Terima Berhasil (Tercatat di Blockchain)" : "Pindai Barcode Serah Terima"}
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
}
