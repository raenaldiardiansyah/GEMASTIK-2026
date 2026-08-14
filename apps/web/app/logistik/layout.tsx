"use client";

import { AppSidebar } from "@/components/logistik/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function LogistikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-role="logistics" className="role-logistik min-h-svh bg-slate-100 text-slate-900">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-slate-100 text-slate-900">
          {/* Mobile-only top bar */}
          <div className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:hidden">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-emerald-900 hover:bg-emerald-50" />
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-600 text-white font-black text-xs">
                  G
                </div>
                <div className="text-xs font-bold text-slate-900">Portal Logistik</div>
              </div>
            </div>
            <div className="rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-950">
              Armada MBG Aktif
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
