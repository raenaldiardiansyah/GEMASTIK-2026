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
    <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between bg-surface border border-border rounded-xl p-3 shadow-xs">
      {/* Left: Title */}
      <div className="flex items-center gap-2">
        <div className="size-7 inline-flex items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
          <LayoutDashboard className="size-4" aria-hidden />
        </div>
        <div>
          <h1 className="font-black text-base tracking-tight text-slate-900 leading-none">
            Dashboard Pemerintah
          </h1>
          <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
            Pengawasan Rantai Pasok & Kepatuhan MBG
          </p>
        </div>
      </div>

      {/* Right: Filters + Notification */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Periode */}
        <div
          className="inline-flex items-center gap-0.5 rounded-full border border-border bg-slate-50 p-0.5"
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
                  "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
                  isActive ? "bg-indigo-600 text-white shadow-xs" : "text-slate-700 hover:bg-slate-200/60"
                )}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* SPPG Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-200/60 transition-colors"
              aria-label="Filter SPPG"
            >
              <span className="max-w-[140px] truncate">
                {filter.sppgId ? "SPPG " + filter.sppgId : "Semua SPPG"}
              </span>
              <ChevronDown className="size-3 text-slate-500" aria-hidden />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="text-xs">
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

        {/* Jenjang */}
        <div
          className="inline-flex items-center gap-0.5 rounded-full border border-border bg-slate-50 p-0.5"
          role="group"
          aria-label="Filter jenjang sekolah"
        >
          <button
            onClick={() => setJenjang([])}
            aria-pressed={filter.jenjang.length === 0}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
              filter.jenjang.length === 0
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-700 hover:bg-slate-200/60"
            )}
          >
            Semua
          </button>
          {(["SD", "SMP", "SMA"] as JenjangFilter[]).map((j) => {
            const isActive = filter.jenjang.includes(j)
            return (
              <button
                key={j}
                onClick={() => toggleJenjang(j)}
                aria-pressed={isActive}
                className={cn(
                  "rounded-full px-2 py-1 text-xs font-semibold transition-colors",
                  isActive
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-200/60"
                )}
              >
                {j}
              </button>
            )
          })}
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => router.push("/goverment/notifikasi")}
          aria-label="Lihat notifikasi (4 belum dibaca)"
          className="relative flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 border border-border text-slate-700 hover:bg-slate-200/60 hover:text-indigo-600 transition-all shadow-xs ml-1"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-0.5 text-[9px] font-black text-white shadow-sm ring-1 ring-white">
            4
          </span>
        </button>
      </div>
    </div>
  )
}
