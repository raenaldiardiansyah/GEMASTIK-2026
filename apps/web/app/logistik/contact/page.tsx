"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, MessageSquare, Mail, AlertTriangle, ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DashboardShell } from "@/components/ui/dashboard-shell";

export default function LogistikContact() {
  const [subject, setSubject] = useState("");
  const [detail, setDetail] = useState("");
  const [category, setCategory] = useState("Kendaraan Bermasalah");
  const [priority, setPriority] = useState("Sedang - Kuning");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Tiket kendala logistik berhasil dikirim! (Simulasi)", {
        description: `ID Tiket: TIKET-${Math.floor(1000 + Math.random() * 9000)} · Tim Dispatcher akan segera merespon.`,
      });
      setSubject("");
      setDetail("");
    }, 600);
  };

  return (
    <DashboardShell
      badge={<Badge variant="outline" className="border-emerald-300 bg-emerald-100 text-emerald-950 font-extrabold px-3 py-1 text-xs shadow-2xs">Portal Logistik · Respon Cepat 24/7</Badge>}
      title="Pusat Bantuan &amp; Dispatcher Logistik"
      description="Hadapi kendala rute, penjadwalan, atau teknis armada? Laporkan masalah Anda secara real-time kepada operator pusat untuk penyelesaian tercepat."
      actions={
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="rounded-xl border-slate-300 text-slate-800 hover:bg-slate-100 font-extrabold text-xs shadow-xs">
            <Link href="/logistik/dashboard">
              <ArrowLeft className="w-4 h-4 mr-1.5 text-slate-600" />
              Kembali ke Dashboard
            </Link>
          </Button>
        </div>
      }
    >
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Card Info Dispatcher (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-xs p-6 space-y-5">
            <div>
              <h3 className="text-lg font-black text-slate-900">Hubungi Dispatcher Pusat</h3>
              <p className="text-xs text-slate-600 font-medium mt-1">
                Tim Pengendali Jaringan siap menerima laporan kritis 24/7. Hubungi kami secepatnya jika terdapat kendala berisiko tinggi.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/70 shadow-2xs">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">Hotline Darurat Armada</p>
                  <p className="text-base font-black text-emerald-950 font-mono">1-500-LOG-BOGA</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/80 shadow-2xs">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">WhatsApp Tim Rute</p>
                  <p className="text-base font-black text-slate-900 font-mono">+62 811 2345 6789</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/80 shadow-2xs">
                <div className="w-10 h-10 bg-slate-100 text-slate-700 border border-slate-300 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Layanan</p>
                  <p className="text-sm font-black text-slate-900 font-mono">logistik@gizantara.go.id</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-amber-300 bg-amber-50/80 p-5 shadow-xs">
            <h4 className="text-xs font-black text-amber-950 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4 text-amber-700" /> SOP Keadaan Darurat Lapangan
            </h4>
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              Apabila terjadi ban bocor, kecelakaan, atau makanan tumpah, tekan tombol <strong>Darurat SOS</strong> di aplikasi armada terlebih dahulu sebelum menelepon hotline. Server akan otomatis mengunci koordinat GPS kendaraan Anda.
            </p>
          </div>
        </div>

        {/* Form Laporan (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-100/60">
              <h3 className="text-base font-black text-slate-900">Formulir Laporan / Tiket Kendala Armada</h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Kirim tiket insiden logistik untuk ditangani langsung oleh dispatcher.
              </p>
            </div>
            
            <form className="p-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="subject" className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">
                  Subjek / ID Rute
                </Label>
                <Input
                  id="subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Misal: Kendaraan RUTE-AG-04 Mengalami Mogok Mesin"
                  className="h-10 rounded-xl border-slate-300 bg-white text-xs font-semibold text-slate-900 shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category" className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">
                    Kategori Kendala
                  </Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs font-bold text-slate-900 shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
                  >
                    <option value="Kendaraan Bermasalah">Kendaraan Bermasalah</option>
                    <option value="Masalah Makanan/Porsi">Masalah Makanan/Porsi</option>
                    <option value="Keterlambatan Ekstrim">Keterlambatan Ekstrim</option>
                    <option value="Sistem GPS Mati">Sistem GPS Mati</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="priority" className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">
                    Level Prioritas
                  </Label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs font-bold text-slate-900 shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
                  >
                    <option value="Sedang - Kuning">Sedang - Kuning</option>
                    <option value="Tinggi - Oranye">Tinggi - Oranye</option>
                    <option value="Kritis - Merah">Kritis - Merah</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="detail" className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">
                  Detail &amp; Kronologi Laporan
                </Label>
                <Textarea
                  id="detail"
                  rows={4}
                  required
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  placeholder="Jelaskan situasinya secara ringkas, lokasi terkini, dan estimasi dampak ke jadwal tiba..."
                  className="rounded-xl border-slate-300 bg-white text-xs font-medium text-slate-900 shadow-2xs"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "Mengirim Laporan..." : "Kirim Tiket Laporan ke Dispatcher"}
                </Button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </DashboardShell>
  );
}
