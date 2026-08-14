"use client"

import { useMemo, memo, useState } from "react"
import { useRouter } from "next/navigation"
import { getComplianceScores, getVendorRanking, type ComplianceCategoryScore } from "@/lib/mbgdummydata"
import { ComplianceModal } from "./ComplianceModal"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { StatusBadge } from "@/components/ui/status-badge"

// ── RadialBar (SVG arc) ───────────────────────────────────────────────────────

function RadialArc({
  skor, skorPrev, kategori, trend, trendValue, color, onClick,
}: Pick<ComplianceCategoryScore, "skor" | "skorPrev" | "kategori" | "trend" | "trendValue"> & { color: string; onClick: () => void }) {
  const R = 24
  const CIRCUMFERENCE = 2 * Math.PI * R
  const offset = CIRCUMFERENCE - (skor / 100) * CIRCUMFERENCE

  return (
    <button
      onClick={onClick}
      aria-label={`Kepatuhan ${kategori}: ${skor}%. Klik untuk lihat detail audit`}
      className="flex flex-col items-center gap-1 hover:scale-105 transition-transform group"
    >
      {/* SVG Arc */}
      <div className="relative w-[60px] h-[60px]">
        <svg className="w-full h-full -rotate-90" aria-hidden>
          <circle cx="30" cy="30" r={R} fill="transparent" stroke="hsl(var(--border))" strokeWidth={5} />
          <motion.circle
            cx="30" cy="30" r={R}
            fill="transparent"
            stroke={color}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-slate-900">
          {skor}%
        </span>
      </div>

      {/* Kategori */}
      <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">{kategori}</p>

      {/* Delta anchor */}
      <p
        className={cn(
          "text-[10px] font-bold flex items-center gap-0.5",
          trend === "up"
            ? "text-emerald-700"
            : trend === "down"
            ? "text-red-700"
            : "text-amber-700"
        )}
      >
        {trend === "up" ? <TrendingUp className="w-2.5 h-2.5" aria-hidden /> : trend === "down" ? <TrendingDown className="w-2.5 h-2.5" aria-hidden /> : null}
        {trend !== "stable" && `${trend === "up" ? "+" : "-"}${trendValue}%`}
      </p>
    </button>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

const RADIAL_COLORS = [
  "hsl(var(--status-success))",
  "hsl(var(--role-primary))",
  "hsl(var(--status-info))",
]

export const ComplianceRankingPanel = memo(function ComplianceRankingPanel() {
  const router = useRouter()
  const scores = useMemo(() => getComplianceScores(), [])
  const vendors = useMemo(() => getVendorRanking().slice(0, 4), [])
  const [modalData, setModalData] = useState<ComplianceCategoryScore | null>(null)

  return (
    <>
      <div className="bg-surface rounded-xl border border-border p-4 sm:p-4.5 shadow-card grid grid-cols-1 md:grid-cols-2 gap-4 h-full">

        {/* Left — RadialBar compliance */}
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-900 mb-3">
              Kepatuhan Sistem
            </p>
            <div className="flex justify-around items-start">
              {scores.map((s, i) => (
                <RadialArc
                  key={s.kategori}
                  {...s}
                  color={RADIAL_COLORS[i]}
                  onClick={() => setModalData(s)}
                />
              ))}
            </div>
          </div>
          <button
            onClick={() => setModalData(scores.find(s => s.skor < 95) || scores[0])}
            aria-label="Lihat detail audit kepatuhan"
            className="mt-3 w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-800 transition-colors shadow-xs"
          >
            Lihat Detail Audit
          </button>
        </div>

        {/* Right — Vendor Ranking */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-900 mb-2.5">
            Ranking Vendor On-Time
            <span className="ml-1 text-slate-500 normal-case font-medium text-[10px]">(terendah di atas)</span>
          </p>

          <div className="flex flex-col gap-1.5" role="list" aria-label="Ranking vendor berdasarkan on-time rate">
            {vendors.map((v) => {
              const barPct = (v.onTimeRate / 100) * 100
              const isLow = v.onTimeRate < 80
              const isSuspended = v.status === "suspend"

              return (
                <div key={v.id} className="group" role="listitem">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {/* Vendor name */}
                    <button
                      onClick={() => router.push(`/goverment/pengajuan?vendor=${v.id}`)}
                      aria-label={`Lihat detail vendor ${v.nama} di halaman pengajuan`}
                      className="text-xs font-semibold text-slate-900 hover:text-indigo-600 transition-colors text-left min-w-0 truncate flex-1"
                    >
                      {v.nama}
                    </button>
                    {/* Badge suspend */}
                    {isSuspended && (
                      <StatusBadge status="SUSPEND" />
                    )}
                    {/* Rate at end of bar (no X axis needed) */}
                    <span
                      className={cn("text-[11px] font-bold shrink-0 w-12 text-right tabular-nums", isLow ? "text-red-600 font-extrabold" : "text-slate-700")}
                      aria-label={`${v.onTimeRate}%`}
                    >
                      {isLow ? "✕ " : "● "}{v.onTimeRate}%
                    </span>
                    <button
                      onClick={() => router.push(`/goverment/pengajuan?vendor=${v.id}`)}
                      aria-label={`Navigasi ke pengajuan vendor ${v.nama}`}
                      className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-role-primary transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <ExternalLink className="w-2.5 h-2.5" aria-hidden />
                    </button>
                  </div>
                  {/* Bar — no X axis, no gridlines */}
                  <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden" aria-hidden>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barPct}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{
                        background: isLow
                          ? "hsl(var(--status-danger))"
                          : isSuspended
                          ? "hsl(var(--status-warning))"
                          : "linear-gradient(90deg,hsl(var(--role-primary)),hsl(var(--status-info)))",
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Compliance Modal — in-place popup */}
      <ComplianceModal
        isOpen={!!modalData}
        onClose={() => setModalData(null)}
        data={
          modalData
            ? {
                kategori: modalData.kategori,
                skor: modalData.skor,
                trend: modalData.trend,
                trendValue: modalData.trendValue,
                entities: modalData.entities,
              }
            : null
        }
      />
    </>
  )
})
