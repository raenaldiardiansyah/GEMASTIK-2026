"use client";

import { CheckCircle2, SearchCheck, ShieldCheck, MapPin } from "lucide-react";

interface AuthPreviewPanelProps {
  accent: string;
  label: string;
  headline: string;
  points: string[];
}

const auditRows = [
  { node: "Vendor", detail: "NIB & NPWP tervalidasi", status: "Verified" },
  { node: "PO-2026-0001", detail: "Diterima QC · Goods Received", status: "Diterima" },
  { node: "Bukti Transfer", detail: "OCR cocok · transfer manual SPPG", status: "PAYMENT" },
  { node: "Hash Ledger", detail: "a3f9…8c1e · immutable", status: "Audited" },
];

export function AuthPreviewPanel({ accent, label, headline, points }: AuthPreviewPanelProps) {
  return (
    <div className="relative hidden md:flex md:w-1/2 flex-col self-stretch overflow-hidden">
      {/* Navy base, bukan foto */}
      <div className="absolute inset-0 bg-[#0a0e1a]" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(160deg, ${accent}33 0%, transparent 55%)` }}
      />

      <div className="relative mt-auto p-6 w-full">
        <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
              <ShieldCheck className="w-3.5 h-3.5" />
              Ledger Simulasi · {label}
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 text-emerald-300 text-[9px] font-bold px-2 py-0.5">
              <MapPin className="w-3 h-3" /> geofence 50m
            </span>
          </div>
          <div className="space-y-2">
            {auditRows.map((row) => (
              <div key={row.node} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{row.node}</p>
                  <p className="text-[10px] text-white/50 truncate">{row.detail}</p>
                </div>
                <span className="text-[9px] font-bold text-emerald-300 shrink-0">{row.status}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 border-t border-white/10 pt-2.5 flex items-center gap-2 text-[10px] font-mono text-white/40">
            <SearchCheck className="w-3 h-3 text-cyan-300" />
            OCR payment verified · 0 anomali
          </div>
        </div>

        <div className="mb-4 flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: accent }}
          />
          <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/70">
            {label}
          </span>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
          {headline}
        </h2>
        <ul className="mt-3 space-y-2 text-[12px] text-white/80">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-2">
              <span
                className="mt-[6px] h-1.5 w-1.5 rounded-full shrink-0"
                style={{ background: accent }}
              />
              <span className="leading-relaxed">{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}