# AGENTS.md

## Stack

- Monorepo Turborepo + pnpm (workspace: `pnpm-workspace.yaml`).
- `apps/web` = Next.js 16 (App Router) + React 19 + TypeScript.
- Styling: Tailwind CSS, Radix UI (shadcn/ui basis), `radix-ui`.
- Animasi: `framer-motion`/`motion`, `gsap`, `motion` (tersedia di deps `apps/web`).
- Charts: `recharts`.
- Maps: `leaflet`, `react-leaflet`, `maplibre-gl`.
- Auth: `better-auth`. Data: `@tanstack/react-query`, `@tanstack/react-table`.

## Commands

- Install: `pnpm install`
- Dev (web): `pnpm --filter @boga/website dev`
- Build: `pnpm build` (turbo)
- Lint: `pnpm lint`
- Typecheck: `pnpm --filter @boga/website typecheck`
- Format: `pnpm format`

## Design resources — WAJIB dipakai sebelum membuat manual

Selalu prioritaskan komponen/gaya dari sumber berikut. JANGAN membuat dari nol jika sumber sudah menyediakan yang cocok — gunakan/mengacu kode dari link, lalu sesuaikan dengan desain proyek.

| Kebutuhan | Sumber | Kapan digunakan |
|---|---|---|
| Landing page / section (hero, pricing, features, footer, dll.) | https://tailark.com | Membuat atau merombak halaman landing/marketing |
| Komponen UI (buttons, cards, modals, accordion, tabs, dll.) | https://reactbits.dev | Komponen animatif/motion untuk web |
| Komponen UI (shadcn/ui resmi: dialog, toast, table, form, sidebar) | https://ui.shadcn.com | Komponen standar yang butuh aksesibilitas & konsistensi |
| Komponen (gratis/template modern) | https://kokonutui.com | Alternatif komponen siap pakai |
| Animasi JavaScript (sprite, timeline, svg) | https://animejs.com | Animasi detail berbasis JS |
| Hover/gesture smooth (framer-motion/motion) | https://motion.dev | Hover animasi, scroll, gesture, layout transitions |
| Charts (grafik/data visualisasi) | https://bklit.com | Dashboard/grafik selain recharts bawaan |
| Referensi/panduan desain & implementasi | https://manus.im | Acuan workflow & pendekatan sebelum implementasi |
SKILL : D:\Downloads\skill\ui-ux-pro-max-skill-main

## Aturan pemakaian

1. Cek sumber di atas dulu sebelum menulis kode UI dari awal.
2. Komponen yang diambil boleh disalin/diadaptasi, sesuaikan token warna, font (Space Grotesk), dan spacing agar konsisten dengan tema proyek.
3. Pastikan dependency yang dipakai (mis. animejs, kokonutui, bklit) ditambahkan ke `apps/web/package.json` jika belum ada, bukan ditulis manual.
4. Jika sumber tidak punya yang sesuai, baru buat manual mengikuti pola komponen yang sudah ada di `apps/web`.

## 🛠️ Skill Analisa Wajib

- Sebelum membuat/melakukan review overhaul halaman: jalankan skill `ui-ux-pro-max` (design-system + query `ux`/`chart`/`landing`) lalu pakai hasilnya sebagai acuan keputusan.
- Sumber desain pada bagian "Design resources" WAJIB dilihat/di-fetch; jangan build from scratch tanpa referensi dari web tersebut.

## 🎯 Visi Produk: GIZANTARA B.O.G.A (Sumber Kebenaran)

B.O.G.A = Sistem Pengadaan + Verifikasi Vendor + Audit Logistik + Audit Pembayaran + Reputasi.
BUKAN versi "smart contract pencairan dana" (tanpa menyentuh APBN langsung, tanpa payment gateway).

Tagline juri:
> "GIZANTARA B.O.G.A — Platform End-to-End Traceability untuk Program MBG: memverifikasi vendor, memantau pengadaan, mengaudit pembayaran melalui OCR bukti transfer, memvalidasi distribusi berbasis geofencing, serta membangun reputasi vendor dan SPPG menggunakan immutable ledger."

