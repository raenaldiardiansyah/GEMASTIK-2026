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
      <div className="space-y-6 px-4 py-6 md:px-6 lg:px-8">
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

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* Row 1: Utama */}
          <div className="min-w-0 xl:col-span-8 h-full">
            <ComposedTrendChart />
          </div>
          <div className="min-w-0 xl:col-span-4 space-y-6">
            <OnTimeRateChart />
            <StatusPerJenjangChart />
          </div>

          {/* Row 2: Compliance Panel memakan porsi full agar tidak tabrakan/cramped */}
          <div className="min-w-0 xl:col-span-12">
            <ComplianceRankingPanel />
          </div>

          {/* Row 3: Tabel Status Sekolah (Full Width) */}
          <div className="min-w-0 xl:col-span-12">
            <SchoolStatusPanel />
          </div>

          {/* Row 4: Log Aktivitas (Full Width, Atas Bawah) */}
          <div className="min-w-0 xl:col-span-12">
            <ActivityFeed items={activityItems} />
          </div>
        </div>

        <DeliveryHeatmap />
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
