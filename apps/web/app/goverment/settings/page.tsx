"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings, User, Bell, Shield, Sliders,
  Eye, EyeOff, Save, CheckCircle2, Monitor,
  Mail, Smartphone, LogIn, Clock, AlertTriangle
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

// ─── Threshold Slider ────────────────────────────────────────────────────────

function ThresholdSlider({
  label, value, min, max, unit, description, onChange, color = "navy",
}: {
  label: string; value: number; min: number; max: number;
  unit: string; description: string; onChange: (v: number) => void; color?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const trackColor = color === "red" ? "#dc2626" : color === "amber" ? "#d97706" : "#213555";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-black text-slate-900">{label}</p>
          <p className="text-xs text-slate-600 font-bold mt-0.5">{description}</p>
        </div>
        <div className="text-right">
          <span className="text-xl font-black tabular-nums text-slate-900" style={{ color: trackColor }}>{value}</span>
          <span className="text-xs font-bold text-slate-700 ml-1">{unit}</span>
        </div>
      </div>
      <div className="relative h-2.5 bg-slate-100 rounded-full border border-slate-200">
        <div
          className="absolute h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: trackColor }}
        />
        <input
          type="range" min={min} max={max} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 shadow-sm transition-all"
          style={{ left: `calc(${pct}% - 8px)`, borderColor: trackColor }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-bold text-slate-700 uppercase tracking-wider">
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-all border ${checked ? "bg-[#213555] border-[#213555]" : "bg-slate-200 border-slate-300"}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-all ${checked ? "left-5.5" : "left-0.5"}`} />
    </button>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({ title, description, icon, children }: {
  title: string; description: string; icon: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
      <div className="px-6 py-4.5 bg-slate-50/80 border-b border-slate-200 flex items-center gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-[#213555] flex items-center justify-center text-white shadow-xs">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-black text-slate-900">{title}</h2>
          <p className="text-xs font-bold text-slate-600 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Login Log Mock ──────────────────────────────────────────────────────────

const LOGIN_LOG = [
  { waktu: "13 Apr 2025, 07:22 WIB", device: "Chrome · Windows · Bandung", current: true },
  { waktu: "12 Apr 2025, 08:05 WIB", device: "Safari · macOS · Jakarta", current: false },
  { waktu: "11 Apr 2025, 07:50 WIB", device: "Chrome · Windows · Bandung", current: false },
];

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [saved, setSaved] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  // Profil
  const [nama, setNama] = useState("Renaldy Fauzan");
  const [jabatan, setJabatan] = useState("Kepala Bagian Pengadaan");
  const [instansi, setInstansi] = useState("BGN Jawa Barat");

  // Notifikasi toggles
  const [notifPref, setNotifPref] = useState({
    pengajuan: true, sengketa: true, keuangan: true, logistik: false, sistem: false,
  });
  const [channel, setChannel] = useState<"app" | "email" | "keduanya">("app");

  // Thresholds
  const [onTimeThreshold, setOnTimeThreshold] = useState(95);
  const [hetMarkupThreshold, setHetMarkupThreshold] = useState(15);
  const [driverIdleThreshold, setDriverIdleThreshold] = useState(30);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("gov-settings");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.nama) setNama(parsed.nama);
        if (parsed.jabatan) setJabatan(parsed.jabatan);
        if (parsed.instansi) setInstansi(parsed.instansi);
        if (parsed.notifPref) setNotifPref(parsed.notifPref);
        if (parsed.channel) setChannel(parsed.channel);
        if (parsed.onTimeThreshold) setOnTimeThreshold(parsed.onTimeThreshold);
        if (parsed.hetMarkupThreshold) setHetMarkupThreshold(parsed.hetMarkupThreshold);
        if (parsed.driverIdleThreshold) setDriverIdleThreshold(parsed.driverIdleThreshold);
      }
    } catch (e) {
      // safe fallback
    }
  }, []);

  const handleSave = (section: string) => {
    try {
      localStorage.setItem("gov-settings", JSON.stringify({
        nama, jabatan, instansi, notifPref, channel, onTimeThreshold, hetMarkupThreshold, driverIdleThreshold
      }));
    } catch (e) {
      // safe fallback
    }
    setSaved(section);
    setTimeout(() => setSaved(null), 2500);
  };

  const SaveButton = ({ section }: { section: string }) => (
    <motion.button
      onClick={() => handleSave(section)}
      whileTap={{ scale: 0.97 }}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-xs ${
        saved === section
          ? "bg-emerald-600 text-white"
          : "bg-[#213555] hover:bg-[#1b2b45] text-white"
      }`}
    >
      {saved === section ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
      {saved === section ? "Tersimpan!" : "Simpan"}
    </motion.button>
  );

  return (
    <div className="p-6 space-y-6 min-h-full bg-background text-foreground w-full">

      {/* Page Header */}
      <PageHeader
        title={
          <span className="inline-flex items-center gap-2.5">
            <span className="size-6 inline-flex items-center justify-center rounded-xl bg-[#213555] text-white shadow-xs">
              <Settings className="size-4" aria-hidden />
            </span>
            <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-900">Pengaturan</span>
          </span>
        }
        subtitle="Konfigurasi profil, preferensi notifikasi, ambang batas alert, dan keamanan akun"
      />

      {/* 2-Column Grid Layout — Fills entire screen width and balances vertical height */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* Left Column */}
        <div className="space-y-6">
          {/* ── Seksi 1: Profil & Akun ── */}
          <SectionCard title="Profil & Akun" description="Informasi identitas pejabat dan kredensial akses portal" icon={<User className="w-4 h-4" />}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Nama Lengkap", value: nama, onChange: setNama },
                  { label: "Jabatan", value: jabatan, onChange: setJabatan },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1.5">{f.label}</label>
                    <input
                      value={f.value}
                      onChange={e => f.onChange(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#213555]/20 focus:border-[#213555] focus:bg-white outline-none transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1.5">Instansi / Lembaga</label>
                <input
                  value={instansi}
                  onChange={e => setInstansi(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#213555]/20 focus:border-[#213555] focus:bg-white outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1.5">Ganti Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Masukkan password baru..."
                    className="w-full px-4 py-2.5 pr-10 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#213555]/20 focus:border-[#213555] focus:bg-white outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <SaveButton section="profil" />
              </div>
            </div>
          </SectionCard>

          {/* ── Seksi 2: Preferensi Notifikasi ── */}
          <SectionCard title="Preferensi Notifikasi" description="Pilih kategori dan channel pengiriman notifikasi yang ingin diterima" icon={<Bell className="w-4 h-4" />}>
            <div className="space-y-5">
              {/* Category Toggles */}
              <div className="space-y-3">
                <p className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Kategori Aktif</p>
                {([
                  { key: "pengajuan", label: "Pengajuan SBT", desc: "Status persetujuan dan penolakan vendor" },
                  { key: "sengketa", label: "Sengketa & Arbitrase", desc: "Kasus baru dan batas waktu BGN" },
                  { key: "keuangan", label: "Keuangan", desc: "Verifikasi pembayaran, audit, dan transaksi" },
                  { key: "logistik", label: "Logistik", desc: "Keterlambatan pengiriman dan anomali armada" },
                  { key: "sistem", label: "Sistem", desc: "Pembaruan HET dan laporan otomatis" },
                ] as const).map(item => (
                  <div key={item.key} className="flex items-center justify-between py-3 px-4 bg-slate-50/80 rounded-xl border border-slate-200">
                    <div>
                      <p className="text-xs font-black text-slate-900">{item.label}</p>
                      <p className="text-xs font-bold text-slate-600 mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle
                      checked={notifPref[item.key]}
                      onChange={v => setNotifPref(prev => ({ ...prev, [item.key]: v }))}
                    />
                  </div>
                ))}
              </div>

              {/* Channel */}
              <div>
                <p className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Channel Pengiriman</p>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { key: "app", label: "In-App", icon: <Monitor className="w-4 h-4" /> },
                    { key: "email", label: "Email", icon: <Mail className="w-4 h-4" /> },
                    { key: "keduanya", label: "Keduanya", icon: <Smartphone className="w-4 h-4" /> },
                  ] as const).map(c => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setChannel(c.key)}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all ${
                        channel === c.key ? "border-[#213555] bg-[#213555] text-white shadow-xs font-extrabold" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold"
                      }`}
                    >
                      {c.icon}
                      <span className="text-xs font-black uppercase tracking-wider">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <SaveButton section="notifikasi" />
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* ── Seksi 3: Ambang Batas Sistem ── */}
          <SectionCard title="Ambang Batas Sistem" description="Nilai threshold yang mengontrol perilaku alert dan gateway di seluruh dashboard" icon={<Sliders className="w-4 h-4" />}>
            <div className="space-y-6">
              <div className="p-3.5 bg-indigo-50/80 border border-indigo-200 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-indigo-700 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-indigo-900 leading-relaxed">
                  Perubahan nilai ini langsung mempengaruhi kapan alert muncul, kapan gateway kondisional aktif, dan kapan anomali terflag di peta pengawasan.
                </p>
              </div>

              <ThresholdSlider
                label="Batas On-Time Rate"
                description="Alert muncul & tombol gateway ke Verifikasi aktif jika On-Time Rate turun di bawah nilai ini"
                value={onTimeThreshold}
                min={80}
                max={100}
                unit="%"
                onChange={setOnTimeThreshold}
                color="navy"
              />

              <div className="border-t border-slate-200" />

              <ThresholdSlider
                label="Batas Mark-up HET"
                description="Vendor otomatis diblokir jika harga yang ditawarkan melebihi HET sebesar nilai ini"
                value={hetMarkupThreshold}
                min={5}
                max={50}
                unit="%"
                onChange={setHetMarkupThreshold}
                color="amber"
              />

              <div className="border-t border-slate-200" />

              <ThresholdSlider
                label="Durasi Diam Supir"
                description="Supir yang tidak bergerak melebihi durasi ini akan otomatis diflag sebagai anomali di peta pengawasan"
                value={driverIdleThreshold}
                min={10}
                max={120}
                unit=" mnt"
                onChange={setDriverIdleThreshold}
                color="red"
              />

              <div className="flex justify-end pt-2">
                <SaveButton section="threshold" />
              </div>
            </div>
          </SectionCard>

          {/* ── Seksi 4: Keamanan ── */}
          <SectionCard title="Keamanan & Sesi" description="Log aktivitas login dan sesi aktif akun pejabat" icon={<Shield className="w-4 h-4" />}>
            <div className="space-y-4">
              {/* Policy Banner */}
              <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-black text-emerald-900">Autentikasi 2FA Terverifikasi</p>
                    <p className="text-[10px] text-emerald-700 font-bold">Standard enkripsi BGN TLS 1.3 & SHA-256</p>
                  </div>
                </div>
                <span className="text-[10px] font-black px-2.5 py-0.5 bg-emerald-600 text-white rounded-full uppercase">
                  Aktif
                </span>
              </div>

              <p className="text-xs font-extrabold text-slate-800 uppercase tracking-wider pt-1">Log Aktivitas Login</p>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {LOGIN_LOG.map((log, i) => (
                  <div key={i} className={`flex items-center justify-between p-3.5 bg-white ${log.current ? "bg-emerald-50/30" : ""}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${log.current ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                        <LogIn className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{log.device}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span className="text-xs text-slate-600 font-bold">{log.waktu}</span>
                        </div>
                      </div>
                    </div>
                    {log.current && (
                      <span className="text-[10px] font-black px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full">
                        Sesi Ini
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Logout all active sessions */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => alert("Sesi di perangkat lain telah diakhiri.")}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                >
                  Keluar dari Perangkat Lain
                </button>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