Pengganti model escrow (HAPUS semua narasi DOKU / smart contract / pencairan dana otomatis):
`QC Approve → SPPG transfer manual → Upload bukti transfer → OCR validasi → Ledger Audit`

## 🔄 Alur 13 Langkah GIZANTARA (wajib diikuti UI setiap role)

| # | Langkah | Status code saat ini | Lokasi |
|---|---|---|---|
| 1 | Vendor registrasi (NIB/NPWP/rekening/foto/alamat) + AI OCR | ✅ Ada (OCR belum nyata) | `vendor/register`, `login-form`, `goverment/pengajuan` |
| 2 | Pemerintah approval (lihat hasil OCR → Approve → whitelist) | ✅ Ada | `goverment/pengajuan` (SBT flow) |
| 3 | Katalog vendor + banding HET/PIHPS → warning/tolak | ✅ Ada | `vendor/katalog` |
| 4 | SPPG buat Purchase Order (PO-2026-0001, Waiting Delivery) | ✅ Ada | `sppg/admin/tender`, `vendor/pesanan` |
| 5 | Vendor kirim → SPPG upload foto/jumlah/surat jalan → hash ledger | ✅ Ada (hash sebagian di profil) | `vendor/pesanan`, `vendor/profil` |
| 6 | QC SPPG: Approve → Goods Received / Reject → Dispute | ✅ Ada | `pesanan`, `sppg/admin/evaluation` |
| 7 | [GANTI DOKU] QC Approve → SPPG transfer MANUAL + upload bukti | ❌ BELUM ADA — bangun | komponen `PaymentProofOCR` + halaman SPPG |
| 8 | OCR bukti: tanggal/nominal/pengirim/penerima/bank/refID → cocokkan PO → MATCH / UNDERPAID / MANUAL REVIEW | ❌ BELUM ADA — bangun | runner OCR mock |
| 9 | Ledger audit immutable: Vendor→PO→diterima→dibayar→tanggal→hash | ⚠️ Sebagian | `vendor/profil` (hash) — bangun `goverment/ledger` |
| 10 | Produksi makanan: takaran → max porsi (anti overreport) | ⚠️ Sebagian | `proposal-wizard` — tambah bahan vs laporan |
| 11 | Distribusi: QR scan + GPS + haversine + geofence 50m → Verified/Rejected | ⚠️ Scan no-op, tanpa radius | `MapLibreLogistik` (fix) |
| 12 | Review siswa: rating + komentar + foto → AI NLP kelompokkan kategori | ⚠️ Sebagian (keyword-match) | `FoodRatingModal`, `VendorPerformanceDashboard` (ganti rule NLP) |
| 13 | Reputasi Vendor & SPPG score (waktu/kualitas/dispute/harga; rating siswa) | ✅ Ada | `VendorRanking`, `ComplianceRankingPanel` |

## ⚠️ Aturan implementasi GIZANTARA

1. Backend DIISI DUMMY/MOCK (tanpa backend baru): visualkan semua alur lewat data tiruan di frontend (localStorage/const array — pola `mbgdummydata.ts` & `katalog`).
2. Nama status `escrow` (ESCROW_HOLD/RELEASED/EXPIRED, DOKU) HANYA boleh tersisa sebagai artefak lama; saat implementasi Fase 1 diubah ke semantik pembayaran baru (`MENUNGGU_BUKTI_TRANSFER`, `UNDERPAID`, `PAYMENT_VERIFIED`, `MANUAL_REVIEW`).
3. Copy/narasi TIDAK boleh menyebut: "DOKU", "smart contract", "cairkan dana otomatis APBN". Gunakan: "transfer manual SPPG + verifikasi OCR bukti transfer + ledger audit".
4. Fitur demo wajib memakai label "Simulasi" bila datanya tiruan (poin trust/compliance juri).
5. UI mengikuti hasil revisi analisa UI/UX (lihat bagian Temuan): perbaiki dead button, mobile phase, safe-area, empty state, pagination, dan hapus komponen dead sebelum/selama implementasi fitur baru.
6. Landing page harus menceritakan ulang 13 langkah ini (ganti blok Escrow di `TrustPrimitives` dan `PhaseTimeline`; tambah blok "Audit Pembayaran via OCR").

