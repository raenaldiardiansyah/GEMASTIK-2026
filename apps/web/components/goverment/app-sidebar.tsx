"use client";

import {
  Activity,
  Award,
  BarChart3,
  Bell,
  CheckCircle,
  CheckCheck,
  FileText,
  History,
  LayoutDashboard,
  PieChart,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { RoleAppSidebar } from "@/components/dashboard/role-app-sidebar";

export function AppSidebar() {
  return (
    <RoleAppSidebar
      roleLabel="Portal Pemerintah"
      homeHref="/goverment/dashboard"
      items={[
        {
          label: "Dashboard Utama",
          href: "/goverment/dashboard",
          icon: LayoutDashboard,
          match: "exact",
        },
        {
          label: "Audit & Transparansi",
          href: "/goverment/ledger",
          icon: ShieldCheck,
          children: [
            {
              label: "Audit Ledger Blockchain",
              href: "/goverment/ledger",
              icon: History,
            },
            {
              label: "Audit Kualitas Pangan",
              href: "/goverment/audit-pangan",
              icon: PieChart,
            },
            {
              label: "Dashboard Reputasi (SBT)",
              href: "/goverment/dashboard-reputasi",
              icon: Award,
            },
          ],
        },
        {
          label: "Verifikasi & Whitelist",
          href: "/goverment/verifikasi",
          icon: CheckCircle,
          children: [
            {
              label: "Verifikasi Supplier",
              href: "/goverment/pengajuan",
              icon: FileText,
            },
            {
              label: "Pengawasan Distribusi",
              href: "/goverment/pengawasan",
              icon: Activity,
            },
            {
              label: "Verifikasi Selesai",
              href: "/goverment/verifikasi/selesai",
              icon: CheckCheck,
              match: "exact",
            },
          ],
        },
        {
          label: "Laporan & Sistem",
          href: "/goverment/statistik",
          icon: BarChart3,
          children: [
            {
              label: "Statistik MBG",
              href: "/goverment/statistik",
              icon: PieChart,
            },
            {
              label: "Riwayat Log",
              href: "/goverment/riwayat",
              icon: History,
            },
            {
              label: "Notifikasi",
              href: "/goverment/notifikasi",
              icon: Bell,
            },
            {
              label: "Pengaturan Portal",
              href: "/goverment/settings",
              icon: Settings,
            },
          ],
        },
      ]}
    />
  );
}

