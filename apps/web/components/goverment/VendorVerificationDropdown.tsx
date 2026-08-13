"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  Star,
  Timer,
  XCircle,
} from "lucide-react";

import {
  sppgList,
  vendorList,
  vendorSekolahList,
  type KategoriVendor,
  type Vendor,
} from "@/lib/mbgdummydata";
import { cn } from "@/lib/utils";

type VerificationStatus = "lulus" | "tinjau" | "gagal";

type VendorVerification = {
  status: VerificationStatus;
  requiredCerts: string[];
  missingCerts: string[];
  issues: string[];
  suggestedActions: string[];
};

function requiredCertsFor(kategori: KategoriVendor): string[] {
  switch (kategori) {
    case "katering":
      return ["Halal MUI", "BPOM"];
    case "logistik":
      return ["ISO 9001"];
    case "supplier_bahan":
      return ["Halal MUI"];
    default:
      return [];
  }
}

function verifyVendor(v: Vendor): VendorVerification {
  const requiredCerts = requiredCertsFor(v.kategori);
  const missingCerts = requiredCerts.filter((c) => !v.sertifikasi.includes(c));

  const issues: string[] = [];
  const suggestedActions: string[] = [];

  if (v.status !== "aktif") {
    issues.push(`Status vendor tidak aktif (${v.status}).`);
    suggestedActions.push("Lakukan verifikasi ulang dan aktivasi status vendor.");
  }

  if (missingCerts.length > 0) {
    issues.push(`Sertifikasi wajib belum lengkap: ${missingCerts.join(", ")}.`);
    suggestedActions.push("Unggah dan validasi dokumen sertifikasi wajib.");
  }

  if (v.on_time_rate < 90) {
    issues.push(`On-time rate rendah (${v.on_time_rate.toFixed(1)}%).`);
    suggestedActions.push("Jadwalkan audit SLA dan rencana perbaikan ketepatan waktu.");
  }

  if (v.rating < 4.0) {
    issues.push(`Rating rendah (${v.rating.toFixed(1)}).`);
    suggestedActions.push("Tinjau keluhan operasional dan lakukan tindakan korektif.");
  }

  let status: VerificationStatus = "lulus";
  if (v.status !== "aktif" || missingCerts.length > 0) status = "gagal";
  else if (v.on_time_rate < 95 || v.rating < 4.5) status = "tinjau";

  return {
    status,
    requiredCerts,
    missingCerts,
    issues,
    suggestedActions: Array.from(new Set(suggestedActions)),
  };
}

function statusBadge(status: VerificationStatus) {
  if (status === "lulus") {
    return {
      label: "Lulus",
      cls: "bg-emerald-100 text-emerald-900 border-emerald-300 font-black",
      icon: CheckCircle2,
    };
  }
  if (status === "tinjau") {
    return {
      label: "Perlu Tinjau",
      cls: "bg-amber-100 text-amber-900 border-amber-300 font-black",
      icon: AlertTriangle,
    };
  }
  return {
    label: "Gagal",
    cls: "bg-red-100 text-red-900 border-red-300 font-black",
    icon: XCircle,
  };
}

function kategoriLabel(kategori: KategoriVendor) {
  return kategori === "supplier_bahan"
    ? "Supplier Bahan"
    : kategori === "katering"
      ? "Katering"
      : "Logistik";
}

function statusRank(s: VerificationStatus) {
  if (s === "gagal") return 0;
  if (s === "tinjau") return 1;
  return 2;
}

function Pill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide",
        className
      )}
    >
      {children}
    </span>
  );
}