## 📋 Temuan Analisa UI/UX (acuan perbaikan & evaluasi)

Analisa penuh via skill `ui-ux-pro-max` (WCAG/a11y, dashboard KPI, chart).
 Ringkasan:

### Landing page
- PERTAHANKAN: `HeroSection`, `PhaseTimeline`, `AnimatedNumber`, `EscrowDiagram`, `CustomButtons`.
- PERBAIKI: splash paksa tanpa tombol skip & bukan `<button>` (`SplashScene`), marquee = belum social proof nyata, statistik hardcoded tanpa label "Simulasi" (`RoleGateways`), anchor rusak `/#how` (harus `#how-it-works`).
- KURANG: visual produk di hero, testimoni/logo institusi, FAQ + Privacy/Terms, per-page metadata (root masih `lang="en"` & metadata Inggris untuk konten 100% Bahasa), CTA demo, dan perbaikan mobile (expand detail timeline mati di `<768px`).

### Goverment / SPPG
- PERTAHANKAN: `StatusPerJenjangChart` (color+shape → WCAG-safe), `DashboardFilterContext`, `KPIBar`.
- PERBAIKI: `sppg/layout` import AppSidebar tapi tak dirender, `ContractBuilder` pakai `Math.random()` utk akreditasi, legend/tooltip chart & empty state kala filter 0 data.

### Vendor / Supplier / Logistik
- KRITIS: `localhost:3001` hardcoded di banyak page (patah di deploy), editable Vendor ID (`pesanan:621`, `inbound:590`), fake fallback "Demo" random PIN saat network error (`pesanan:517-526`), bid selalu `vendorList[0]` (`bidding:37`).
- DEAD/INERT: tombol "Cari bahan" (`tender:102`), form tiket logistik (`contact:90`), QR scan no-op (`MapLibreLogistik:562`), search map tak difilter, `alert()` blocking (`MapLibreLogistik:406`).
- Supplier = redirect ke `/sppg/dashboard` (role belum jadi — putuskan: hapus atau bangun sungguhan).

### Sekolah / Mobile
- PERTAHANKAN: `FoodRatingModal` (rating wizard terbaik), `FloatingBottomNav`.
- PERBAIKI: tanpa `safe-area-inset`, theme toggle tanpa onClick (`TopHeader:17`), potensi scroll clipping (`main-wrapper:64`), hardcoded hex bypass token `--role-primary`.
- HAPUS DEAD: `DesktopViewSiswa`, `StoryCarousel`/`ReportForm`/`InteractiveRatingModal` (tak di-import).

### Library `components/ui`
- HAPUS: duplikat `.jsx`/`.tsx` (button, card, input, separator, sheet), 2 dari 3 komponen pagination, `AnimatedScene` duplikat, `LogoLoop` (497 baris) + ~25 komponen 0-import.
- KONSOLIDASI: 3 navbar, `DashboardHeader` (ui vs goverment), `SchoolMap` (ui vs sppg/admin).

---


### 🎯 Prinsip Rombak (WAJIB)

