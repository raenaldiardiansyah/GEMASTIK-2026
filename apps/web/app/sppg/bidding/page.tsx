"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarClock,
  Gavel,
  Plus,
  Search,
  Settings2,
} from "lucide-react";

import { getTenderSppg, type TenderWeights } from "@/lib/bidding";
import { createTender, useBiddingSnapshot } from "@/lib/bidding-store";
import { sppgList } from "@/lib/mbgdummydata";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

function formatDate(dateIso: string) {
  return new Date(dateIso).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function SppgBiddingPage() {
  const snapshot = useBiddingSnapshot();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "OPEN" | "AWARDED" | "CLOSED"
  >("ALL");
  const [selectedSppgId, setSelectedSppgId] = useState<number>(
    sppgList[0]?.id ?? 1
  );
  const [createOpen, setCreateOpen] = useState(false);

  const [draftTitle, setDraftTitle] = useState("Tender Vendor MBG");
  const [draftCategory, setDraftCategory] = useState("Katering");
  const [draftQuantity, setDraftQuantity] = useState("12000");
  const [draftUnit, setDraftUnit] = useState("porsi");
  const [draftDeadline, setDraftDeadline] = useState("2026-05-05");
  const [draftWeights, setDraftWeights] = useState<{
    price: number;
    quality: number;
    distance: number;
  }>({
    price: 50,
    quality: 35,
    distance: 15,
  });

  const tenders = useMemo(() => {
    const q = query.trim().toLowerCase();
    return snapshot.tenders
      .filter((t) => t.sppgId === selectedSppgId)
      .filter((t) => (statusFilter === "ALL" ? true : t.status === statusFilter))
      .filter((t) => {
        if (!q) return true;
        return (
          t.id.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
        );
      });
  }, [query, selectedSppgId, snapshot.tenders, statusFilter]);

  function normalizeWeights(weights: {
    price: number;
    quality: number;
    distance: number;
  }): TenderWeights {
    const p = Math.max(0, weights.price);
    const q = Math.max(0, weights.quality);
    const d = Math.max(0, weights.distance);
    const sum = p + q + d || 1;
    return { price: p / sum, quality: q / sum, distance: d / sum };
  }

  return (
    <DashboardShell
      badge={<Badge variant="outline" className="border-cyan-300 bg-cyan-100 text-cyan-950 font-extrabold px-3 py-1 text-xs shadow-2xs">SPPG · Bidding Engine</Badge>}
      title="Bidding Vendor"
      description="Seleksi dan evaluasi proposal vendor berdasarkan harga, riwayat kualitas, jarak dapur, dan bobot SAW."
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="rounded-xl border-slate-300 text-slate-800 hover:bg-slate-100 font-extrabold text-xs shadow-xs">
            <Link href="/sppg/dashboard">
              Kembali
            </Link>
          </Button>
          <Button className="rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs shadow-md shadow-cyan-600/25 px-4" onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Buat Tender Baru
          </Button>
        </div>
      }
    >
      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-100/60 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-base font-black text-slate-900">Daftar Tender Pengadaan</p>
              <p className="text-xs font-medium text-slate-600 mt-0.5">
                Buka tender, terima penawaran harga, dan tetapkan pemenang.
              </p>
            </div>

            <div className="grid w-full gap-3 sm:max-w-md sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="sppg" className="text-[11px] font-bold text-slate-600">
                  SPPG Terpilih
                </Label>
                <select
                  id="sppg"
                  value={String(selectedSppgId)}
                  onChange={(e) => setSelectedSppgId(Number(e.target.value))}
                  className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs font-bold text-slate-900 shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500"
                >
                  {sppgList.map((s) => (
                    <option key={s.id} value={String(s.id)}>
                      {s.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="search" className="text-[11px] font-bold text-slate-600">
                  Cari Tender
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Judul / komoditas..."
                    className="h-10 rounded-xl border-slate-300 bg-white pl-8 text-xs font-semibold text-slate-900 shadow-2xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {tenders.length === 0 ? (
              <div className="p-12 text-center text-xs font-bold text-slate-400">
                Belum ada tender pengadaan aktif untuk SPPG ini.
              </div>
            ) : (
              tenders.map((tender) => {
                const sppg = getTenderSppg(tender);
                const bidCount = snapshot.bids.filter(
                  (b) => b.tenderId === tender.id
                ).length;
                return (
                  <Link
                    key={tender.id}
                    href={`/sppg/bidding/${tender.id}`}
                    className="group block p-5 transition-colors hover:bg-cyan-50/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-cyan-900 bg-cyan-100 px-2.5 py-0.5 rounded-md border border-cyan-300">
                            {tender.id}
                          </span>
                          <p className="truncate text-sm font-black text-slate-900 group-hover:text-cyan-700 transition-colors">
                            {tender.title}
                          </p>
                        </div>
                        <p className="mt-1.5 text-xs font-medium text-slate-500">
                          {sppg
                            ? `${sppg.nama} • Kec. ${sppg.kecamatan}, ${sppg.kota}`
                            : `SPPG #${tender.sppgId}`}
                        </p>
                      </div>
                      <Badge
                        className={`rounded-lg px-2.5 py-0.5 text-[10px] font-extrabold ${
                          tender.status === "OPEN" 
                            ? "bg-emerald-100 text-emerald-900 border border-emerald-300" 
                            : "bg-slate-100 text-slate-800 border border-slate-300"
                        }`}
                      >
                        {tender.status}
                      </Badge>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-100 pt-3">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
                        <span className="inline-flex items-center gap-1 text-slate-700 font-bold">
                          <CalendarClock className="size-3.5 text-cyan-700" /> {formatDate(tender.deadline)}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="tabular-nums text-slate-900 font-black">
                          {tender.quantity.toLocaleString("id-ID")} {tender.unit}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-600 font-medium">{tender.category}</span>
                        <span className="text-slate-300">•</span>
                        <span className="tabular-nums font-extrabold text-cyan-900 bg-cyan-100 px-2.5 py-0.5 rounded border border-cyan-300">{bidCount} penawaran masuk</span>
                      </div>

                      <div className="inline-flex items-center gap-1.5 text-xs font-black text-cyan-700 group-hover:underline">
                        Evaluasi Vendor <Gavel className="size-3.5 transition-transform group-hover:scale-110" />
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs h-fit space-y-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-black text-slate-900">
              <Settings2 className="size-4 text-cyan-700" /> Filter Status
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Saring daftar pengadaan sesuai tahap operasional.
            </p>
          </div>

          <Separator className="bg-slate-200" />

          <div className="space-y-1.5">
            <Label htmlFor="status" className="text-xs font-bold text-slate-700">
              Status Tender
            </Label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs font-bold text-slate-900 shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500"
            >
              <option value="ALL">Semua</option>
              <option value="OPEN">OPEN</option>
              <option value="AWARDED">AWARDED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
        </aside>
      </section>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Buat tender baru</DialogTitle>
            <DialogDescription>
              Tender ini akan muncul di portal vendor untuk menerima penawaran.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title" className="text-xs text-muted-foreground">
                Judul
              </Label>
              <Input
                id="title"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                className="h-10 rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-xs text-muted-foreground">
                Kategori
              </Label>
              <Input
                id="category"
                value={draftCategory}
                onChange={(e) => setDraftCategory(e.target.value)}
                className="h-10 rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-xs text-muted-foreground">
                Deadline
              </Label>
              <Input
                id="deadline"
                type="date"
                value={draftDeadline}
                onChange={(e) => setDraftDeadline(e.target.value)}
                className="h-10 rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qty" className="text-xs text-muted-foreground">
                Kuantitas
              </Label>
              <Input
                id="qty"
                inputMode="numeric"
                value={draftQuantity}
                onChange={(e) => setDraftQuantity(e.target.value)}
                className="h-10 rounded-2xl tabular-nums"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit" className="text-xs text-muted-foreground">
                Unit
              </Label>
              <Input
                id="unit"
                value={draftUnit}
                onChange={(e) => setDraftUnit(e.target.value)}
                className="h-10 rounded-2xl"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className="text-xs text-muted-foreground">
                Bobot penilaian (%, demo)
              </Label>
              <div className="grid gap-3 sm:grid-cols-3">
                {(
                  [
                    ["price", "Harga"],
                    ["quality", "Kualitas"],
                    ["distance", "Jarak"],
                  ] as const
                ).map(([key, label]) => (
                  <div
                    key={key}
                    className="rounded-2xl border border-border/70 bg-muted/20 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold">{label}</p>
                      <p className="text-xs font-semibold tabular-nums">
                        {draftWeights[key]}%
                      </p>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={draftWeights[key]}
                      onChange={(e) =>
                        setDraftWeights((prev) => ({
                          ...prev,
                          [key]: Number(e.target.value),
                        }))
                      }
                      className="mt-2 w-full"
                    />
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Sistem akan menormalisasi bobot (tidak harus pas 100%).
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => setCreateOpen(false)}
            >
              Batal
            </Button>
            <Button
              className="rounded-full"
              onClick={() => {
                const weights = normalizeWeights(draftWeights);
                const tender = createTender({
                  sppgId: selectedSppgId,
                  title: draftTitle.trim() || "Tender Vendor MBG",
                  category: draftCategory.trim() || "Katering",
                  quantity: Number(draftQuantity) || 0,
                  unit: draftUnit.trim() || "porsi",
                  deadline: draftDeadline || new Date().toISOString().slice(0, 10),
                  weights,
                });
                setCreateOpen(false);
                window.location.href = `/sppg/bidding/${tender.id}`;
              }}
            >
              Buat & buka
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}

