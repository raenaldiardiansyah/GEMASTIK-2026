"use client"

import { useMemo } from "react"

import {
  DashboardFilterProvider,
  SchoolSearchProvider,
  useDashboardFilter,
} from "@/components/goverment/DashboardFilterContext"
import { DashboardHeader } from "@/components/goverment/DashboardHeader"
import { AlertBanner, type AlertItem } from "@/components/goverment/AlertBanner"
import { ComposedTrendChart } from "@/components/goverment/ComposedTrendChart"
import { OnTimeRateChart } from "@/components/goverment/OnTimeRateChart"
import { StatusPerJenjangChart } from "@/components/goverment/StatusPerJenjangChart"
import { ComplianceRankingPanel } from "@/components/goverment/ComplianceRankingPanel"
import { SchoolStatusPanel } from "@/components/goverment/SchoolStatusPanel"
import { DeliveryHeatmap } from "@/components/goverment/DeliveryHeatmap"
import { KPIBar } from "@/components/goverment/KPIBar"
import { DailyBriefing } from "@/components/goverment/DailyBriefing"
import { ActivityFeed, type FeedItem, type FeedItemType } from "@/components/goverment/ActivityFeed"
import { getKPISummary, getActivityLog } from "@/lib/mbgdummydata"

const ALERTS: AlertItem[] = [
  {
    id: "a1",
    severity: "warning",
    message: "3 pengiriman hari ini belum terkonfirmasi — batas waktu 14.00 WIB",
    anchor: "lebih tinggi dari rata-rata 7 hari lalu (biasanya 1)",
    actionLabel: "Lihat Detail",
    actionHref: "/goverment/verifikasi",
  },
]

function DashboardContent() {
  const { filter } = useDashboardFilter()
  const kpi = useMemo(() => getKPISummary(filter.periode), [filter.periode])
  const activityItems: FeedItem[] = useMemo(() => {
    const raw = getActivityLog().slice(0, 5)
    return raw.map(item => ({
      id: item.id,
      type: item.type as FeedItemType,
      message: item.message,
      time: item.timeLabel,
      href: item.href,
    }))
  }, [])

  return (
    <div className="min-h-full bg-background text-foreground">
      <div className="space-y-4 px-4 py-5 md:px-6">
        <DashboardHeader />
        <DailyBriefing
          data={{
            porsiHariIni: kpi.totalPorsi,
            sengketaAktif: kpi.sengketaAktif,
            vendorMenunggu: kpi.vendorPending,
            urgentHref: kpi.sengketaAktif > 0 ? "/goverment/verifikasi" : "/goverment/pengawasan",
          }}
        />
        <AlertBanner alerts={ALERTS} />
        <KPIBar />

        <div className="grid grid-cols-1 gap-4 md:gap-5 xl:grid-cols-12">
          {/* Row 1: Tren Utama (8 cols) & Metrik Cepat (4 cols) */}
          <div className="min-w-0 xl:col-span-8 flex flex-col">
            <ComposedTrendChart />
          </div>
          <div className="min-w-0 xl:col-span-4 flex flex-col gap-4">
            <OnTimeRateChart />
            <StatusPerJenjangChart />
          </div>

          {/* Row 2: Kepatuhan Sistem (7 cols) & Feed Aktivitas (5 cols) Side-by-Side */}
          <div className="min-w-0 xl:col-span-7 flex flex-col">
            <ComplianceRankingPanel />
          </div>
          <div className="min-w-0 xl:col-span-5 flex flex-col">
            <ActivityFeed items={activityItems} />
          </div>

          {/* Row 3: Tabel Status Sekolah Terkini */}
          <div className="min-w-0 xl:col-span-12">
            <SchoolStatusPanel />
          </div>

          {/* Row 4: Pola Distribusi Heatmap (Paling Bawah) */}
          <div className="min-w-0 xl:col-span-12">
            <DeliveryHeatmap />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GovermentDashboard() {
  return (
    <DashboardFilterProvider>
      <SchoolSearchProvider>
        <DashboardContent />
      </SchoolSearchProvider>
    </DashboardFilterProvider>
  )
}