1. **TIDAK MENGHAPUS FEATURE.** Semua fitur & rute tetap hidup (`/vendor/*`, `/sppg/*`, `/goverment/*`, `/logistik/*`, `/sekolah/*`, `/auth/login`, `/contact`, `/orbit-demo`, `/debug/simulator`). Rombak hanya styling/layout/copy.
2. Hapus komponen mati (0-import) & duplikasi UI; konsolidasikan ke satu varian — bukan menghapus fitur.
3. Semua data tetap via `lib/mbgdummydata.ts` / const array / localStorage — JANGAN menyentuh backend contract yang sudah berjalan (better-auth, `lib/pesanan.ts`, `lib/bidding.ts`, `lib/tender-utils.ts`).
4. Lanjutkan migrasi semantik pembayaran: hapus artefak `escrow/DOKU/smart-contract/cairkan otomatis` dari UI; pakai `MENUNGGU_BUKTI_TRANSFER / UNDERPAID / PAYMENT_VERIFIED / MANUAL_REVIEW`. Provinsi: fungsional tetap setara (jangan patahkan test `lib/__tests__/pesanan.test.ts`).
5. Setiap fitur demo berlabel **Simulasi** bila datanya tiruan.
6. Font utama **Space Grotesk** (`@fontsource/space-grotesk` sudah di deps) — ganti Plus_Jakarta_Sans di `app/layout.tsx` untuk konsistensi AGENTS.
7. **TDD**: mulai tiap fase dengan endors test dulu. Ada runner `vitest` + `@testing-library/react` + `jsdom` siaga (`apps/web/vitest.config.ts`, `vitest.setup.ts`). Baseline saat ini: 8 test lolos (2 file). Run `pnpm --filter @boga/website test run`. Fix `pnpm lint` (eslint.config.mjs pakai flat config; skrip `next lint` rusak → ganti `eslint .`).
8. Perubahan tiap fase diakhiri `pnpm --filter @boga/website typecheck` + `pnpm --filter @boga/website test run` + `pnpm build` (turbo). Pastikan tidak ada fitur yang tertutup (smoke-test tiap rute manual).

### 🎨 Direction Design ("Anti AI-generik")

- **Warna**: turunkan dominasi gradient biru-ungu generik. Utamakan palet "trust navy + beige + green audit" dari design-system skill: `#1E3A5F` primary, `#2563EB` secondary, `#16A34A` aksen (verified/audit), `#F8FAFC` background, `#0F172A` foreground. Simfoni per-role: Pemerintah=navy, Vendor=amber, SPPG=cyan, Logistik=emerald, Sekolah=violet.
- **Style**: Exaggerated Minimalism / editorial (spasi besar, tipografi tegas) + bento-grid untuk dashboard. Kurangi `blur-[100px]`, gradient mesh, dan card glassmorphism berulang.
- **Motion**: 150–300ms, hormati `prefers-reduced-motion`; scroll reveal bertahap (motion.dev), bukan dekoratif.
- **Charts**: pakai recharts yang ada, style konsisten via `ui-ux-pro-max` query `chart` (tooltip/legend selalu, warna accessible, jangan andalkan warna saja).
- **Referensi web (AGENTS bagian Design resources)** WAJIB dipakai per kebutuhan: tailark.com (landing/section), reactbits.dev (komponen animatif), ui.shadcn.com (komponen standar/aksesibel), kokonutui.com (template alternatif), animejs.com (animasi JS detail), motion.dev (hover/gesture/scroll), bklit.com (chart), manus.im (workflow).
- **Jalankan skill** `ui-ux-pro-max` (design-system + query `ux`/`landing`/`chart`) sebelum setiap fase rombak.


## ✅ Definisi "Fitur Tidak Tertutup" (Checklist Akhir)
1. Semua rute di atas accessible via login demo → render tanpa error (smoke manual + render test).
2. `pnpm lint` hijau (ganti `next lint` → `eslint .`), `typecheck` hijau, `pnpm build` sukses.
3. Test suite bertambah (target: semua logika rapid di `lib/*` ditest: pesanan, bidding, tender-utils, haversine/geofence, oauth/OCR mock), seluruh test lulus.
4. Tidak ada string `DOKU`/`smart contract`/`escrow` baru di UI; `escrow` hanya tersisa di artefak legacy + test migration.
5. Tidak ada tombol/inert UI yang mati (grep `onClick`/href kosong).
6. Per-role navigation seragam & konsisten (satu pattern sidebar/navbar).

---

## 🚧 RENCANA ROMBAK TOTAL GIZANTARA B.O.G.A (6 FASE)

