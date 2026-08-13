"use client";

import Link from "next/link";

const platformLinks = [
  { label: "Alur Kerja", href: "#how-it-works" },
  { label: "Sistem Keamanan", href: "#primitives" },
  { label: "Akses Peran", href: "#roles" },
  { label: "FAQ", href: "#faq" },
];

const accountLinks = [
  { label: "Login Portal", href: "/auth/login" },
  { label: "Dashboard Pusat", href: "/goverment/dashboard" },
  { label: "Hubungi Bantuan", href: "/contact" },
];

const legalLinks = [
  { label: "Kebijakan Privasi", href: "/privacy" },
  { label: "Syarat & Ketentuan", href: "/terms" },
];

export function LandingFooter() {
  return (
    <footer className="bg-[#0F172A] pt-6 pb-6 lg:pt-10 lg:pb-10 px-[clamp(1.5rem,5vw,4rem)] border-t border-slate-800">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-7 h-7 lg:w-8 lg:h-8 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-[10px] flex items-center justify-center text-white font-bold text-xs lg:text-sm">G</div>
              <span className="font-semibold text-white text-sm tracking-[-0.01em]">GIZANTARA</span>
            </div>
            <p className="text-slate-500 text-xs lg:text-sm leading-relaxed">Platform end-to-end traceability untuk program makan bergizi gratis.</p>
          </div>
          <div>
            <h4 className="text-[10px] lg:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 lg:mb-5">Platform</h4>
            <ul className="space-y-2 lg:space-y-3">
              {platformLinks.map((link) => (<li key={link.label}><a href={link.href} className="text-slate-500 text-xs lg:text-sm hover:text-white transition-colors">{link.label}</a></li>))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] lg:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 lg:mb-5">Akses</h4>
            <ul className="space-y-2 lg:space-y-3">
              {accountLinks.map((link) => (<li key={link.label}><Link href={link.href} className="text-slate-500 text-xs lg:text-sm hover:text-white transition-colors">{link.label}</Link></li>))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] lg:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 lg:mb-5">Legal</h4>
            <ul className="space-y-2 lg:space-y-3">
              {legalLinks.map((link) => (<li key={link.label}><Link href={link.href} className="text-slate-500 text-xs lg:text-sm hover:text-white transition-colors">{link.label}</Link></li>))}
            </ul>
          </div>
        </div>
        <div className="mt-6 lg:mt-12 pt-4 lg:pt-6 border-t border-[#334155] flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="text-slate-500 text-xs lg:text-sm">(c) 2026 GIZANTARA GIZANTARA. Semua hak dilindungi.</p>
          <div className="flex items-center gap-4 text-xs lg:text-sm">
            {legalLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-slate-500 hover:text-white transition-colors">{link.label}</Link>
            ))}
            <Link href="/contact" className="text-slate-500 hover:text-white transition-colors">Bantuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
