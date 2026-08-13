"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Truck, School, Users, Briefcase } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LoginForm = dynamic(() => import("@/components/ui/login-form").then(m => m.LoginForm), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full animate-pulse rounded-xl bg-slate-100" />,
});

export type AuthModeType = "login" | "signup";

export interface RoleType {
  id: string;
  label: string;
  desc: string;
  accent: string;
  bg: string;
  icon: React.ReactNode;
}

const ROLES: RoleType[] = [
  {
    id: "goverment",
    label: "Pemerintah",
    desc: "Instansi & lembaga negara",
    accent: "#0F172A",
    bg: "#F8FAFC",
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    id: "sppg",
    label: "SPPG",
    desc: "Satuan Pelayanan Pangan Gizi",
    accent: "#0F172A",
    bg: "#F8FAFC",
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: "sekolah",
    label: "Sekolah",
    desc: "Lembaga pendidikan",
    accent: "#0F172A",
    bg: "#F8FAFC",
    icon: <School className="w-5 h-5" />,
  },
  {
    id: "vendor",
    label: "Vendor",
    desc: "Penyedia jasa & solusi",
    accent: "#0F172A",
    bg: "#F8FAFC",
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    id: "logistik",
    label: "Logistik",
    desc: "Jasa pengiriman & distribusi",
    accent: "#0F172A",
    bg: "#F8FAFC",
    icon: <Truck className="w-5 h-5" />,
  },
];

function RoleSelectionList({
  selectedRole,
  onSelect,
}: {
  selectedRole: RoleType | null;
  onSelect: (role: RoleType) => void;
}) {
  const isExpanded = !!selectedRole;
  return (
    <div className="flex flex-col gap-4 p-5 md:p-6 h-full">
      <div className={cn("flex flex-col transition-all duration-500", isExpanded ? "items-start text-left" : "items-center text-center")}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-900 text-white text-base font-bold mb-3 shadow-sm">
          B
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">
          Selamat datang
        </h1>
        <p className="text-sm text-slate-500 mt-1.5">
          Pilih peran Anda untuk masuk ke sistem GIZANTARA.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 mt-2 flex-grow">
        {ROLES.map((role) => {
          const isSelected = selectedRole?.id === role.id;
          return (
            <button
              key={role.id}
              onClick={() => onSelect(role)}
              className={cn(
                "group flex items-center gap-3 p-3 rounded-xl border transition-all text-left w-full focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2",
                isSelected
                  ? "bg-slate-50 border-slate-900 shadow-sm ring-1 ring-slate-900"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <div
                className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                  isSelected
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                )}
              >
                {role.icon}
              </div>
              <div className="flex-grow">
                <p className={cn("text-sm font-semibold transition-colors", isSelected ? "text-slate-900" : "text-slate-700")}>
                  {role.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{role.desc}</p>
              </div>
              <div className="flex-shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={cn(
                    "transition-all",
                    isSelected ? "text-slate-900 translate-x-1 opacity-100" : "text-slate-300 opacity-0 group-hover:opacity-100"
                  )}
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-center md:text-left text-xs text-slate-400">
        Butuh bantuan?{" "}
        <Link href="/contact" className="text-slate-900 hover:underline font-medium">
          Hubungi admin
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  const [role, setRole] = useState<RoleType | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-slate-200 overflow-hidden">
      <motion.div
        layout
        className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row relative"
        initial={false}
        animate={{
          maxWidth: role ? "840px" : "400px",
        }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      >
        {/* Left Side: Roles */}
        <motion.div
          layout
          className="w-full shrink-0"
          animate={{
            width: role ? "50%" : "100%",
          }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        >
          <RoleSelectionList selectedRole={role} onSelect={setRole} />
        </motion.div>

        {/* Right Side: Form */}
        <AnimatePresence>
          {role && (
            <motion.div
              key="login-form-container"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
              className="w-full md:w-1/2 border-t md:border-t-0 md:border-l border-slate-100 bg-slate-50/50 flex flex-col"
            >
              {/* @ts-ignore */}
              <LoginForm role={role} onBack={() => setRole(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}