"use client";

import { LayoutDashboard } from "lucide-react";

import { RoleAppSidebar } from "@/components/dashboard/role-app-sidebar";

export function AppSidebar() {
  return (
    <RoleAppSidebar
      roleLabel="Portal Sekolah"
      homeHref="/sekolah/admin"
      items={[
        { label: "Admin", href: "/sekolah/admin", icon: LayoutDashboard },
      ]}
    />
  );
}

