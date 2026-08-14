"use client";

import { Contact, History, LayoutDashboard, MapPinned, Navigation } from "lucide-react";

import { RoleAppSidebar } from "@/components/dashboard/role-app-sidebar";

export function AppSidebar() {
  return (
    <RoleAppSidebar
      roleLabel="Portal Logistik"
      homeHref="/logistik/dashboard"
      items={[
        { label: "Dashboard", href: "/logistik/dashboard", icon: LayoutDashboard },
        { label: "Pantau Rute", href: "/logistik/pantau", icon: MapPinned },
        { label: "Geofence 50m", href: "/logistik/monitoring-distribusi", icon: Navigation },
        { label: "Riwayat", href: "/logistik/riwayat", icon: History },
        { label: "Kontak", href: "/logistik/contact", icon: Contact },
      ]}
    />
  );
}

