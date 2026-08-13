import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";

const sections = [
  {
    title: "1. Data yang Kami Proses",
    body: "Situs ini adalah simulasi (mock) untuk memvisualkan alur kerja GIZANTARA GIZANTARA. Data yang dimasukkan — seperti dokumen vendor, PO, dan bukti transfer — hanya disimpan di penyimpanan lokal perangkat Anda (localStorage) dan tidak dikirim ke server produksi.",
  },
  {
    title: "2. Penggunaan Demo",
    body: "Seluruh angka, statistik, dan peran yang tampil di demo bersifat tiruan dan diberi label 'Simulasi'. Tidak ada transaksi riil APBN yang diproses melalui platform ini.",
  },
  {
    title: "3. Keamanan",
    body: "Kami menerapkan kontrol akses berbasis peran pada semua antarmuka. Namun karena ini demo, jangan gunakan data pribadi sensitif yang sesungguhnya.",
  },
  {
    title: "4. Perubahan Kebijakan",
    body: "Kebijakan ini dapat diperbarui sewaktu-waktu. Perubahan besar akan ditandai di halaman ini.",
  },
  {
    title: "5. Kontak",
    body: "Pertanyaan seputar privasi dapat dikirim ke support@boga.id.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <LandingNavbar />
      <main className="min-h-svh px-4 pb-16 pt-28 md:px-6 md:pt-32">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
            GIZANTARA • Legal
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Kebijakan Privasi
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