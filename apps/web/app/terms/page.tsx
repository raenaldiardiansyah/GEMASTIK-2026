import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";

const sections = [
  {
    title: "1. Status Demo",
    body: "GIZANTARA GIZANTARA adalah platform simulasi untuk verifikasi vendor, pengadaan, audit pembayaran via OCR, distribusi geofencing, dan reputasi. Akses ke sini tidak menjamin layanan produksi apa pun dan tidak terkait dengan pembayaran dana riil.",
  },
  {
    title: "2. Transfer Manual & OCR",
    body: "Dalam alur GIZANTARA, pembayaran dilakukan secara manual oleh SPPG. Platform tidak mengunci, menahan, atau mencairkan dana secara otomatis; yang platform lakukan adalah memverifikasi bukti transfer melalui OCR dan mencatatnya di ledger audit.",
  },
  {
    title: "3. Tanggung Jawab Data",
    body: "Pengguna bertanggung jawab atas keakuratan data yang dimasukkan selama demo, termasuk dokumen identitas, PO, dan bukti pembayaran.",
  },
  {
    title: "4. Tanpa Jaminan",
    body: "Seluruh fitur disediakan 'sebagaimana adanya' untuk keperluan demonstrasi. Tidak ada jaminan ketersediaan, keakuratan, atau kesesuaian untuk kepentingan tertentu.",
  },
  {
    title: "5. Hukum yang Berlaku",
    body: "Syarat ini diatur oleh hukum Republik Indonesia. Sengketa akan diselesaikan melalui pengadilan yang berwenang di wilayah Indonesia.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <LandingNavbar />
      <main className="min-h-svh px-4 pb-16 pt-28 md:px-6 md:pt-32">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
            GIZANTARA • Legal
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Syarat & Ketentuan
          </h1>
          <p className="mt-4 text-base text-slate-400">
            Sah per 12 Agustus 2026. Berlaku untuk situs demo GIZANTARA GIZANTARA.
          </p>
          <div className="mt-8 space-y-5">
            {sections.map((s) => (
              <div key={s.title} className="rounded-2xl border border-[#334155] bg-white/[0.03] p-6">
                <h2 className="text-sm font-bold text-white md:text-base">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}