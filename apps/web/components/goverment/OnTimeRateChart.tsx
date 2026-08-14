"use client"

import { useMemo, memo } from "react"
import { useRouter } from "next/navigation"
import { useDashboardFilter } from "./DashboardFilterContext"
import { getOnTimeRateSeries } from "@/lib/mbgdummydata"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts"
import { cn } from "@/lib/utils"
import { ExternalLink, TrendingDown, TrendingUp } from "lucide-react"

const TARGET = 95

export const OnTimeRateChart = memo(function OnTimeRateChart() {
  const { filter } = useDashboardFilter()
  const router = useRouter()
  const activeJenjang = filter.jenjang.length ? filter.jenjang : undefined
  const { series, current, prev } = useMemo(
    () => getOnTimeRateSeries(filter.periode, activeJenjang),
    [filter.periode, filter.jenjang]
  )

  const isBelowTarget = current < TARGET
  const delta = (current - prev).toFixed(1)
  const isDown = current < prev

  const firstLabel = series[0]?.label
  const lastLabel = series[series.length - 1]?.label

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-surface p-3.5 sm:p-4 shadow-[var(--shadow-card)]",
        isBelowTarget ? "border-status-warning/30" : "border-border"
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-1.5">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-800">
              On-Time Rate
            </p>
            {isBelowTarget && (
              <button
                onClick={() => router.push("/goverment/verifikasi")}
                title="Lihat keterlambatan aktif"
                aria-label="Lihat keterlambatan aktif di halaman verifikasi"
                className="flex items-center justify-center p-1 rounded-md border border-status-warning/30 bg-status-warning-bg text-status-warning hover:bg-status-warning-bg/70 transition-colors shadow-xs"
              >
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
          <p className={cn("text-xl font-black tracking-tight tabular-nums", isBelowTarget ? "text-status-warning" : "text-status-success")}>
            {current}%
          </p>
        </div>
        {/* Delta vs prev — anchoring */}
        <div className="flex items-center gap-1.5 text-xs">
          {isDown
            ? <TrendingDown className="w-3.5 h-3.5 text-status-danger" aria-hidden />
            : <TrendingUp className="w-3.5 h-3.5 text-status-success" aria-hidden />}
          <span className={cn("font-bold tabular-nums", isDown ? "text-status-danger" : "text-status-success")}>
            {isDown ? "" : "+"}{delta}%
          </span>
          <span className="text-slate-500 font-medium">vs lalu ({prev}%)</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={95}>
        <AreaChart data={series} margin={{ left: 4, right: 8, top: 6, bottom: 2 }}>
          <defs>
            <linearGradient id="onTimeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isBelowTarget ? "hsl(var(--status-warning))" : "hsl(var(--status-success))"} stopOpacity={0.15} />
              <stop offset="95%" stopColor={isBelowTarget ? "hsl(var(--status-warning))" : "hsl(var(--status-success))"} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Only 3 Y labels: 0, 95, 100 */}
          <YAxis
            domain={[0, 100]}
            ticks={[0, TARGET, 100]}
            tick={({ x, y, payload }) => (
              <text
                x={Number(x)}
                y={Number(y) + 4}
                textAnchor="end"
                fontSize={12}
                fontWeight={600}
                fill={(payload.value as number) === TARGET ? "hsl(var(--status-danger))" : "#334155"}
              >
                {payload.value}%
              </text>
            )}
            axisLine={false}
            tickLine={false}
            width={42}
          />

          {/* Only first & last X label */}
          <XAxis
            dataKey="label"
            tick={({ x, y, payload }) => {
              if (payload.value !== firstLabel && payload.value !== lastLabel) return <g />
              return (
                <text x={Number(x)} y={Number(y) + 14} textAnchor="middle" fontSize={12} fontWeight={700} fill="#1e293b">
                  {payload.value}
                </text>
              )
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <div className="rounded-xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow-md)]">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                  <p className={cn("text-sm font-semibold", (payload[0].value as number) < TARGET ? "text-status-warning" : "text-status-success")}>
                    {payload[0].value}%
                  </p>
                </div>
              ) : null
            }
            cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
          />

          {/* Target line — the only gridline */}
          <ReferenceLine
            y={TARGET}
            stroke="hsl(var(--status-danger))"
            strokeWidth={1}
            strokeDasharray="4 4"
            aria-label="Garis target on-time rate 95%"
          />

          <Area
            type="monotone"
            dataKey="rate"
            stroke={isBelowTarget ? "hsl(var(--status-warning))" : "hsl(var(--status-success))"}
            strokeWidth={2}
            fill="url(#onTimeGrad)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
})
