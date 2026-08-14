"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Activity,
  Search,
  Filter,
  Truck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Wifi,
  Radio,
  Clock,
  School,
  Warehouse,
  ArrowRight,
  X,
} from "lucide-react";
import {
  deliveryList,
  vendorSekolahList,
  vendorList,
  sekolahList,
  sppgList,
  sppgSekolahList,
  type ArahPengiriman,
} from "@/lib/mbgdummydata";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";

// Deterministic jitter based on ID to avoid Math.random() SSR issues
const deterministicJitter = (base: number, id: number, maxOffset: number) => {
  const seed = id * 37 + 7;
  let s = seed >>> 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
  const offset = ((t ^ (t >>> 14)) >>> 0) / 0xffffffff * 2 - 1;
  return base + offset * maxOffset;
};

const MapSupervision = dynamic(() => import("@/components/goverment/MapSupervision"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse rounded-[40px]" />,
});

// ─── Types ──────────────────────────────────────────────────────────────────

type JenjangFilter = "SEMUA" | "SD" | "SMP" | "SMA";
type ArahFilter = "SEMUA" | ArahPengiriman;

interface ActiveDriver {
  id: string;
  name: string;
  vendorId: number;
  sekolahId: number;
  sppgId?: number;
  arah: ArahPengiriman;
  status: string;
  manifest: string;
  baseLat: number;
  baseLng: number;
  lat: number;
  lng: number;
  eta: string;
  vendorName: string;
  schoolName: string;
  jenjang: "SD" | "SMP" | "SMA";
}

// ─── Jenjang Badge ───────────────────────────────────────────────────────────

const JENJANG_COLOR: Record<string, string> = {
  SD:  "bg-sky-100  text-sky-600  border-sky-100",
  SMP: "bg-violet-100 text-violet-600 border-violet-100",
  SMA: "bg-rose-100 text-rose-600  border-rose-100",
};

const ARAH_COLOR: Record<ArahPengiriman, string> = {
  vendor_ke_sppg:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  sppg_ke_sekolah: "bg-teal-50 text-teal-700 border-teal-200",
};

const ARAH_LABEL: Record<ArahPengiriman, string> = {
  vendor_ke_sppg:  "Vendor → SPPG",
  sppg_ke_sekolah: "SPPG → Sekolah",
};

// ─── Main Page ───────────────────────────────────────────────────────────────

const PRESET_DRIVERS: ActiveDriver[] = [
  {
    id: "TRK-003",
    name: "Driver 3",
    vendorId: 1,
    sekolahId: 1,
    sppgId: 1,
    arah: "vendor_ke_sppg",
    status: "Moving",
    manifest: "680 Porsi Nasi Box",
    baseLat: -6.8950,
    baseLng: 107.6140,
    lat: -6.8950,
    lng: 107.6140,
    eta: "14:45",
    vendorName: "PT Agro Boga Nusantara",
    schoolName: "SMAN 3 Bandung",
    jenjang: "SMA",
  },
  {
    id: "TRK-012",
    name: "Driver 12",
    vendorId: 1,
    sekolahId: 6,
    sppgId: 1,
    arah: "vendor_ke_sppg",
    status: "Moving",
    manifest: "820 Porsi Nasi Box",
    baseLat: -6.8990,
    baseLng: 107.6220,
    lat: -6.8990,
    lng: 107.6220,
    eta: "14:45",
    vendorName: "PT Agro Boga Nusantara",
    schoolName: "SMAN 20 Bandung",
    jenjang: "SMA",
  },
  {
    id: "SPG-001",
    name: "Kurir SPPG 1",
    vendorId: 1,
    sekolahId: 1,
    sppgId: 1,
    arah: "sppg_ke_sekolah",
    status: "Moving",
    manifest: "680 Porsi — SPPG Dago Bandung",
    baseLat: -6.8980,
    baseLng: 107.6160,
    lat: -6.8980,
    lng: 107.6160,
    eta: "07:15",
    vendorName: "SPPG Dago Bandung",
    schoolName: "SMAN 3 Bandung",
    jenjang: "SMA",
  },
  {
    id: "SPG-002",
    name: "Kurir SPPG 2",
    vendorId: 1,
    sekolahId: 3,
    sppgId: 1,
    arah: "sppg_ke_sekolah",
    status: "Moving",
    manifest: "410 Porsi — SPPG Dago Bandung",
    baseLat: -6.8900,
    baseLng: 107.6140,
    lat: -6.8900,
    lng: 107.6140,
    eta: "07:15",
    vendorName: "SPPG Dago Bandung",
    schoolName: "SDN 061 Cihampelas",
    jenjang: "SD",
  },
  {
    id: "SPG-003",
    name: "Kurir SPPG 3",
    vendorId: 1,
    sekolahId: 6,
    sppgId: 1,
    arah: "sppg_ke_sekolah",
    status: "Moving",
    manifest: "820 Porsi — SPPG Dago Bandung",
    baseLat: -6.9020,
    baseLng: 107.6250,
    lat: -6.9020,
    lng: 107.6250,
    eta: "07:15",
    vendorName: "SPPG Dago Bandung",
    schoolName: "SMPN 5 Bandung",
    jenjang: "SMP",
  },
  {
    id: "SPG-004",
    name: "Kurir SPPG 4",
    vendorId: 2,
    sekolahId: 2,
    sppgId: 2,
    arah: "sppg_ke_sekolah",
    status: "Moving",
    manifest: "320 Porsi — SPPG Soekarno Hatta",
    baseLat: -6.9200,
    baseLng: 107.6220,
    lat: -6.9200,
    lng: 107.6220,
    eta: "07:15",
    vendorName: "SPPG Soekarno Hatta",
    schoolName: "SMPN 2 Bandung",
    jenjang: "SMP",
  },
];

