"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, History, MapPin, Navigation, ShieldCheck } from "lucide-react";
import { type Sekolah } from "@/lib/mbgdummydata";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/ui/dashboard-shell";

const MapLibreLogistik = dynamic(() => import("@/components/ui/MapLibreLogistik"), { 
  ssr: false,
  loading: () => <div className="h-[600px] w-full animate-pulse rounded-2xl bg-slate-200" />
});

export default function PantauRutePage() {
  const [selectedSchool, setSelectedSchool] = useState<Sekolah | null>(null);

  return (
    <DashboardShell
      badge={<Badge variant="outline" className="border-emerald-300 bg-emerald-100 text-emerald-950 font-extrabold px-3 py-1 text-xs shadow-2xs">Portal Logistik · Live Tracking GPS &amp; Animasi 3D</Badge>}
      title="Pantau Rute Kendaraan &amp; Distribusi Live 3D"
      description="Peta interaktif pergerakan suplai MBG dengan animasi rute 3D live telemetri armada seperti pada portal pengawasan pemerintah."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" className="rounded-xl border-slate-300 text-slate-800 hover:bg-slate-100 font-extrabold text-xs shadow-xs">
            <Link href="/logistik/dashboard">
              <ArrowLeft className="w-4 h-4 mr-1.5 text-slate-600" />
              Kembali
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl border-slate-300 text-slate-800 hover:bg-slate-100 font-extrabold text-xs shadow-xs">
            <Link href="/logistik/riwayat">
              <History className="w-4 h-4 mr-1.5 text-emerald-700" />
              Riwayat Manifest
            </Link>
          </Button>
        </div>
      }
    >
      {/* Quick Status Bar */}
      <section className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <span className="text-xs font-bold text-slate-600 block">Satelit GPS Telemetri</span>
          <span className="text-sm font-black text-emerald-800 flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> TERHUBUNG (LIVE 3D)
          </span>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <span className="text-xs font-bold text-slate-600 block">Geofence Radius Sekolah</span>
          <span className="text-sm font-black text-slate-900 mt-1 block">50 Meter Radius</span>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <span className="text-xs font-bold text-slate-600 block">Sekolah Terpilih</span>
          <span className="text-sm font-black text-emerald-950 truncate mt-1 block">
            {selectedSchool ? selectedSchool.nama : "Semua Titik Sekolah"}
          </span>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <span className="text-xs font-bold text-slate-600 block">Protokol Keamanan</span>
          <span className="text-xs font-black text-emerald-950 flex items-center gap-1 mt-1 bg-emerald-100 w-fit px-2 py-0.5 rounded border border-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" /> ANTI-SPOOFING GPS
          </span>
        </div>
      </section>

      {/* Main Map Box */}
      <section className="mt-6">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-100/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-base font-black text-slate-900">Peta Navigasi Geografis &amp; Animasi Rute Live</p>
              <p className="text-xs font-medium text-slate-600 mt-0.5">
                Klik tombol &quot;Simulasi Animasi 3D&quot; pada kontrol peta untuk melihat pergerakan armada secara real-time.
              </p>
            </div>
          </div>
          <div className="p-5">
            <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-2xs">
              <MapLibreLogistik 
                focusLocation={selectedSchool ? { lat: selectedSchool.lat, lng: selectedSchool.lng, zoom: 16 } : null}
              />
            </div>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
