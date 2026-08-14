"use client"

import { useMemo, memo } from "react"

import { getDeliveryHeatmap } from "@/lib/mbgdummydata"

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]

function cellColor(t: number): string {
  const clamped = Math.max(0, Math.min(1, t))
  if (clamped <= 0.001) return "hsl(var(--surface-raised))"
  const alpha = 0.06 + clamped * 0.62
  return `hsl(var(--status-success) / ${alpha})`
}

export const DeliveryHeatmap = memo(function DeliveryHeatmap() {
  const { cells, avgPerHour } = useMemo(() => getDeliveryHeatmap(), [])

  const maxVol = Math.max(...cells.map((c) => c.volume), 1)
  const maxAvg = Math.max(...avgPerHour, 1)

  const byDay: Record<number, { hour: number; volume: number }[]> = {}
  cells.forEach((c) => {
    if (!byDay[c.day]) byDay[c.day] = []
    byDay[c.day].push({ hour: c.hour, volume: c.volume })
  })

  const activeDays = [1, 2, 3, 4, 5, 6]

  const peakHour = avgPerHour.indexOf(Math.max(...avgPerHour))
  const troughHour =
    avgPerHour.slice(6, 21).indexOf(Math.min(...avgPerHour.slice(6, 21))) + 6

  const hourMarks = [0, peakHour, troughHour, 23].filter(
    (v, i, a) => a.indexOf(v) === i
  )

  return (
    <section
      className="bg-surface rounded-xl border border-border p-3.5 sm:p-4 shadow-card"
      role="region"
      aria-label="Heatmap jam pengiriman"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-900">
            Pola Jam Pengiriman
          </p>
          <p className="mt-0.5 text-xs font-semibold text-slate-700">
            Volume porsi per jam · 7 hari
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2" aria-label="Legenda intensitas">
          <span className="text-[10px] text-slate-700 font-bold">Rendah</span>
          <div className="flex gap-1">
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => (
              <div
                key={t}
                className="w-3.5 h-3.5 rounded-full border border-border/60 shadow-2xs"
                style={{ background: cellColor(t) }}
                aria-hidden
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-700 font-bold">Tinggi</span>
        </div>
      </div>

      <div className="flex mb-1">
        <div className="w-8 shrink-0" aria-hidden />
        <div className="flex-1 relative h-4" aria-hidden>
          {hourMarks.map((h) => (
            <span
              key={h}
              className="absolute text-[10px] font-bold text-slate-700 -translate-x-1/2"
              style={{ left: `${(h / 23) * 100}%` }}
            >
              {String(h).padStart(2, "0")}
            </span>
          ))}
        </div>
      </div>

      <div
        className="flex flex-col gap-1.5"
        role="img"
        aria-label="Grid heatmap pengiriman per jam per hari"
      >
        {activeDays.map((day) => {
          const hours = byDay[day] ?? []
          return (
            <div key={day} className="flex items-center gap-1">
              <span
                className="w-8 shrink-0 text-[10px] font-bold text-slate-800 text-right pr-1.5"
                aria-label={DAY_NAMES[day]}
              >
                {DAY_NAMES[day]}
              </span>

              <div className="flex flex-1 gap-1">
                {Array.from({ length: 24 }, (_, h) => {
                  const cell = hours.find((c) => c.hour === h)
                  const vol = cell?.volume ?? 0
                  const t = vol / maxVol
                  const title = `${DAY_NAMES[day]} ${String(h).padStart(2, "0")}:00 — ${vol.toLocaleString("id-ID")} porsi`
                  return (
                    <div
                      key={h}
                      className="flex-1 h-5 sm:h-5.5 rounded-md sm:rounded-lg border border-border/50 transition-all hover:scale-110 shadow-2xs"
                      style={{ background: cellColor(t) }}
                      title={title}
                      aria-label={vol > 0 ? title : undefined}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex mt-3 gap-1 items-end" aria-label="Rata-rata volume per jam">
        <div className="w-8 shrink-0 text-[10px] font-bold text-muted-foreground text-right pr-1.5">
          Avg
        </div>
        <div className="flex flex-1 gap-1 items-end h-6">
          {avgPerHour.map((v, h) => {
            const pct = (v / maxAvg) * 100
            return (
              <div
                key={h}
                className="flex-1 rounded-full"
                style={{
                  height: `${Math.max(pct, 6)}%`,
                  background: "hsl(var(--status-info))",
                  opacity: 0.7,
                }}
                title={`Rata-rata jam ${h}: ${v.toLocaleString("id-ID")} porsi`}
                aria-hidden
              />
            )
          })}
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground mt-2 text-center">
        ↑ Rata-rata volume per jam sebagai referensi komparasi hari-hari di grid
      </p>
    </section>
  )
})

