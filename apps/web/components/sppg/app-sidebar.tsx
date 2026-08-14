"use client";

import { Gavel, LayoutDashboard, PackageCheck, Receipt } from "lucide-react";

import { RoleAppSidebar } from "@/components/dashboard/role-app-sidebar";

export function AppSidebar() {
  return (
    <RoleAppSidebar
      roleLabel="Sentra Gizi (SPPG)"
      homeHref="/sppg/dashboard"
      items={[
        { label: "Dashboard & PO", href: "/sppg/dashboard", icon: LayoutDashboard },
        { label: "Bidding Vendor", href: "/sppg/bidding", icon: Gavel },
        { label: "Audit Pengadaan", href: "/sppg/pengadaan", icon: PackageCheck },
        { label: "Verifikasi Pembayaran", href: "/sppg/verifikasi-pembayaran", icon: Receipt },
      ]}
    />
  );
}