> Dipicu dari evaluasi: mockup saat ini "terlalu AI-generik" (gradient ungu-biru seragam, glassmorphism berlebihan, banyak dead button, status escrow/DOKU tersisa, dan `next lint` rusak). Berikut rencana rombak menyeluruh yang **berpatokan penuh pada aturan di atas** — JANGAN menghapus fitur apa pun, hanya menyelaraskan tampilan/layout dengan data dummy yang ada.

### 🎯 Prinsip Rombak (WAJIB)

1. **TIDAK MENGHAPUS FEATURE.** Semua fitur & rute tetap hidup (`/vendor/*`, `/sppg/*`, `/goverment/*`, `/logistik/*`, `/sekolah/*`, `/auth/login`, `/contact`, `/orbit-demo`, `/debug/simulator`). Rombak hanya styling/layout/copy.
2. Hapus komponen mati (0-import) & duplikasi UI; konsolidasikan ke satu varian — bukan menghapus fitur.
3. Semua data tetap via `lib/mbgdummydata.ts` / const array / localStorage — JWEB JANGAN menyentuh backend contract yang sudah berjalan (better-auth, `lib/pesanan.ts`, `lib/bidding.ts`, `lib/tender-utils.ts`).
4. Lanjutkan migrasi semantik pembayaran: hapus artefak `escrow/DOKU/smart-contract/cairkan otomatis` dari UI; pakai `MENUNGGU_BUKTI_TRANSFER / UNDERPAID / PAYMENT_VERIFIED / MANUAL_REVIEW`. Provinsi: fungsional tetap setara (jangan patahkan test `lib/__tests__/pesanan.test.ts`).
5. Setiap fitur demo berlabel **Simulasi** bila datanya tiruan.
6. Font utama **Space Grotesk** (`@fontsource/space-grotesk` sudah di deps) — ganti Plus_Jakarta_Sans di `app/layout.tsx` untuk konsistensi AGENTS.
7. **TDD**: mulai tiap fase dengan endors test dulu. Ada runner `vitest` + `@testing-library/react` + `jsdom` siaga (`apps/web/vitest.config.ts`, `vitest.setup.ts`). Baseline saat ini: 8 test lolos (2 file). Run `pnpm --filter @boga/website test run`. Fix `pnpm lint` (eslint.config.mjs pakai flat config; skrip `next lint` rusak → ganti `eslint .`).
8. Perubahan tiap fase diakhiri `pnpm --filter @boga/website typecheck` + `pnpm --filter @boga/website test run` + `pnpm build` (turbo). Pastikan tidak ada fitur yang tertutup (smoke-test tiap rute manual).

### 🎨 Direction Design ("Anti AI-generik")

- **Warna**: turunkan dominasi gradient biru-ungu generik. Utamakan palet "trust navy + beige + green audit" dari design-system skill: `#1E3A5F` primary, `#2563EB` secondary, `#16A34A` aksen (verified/audit), `#F8FAFC` background, `#0F172A` foreground. Simfoni per-role: Pemerintah=navy, Vendor=amber, SPPG=cyan, Logistik=emerald, Sekolah=violet.
- **Style**: Exaggerated Minimalism / editorial (spasi besar, tipografi tegas) + bento-grid untuk dashboard. Kurangi `blur-[100px]`, gradient mesh, dan card glassmorphism berulang.
- **Motion**: 150–300ms, hormati `prefers-reduced-motion`; scroll reveal bertahap (motion.dev), bukan dekoratif.
- **Charts**: pakai recharts yang ada, style konsisten via `ui-ux-pro-max` query `chart` (tooltip/legend selalu, warna accessible, jangan andalkan warna saja).
- **Referensi web (AGENTS bagian Design resources)** WAJIB dipakai per kebutuhan: tailark.com (landing/section), reactbits.dev (komponen animatif), ui.shadcn.com (komponen standar/aksesibel), kokonutui.com (template alternatif), animejs.com (animasi JS detail), motion.dev (hover/gesture/scroll), bklit.com (chart), manus.im (workflow).
- **Jalankan skill** `ui-ux-pro-max` (design-system + query `ux`/`landing`/`chart`) sebelum setiap fase rombak.

