"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgePercent,
  ClipboardList,
  PackagePlus,
  QrCode,
  Wallet,
  Gavel,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

import { tenderMaterials } from "@/lib/mbgdummydata";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function currency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

type CartItem = {
  id: number;
  name: string;
  type: string;
  price: number;
  quantity: number;
};

export default function SppgDashboardClient() {
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [qrOpen, setQrOpen] = useState(false);
  const [paymentPending, setPaymentPending] = useState(false);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tenderMaterials;
    return tenderMaterials.filter((m) => {
      return (
        m.name.toLowerCase().includes(q) ||
        m.type.toLowerCase().includes(q) ||
        String(m.id) === q
      );
    });
  }, [query]);

  const total = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const poPayload = useMemo(() => {
    if (cart.length === 0) return "";
    return JSON.stringify(
      {
        po_id: "PO-DEMO-0001",
        sppg_id: "SPPG-DEMO-01",
        items: cart.map((c) => ({
          id: c.id,
          name: c.name,
          qty: c.quantity,
          unit_price: c.price,
        })),
        total_amount_idr: total,
        issued_at: new Date().toISOString(),
      },
      null,
      0
    );
  }, [cart, total]);

  const qrImageUrl = useMemo(() => {
    if (!poPayload) return "";
    return `https://quickchart.io/qr?size=280&text=${encodeURIComponent(poPayload)}`;
  }, [poPayload]);

  const addToCart = (id: number) => {
    const material = tenderMaterials.find((m) => m.id === id);
    if (!material) return;

    setCart((prev) => {
      const existing = prev.find((p) => p.id === id);
      if (existing) {
        return prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p));
      }
      return [...prev, { id, name: material.name, type: material.type, price: material.price, quantity: 1 }];
    });
  };

  const updateQty = (id: number, quantity: number) => {
    setCart((prev) => {
      const nextQty = Math.max(0, Math.min(999, quantity));
      if (nextQty === 0) return prev.filter((p) => p.id !== id);
      return prev.map((p) => (p.id === id ? { ...p, quantity: nextQty } : p));
    });
  };

  return (
    <>
      <DashboardShell
        badge={<Badge variant="outline" className="border-cyan-300 bg-cyan-100 text-cyan-950 font-extrabold px-3 py-1 text-xs shadow-2xs">SPPG · Dapur Sentral</Badge>}
        title="E‑Katalog & PO Builder"
        description="Bangun Purchase Order (PO) dari katalog bahan pangan bersertifikasi. Alur 60-30-10 terintegrasi."
        actions={
          <div className="flex items-center gap-2">
            <Button
              className="rounded-xl bg-[#1E3A5F] hover:bg-slate-800 text-white font-black text-xs shadow-xs px-4 h-10"
              disabled={cart.length === 0}
              onClick={() => setQrOpen(true)}
            >
              <QrCode className="w-4 h-4 mr-1.5 text-emerald-400" />
              Generate QR PO ({cart.length})
            </Button>
          </div>
        }
      >
        <section className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" aria-label="Ringkasan SPPG">
          {[
            { label: "Sisa Anggaran (Simulasi)", value: currency(35_000_000), icon: Wallet },
            { label: "Guard Batas HET", value: "Aktif Terkunci", icon: BadgePercent },
            { label: "Draft PO Aktif", value: `${cart.length} Item`, icon: ClipboardList },
            { label: "Item Bahan Katalog", value: `${tenderMaterials.length} Komoditas`, icon: PackagePlus },
            { label: "Verifikasi Pembayaran", value: paymentPending ? "Menunggu OCR" : "Draft Siap", icon: Lock },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs transition-all hover:border-[#1E3A5F] hover:shadow-md flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-bold text-slate-500 leading-tight">{m.label}</p>
                <div className="rounded-xl bg-cyan-50 p-2 text-cyan-800 border border-cyan-200 shadow-2xs shrink-0">
                  <m.icon className="size-4" aria-hidden />
                </div>
              </div>
              <p className="mt-3 text-lg sm:text-xl font-black tracking-tight text-slate-900 tabular-nums truncate" title={m.value}>
                {m.value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="flex flex-col gap-3 p-5 border-b border-slate-200 bg-slate-100/60 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-base font-black text-slate-900">Katalog Bahan Pangan Terstandarisasi</p>
                <p className="text-xs font-medium text-slate-600 mt-0.5">
                  Pilih bahan pangan bergizi terverifikasi untuk menyusun Purchase Order.
                </p>
              </div>
              <div className="w-full sm:max-w-xs">
                <Input
                  id="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari beras, ayam, susu..."
                  className="h-10 rounded-xl border-slate-300 bg-white text-xs font-semibold text-slate-900 shadow-2xs focus:border-cyan-600"
                />
              </div>
            </div>

            <div className="p-5">
              <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-2xs">
                <Table>
                  <TableHeader className="bg-slate-100/90 border-b border-slate-200">
                    <TableRow>
                      <TableHead className="text-xs font-black text-slate-900">ID</TableHead>
                      <TableHead className="text-xs font-black text-slate-900">Nama Bahan</TableHead>
                      <TableHead className="text-xs font-black text-slate-900">Kategori</TableHead>
                      <TableHead className="text-right text-xs font-black text-slate-900">Harga Standar</TableHead>
                      <TableHead className="text-right text-xs font-black text-slate-900">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((m) => (
                      <TableRow key={m.id} className="hover:bg-cyan-50/40 border-b border-slate-100">
                        <TableCell className="font-mono text-xs font-bold text-slate-500">{m.id}</TableCell>
                        <TableCell className="font-extrabold text-slate-900 text-xs">{m.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="rounded-lg bg-cyan-100 text-cyan-900 border border-cyan-300 font-extrabold text-[10px] px-2.5 py-0.5">
                            {m.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-black text-xs text-slate-900 tabular-nums">{currency(m.price)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-lg border-cyan-300 text-cyan-800 bg-cyan-50/60 hover:bg-cyan-600 hover:text-white font-extrabold text-xs transition-all shadow-2xs"
                            onClick={() => addToCart(m.id)}
                          >
                            + Keranjang
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-200 bg-slate-100/60">
              <p className="text-base font-black text-slate-900">Keranjang Purchase Order</p>
              <p className="text-xs font-medium text-slate-600 mt-0.5">
                Kalkulasi volume logistik dan nominal anggaran otomatis.
              </p>
            </div>

            <div className="p-5 space-y-4 flex-1 flex flex-col">
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <ClipboardList className="w-9 h-9 text-slate-400 mb-2" />
                  <p className="text-xs font-black text-slate-800">Keranjang PO Kosong</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-1">Pilih komoditas bahan dari katalog di sebelah kiri.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                  {cart.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-black text-slate-900">{c.name}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{c.type}</p>
                        </div>
                        <Badge variant="secondary" className="shrink-0 text-xs font-black text-cyan-950 bg-white border border-slate-300 shadow-2xs tabular-nums px-2.5 py-0.5">
                          {currency(c.price)}
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3 pt-2.5 border-t border-slate-200">
                        <Label htmlFor={`qty-${c.id}`} className="text-xs font-bold text-slate-700">
                          Kuantitas (kg / unit)
                        </Label>
                        <Input
                          id={`qty-${c.id}`}
                          type="number"
                          value={c.quantity}
                          onChange={(e) => updateQty(c.id, Number(e.target.value))}
                          className="h-8 w-20 rounded-lg text-right font-black text-xs bg-white border-slate-300 tabular-nums shadow-2xs"
                          min={0}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Separator className="bg-slate-200" />

              <div className="flex items-center justify-between gap-3 bg-slate-100/90 p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-700">Total Anggaran PO:</span>
                <span className="text-lg font-black text-cyan-950 tabular-nums">{currency(total)}</span>
              </div>

              <Button
                className="w-full rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs py-3 shadow-md shadow-cyan-600/25"
                disabled={cart.length === 0}
                onClick={() => setQrOpen(true)}
              >
                <QrCode className="w-4 h-4 mr-1.5" />
                Generate QR Purchase Order
              </Button>
            </div>
          </aside>
        </section>
      </DashboardShell>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>QR Purchase Order (Demo)</DialogTitle>
            <DialogDescription>
              Payload ringkas untuk dokumen fisik + proses serah-terima. (UI-only.)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">PO</p>
              <p className="text-sm font-semibold">PO-DEMO-0001</p>
              <p className="mt-1 text-xs text-muted-foreground tabular-nums">{currency(total)}</p>
            </div>

            <div className="mx-auto w-fit rounded-2xl border border-border bg-card p-2">
              {qrImageUrl ? (
                <img src={qrImageUrl} alt="QR PO" className="h-64 w-64 rounded-xl" />
              ) : (
                <div className="flex h-64 w-64 items-center justify-center text-sm text-muted-foreground">
                  QR belum tersedia
                </div>
              )}
            </div>

            <Input value={poPayload} readOnly className="text-xs" />

            <Button
              variant="outline"
              className="w-full rounded-full"
              onClick={async () => {
                if (!poPayload) return;
                await navigator.clipboard.writeText(poPayload);
              }}
            >
              <QrCode data-icon="inline-start" />
              Salin Payload QR
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
