"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AppSidebar } from "@/components/sekolah/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Building2, ChevronRight, Home, LogOut, School } from "lucide-react";
export default function SekolahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSiswa = pathname?.includes("/sekolah/siswa");
  const isAdmin = pathname?.includes("/sekolah/admin");
  const footerRef = useRef<HTMLElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    if (!isAdmin) return;
    
    const updateHeight = () => {
      if (footerRef.current) {
        setFooterHeight(footerRef.current.offsetHeight);
      }
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [isAdmin]);

  if (isSiswa) {
    return (
      <div data-role="student" className="min-h-svh bg-background text-foreground">
        {children}
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div data-role="school" className="role-sekolah min-h-svh bg-violet-950 text-slate-900 flex flex-col">
        {/* Navbar Atas Khusus Sekolah Admin (Gaya Landing Page - Light Theme 60-30-10) */}
        <header className="sticky top-0 z-50 w-full border-b border-violet-100 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-xs">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="flex size-9 items-center justify-center rounded-xl bg-violet-600 text-white font-black text-base shadow-md shadow-violet-500/25 group-hover:scale-105 transition-transform">
                  G
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-base tracking-tight text-slate-900 leading-none">
                    GIZANTARA
                  </span>
                  <span className="text-[10px] font-extrabold text-violet-600 tracking-wider uppercase mt-0.5">
                    GIZANTARA
                  </span>
                </div>
              </Link>
              <div className="h-4 w-px bg-slate-200 hidden sm:block" />
              <Badge variant="outline" className="hidden sm:inline-flex border-violet-200 text-violet-700 bg-violet-50 font-bold px-2.5 py-0.5">
                <School className="w-3.5 h-3.5 mr-1 text-violet-600" />
                Portal Admin Sekolah
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="hidden md:flex items-center text-xs font-semibold text-slate-600 hover:text-violet-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-violet-50"
              >
                <Home className="w-3.5 h-3.5 mr-1.5" />
                Beranda UTama
              </Link>
              <div className="flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/70 p-1.5 px-3 text-xs font-bold text-violet-800">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>SDN 01 Menteng (Aktif)</span>
              </div>
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 transition-all px-3.5 py-1.5 rounded-lg shadow-sm shadow-violet-500/20"
              >
                <LogOut className="w-3.5 h-3.5" />
                Keluar
              </Link>
            </div>
          </div>
        </header>

        <main 
          className="flex-1 bg-white relative z-10 rounded-b-3xl md:rounded-b-[3rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] border-b border-violet-100"
          style={{ marginBottom: footerHeight ? `${footerHeight}px` : '200px' }}
        >
          {children}
        </main>

        {/* Footer Reveal (Layer 2) - Fixed at bottom, revealed when main scrolls up */}
        <footer 
          ref={footerRef}
          className="fixed bottom-0 left-0 w-full h-auto z-0 bg-violet-950 text-white flex flex-col justify-end pt-20 pb-12 px-[clamp(1.5rem,5vw,4rem)]"
        >
          <div className="max-w-[1200px] mx-auto w-full flex flex-col">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 content-center">
              <div className="col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-violet-700 font-bold text-sm shadow-md">G</div>
                  <span className="font-bold text-white text-base tracking-tight">GIZANTARA</span>
                </div>
                <p className="text-violet-100 text-xs lg:text-sm leading-relaxed max-w-xs">Portal Admin Sekolah untuk manajemen program makan bergizi gratis GIZANTARA.</p>
              </div>
              
              <div>
                <h4 className="text-[10px] lg:text-xs font-bold text-white uppercase tracking-wider mb-3 lg:mb-5">Navigasi</h4>
                <ul className="space-y-2 lg:space-y-3">
                  <li><a href="#overview" className="text-violet-100 text-xs lg:text-sm hover:text-white transition-colors">Overview</a></li>
                  <li><a href="#validasi" className="text-violet-100 text-xs lg:text-sm hover:text-white transition-colors">Validasi Logistik</a></li>
                  <li><a href="#mitra" className="text-violet-100 text-xs lg:text-sm hover:text-white transition-colors">Mitra Operasional</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-[10px] lg:text-xs font-bold text-white uppercase tracking-wider mb-3 lg:mb-5">Bantuan</h4>
                <ul className="space-y-2 lg:space-y-3">
                  <li><a href="#faq" className="text-violet-100 text-xs lg:text-sm hover:text-white transition-colors">FAQ & Informasi</a></li>
                  <li><a href="#bantuan" className="text-violet-100 text-xs lg:text-sm hover:text-white transition-colors">Tiket Kendala</a></li>
                  <li><Link href="/contact" className="text-violet-100 text-xs lg:text-sm hover:text-white transition-colors">Hubungi Kami</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-[10px] lg:text-xs font-bold text-white uppercase tracking-wider mb-3 lg:mb-5">Akses</h4>
                <ul className="space-y-2 lg:space-y-3">
                  <li><Link href="/auth/login" className="text-violet-100 text-xs lg:text-sm hover:text-white transition-colors">Login Portal</Link></li>
                  <li><Link href="/privacy" className="text-violet-100 text-xs lg:text-sm hover:text-white transition-colors">Privasi</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-auto pt-6 border-t border-violet-500/50 flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-violet-100 text-xs font-medium">(c) 2026 GIZANTARA. Hak Cipta Dilindungi.</p>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                <span className="text-violet-100 text-xs font-bold">Sistem Operasional Aktif</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div data-role="school" className="role-sekolah min-h-svh bg-background text-foreground">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="sticky top-0 z-20 flex h-12 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:hidden">
            <SidebarTrigger />
            <div className="text-sm font-semibold text-foreground">GIZANTARA</div>
          </div>
          <div className="flex-1 h-full min-h-0 overflow-y-auto">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

