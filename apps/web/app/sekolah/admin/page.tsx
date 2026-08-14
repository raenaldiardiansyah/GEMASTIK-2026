"use client";

import { useMemo, useState, useEffect } from "react";

import dynamic from "next/dynamic";

import {

  Activity,

  AlertTriangle,

  Mail,

  MapPin,

  MessageSquare,

  Phone,

  ShieldCheck,

  School as SchoolIcon,

  QrCode,

  Users,

} from "lucide-react";

import { toast } from "sonner";

import CountUp from "@/components/ui/CountUp";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { DashboardShell } from "@/components/ui/dashboard-shell";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Separator } from "@/components/ui/separator";

import { Textarea } from "@/components/ui/textarea";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import {

  type Sekolah,

  deliveryList,

  getSPPGBySekolah,

  getVendorsBySekolah,

  sekolahList,

} from "@/lib/mbgdummydata";

import { SchoolDetailPanel } from "@/components/ui/SchoolDetailPanel";

import VendorRanking from "@/components/ui/vendorranking";

import VendorPerformanceDashboard from "@/components/ui/VendorPerformanceDashboard";

import { KpiCard } from "@/components/ui/kpi-card";

import { cn } from "@/lib/utils";

const MapLibreMap = dynamic(() => import("@/components/ui/MapLibreMap"), { ssr: false });

const CATEGORIES = [

  { id: "overview", label: "Overview & Distribusi" },

  { id: "validasi", label: "Validasi Logistik" },

  { id: "mitra", label: "Mitra Operasional" },

  { id: "bantuan", label: "Bantuan & Tiket" },

];

