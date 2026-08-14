"use client";

import { LayoutDashboard, MessageSquare, Users } from "lucide-react";

import { RoleAppSidebar } from "@/components/dashboard/role-app-sidebar";

export function AppSidebar() {
  return (
    <RoleAppSidebar
      roleLabel="Portal Sekolah"
      homeHref="/sekolah/admin"
      items={[
        { label: "Admin Sekolah", href: "/sekolah/admin", icon: LayoutDashboard },
        { label: "Feedback & Ulasan", href: "/sekolah/feedback", icon: MessageSquare },
        { label: "Portal Siswa", href: "/sekolah/siswa", icon: Users },
      ]}
    />
  );
}

