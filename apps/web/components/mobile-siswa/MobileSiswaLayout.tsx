"use client";

import { useState } from "react";
import { MessageSquare, Star, Settings, User } from "lucide-react";

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
                <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl cursor-pointer" onClick={() => setIsFoodRatingOpen(true)}>
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
        return (
          <div className="px-6 py-6 flex flex-col gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Kotak Masuk</h3>
              <p className="text-xs text-slate-400">Bantuan langsung dan info operasional sekolah.</p>
            </div>

            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardHeader className="py-8 text-center">
                <CardTitle className="text-sm font-bold text-slate-800 mb-1">Belum ada pesan</CardTitle>
                <CardDescription className="text-xs text-slate-500">Kotak masuk kamu kosong untuk saat ini.</CardDescription>
              </CardHeader>
            </Card>

            <Button 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer" 
              variant="default" 
              type="button"
              onClick={() => toast.success("Simulasi: Menghubungkan ke admin/layanan pengaduan B.O.G.A")}
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

            <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
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
        onClose={() => {
          setIsFoodRatingOpen(false);
          setActiveTab("home");
        }}
      />
    </div>
  );
};
