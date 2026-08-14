"use client";

import { useState } from "react";
import { MessageSquare, Star, Settings, User, Sparkles, Search, ChevronLeft, ChevronRight } from "lucide-react";

import { type Sekolah, getVendorsBySekolah } from "@/lib/mbgdummydata";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SchoolDetailPanel } from "@/components/ui/SchoolDetailPanel";
import { toast } from "sonner";

import { TopHeader } from "./TopHeader";
import { HeroGreeting } from "./HeroGreeting";
import { InteractiveMapCard } from "./InteractiveMapCard";
import { StatsAndLeaderboard } from "./StatsAndLeaderboard";
import { TodayMenuCard } from "./TodayMenuCard";
import { FloatingBottomNav } from "./FloatingBottomNav";
import { FoodRatingModal } from "./FoodRatingModal";

export const MobileSiswaLayout = () => {
  const [selectedSchool, setSelectedSchool] = useState<Sekolah | null>(null);
  const [isFoodRatingOpen, setIsFoodRatingOpen] = useState(false);
  const [ratingMode, setRatingMode] = useState<"RATING" | "PENGADUAN">("RATING");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"home" | "map" | "rate" | "messages" | "menu">(
    "home"
  );

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-1">
            <HeroGreeting onViewMap={() => setActiveTab("map")} />
            <TodayMenuCard />
            <StatsAndLeaderboard />
          </div>
        );
      case "map":
        return (
          <div className="space-y-4">
            <InteractiveMapCard selectedSchool={selectedSchool} onSchoolSelect={setSelectedSchool} />
            {selectedSchool ? (
              <div className="px-6 py-2">
                <SchoolDetailPanel
                  school={selectedSchool}
                  vendors={getVendorsBySekolah(selectedSchool.id)}
                  onClose={() => setSelectedSchool(null)}
                />
              </div>
            ) : (
              <div className="px-6 text-center py-4">
                <p className="text-xs text-slate-500 font-semibold">Pilih salah satu penanda sekolah di peta untuk melihat detail layanan.</p>
              </div>
            )}
          </div>
        );
      case "rate":
        return (
          <div className="px-6 py-6">
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <Star className="size-4 text-violet-600" />
                  Audit Menu Makan
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Beri penilaian agar kualitas dan distribusi menu harian gizi nasional tetap terjaga.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl cursor-pointer" onClick={() => { setRatingMode("RATING"); setIsFoodRatingOpen(true); }}>
                  Mulai Audit Makanan
                </Button>
                <p className="text-[10px] text-slate-400 text-center">
                  Form audit menggunakan sistem multi-step terintegrasi ledger.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case "messages":
        const filteredHistory = chatHistory.filter(chat => 
          chat.keluhan?.toLowerCase().includes(searchQuery.toLowerCase()) || 
          chat.status_visual?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const ITEMS_PER_PAGE = 3;
        const totalPages = Math.max(1, Math.ceil(filteredHistory.length / ITEMS_PER_PAGE));
        const currentHistory = filteredHistory.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

        return (
          <div className="px-6 py-6 flex flex-col gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Riwayat Pengaduan</h3>
              <p className="text-xs text-slate-400">Rekam jejak laporan dan sesi obrolan bantuan Anda.</p>
            </div>

            {chatHistory.length > 0 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari keluhan atau status..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            )}

            {filteredHistory.length === 0 ? (
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardHeader className="py-8 text-center">
                  <CardTitle className="text-sm font-bold text-slate-800 mb-1">
                    {chatHistory.length === 0 ? "Belum ada riwayat laporan" : "Pencarian tidak ditemukan"}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    {chatHistory.length === 0 
                      ? "Semua laporan dan percakapan Anda dengan layanan pengaduan akan muncul di sini."
                      : "Coba gunakan kata kunci lain untuk mencari keluhan Anda."}
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <div className="flex flex-col gap-3">
                {currentHistory.map((chat, idx) => (
                  <Card key={idx} className="rounded-xl border border-slate-100 shadow-sm p-3 bg-white hover:border-indigo-100 transition-all cursor-pointer group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                    <div className="flex justify-between items-center mb-2 pl-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                          <MessageSquare className="w-3 h-3 text-indigo-600" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">{chat.status_visual.replace(/_/g, ' ')}</span>
                      </div>
                      <span className="text-[8px] px-1.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-full font-bold uppercase tracking-wider shrink-0">
                        {chat.risiko?.split("-")[0] || "Menunggu"}
                      </span>
                    </div>
                    <div className="pl-1.5">
                      <div className="bg-slate-50 border border-slate-100 rounded-lg rounded-tl-sm p-2.5 relative">
                        <p className="text-[11px] text-slate-600 italic leading-relaxed line-clamp-2">"{chat.keluhan}"</p>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                         <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                           <Sparkles className="w-2.5 h-2.5" />
                           Audit AI Disimpan
                         </span>
                         <span className="text-[9px] font-medium text-slate-400">Baru Saja</span>
                      </div>
                    </div>
                  </Card>
                ))}

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-1 px-1">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-bold text-slate-500">
                      Hal {currentPage} dari {totalPages}
                    </span>
                    <button 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            <Button 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer" 
              variant="default" 
              type="button"
              onClick={() => { setRatingMode("PENGADUAN"); setIsFoodRatingOpen(true); }}
            >
              <MessageSquare className="mr-2 size-4" />
              Hubungi Layanan Pengaduan
            </Button>
          </div>
        );
      case "menu":
        return (
          <div className="px-6 py-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Pengaturan Akun</h3>
              <p className="text-xs text-slate-400">Kelola profil siswa dan data sekolah kamu.</p>
            </div>

            <Card className="rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden divide-y divide-slate-200">
              <button 
                onClick={() => toast.info("Simulasi: Membuka detail profil siswa Raenaldi (SMAN 3 Bandung)")}
                className="w-full text-left p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center text-violet-600">
                  <User className="size-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-800">Profil Raenaldi</p>
                  <p className="text-[10px] text-slate-400">Siswa Kelas 12 - SMAN 3 Bandung</p>
                </div>
              </button>
              <button 
                onClick={() => toast.info("Simulasi: Mengakses pengaturan sistem audit terdistribusi")}
                className="w-full text-left p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <Settings className="size-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-800">Pengaturan Sistem</p>
                  <p className="text-[10px] text-slate-400">Simulasi dan audit terdistribusi</p>
                </div>
              </button>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 font-sans pb-32 max-w-md mx-auto overflow-x-hidden shadow-2xl border-x border-slate-200">
      <TopHeader onNotificationClick={() => setActiveTab("messages")} />
      <div>{renderContent()}</div>
      <FloatingBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <FoodRatingModal
        isOpen={isFoodRatingOpen}
        startMode={ratingMode}
        onClose={() => {
          setIsFoodRatingOpen(false);
          setActiveTab("home");
        }}
        onSubmitSuccess={(data) => {
          setChatHistory((prev) => [data, ...prev]);
        }}
      />
    </div>
  );
};
