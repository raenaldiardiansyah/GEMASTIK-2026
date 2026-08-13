"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { Bell, ChevronDown, LayoutDashboard } from "lucide-react"

import { cn } from "@/lib/utils"
import { useDashboardFilter } from "./DashboardFilterContext"
import { sppgList, type DashboardPeriode, type JenjangFilter } from "@/lib/mbgdummydata"
import { PageHeader } from "@/components/ui/page-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const STATUS_COLORS = {
  delivered: "hsl(var(--status-success))",
  on_transit: "hsl(var(--status-info))",
  pending: "hsl(var(--status-pending))",
  gagal: "hsl(var(--status-danger))",
}

export function DashboardHeader() {
  const { filter, setPeriode, setSppgId, toggleJenjang, setJenjang } = useDashboardFilter()
  const router = useRouter()

  return (
    <div className="space-y-4">
      <PageHeader
        title={
          <span className="inline-flex items-center gap-2.5">
            <span className="size-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <LayoutDashboard className="size-4" aria-hidden />
            </span>
            <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-900">Dashboard Pemerintah</span>
          </span>
        }
        subtitle={null}
        actions={
          <button
            onClick={() => router.push("/goverment/notifikasi")}
            aria-label="Lihat notifikasi (4 notifikasi belum dibaca)"
            className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-surface border border-border text-slate-800 hover:bg-slate-100 hover:text-indigo-600 transition-all shadow-xs group"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white shadow-sm ring-2 ring-white">
              4
            </span>
          </button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <div
          className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-1.5 py-1"
          role="group"
          aria-label="Filter periode"
        >
          {["1H", "7H", "30H"].map((p) => {
            const val = p as DashboardPeriode
            const label = { "1H": "1 Hari", "7H": "7 Hari", "30H": "30 Hari" }[p]
            const isActive = filter.periode === val
            return (
              <button
                key={p}
                onClick={() => setPeriode(val)}
                aria-pressed={isActive}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive ? "bg-indigo-600 text-white" : "text-slate-800 font-semibold hover:bg-surface-raised"
                )}
              >
                {label}
              </button>
            )
          })}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-raised transition-colors"
              aria-label="Filter SPPG"
            >
              <span className="max-w-[220px] truncate">
                {filter.sppgId ? "SPPG " + filter.sppgId : "Semua SPPG"}
              </span>
              <ChevronDown className="size-4 text-muted-foreground" aria-hidden />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="text-sm">
            <DropdownMenuItem
              onClick={() => setSppgId(null)}
              className="font-semibold"
            >
              Semua SPPG
            </DropdownMenuItem>
            {sppgList.map(sppg => (
              <DropdownMenuItem
                key={sppg.id}
                onClick={() => setSppgId(sppg.id)}
              >
                {sppg.nama}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter jenjang">
          <button
            onClick={() => {
              const all: JenjangFilter[] = ["SD", "SMP", "SMA"]
              setJenjang(
                filter.jenjang.length === all.length
                  ? []
                  : all
              )
            }}
            aria-pressed={filter.jenjang.length > 0}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              filter.jenjang.length === 0
                ? "border-indigo-600 bg-indigo-100 text-indigo-700 font-semibold"
                : "border-border bg-surface text-slate-800 font-semibold hover:bg-surface-raised"
            )}
          >
            Semua
          </button>

          {"SD SMP SMA".split(" ").map((j) => {
            const active = filter.jenjang.includes(j as any)
            return (
              <button
                key={j}
                onClick={() => toggleJenjang(j as any)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "border-indigo-600 bg-indigo-100 text-indigo-700 font-semibold"
                    : "border-border bg-surface text-slate-800 font-semibold hover:bg-surface-raised"
                )}
              >
                {j}
              </button>
            )
          })}
        </div>
      </div>

    </div>
  )
}