export function VendorVerificationDropdown() {
  const [expandedVendorId, setExpandedVendorId] = useState<number | null>(null);

  const usedVendors = useMemo(() => {
    const usedIds = new Set<number>();
    for (const vs of vendorSekolahList) usedIds.add(vs.vendor_id);
    for (const sppg of sppgList) usedIds.add(sppg.vendor_id);

    const vendors = vendorList.filter((v) => usedIds.has(v.id));
    return vendors.length > 0 ? vendors : vendorList;
  }, []);

  const vendorsWithVerification = useMemo(() => {
    return usedVendors
      .map((v) => ({ v, ver: verifyVendor(v) }))
      .sort((a, b) => {
        const r = statusRank(a.ver.status) - statusRank(b.ver.status);
        if (r !== 0) return r;
        return a.v.nama.localeCompare(b.v.nama);
      });
  }, [usedVendors]);

  const counts = useMemo(() => {
    const base = { total: vendorsWithVerification.length, gagal: 0, tinjau: 0, lulus: 0 };
    for (const it of vendorsWithVerification) base[it.ver.status] += 1;
    return base;
  }, [vendorsWithVerification]);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-300 bg-white">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6 bg-slate-50/50">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-[#213555] text-white shadow-xs">
            <BadgeCheck className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-wide text-slate-800">
              Vendor digunakan
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900">
              Hasil verifikasi vendor
            </h2>
            <p className="mt-1 text-xs font-bold text-slate-700">
              Klik vendor untuk melihat detail—terutama yang{" "}
              <span className="font-black text-red-700">gagal</span> atau{" "}
              <span className="font-black text-amber-800">perlu tinjau</span>.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <Pill className="border-slate-300 bg-white text-slate-900 font-black">Total {counts.total}</Pill>
          {counts.gagal > 0 ? (
            <Pill className="border-red-300 bg-red-100 text-red-900 font-black">
              {counts.gagal} gagal
            </Pill>
          ) : null}
          {counts.tinjau > 0 ? (
            <Pill className="border-amber-300 bg-amber-100 text-amber-900 font-black">
              {counts.tinjau} tinjau
            </Pill>
          ) : null}
          {counts.lulus > 0 ? (
            <Pill className="border-emerald-300 bg-emerald-100 text-emerald-900 font-black">
              {counts.lulus} lulus
            </Pill>
          ) : null}
        </div>
      </div>

      <div className="divide-y divide-slate-200">
        {vendorsWithVerification.map(({ v, ver }) => {
          const badge = statusBadge(ver.status);
          const Icon = badge.icon;
          const isExpanded = expandedVendorId === v.id;

          return (
            <motion.div key={v.id} layout className="bg-white">
              <button
                type="button"
                onClick={() => setExpandedVendorId(isExpanded ? null : v.id)}
                aria-expanded={isExpanded}
                className={cn(
                  "w-full px-5 py-4 sm:px-6 text-left transition-colors hover:bg-slate-100/80",
                  ver.status === "gagal"
                    ? "bg-red-50/60"
                    : ver.status === "tinjau"
                      ? "bg-amber-50/60"
                      : undefined
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-black text-slate-900">{v.nama}</p>
                      <Pill className="border-slate-300 bg-slate-100 text-slate-800 font-black">
                        {kategoriLabel(v.kategori)}
                      </Pill>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-black uppercase tracking-wide",
                          badge.cls
                        )}
                      >
                        <Icon className="size-3.5" />
                        {badge.label}
                      </span>
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-4">
                      <span className="flex items-center gap-1 text-xs font-extrabold text-slate-800">
                        <Timer className="size-4 text-[#213555]" aria-hidden />
                        {v.on_time_rate.toFixed(1)}% tepat waktu
                      </span>
                      <span className="flex items-center gap-1 text-xs font-extrabold text-slate-800">
                        <Star className="size-4 text-amber-600 fill-amber-500" aria-hidden />
                        {v.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <ChevronDown
                    className={cn(
                      "mt-1 size-5 shrink-0 text-slate-700 transition-transform",
                      isExpanded && "rotate-180"
                    )}
                    aria-hidden
                  />
                </div>
              </button>

              <AnimatePresence>
                {isExpanded ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-slate-200"
                  >
                    <div className="px-5 pb-5 pt-3 sm:px-6 bg-slate-50/50">
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                          <p className="text-xs font-black uppercase tracking-wide text-slate-800">
                            Temuan
                          </p>
                          {ver.issues.length === 0 ? (
                            <p className="mt-2 text-xs font-bold text-slate-700">Tidak ada temuan.</p>
                          ) : (
                            <ul className="mt-2 space-y-2 text-xs font-bold text-slate-900">
                              {ver.issues.map((issue) => (
                                <li key={issue} className="flex gap-2">
                                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-red-600" aria-hidden />
                                  <span className="leading-relaxed">{issue}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                          <p className="text-xs font-black uppercase tracking-wide text-slate-800">
                            Rekomendasi tindakan
                          </p>
                          {ver.suggestedActions.length === 0 ? (
                            <p className="mt-2 text-xs font-bold text-slate-700">Tidak ada rekomendasi.</p>
                          ) : (
                            <ul className="mt-2 space-y-2 text-xs font-bold text-slate-900">
                              {ver.suggestedActions.map((action) => (
                                <li key={action} className="flex gap-2">
                                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#213555]" aria-hidden />
                                  <span className="leading-relaxed">{action}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

