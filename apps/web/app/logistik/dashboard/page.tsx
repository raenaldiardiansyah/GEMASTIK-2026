"use client";

import { useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowRight,
  Factory,
  Navigation,
  PackageCheck,
  Route,
  School,
  ScanLine,
  Truck,
} from "lucide-react";

import {
  deliveryList,
  vendorList,
  vendorSekolahList,
  sekolahList,
} from "@/lib/mbgdummydata";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { KpiCard } from "@/components/ui/kpi-card";

const MapLibreLogistik = dynamic(() => import("@/components/ui/MapLibreLogistik"), {
  ssr: false,
  loading: () => <div className="h-[540px] w-full animate-pulse rounded-xl bg-muted" />,
});

type StageStatus = "vendor" | "sppg" | "school";

function getStageStatus(status: string): StageStatus {
  if (status === "pending") return "vendor";
  if (status === "on_transit") return "sppg";
  return "school";
}

function stageLabel(status: string) {
  if (status === "pending") return "Vendor → SPPG (menunggu pickup)";
  if (status === "on_transit") return "SPPG → Sekolah (dalam perjalanan)";
  if (status === "delivered") return "Selesai di Sekolah";
  return "Insiden Pengiriman";
}

export default function LogistikDashboardPage() {
  const rows = useMemo(() => {
    return deliveryList.slice(0, 10).map((delivery) => {
      const relation = vendorSekolahList.find((item) => item.id === delivery.vendor_sekolah_id);
      const vendor = vendorList.find((item) => item.id === relation?.vendor_id);
      const school = sekolahList.find((item) => item.id === relation?.sekolah_id);
      const sppgName = `SPPG ${vendor?.nama?.replace(/^CV\s|^PT\s/, "").split(" ")[0] ?? "Utama"}`;

      return {
        id: delivery.id,
        vendor: vendor?.nama ?? "Vendor",
        sppg: sppgName,
        school: school?.nama ?? "Sekolah",
        status: delivery.status,
        stage: getStageStatus(delivery.status),
        target: delivery.jam_target,
      };
    });
  }, []);

  const summary = useMemo(() => {
    const delivered = rows.filter((row) => row.status === "delivered").length;
    const inTransit = rows.filter((row) => row.status === "on_transit").length;
    const pending = rows.filter((row) => row.status === "pending").length;

    return {
      delivered,
      inTransit,
      pending,
      routes: rows.length,
    };
  }, [rows]);

  return (
    <DashboardShell
      badge={<Badge variant="outline" className="border-emerald-300 bg-emerald-100 text-emerald-950 font-extrabold px-3 py-1 text-xs shadow-2xs">Portal Logistik · Distribusi MBG</Badge>}
      title="Dashboard Logistik: Vendor → SPPG → Sekolah"
      description={
        <>
          Pemantauan rantai pasok harian, status serah-terima manifest, validasi geofencing, dan modul pemindai QR terintegrasi.
        </>
      }
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/25 px-4">
            <Link href="/logistik/pantau">
              Pantau Detail Rute
              <Navigation className="w-4 h-4 ml-1.5" />
            </Link>
          </Button>
        </div>
      }
    >

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Statistik Logistik">
        {[
          { label: "Manifest Selesai", value: summary.delivered, icon: PackageCheck },
          { label: "Dalam Pengiriman", value: summary.inTransit, icon: Truck },
          { label: "Menunggu Pickup", value: summary.pending, icon: Factory },
          { label: "Rute Dipantau", value: summary.routes, icon: Route },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-emerald-500 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold text-slate-600">{m.label}</p>
              <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-800 border border-emerald-300 shadow-2xs">
                <m.icon className="size-4" aria-hidden />
              </div>
            </div>
            <p className="mt-3 text-2xl font-black tracking-tight text-slate-900 tabular-nums">
              {m.value}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden lg:col-span-2 flex flex-col">
          <div className="p-5 border-b border-slate-200 bg-slate-100/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-base font-black text-slate-900">Alur Distribusi per Manifest</p>
              <p className="text-xs font-medium text-slate-600 mt-0.5">
                Posisi operasional saat ini berdasarkan urutan Vendor → SPPG → Sekolah.
              </p>
            </div>
          </div>
          <div className="p-5 flex-1">
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-2xs">
              <Table>
                <TableHeader className="bg-slate-100/90 border-b border-slate-200">
                  <TableRow>
                    <TableHead className="text-xs font-black text-slate-900">Manifest</TableHead>
                    <TableHead className="text-xs font-black text-slate-900">Vendor</TableHead>
                    <TableHead className="text-xs font-black text-slate-900">SPPG</TableHead>
                    <TableHead className="text-xs font-black text-slate-900">Sekolah</TableHead>
                    <TableHead className="text-xs font-black text-slate-900">Tahap Aktif</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id} className="hover:bg-emerald-50/40 border-b border-slate-100">
                      <TableCell className="font-mono text-xs font-black text-emerald-950">
                        MBG-{row.id.toString().padStart(5, "0")}
                      </TableCell>
                      <TableCell className="font-bold text-slate-900 text-xs">{row.vendor}</TableCell>
                      <TableCell className="font-semibold text-slate-700 text-xs">{row.sppg}</TableCell>
                      <TableCell className="font-semibold text-slate-700 text-xs">{row.school}</TableCell>
                      <TableCell>
                        <div className="space-y-1.5 py-1">
                          <div className="flex flex-wrap items-center gap-1.5 text-xs">
                            <Badge className={`rounded-md text-[10px] font-black ${row.stage === "vendor" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 border border-slate-300"}`}>
                              Vendor
                            </Badge>
                            <ArrowRight className="size-3 text-slate-400" />
                            <Badge className={`rounded-md text-[10px] font-black ${row.stage === "sppg" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 border border-slate-300"}`}>
                              SPPG
                            </Badge>
                            <ArrowRight className="size-3 text-slate-400" />
                            <Badge className={`rounded-md text-[10px] font-black ${row.stage === "school" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 border border-slate-300"}`}>
                              Sekolah
                            </Badge>
                          </div>
                          <p className="text-[11px] font-bold text-emerald-800">{stageLabel(row.status)}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-200 bg-slate-100/60">
            <p className="text-base font-black text-slate-900">Scanner & Validasi QR</p>
            <p className="text-xs font-medium text-slate-600 mt-0.5">
              Standar serah-terima fisik digital tanpa manipulasi lokasi.
            </p>
          </div>
          <div className="p-5 space-y-4 flex-1">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs space-y-2">
              <p className="font-black text-emerald-950 uppercase tracking-wide">SOP Verifikasi QR Geofencing</p>
              <ol className="list-decimal space-y-1 pl-4 text-emerald-900 font-medium leading-relaxed">
                <li>Vendor menyerahkan manifest QR saat bahan siap dimuat.</li>
                <li>Driver logistik scan QR di titik muat SPPG.</li>
                <li>Konfirmasi tiba di sekolah melalui geofence radius 50m.</li>
              </ol>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <p className="flex items-center gap-2 font-semibold">
                <ScanLine className="size-4 text-emerald-600 shrink-0" />
                Gunakan modul pemindaian di halaman <strong>Pantau Rute</strong>.
              </p>
              <p className="flex items-center gap-2 font-semibold">
                <School className="size-4 text-emerald-600 shrink-0" />
                Pastikan nama sekolah penerima cocok dengan Surat Jalan.
              </p>
            </div>
          </div>
          <div className="p-5 border-t border-slate-100 bg-slate-50/50">
            <Button asChild className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 shadow-md shadow-emerald-600/25">
              <Link href="/logistik/pantau">
                Buka Monitoring Map &amp; Scanner
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="map-logistik" className="mt-6">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-100/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-base font-black text-slate-900">Peta Armada Logistik &amp; Live Tracking</p>
              <p className="text-xs font-medium text-slate-600 mt-0.5">
                Visualisasi titik distribusi SPPG, kendaraan dalam perjalanan, serta rute tujuan sekolah.
              </p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-950 border border-emerald-300 font-extrabold text-xs w-fit">
              ● Live GPS Connected
            </Badge>
          </div>
          <div className="p-5">
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-2xs">
              <MapLibreLogistik />
            </div>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