export default function PengawasanPage() {
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDrivers, setActiveDrivers] = useState<ActiveDriver[]>(PRESET_DRIVERS);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [jenjangFilter, setJenjangFilter] = useState<JenjangFilter>("SEMUA");
  const [arahFilter, setArahFilter] = useState<ArahFilter>("SEMUA");

  // Pagination (Fixed 3 items per page for perfect single-screen fit)
  const PAGE_SIZE = 3;
  const [page, setPage] = useState(0);

  // ── Simulation Loop ──────────────────────────────────────────────────────
  useEffect(() => {
    let t = 0;
    const interval = setInterval(() => {
      t += 0.1;
      setActiveDrivers((prev) =>
        prev.map((d, idx) => {
          const deltaLat = Math.sin(t + idx * 1.5) * 0.0004;
          const deltaLng = Math.cos(t + idx * 1.5) * 0.0004;
          return {
            ...d,
            lat: d.baseLat + deltaLat,
            lng: d.baseLng + deltaLng,
          };
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // ── Filtering ────────────────────────────────────────────────────────────

  const filteredDrivers = activeDrivers.filter((d) => {
    const matchSearch =
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchJenjang = jenjangFilter === "SEMUA" || d.jenjang === jenjangFilter;
    const matchArah = arahFilter === "SEMUA" || d.arah === arahFilter;
    return matchSearch && matchJenjang && matchArah;
  });

  const totalPages = Math.ceil(filteredDrivers.length / PAGE_SIZE);
  const pagedDrivers = filteredDrivers.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const hasActiveFilters = jenjangFilter !== "SEMUA" || arahFilter !== "SEMUA";

  const resetFilters = () => {
    setJenjangFilter("SEMUA");
    setArahFilter("SEMUA");
    setPage(0);
  };

  // Reset to page 0 whenever filters/search change
  useEffect(() => { setPage(0); }, [jenjangFilter, arahFilter, searchQuery]);

  const countByJenjang = (j: JenjangFilter) =>
    activeDrivers.filter((d) => j === "SEMUA" || d.jenjang === j).length;

  return (
    <div className="flex h-[100dvh] max-h-[100dvh] w-full gap-3 p-3 bg-slate-50 overflow-hidden relative">

      {/* ── Sidebar: Unit Monitoring ── */}
      <motion.aside
        initial={false}
        animate={{
          width: isSidebarCollapsed ? "80px" : "320px",
          minWidth: isSidebarCollapsed ? "80px" : "320px",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex flex-col gap-4 relative z-20"
      >
        <GlassCard className="p-4 h-full flex flex-col gap-4 overflow-hidden relative transition-all duration-500">

          {/* Header */}
          <div className={`flex items-center ${isSidebarCollapsed ? "flex-col gap-4" : "justify-between"} w-full`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50/50 flex items-center justify-center text-indigo-600 border border-indigo-100 flex-shrink-0">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              {!isSidebarCollapsed && (
                <motion.h2
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-lg font-black text-slate-800 tracking-tighter uppercase"
                >
                  Monitoring
                </motion.h2>
              )}
            </div>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`p-2 rounded-xl bg-slate-100 hover:bg-indigo-500 hover:text-white text-slate-400 transition-all ${isSidebarCollapsed ? "mt-2" : ""}`}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 rotate-180" />}
            </button>
          </div>

          {!isSidebarCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2.5 shrink-0">

              {/* Search + Filter Button Row */}
              <div className="flex items-center gap-1.5">
                <div className="relative flex-1 group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari armada / rute..."
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 pl-8.5 pr-2.5 text-xs font-bold text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all"
                  />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                    showFilters || hasActiveFilters
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-xs"
                      : "bg-slate-50 border-slate-200/80 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                  title="Filter Jenjang & Rute"
                >
                  <Filter className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Collapsible Filter Panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col gap-2 p-2.5 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden"
                  >
                    {/* Filter: Jenjang */}
                    <div>
                      <label className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <School className="w-3 h-3 text-indigo-600" /> Jenjang Sekolah
                      </label>
                      <select
                        value={jenjangFilter}
                        onChange={(e) => setJenjangFilter(e.target.value as JenjangFilter)}
                        className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2 text-[11px] font-bold text-slate-700 outline-none cursor-pointer"
                      >
                        <option value="SEMUA">Semua Jenjang ({activeDrivers.length})</option>
                        <option value="SD">SD ({countByJenjang("SD")})</option>
                        <option value="SMP">SMP ({countByJenjang("SMP")})</option>
                        <option value="SMA">SMA ({countByJenjang("SMA")})</option>
                      </select>
                    </div>

                    {/* Filter: Arah Pengiriman */}
                    <div>
                      <label className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <ArrowRight className="w-3 h-3 text-emerald-600" /> Rute Pengiriman
                      </label>
                      <select
                        value={arahFilter}
                        onChange={(e) => setArahFilter(e.target.value as ArahFilter)}
                        className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2 text-[11px] font-bold text-slate-700 outline-none cursor-pointer"
                      >
                        <option value="SEMUA">Semua Rute</option>
                        <option value="vendor_ke_sppg">Vendor → SPPG</option>
                        <option value="sppg_ke_sekolah">SPPG → Sekolah</option>
                      </select>
                    </div>

                    {hasActiveFilters && (
                      <button
                        onClick={resetFilters}
                        className="flex items-center justify-center gap-1 text-[9px] font-black text-red-500 hover:underline pt-1"
                      >
                        <X className="w-3 h-3" /> Reset Filter
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Active summary badge when filters are closed */}
              {!showFilters && hasActiveFilters && (
                <div className="flex items-center justify-between px-2 py-1 bg-indigo-50 rounded-lg border border-indigo-100 text-[9px] font-bold text-indigo-700">
                  <span>Filter Aktif ({filteredDrivers.length} armada)</span>
                  <button onClick={resetFilters} className="text-red-500 hover:underline font-black">Reset</button>
                </div>
              )}

              {/* Count label */}
              <div className="flex items-center justify-between px-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Armada Aktif: {filteredDrivers.length}</span>
                <span className="font-mono text-emerald-600 font-black">LIVE GPS</span>
              </div>
            </motion.div>
          )}

          {/* ── Driver List ── */}
          <div className="flex-1 overflow-hidden flex flex-col gap-2">
            <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-2 custom-scrollbar">
              {filteredDrivers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <Truck className="w-8 h-8 text-slate-200" />
                  <p className="text-[10px] text-slate-400 font-bold text-center">Tidak ada armada<br />sesuai filter</p>
                </div>
              ) : (
                pagedDrivers.map((driver) => (
                  <motion.div
                    key={driver.id}
                    layoutId={driver.id}
                    onClick={() => setSelectedDriverId(driver.id)}
                    className={`group relative rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                      isSidebarCollapsed ? "p-2" : "p-3.5"
                    } ${
                      selectedDriverId === driver.id
                        ? "bg-white border-indigo-200 shadow-xl shadow-indigo-500/10"
                        : "bg-white/50 border-slate-100 hover:border-indigo-100 hover:bg-white"
                    }`}
                  >
                    <div className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"} mb-2`}>
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                          selectedDriverId === driver.id
                            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                            : "bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500"
                        }`}>
                          <Truck className="w-4 h-4" />
                        </div>
                        {!isSidebarCollapsed && (
                          <div>
                            <p className={`text-sm font-black tracking-tighter leading-none mb-0.5 ${selectedDriverId === driver.id ? "text-slate-900" : "text-slate-700"}`}>
                              {driver.id}
                            </p>
                            <div className="flex items-center gap-1">
                              <span className={`text-[7px] font-black px-1.5 py-0.5 rounded border ${JENJANG_COLOR[driver.jenjang] || ""}`}>
                                {driver.jenjang}
                              </span>
                              <span className={`text-[7px] font-black px-1.5 py-0.5 rounded border ${ARAH_COLOR[driver.arah]}`}>
                                {driver.arah === "vendor_ke_sppg" ? "V→S" : "S→K"}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      {!isSidebarCollapsed && (
                        <div className="text-right">
                          <p className="text-[10px] font-black text-emerald-500">{driver.eta}</p>
                          <p className="text-[7px] font-bold text-slate-300 uppercase">ETA</p>
                        </div>
                      )}
                    </div>

                    {!isSidebarCollapsed && (
                      <>
                        <div className="flex items-center gap-2 p-2 bg-slate-50/50 rounded-xl border border-slate-100/50">
                          <Radio className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                          <div className="flex-1 overflow-hidden">
                            <p className="text-[9px] font-black text-slate-600 truncate">{driver.schoolName}</p>
                            <p className="text-[8px] text-slate-400 truncate">{driver.vendorName.split(" ")[0]}</p>
                          </div>
                          <ChevronRight className={`w-3 h-3 text-slate-300 flex-shrink-0 transition-transform ${selectedDriverId === driver.id ? "translate-x-0.5 text-indigo-400" : ""}`} />
                        </div>

                        {selectedDriverId === driver.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-2 pt-2 border-t border-slate-100"
                          >
                            <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border ${ARAH_COLOR[driver.arah]}`}>
                              {driver.arah === "vendor_ke_sppg"
                                ? <Warehouse className="w-3 h-3" />
                                : <School className="w-3 h-3" />}
                              <span className="text-[9px] font-black">{ARAH_LABEL[driver.arah]}</span>
                            </div>
                            <div className="flex items-center justify-between text-[9px] font-bold mt-2">
                              <span className="text-slate-400 uppercase tracking-widest">Signal</span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4].map((i) => (
                                  <div key={i} className={`w-1 h-2 rounded-full ${i <= 3 ? "bg-indigo-500" : "bg-slate-200"}`} />
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* ── Pagination ── */}
            {!isSidebarCollapsed && totalPages > 1 && (
              <div className="flex items-center justify-between pt-2 pb-1 border-t border-slate-100 shrink-0">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-slate-200/80 bg-white"
                  title="Halaman Sebelumnya"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1 font-mono text-[10px] font-bold text-slate-600">
                  <span>Halaman {page + 1} / {totalPages}</span>
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-slate-200/80 bg-white"
                  title="Halaman Berikutnya"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Footer Stats */}
          {!isSidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2"
            >
              {[
                { label: "SD", count: activeDrivers.filter((d) => d.jenjang === "SD").length, color: "text-sky-600" },
                { label: "SMP", count: activeDrivers.filter((d) => d.jenjang === "SMP").length, color: "text-violet-600" },
                { label: "SMA", count: activeDrivers.filter((d) => d.jenjang === "SMA").length, color: "text-rose-600" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className={`text-base font-black leading-none ${s.color}`}>{s.count}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          )}
        </GlassCard>
      </motion.aside>

      {/* ── Main Map View ── */}
      <motion.main layout className="flex-1 relative animate-in zoom-in-95 duration-1000 overflow-hidden">
        <MapSupervision
          activeDrivers={activeDrivers}
          selectedDriverId={selectedDriverId}
          onSelectDriver={setSelectedDriverId}
          onExit={() => setSelectedDriverId(null)}
        />

        {/* Floating Telemetry Trigger / Popover */}
        {!selectedDriverId && (
          <div className="absolute bottom-6 right-6 z-20 flex flex-col items-end pointer-events-auto">
            <div className="relative group">
              {/* Expandable Popover Card on Hover or Focus */}
              <div className="absolute bottom-full right-0 mb-3 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out z-30">
                <GlassCard className="px-5 py-3.5 flex items-center gap-5 shadow-2xl border border-slate-200/80 bg-white/95 backdrop-blur-xl rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shrink-0">
                      <Wifi className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Koneksi Satelit</p>
                      <p className="text-xs font-black text-slate-800 leading-none">100% Satlink</p>
                    </div>
                  </div>
                  <div className="w-[1px] h-6 bg-slate-200" />
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Waktu Sistem</p>
                      <p className="text-xs font-black text-slate-800 leading-none whitespace-nowrap">
                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} WIB
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Main Compact Icon Button */}
              <button 
                className="w-10 h-10 rounded-2xl bg-white/90 hover:bg-white backdrop-blur-xl border border-slate-200/90 shadow-xl flex items-center justify-center text-emerald-600 hover:scale-105 active:scale-95 transition-all group-hover:border-emerald-300 cursor-pointer"
                title="Status Koneksi & Waktu Telemetri"
              >
                <div className="relative">
                  <Wifi className="w-4 h-4 text-emerald-600" />
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}
      </motion.main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 9999px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}