export default function SekolahAdminPage() {

  const [viewMode, setViewMode] = useState<"school" | "aggregate">("school");

  const [activeMitraTab, setActiveMitraTab] = useState<"performa" | "ranking">("performa");

  const [activeCategory, setActiveCategory] = useState<string>("overview");

  const [selectedSchool, setSelectedSchool] = useState<Sekolah | null>(null);

  const [selectedEntityId, setSelectedEntityId] = useState<number>(1);

  const [scanOpen, setScanOpen] = useState(false);

  const [lastScan, setLastScan] = useState<string | null>(null);

  // Scrollspy via IntersectionObserver

  useEffect(() => {

    const observerOptions = {

      root: null,

      rootMargin: "-20% 0px -55% 0px",

      threshold: 0,

    };

    const handleIntersect: IntersectionObserverCallback = (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          setActiveCategory(entry.target.id);

        }

      });

    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    CATEGORIES.forEach((cat) => {

      const el = document.getElementById(cat.id);

      if (el) observer.observe(el);

    });

    return () => observer.disconnect();

  }, []);

  const scrollToCategory = (id: string) => {

    setActiveCategory(id);

    const element = document.getElementById(id);

    if (element) {

      const yOffset = -90; // offset for sticky top navbar

      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });

    }

  };

  const loggedInSchool = useMemo(() => sekolahList.find((s) => s.id === 1) ?? null, []);

  const availableVendors = useMemo(

    () => (loggedInSchool ? getVendorsBySekolah(loggedInSchool.id) : []),

    [loggedInSchool]

  );

  const availableSPPG = useMemo(

    () => (loggedInSchool ? getSPPGBySekolah(loggedInSchool.id) : null),

    [loggedInSchool]

  );

  const primaryRelation = useMemo(

    () => availableVendors.find((v) => v.is_primary) ?? availableVendors[0] ?? null,

    [availableVendors]

  );

  const latestDelivery = useMemo(() => {

    if (!primaryRelation) return null;

    return (

      deliveryList

        .filter((d) => d.vendor_sekolah_id === primaryRelation.id)

        .sort((a, b) => b.id - a.id)[0] ?? null

    );

  }, [primaryRelation]);

  const identityPanels = useMemo(() => {

    const statusLabel =

      latestDelivery?.status === "on_transit"

        ? "Dalam perjalanan"

        : latestDelivery?.status === "delivered"

        ? "Selesai"

        : latestDelivery?.status === "pending"

        ? "Diproses"

        : "—";

    return [

      {

        title: "Status batch terakhir",

        subtitle: "Monitoring operasional",

        icon: Activity,

        content: latestDelivery ? statusLabel : "Belum ada data",

        detail: latestDelivery

          ? `Batch #${latestDelivery.id} • ${latestDelivery.tanggal} • ${latestDelivery.porsi_dikirim} box`

          : "Manifest belum tersedia.",

      },

      {

        title: "Jadwal pengiriman",

        subtitle: "Window penerimaan",

        icon: ShieldCheck,

        content: `Target: ${latestDelivery?.jam_target ?? "07:00"} WIB`,

        detail:

          latestDelivery?.jam_tiba && latestDelivery.jam_tiba !== "--"

            ? `Tiba: ${latestDelivery.jam_tiba} WIB`

            : "Armada belum tiba.",

      },

      {

        title: "Mitra vendor pelaksana",

        subtitle: "PIC vendor",

        icon: Phone,

        content: primaryRelation?.vendor.nama ?? "—",

        detail: primaryRelation?.vendor.no_telp

          ? `${primaryRelation.vendor.kontak_pic} • ${primaryRelation.vendor.no_telp}`

          : "Kontak belum tersedia.",

      },

      {

        title: "Dapur SPPG penanggung jawab",

        subtitle: "Verifikasi & pengolahan",

        icon: MapPin,

        content: availableSPPG?.nama ?? "Belum terhubung",

        detail: availableSPPG

          ? `${availableSPPG.kecamatan}, ${availableSPPG.kota} • Kapasitas ${availableSPPG.kapasitas_porsi}/hari`

          : "SPPG belum terhubung.",

      },

    ] as const;

  }, [availableSPPG, latestDelivery, primaryRelation]);

  const stats = useMemo(() => {

    if (viewMode === "school" && loggedInSchool) {

      return [

        { label: "Total siswa", value: loggedInSchool.total_siswa, unit: "jiwa", icon: Users },

        { label: "Penerima makan", value: loggedInSchool.total_siswa, unit: "porsi", icon: Activity },

        { label: "Mitra terafiliasi", value: availableVendors.length, unit: "vendor", icon: ShieldCheck },

        { label: "SPPG terhubung", value: availableSPPG ? 1 : 0, unit: "dapur", icon: MapPin },

      ] as const;

    }

    return [

      { label: "Sekolah aktif", value: sekolahList.length, unit: "unit", icon: SchoolIcon },

      { label: "Penerima makan", value: 2693, unit: "/hari", icon: Activity },

      { label: "Mitra terafiliasi", value: 5, unit: "vendor", icon: ShieldCheck },

      { label: "SPPG aktif", value: 4, unit: "dapur", icon: MapPin },

    ] as const;

  }, [availableSPPG, availableVendors.length, loggedInSchool, viewMode]);

  return (

    <>

      <DashboardShell

        badge={<Badge variant="outline" className="text-role-primary border-role-primary/30 bg-role-primary/5">Sekolah • Admin</Badge>}

        title="Dashboard Sekolah"

        description="Pantau distribusi dan koordinasi manifest dari vendor → SPPG → sekolah."

        actions={

          <div className="flex flex-wrap items-center gap-2">

            <div className="flex bg-slate-200/70 p-1 rounded-xl border border-slate-300/60 shadow-xs">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setViewMode("school")}
                className={cn(
                  "rounded-lg text-xs font-bold transition-all px-3.5 py-1.5",
                  viewMode === "school"
                    ? "bg-violet-600 text-white shadow-xs hover:bg-violet-700 hover:text-white"
                    : "text-slate-700 hover:text-violet-700 hover:bg-violet-50"
                )}
              >
                Konteks sekolah
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setViewMode("aggregate")}
                className={cn(
                  "rounded-lg text-xs font-bold transition-all px-3.5 py-1.5",
                  viewMode === "aggregate"
                    ? "bg-violet-600 text-white shadow-xs hover:bg-violet-700 hover:text-white"
                    : "text-slate-700 hover:text-violet-700 hover:bg-violet-50"
                )}
              >
                Agregat sistem
              </Button>
            </div>
          </div>

        }

      >

        <div className="flex flex-col md:flex-row gap-6 items-start mt-4">

          {/* Sticky Scrollspy Navigasi Kategori (Kecil Proporsi & 60-30-10 Light Theme) */}

          <aside className="w-full md:w-52 shrink-0 sticky top-24 z-30">

            <div className="bg-white/90 backdrop-blur-sm border border-violet-200/80 rounded-2xl p-2.5 shadow-sm space-y-2">

              <div className="px-3 pt-1 flex items-center justify-between">

                <p className="text-[10px] font-extrabold uppercase tracking-wider text-violet-900/60">

                  Navigasi

                </p>

                <span className="size-1.5 rounded-full bg-violet-600 animate-ping" />

              </div>

              <nav className="flex flex-col space-y-1">

                {CATEGORIES.map((cat) => (

                  <button

                    key={cat.id}

                    onClick={() => scrollToCategory(cat.id)}

                    className={cn(

                      "flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 text-left cursor-pointer",

                      activeCategory === cat.id

                        ? "bg-violet-600 text-white font-bold shadow-md shadow-violet-500/20 border border-violet-500"

                        : "text-slate-600 hover:bg-violet-50 hover:text-violet-700 border border-transparent"

                    )}

                  >

                    <span>{cat.label}</span>

                    {activeCategory === cat.id && (

                      <span className="size-1.5 rounded-full bg-white animate-pulse" />

                    )}

                  </button>

                ))}

              </nav>

            </div>

          </aside>

          {/* Konten Utama (Render Semua Section untuk Scrollspy) */}

          <main className="flex-1 min-w-0 space-y-14 pb-16">

            {/* SECTION 1: OVERVIEW & DISTRIBUSI */}
            <section id="overview" className="space-y-6 scroll-mt-24">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-l-4 border-violet-600 pl-4 py-1">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900">Overview &amp; Peta Distribusi</h2>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Ringkasan statistik harian serta pemetaan geografis sekolah.</p>
                </div>
                <Badge variant="outline" className="w-fit border-emerald-200 bg-emerald-50 text-emerald-700 font-bold px-3 py-1 text-xs shadow-xs">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
                  Operasional Aktif
                </Badge>
              </div>

              {/* Bento Grid Stats */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Ringkasan sekolah">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-white rounded-2xl border border-violet-100 p-5 shadow-xs hover:shadow-md hover:border-violet-200 transition-all group">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                      <div className="p-2 rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                        <stat.icon className="size-4" aria-hidden />
                      </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-1.5">
                      <span className="text-3xl font-black tracking-tight text-slate-900">
                        <CountUp to={stat.value} />
                      </span>
                      <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">{stat.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-12">
                <Card className="lg:col-span-8 shadow-xs border-violet-100 rounded-3xl overflow-hidden bg-white">
                  <CardHeader className="bg-slate-50/50 border-b border-violet-100/60 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold text-slate-900">Peta Distribusi Real-time</CardTitle>
                        <CardDescription className="text-xs text-slate-500">Klik titik sekolah pada peta untuk audit integrasi logistik.</CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-violet-100 text-violet-700 font-bold text-[10px]">Interactive Map</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-[480px] overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50">
                      <MapLibreMap
                        selectedSchool={selectedSchool}
                        onSchoolSelect={setSelectedSchool}
                        userSchoolId={loggedInSchool?.id}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="lg:col-span-4 space-y-4"> 
                  {selectedSchool ? ( 
                    <SchoolDetailPanel 
                       school={selectedSchool} 
                       vendors={getVendorsBySekolah(selectedSchool.id)} 
                       onClose={() => setSelectedSchool(null)} 
                       readOnly={selectedSchool.id !== (loggedInSchool?.id ?? 0)} 
                    /> 
                  ) : ( 
                    <Card className="shadow-xs border-violet-100 rounded-3xl overflow-hidden bg-white"> 
                      <CardHeader className="bg-slate-50/50 border-b border-violet-100/60 pb-4"> 
                        <CardTitle className="text-lg font-bold text-slate-900">Identitas Operasional</CardTitle> 
                        <CardDescription className="text-xs text-slate-500">Ringkasan status penerimaan dan mitra aktif.</CardDescription> 
                      </CardHeader> 
                      <CardContent className="p-4 space-y-3"> 
                        {identityPanels.map((panel) => ( 
                          <div key={panel.title} className="rounded-2xl border border-violet-100/80 p-3.5 bg-violet-50/30 hover:bg-violet-50/70 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 rounded-xl bg-white p-2 text-violet-600 shadow-xs border border-violet-100">
                                <panel.icon className="size-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900">{panel.title}</p>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{panel.subtitle}</p>
                              </div>
                            </div>
                            <div className="mt-2.5 pt-2 border-t border-violet-100/50">
                              <p className="text-xs font-bold text-violet-700">{panel.content}</p>
                              <p className="text-[11px] text-slate-500 font-medium mt-0.5">{panel.detail}</p>
                            </div>
                          </div>
                        ))}
                      </CardContent> 
                    </Card> 
                  )} 
                </div> 
              </div>
            </section>

            {/* SECTION 2: VALIDASI LOGISTIK */}
            <section id="validasi" className="space-y-6 scroll-mt-24">
              <div className="border-l-4 border-violet-600 pl-4 py-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">Validasi Logistik &amp; Serah Terima</h2>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Pemindaian QR Code bukti fisik serah terima barang di lokasi (Phase 3).</p>
              </div>

              <Card className="overflow-hidden border border-violet-100 shadow-xs rounded-3xl bg-white">
                <div className="h-1.5 w-full bg-emerald-500" />
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6">
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900">Validasi Penerimaan Logistik</CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-1">
                      Generate QR Code agar mitra pengirim (vendor / armada) dapat melakukan pemindaian serah terima di lokasi.
                    </CardDescription>
                  </div>
                  <Button 
                    className="rounded-xl shadow-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 text-xs transition-all hover:scale-102" 
                    onClick={() => setScanOpen(true)}
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Generate QR Terima
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-6 sm:items-center justify-between">
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 flex-1 shadow-xs">
                      <p className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider mb-2">Scan Terakhir Oleh Mitra</p>
                      <div className="flex items-center gap-3">
                        <div className={cn("size-3 rounded-full", lastScan ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
                        <p className="font-mono text-sm text-slate-800 break-all font-bold">
                          {lastScan ?? "Belum ada pemindaian hari ini"}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        Setelah QR Code berhasil dipindai oleh pihak pengirim menggunakan aplikasi mereka, status serah terima pesanan (manifest) akan otomatis terverifikasi di dalam sistem audit GIZANTARA.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* SECTION 3: MITRA OPERASIONAL */}
            <section id="mitra" className="space-y-6 scroll-mt-24">
              <div className="border-l-4 border-violet-600 pl-4 py-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">Mitra Operasional &amp; Reputasi</h2>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Audit performa individu vendor &amp; dapur SPPG serta leaderboard peringkat.</p>
              </div>

              <Card className="shadow-xs border-violet-100 rounded-3xl overflow-hidden bg-white">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/50 border-b border-violet-100/60 pb-4">
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-900">Audit &amp; Ranking Mitra</CardTitle>
                    <CardDescription className="text-xs text-slate-500">Pantau performa individu atau peringkat mitra teratas (Vendor &amp; SPPG).</CardDescription>
                  </div>
                  {/* Floating Pill Switcher Kokonut UI */}
                  <div className="flex bg-slate-200/60 p-1 rounded-xl border border-slate-200">
                    <Button 
                      variant={activeMitraTab === "performa" ? "default" : "ghost"} 
                      size="sm"
                      className={cn(
                        "rounded-lg text-xs font-bold transition-all", 
                        activeMitraTab === "performa" 
                          ? "bg-violet-600 text-white shadow-xs" 
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                      )}
                      onClick={() => setActiveMitraTab("performa")}
                    >
                      Audit Performa
                    </Button>
                    <Button 
                      variant={activeMitraTab === "ranking" ? "default" : "ghost"} 
                      size="sm"
                      className={cn(
                        "rounded-lg text-xs font-bold transition-all", 
                        activeMitraTab === "ranking" 
                          ? "bg-violet-600 text-white shadow-xs" 
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                      )}
                      onClick={() => setActiveMitraTab("ranking")}
                    >
                      Leaderboard Ranking
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {activeMitraTab === "performa" ? (
                    <div className="max-w-4xl mx-auto pt-2">
                      <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-slate-100 mb-6">
                        <Label htmlFor="entityId" className="text-xs font-bold text-slate-700">
                          Target Entity ID
                        </Label>
                        <Input
                          id="entityId"
                          type="number"
                          value={selectedEntityId}
                          onChange={(e) => setSelectedEntityId(Number(e.target.value))}
                          className="h-9 w-28 text-center font-bold border-violet-200 bg-violet-50/50 text-violet-900 rounded-xl"
                        />
                        <Badge variant="secondary" className="bg-violet-100 text-violet-700 border-none font-extrabold text-[11px]">type: sppg</Badge>
                      </div>
                      <VendorPerformanceDashboard type="sppg" entityId={selectedEntityId} />
                    </div>
                  ) : (
                    <div className="space-y-8 bg-violet-50/30 p-4 sm:p-6 rounded-2xl border border-violet-100">
                      <VendorRanking type="vendor" />
                      <Separator className="bg-violet-100" />
                      <VendorRanking type="sppg" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* SECTION 4: BANTUAN & TIKET */}
            <section id="bantuan" className="space-y-6 scroll-mt-24">
              <div className="border-l-4 border-violet-600 pl-4 py-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">Bantuan &amp; Tiket Kendala</h2>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Hotline darurat dan pelaporan kendala teknis operasional.</p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="shadow-xs border-violet-100 rounded-3xl overflow-hidden bg-white">
                  <CardHeader className="bg-slate-50/50 border-b border-violet-100/60 pb-4">
                    <CardTitle className="text-lg font-bold text-slate-900">Kontak Bantuan Operasional</CardTitle>
                    <CardDescription className="text-xs text-slate-500">Kanal respon cepat untuk penanganan isu teknis dan pengiriman.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4 text-sm">
                    <div className="flex items-start gap-3.5 rounded-2xl border border-violet-100 bg-violet-50/30 p-4 hover:border-violet-300 transition-colors">
                      <div className="mt-0.5 rounded-xl bg-white p-2 text-violet-600 shadow-xs border border-violet-100">
                        <Phone className="size-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Hotline Darurat</p>
                        <p className="font-black text-slate-900 text-base mt-0.5">1-500-BOGA</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3.5 rounded-2xl border border-violet-100 bg-violet-50/30 p-4 hover:border-violet-300 transition-colors">
                      <div className="mt-0.5 rounded-xl bg-white p-2 text-violet-600 shadow-xs border border-violet-100">
                        <MessageSquare className="size-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">WhatsApp Support</p>
                        <p className="font-black text-slate-900 text-base mt-0.5">+62 811 2345 6789</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3.5 rounded-2xl border border-violet-100 bg-violet-50/30 p-4 hover:border-violet-300 transition-colors">
                      <div className="mt-0.5 rounded-xl bg-white p-2 text-violet-600 shadow-xs border border-violet-100">
                        <Mail className="size-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Email Resmi</p>
                        <p className="font-black text-slate-900 text-base mt-0.5">support@boga.id</p>
                      </div>
                    </div>

                    <Separator className="my-4 bg-slate-100" />

                    <Alert className="border-amber-200 bg-amber-50/70 text-amber-900 rounded-2xl">
                      <AlertTriangle className="size-4 text-amber-600" />
                      <AlertTitle className="text-amber-900 font-bold text-xs">Kendala Keamanan &amp; Fraud</AlertTitle>
                      <AlertDescription className="text-amber-800 mt-1 text-xs font-medium leading-relaxed">
                        Jika ada indikasi manipulasi data penerimaan, porsi, atau kelayakan makanan, harap hubungi admin server pusat untuk penanganan prioritas.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                <Card className="shadow-xs border-violet-100 rounded-3xl overflow-hidden bg-white">
                  <CardHeader className="bg-slate-50/50 border-b border-violet-100/60 pb-4">
                    <CardTitle className="text-lg font-bold text-slate-900">Buat Tiket Laporan</CardTitle>
                    <CardDescription className="text-xs text-slate-500">Catat kendala operasional agar langsung ditindaklanjuti.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                      <div className="space-y-2">
                        <Label htmlFor="ticket-title" className="font-bold text-xs text-slate-800">Judul Kendala</Label>
                        <Input id="ticket-title" placeholder="Contoh: Salah kirim jumlah boks hari ini" className="bg-slate-50/50 border-violet-100 rounded-xl text-xs font-medium" />
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="font-bold text-xs text-slate-800">Kategori</Label>
                          <RadioGroup defaultValue="data" className="space-y-1.5">
                            <div className="flex items-center gap-2 p-2 rounded-xl border border-violet-100/60 hover:bg-violet-50/50 transition-colors">
                              <RadioGroupItem value="data" id="cat-data" />
                              <Label htmlFor="cat-data" className="font-semibold cursor-pointer w-full text-xs text-slate-700">
                                Logistik &amp; Pengiriman
                              </Label>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-xl border border-violet-100/60 hover:bg-violet-50/50 transition-colors">
                              <RadioGroupItem value="access" id="cat-access" />
                              <Label htmlFor="cat-access" className="font-semibold cursor-pointer w-full text-xs text-slate-700">
                                Akses Aplikasi
                              </Label>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-xl border border-violet-100/60 hover:bg-violet-50/50 transition-colors">
                              <RadioGroupItem value="other" id="cat-other" />
                              <Label htmlFor="cat-other" className="font-semibold cursor-pointer w-full text-xs text-slate-700">
                                Lainnya
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="space-y-2">
                          <Label className="font-bold text-xs text-slate-800">Tingkat Prioritas</Label>
                          <RadioGroup defaultValue="normal" className="space-y-1.5">
                            <div className="flex items-center gap-2 p-2 rounded-xl border border-violet-100/60 hover:bg-violet-50/50 transition-colors">
                              <RadioGroupItem value="normal" id="prio-normal" />
                              <Label htmlFor="prio-normal" className="font-semibold cursor-pointer w-full text-xs text-slate-700">
                                Normal
                              </Label>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 transition-colors">
                              <RadioGroupItem value="high" id="prio-high" className="text-amber-600" />
                              <Label htmlFor="prio-high" className="font-bold text-amber-800 cursor-pointer w-full text-xs">
                                Mendesak (High)
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ticket-detail" className="font-bold text-xs text-slate-800">Detail Laporan</Label>
                        <Textarea
                          id="ticket-detail"
                          rows={4}
                          placeholder="Jelaskan detail laporan secara ringkas..."
                          className="bg-slate-50/50 border-violet-100 rounded-xl resize-none text-xs font-medium"
                        />
                      </div>

                      <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2.5 rounded-xl shadow-xs transition-all">
                        Kirim Tiket Laporan
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </section>

          </main>

        </div>

      </DashboardShell>

      <Dialog open={scanOpen} onOpenChange={setScanOpen}>

        <DialogContent className="sm:max-w-md bg-white border-slate-100 flex flex-col items-center justify-center p-8 text-center text-slate-800">

          <DialogHeader className="mb-4">

            <DialogTitle className="text-2xl font-black text-slate-800 tracking-tight text-center">

              QR Serah Terima

            </DialogTitle>

            <DialogDescription className="text-slate-500 text-xs text-center max-w-xs mx-auto mt-2">

              Minta mitra pengirim (vendor / logistik) untuk memindai kode ini dari aplikasi mereka.

            </DialogDescription>

          </DialogHeader>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm inline-flex mb-8">

            <QrCode className="w-64 h-64 text-slate-800" strokeWidth={1} />

          </div>

          <div className="flex gap-3 w-full">

            <Button variant="outline" className="flex-1 rounded-full text-xs font-bold" onClick={() => setScanOpen(false)}>

              Batal

            </Button>

            <Button 

              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold shadow-md" 

              onClick={() => {

                setLastScan(`QR-ACC-${Date.now()}`);

                setScanOpen(false);

                toast.success("Pemindaian Mitra Berhasil", {

                  description: "Serah terima barang telah terverifikasi.",

                });

              }}

            >

              Simulasikan Pindai

            </Button>

          </div>

        </DialogContent>

      </Dialog>

    </>

  );

}

