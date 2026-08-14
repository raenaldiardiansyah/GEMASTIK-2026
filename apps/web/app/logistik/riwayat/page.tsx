import Link from "next/link"
import { ArrowLeft, Navigation, PackageCheck, Route, Truck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardShell } from "@/components/ui/dashboard-shell"
import { columns, LogistikDelivery } from "./columns"
import { DataTable } from "./data-table"
import { deliveryList, vendorSekolahList, vendorList, sekolahList } from "@/lib/mbgdummydata"

function mapStatus(status: string) {
  if (status === "delivered") return "Selesai"
  if (status === "on_transit") return "Sedang Dikirim"
  if (status === "pending") return "Diproses"
  return "Kendala"
}

async function getData(): Promise<LogistikDelivery[]> {
  return deliveryList.map((delivery) => {
    const vs = vendorSekolahList.find((v) => v.id === delivery.vendor_sekolah_id)
    const vendor = vendorList.find((v) => v.id === vs?.vendor_id)
    const sekolah = sekolahList.find((s) => s.id === vs?.sekolah_id)
    
    return {
      id: `LOG-INV-${delivery.id.toString().padStart(3, "0")}`,
      vendor: vendor?.nama || "Unknown Vendor",
      sekolah: sekolah?.nama || "Unknown Sekolah",
      porsi: delivery.porsi_dikirim > 0 ? delivery.porsi_dikirim : (vs?.porsi_per_hari || 0),
      status: mapStatus(delivery.status) as any,
      waktu: delivery.jam_tiba !== "--" ? `${delivery.jam_tiba} WIB` : `${delivery.jam_target} WIB (Est)`,
    }
  })
}

export default async function RiwayatDashboardPage() {
  const data = await getData()

  return (
    <DashboardShell
      badge={<Badge variant="outline" className="border-emerald-300 bg-emerald-100 text-emerald-950 font-extrabold px-3 py-1 text-xs shadow-2xs">Portal Logistik · Laporan Ekstensif</Badge>}
      title="Riwayat Pengiriman & Audit Manifest"
      description="Semua riwayat pengantaran makanan bergizi oleh armada logistik boga, ditinjau secara real-time termasuk status keberhasilan dan kendala."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" className="rounded-xl border-slate-300 text-slate-800 hover:bg-slate-100 font-extrabold text-xs shadow-xs">
            <Link href="/logistik/dashboard">
              <ArrowLeft className="w-4 h-4 mr-1.5 text-slate-600" />
              Kembali
            </Link>
          </Button>
          <Button asChild className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/25 px-4">
            <Link href="/logistik/pantau">
              Pantau Live Map
              <Navigation className="w-4 h-4 ml-1.5" />
            </Link>
          </Button>
        </div>
      }
    >
      <section className="mt-6">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-100/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-base font-black text-slate-900">Arsip Manifest Distribusi</p>
              <p className="text-xs font-medium text-slate-600 mt-0.5">
                Pencatatan nomor resi manifest, volume porsi terkirim, dan stempel waktu serah-terima.
              </p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-950 border border-emerald-300 font-extrabold text-xs w-fit">
              Total {data.length} Manifest
            </Badge>
          </div>
          <div className="p-5">
            <DataTable columns={columns} data={data} />
          </div>
        </div>
      </section>
    </DashboardShell>
  )
}
