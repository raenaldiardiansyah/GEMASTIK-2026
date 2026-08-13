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
      <div data-role="sppg" className="role-sppg min-h-svh bg-background text-foreground">
        {children}
      </div>
    );
  }

  return (
    <div data-role="sppg" className="role-sppg min-h-svh bg-background text-foreground">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Mobile-only top bar */}
          <div className="sticky top-0 z-20 flex h-12 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:hidden">
            <SidebarTrigger />
            <div className="text-sm font-semibold text-foreground">GIZANTARA · Portal SPPG</div>
          </div>
          <div className="flex-1 h-full min-h-0 overflow-y-auto bg-background">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
