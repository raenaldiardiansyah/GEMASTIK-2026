"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/sppg/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function SppgLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/sppg/admin");

  // Area admin punya layout + sidebar sendiri — jangan render sidebar portal di sini.
  if (isAdmin) {
    return (
      <div data-role="sppg" className="role-sppg min-h-svh bg-slate-100 text-slate-900">
        {children}
      </div>
    );
  }

  return (
    <div data-role="sppg" className="role-sppg min-h-svh bg-slate-100 text-slate-900">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-slate-100 text-slate-900">
          {/* Mobile-only top bar */}
          <div className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:hidden">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-cyan-900 hover:bg-cyan-50" />
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-cyan-600 text-white font-black text-xs">
                  G
                </div>
                <div className="text-xs font-bold text-slate-900">Portal SPPG</div>
              </div>
            </div>
            <div className="rounded-full bg-cyan-100 border border-cyan-300 px-2.5 py-0.5 text-[10px] font-extrabold text-cyan-900">
              Dapur MBG Aktif
            </div>
          </div>
          <div className="flex-1 h-full min-h-0 overflow-y-auto bg-slate-100 text-slate-900">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
