"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Landmark, Store, Box, Truck, School, Users } from "lucide-react";
import Link from "next/link";
import { PrimaryButton } from "./CustomButtons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const portalLinks = [
  { 
    label: "Portal Pemerintah", 
    href: "/goverment/dashboard", 
    icon: Landmark,
    desc: "Verifikasi vendor, pengawasan & audit kepatuhan SBT.",
    tag: "Governance",
    color: "from-blue-500/20 to-indigo-500/10 text-cyan-400 border-blue-500/30"
  },
  { 
    label: "Portal Vendor", 
    href: "/vendor/dashboard", 
    icon: Store,
    desc: "Katalog HET, pengadaan, dan upload OCR bukti transfer.",
    tag: "Supplier",
    color: "from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30"
  },
  { 
    label: "Portal SPPG", 
    href: "/sppg/dashboard", 
    icon: Box,
    desc: "Penerbitan PO, penjaminan gizi, dan QC penerimaan.",
    tag: "Assurance",
    color: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30"
  },
  { 
    label: "Portal Logistik", 
    href: "/logistik/dashboard", 
    icon: Truck,
    desc: "Pelacakan GPS armada & validasi geofence <= 50m.",
    tag: "Distribution",
    color: "from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30"
  },
  { 
    label: "Admin Sekolah", 
    href: "/sekolah/admin", 
    icon: School,
    desc: "Pencatatan porsi harian & verifikasi foto penerimaan.",
    tag: "School Log",
    color: "from-violet-500/20 to-purple-500/10 text-violet-400 border-violet-500/30"
  },
  { 
    label: "Portal Siswa", 
    href: "/sekolah/siswa", 
    icon: Users,
    desc: "Rating gizi menu harian & analisis sentimen ulasan.",
    tag: "Feedback",
    color: "from-pink-500/20 to-rose-500/10 text-pink-400 border-pink-500/30"
  },
];

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobilePortalsOpen, setMobilePortalsOpen] = useState(false);
  const [portalHovered, setPortalHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Beranda", href: "#" },
    { label: "Alur Kerja", href: "#how-it-works" },
    { label: "Keamanan", href: "#primitives" },
    { label: "Peran", href: "#roles" },
    { label: "Portal", href: "#", hasDropdown: true },
  ];

  return (
    <>
      <nav
        className={[
          "fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-500",
          scrolled || portalHovered
            ? "bg-[#0F172A]/95 backdrop-blur-[24px] border-b border-slate-800/80 shadow-2xl"
            : "bg-black/10 backdrop-blur-[12px] border-b border-white/10",
        ].join(" ")}
      >
        <div className="h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-[10px] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20">
              B
            </div>
            <span className="font-bold text-sm tracking-tight text-white">
              GIZANTARA
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              if (link.hasDropdown) {
                return (
                  <div
                    key={link.label}
                    onMouseEnter={() => setPortalHovered(true)}
                    onMouseLeave={() => setPortalHovered(false)}
                    className="relative py-6"
                  >
                    <button
                      className="flex items-center gap-1.5 text-sm font-bold text-white/90 hover:text-white transition-colors cursor-pointer"
                    >
                      <span>{link.label}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${portalHovered ? "rotate-180 text-cyan-400" : "opacity-60"}`} />
                    </button>
                  </div>
                );
              }
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <PrimaryButton
              href="/auth/login"
              className="py-2.5 px-5 text-sm"
              icon={false}
            >
              Masuk
            </PrimaryButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="md:hidden bg-[#0F172A]/95 backdrop-blur-[24px] border-b border-slate-800 text-white overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    <button
                      onClick={() => {
                        if (link.hasDropdown) {
                          setMobilePortalsOpen(!mobilePortalsOpen);
                        } else {
                          setMenuOpen(false);
                          window.location.href = link.href;
                        }
                      }}
                      className="w-full flex items-center justify-between py-3 px-4 rounded-xl text-slate-200 font-medium hover:bg-slate-800 transition-colors"
                    >
                      {link.label}
                      {link.hasDropdown && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${mobilePortalsOpen ? "rotate-180" : ""}`}
                        />
                      )}
                    </button>
                    {link.hasDropdown && (
                      <AnimatePresence>
                        {mobilePortalsOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 overflow-hidden"
                          >
                            {portalLinks.map((portal) => (
                              <Link
                                key={portal.label}
                                href={portal.href}
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-300 text-sm hover:bg-slate-800 transition-colors"
                              >
                                <portal.icon className="w-4 h-4 opacity-70" />
                                {portal.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                ))}
                <div className="mt-4 px-4 pb-4">
                  <PrimaryButton
                    href="/auth/login"
                    className="w-full"
                    icon={false}
                  >
                    Masuk
                  </PrimaryButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Tailark Full-Width Mega Menu Backdrop Blur & Panel (Pure White 60-30-10) */}
      <AnimatePresence>
        {portalHovered && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setPortalHovered(false)}
              className="fixed inset-0 top-[72px] bg-slate-950/40 backdrop-blur-xl z-40 pointer-events-auto"
            />

            {/* Full-Width Mega Menu Dropdown Container */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onMouseEnter={() => setPortalHovered(true)}
              onMouseLeave={() => setPortalHovered(false)}
              className="fixed top-[72px] left-0 right-0 w-full bg-white border-b border-slate-200/90 shadow-2xl z-50 text-slate-900 overflow-hidden"
            >
              <div className="max-w-[1340px] mx-auto px-6 lg:px-8 py-5 lg:py-6">
                <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-6 items-stretch">
                  {/* Left Column Banner (30% Secondary Structural Anchor) */}
                  <div className="bg-[#0F172A] rounded-xl p-4 sm:p-5 border border-slate-800 flex flex-col justify-between relative overflow-hidden shadow-lg text-white">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[9px] font-extrabold uppercase tracking-widest mb-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        EKOSISTEM GIZANTARA
                      </div>
                      <h4 className="text-base font-extrabold text-white leading-snug mb-1.5">
                        6 Portal Terintegrasi MBG
                      </h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-medium mb-3 line-clamp-2">
                        Setiap peran terhubung dalam siklus audit transparan: pengadaan, OCR bukti transfer, geofence, dan laporan gizi.
                      </p>
                    </div>
                    <div>
                      <Link
                        href="/auth/login"
                        onClick={() => setPortalHovered(false)}
                        className="inline-flex items-center justify-center w-full py-2 px-3 rounded-lg bg-[#1E3A5F] text-white text-[11px] font-black shadow-md hover:bg-slate-900 transition-all"
                      >
                        Pilih Role &amp; Masuk Portal
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: 6 Role Cards (White 60-30-10 Grid) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {portalLinks.map((portal) => (
                      <Link
                        key={portal.label}
                        href={portal.href}
                        onClick={() => setPortalHovered(false)}
                        className="group bg-slate-50 border border-slate-200/90 hover:border-slate-400 hover:bg-white rounded-xl p-3 transition-all duration-250 flex flex-col justify-between shadow-sm hover:shadow-md"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm text-[#1E3A5F]">
                              <portal.icon className="w-4 h-4" />
                            </div>
                            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 border border-slate-300">
                              {portal.tag}
                            </span>
                          </div>
                          <h5 className="text-xs font-extrabold text-slate-900 group-hover:text-[#1E3A5F] transition-colors mb-0.5">
                            {portal.label}
                          </h5>
                          <p className="text-[11px] text-slate-500 leading-snug line-clamp-1 font-medium">
                            {portal.desc}
                          </p>
                        </div>
                        <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-extrabold text-[#1E3A5F] group-hover:translate-x-1 transition-transform">
                          <span>Akses Portal</span>
                          <span>&rarr;</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
