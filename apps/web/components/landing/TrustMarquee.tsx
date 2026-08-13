"use client";

import {
  Landmark,
  UtensilsCrossed,
  School,
  Building2,
  Plus,
  HeartPulse,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const institutions = [
  { icon: Landmark, name: "Kemenko PMK", tag: "Koordinasi Program" },
  { icon: UtensilsCrossed, name: "BGN", tag: "Badan Gizi Nasional" },
  { icon: School, name: "Kemendikdasmen", tag: "Pendidikan Dasar" },
  { icon: Building2, name: "Kementan", tag: "Ketahanan Pangan" },
  { icon: Plus, name: "BPOM", tag: "Keamanan Pangan" },
  { icon: HeartPulse, name: "Kemenkes", tag: "Kesehatan Masyarakat" },
];

function InstitutionItem({ icon: Icon, name, tag }: { icon: any; name: string; tag: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2.5 bg-white border border-slate-200/90 rounded-full px-5 py-2.5 shrink-0 cursor-pointer hover:border-slate-400 hover:shadow-md transition-all shadow-sm">
          <Icon className="w-4 h-4 text-[#1E3A5F]" />
          <span className="text-sm font-bold text-slate-800 whitespace-nowrap">
            {name}
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4 shadow-xl bg-white border-slate-200 text-slate-900">
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-extrabold text-slate-900">{name}</p>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {tag} — elemen mitra strategis pada alur MBG (Simulasi).
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const items = [...institutions, ...institutions, ...institutions, ...institutions];
  return (
    <div
      className={`landing-marquee-container overflow-hidden ${reverse ? "mt-3" : ""}`}
    >
      <div
        className={`landing-marquee-track flex gap-4 ${reverse ? "animate-[marqueeReverse_40s_linear_infinite]" : "animate-[marquee_40s_linear_infinite]"}`}
        style={{ width: "max-content" }}
      >
        {items.map((institution, i) => (
          <InstitutionItem
            key={`${institution.name}-${i}`}
            icon={institution.icon}
            name={institution.name}
            tag={institution.tag}
          />
        ))}
      </div>
    </div>
  );
}

export function TrustMarquee() {
  return (
    <section className="pt-10 md:pt-12 pb-8 md:pb-10 bg-[#F1F5F9] border-y border-slate-200/80">
      <p className="text-center text-[11px] md:text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-5">
        Kolaborasi Mitra Strategis Ekosistem · Simulasi
      </p>
      <MarqueeRow />
      <MarqueeRow reverse />
    </section>
  );
}
