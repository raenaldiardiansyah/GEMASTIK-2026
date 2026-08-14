"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  UserCheck,
  ShoppingBag,
  CreditCard,
  ShieldCheck,
  MessageSquare,
  Search,
  CheckCircle2,
  ArrowRight,
  FileText,
  Lock,
  ChevronRight,
  Sparkles,
  Layers,
  Terminal
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface StepDetail {
  nomor: string;
  judul: string;
  aktor: string;
  inputData: string;
  aksiSistem: string;
  outputData: string;
  langkahDetail: string[];
}

interface ManualSection {
  id: string;
  code: string;
  title: string;
  icon: any;
  summary: string;
  steps: StepDetail[];
}

const MANUAL_SECTIONS: ManualSection[] = [
  {
    id: "9.1",
    code: "9.1",
    title: "Registrasi dan Verifikasi Supplier",
    icon: UserCheck,
    summary: "Panduan onboarding vendor bahan pangan, ekstraksi dokumen legalitas via OCR, validasi AI Vision, dan pencatatan whitelist pada Immutable Ledger.",
    steps: [
      {
        nomor: "1",
        judul: "Pengisian Profil Usaha dasar",
        aktor: "Calon Supplier",
        inputData: "Nama Entitas, Alamat Gudang/Kebun, Rekening Perbankan, Kontak",
        aksiSistem: "Membuat draft akun dan menggenerasi Alamat Wallet Kriptografi.",
        outputData: "Akun Unverified & Wallet Public Key",
        langkahDetail: [
          "Akses Portal Web B.O.G.A pada URL /goverment/verifikasi-supplier.",
          "Klik tombol 'Registrasi Supplier Baru' dan lengkapi form profil usaha.",
          "Verifikasi nomor telepon via OTP SMS / WhatsApp."
        ]
      },
      {
        nomor: "2",
        judul: "Unggah Berkas Legalitas Fisik",
        aktor: "Calon Supplier",
        inputData: "Pindaian NIB, KTP Pemilik, NPWP Badan, Sertifikat Halal & Higiene",
        aksiSistem: "Penerimaan file via Drag-and-Drop Dropzone dengan batas file 10MB.",
        outputData: "File Berkas Terenkripsi di Server",
        langkahDetail: [
          "Pilih jenis dokumen pada borang pengunggahan.",
          "Unggah file pindaian berformat PDF atau PNG presisi tinggi.",
          "Pastikan stempel dan nomor dokumen terlihat jelas tanpa terpotong."
        ]
      },
      {
        nomor: "3",
        judul: "Ekstraksi & Validasi Otomatis AI/OCR",
        aktor: "AI OCR Microservice & AI Vision Engine",
        inputData: "File Dokumen Pindaian",
        aksiSistem: "Memindai teks (<2s), pengecekan manipulasi piksel, dan validasi API Kemenkeu/Kemendag.",
        outputData: "Status Validation Matrix & Akurasi OCR (%)",
        langkahDetail: [
          "Microservice OCR mengekstraksi teks nomor registrasi NIB dan NPWP.",
          "AI Vision memeriksa keaslian stempel dan stiker legalitas.",
          "Sistem membandingkan data ekstraksi dengan basis data kementerian."
        ]
      },
      {
        nomor: "4",
        judul: "Pencatatan Izin di Blockchain Ledger",
        aktor: "Otoritas BGN / Admin Sistem",
        inputData: "Hasil Pengecekan AI OCR",
        aksiSistem: "Mendaftarkan profil Supplier ke Whitelist Immutable Ledger B.O.G.A.",
        outputData: "Status Terverifikasi & Izin Akses Katalog",
        langkahDetail: [
          "Admin meninjau status hijau pada Validation Matrix.",
          "Klik tombol 'Otorisasi & Daftarkan Wallet ke Whitelist'.",
          "Supplier resmi memperoleh status Terverifikasi dan siap menerima PO."
        ]
      }
    ]
  },
  {
    id: "9.2",
    code: "9.2",
    title: "Proses Pengadaan dan Audit Trail",
    icon: ShoppingBag,
    summary: "Panduan penerbitan Purchase Order bahan baku oleh SPPG, validasi batas HET/PIHPS, dan peninjauan alokasi anggaran.",
    steps: [
      {
        nomor: "1",
        judul: "Penyusunan Purchase Order (PO)",
        aktor: "Staf Pengadaan SPPG",
        inputData: "Daftar Komoditas, Volume (Kg/Ton), Jadwal Pengiriman",
        aksiSistem: "Memvalidasi harga komoditas terhadap batas PIHPS/HET nasional.",
        outputData: "Draft PO Lolos Validasi Harga",
        langkahDetail: [
          "Buka modul E-Katalog B.O.G.A di portal SPPG.",
          "Pilih komoditas dari supplier terverifikasi.",
          "Sistem akan memblokir penerbitan jika harga melebihi batas HET."
        ]
      },
      {
        nomor: "2",
        judul: "Konfirmasi & Penerbitan Invoice",
        aktor: "Supplier Terverifikasi",
        inputData: "Draft PO Masuk",
        aksiSistem: "Mengunci ketersediaan stok dan menerbitkan Invoice Digital.",
        outputData: "Invoice Tagihan Pengadaan",
        langkahDetail: [
          "Supplier menerima notifikasi pesanan masuk.",
          "Memeriksa kesiapan komoditas di gudang.",
          "Menekan tombol 'Konfirmasi & Terbitkan Invoice'."
        ]
      },
      {
        nomor: "3",
        judul: "Pencatatan Audit Trail Blockchain",
        aktor: "Sistem Audit B.O.G.A & Blockchain Ledger",
        inputData: "Data Invoice & RAB Pengadaan",
        aksiSistem: "Mengenkripsi dan mempublikasikan Hash Transaksi ke jaringan blockchain B.O.G.A.",
        outputData: "Immutable Transaction Hash",
        langkahDetail: [
          "Sistem secara otomatis membuat struktur data terenkripsi.",
          "Hash transaksi disimpan di ledger blockchain B.O.G.A.",
          "Rencana anggaran kunci secara permanen tanpa dapat diubah."
        ]
      },
      {
        nomor: "4",
        judul: "Verifikasi Alokasi Anggaran Manual",
        aktor: "Sistem Keuangan SPPG & Bank Nasional",
        inputData: "Alokasi Dana Anggaran SPPG",
        aksiSistem: "Mengalokasikan dana sesuai nilai PO untuk persiapan transfer manual ke vendor.",
        outputData: "Alokasi Anggaran Terkonfirmasi",
        langkahDetail: [
          "Dana sebesar total nilai PO dialokasikan oleh SPPG pada rekening giro resmi.",
          "Transfer akhir membutuhkan persetujuan QC (Goods Received) dan validasi AI OCR bukti transfer."
        ]
      }
    ]
  },
  {
    id: "9.3",
    code: "9.3",
    title: "Verifikasi Pembayaran & Rekonsiliasi Otomatis",
    icon: CreditCard,
    summary: "Panduan unggah bukti transfer perbankan, rekonsiliasi otomatis nominal PO, serta pencegahan klaim resi ganda (anti-replay).",
    steps: [
      {
        nomor: "1",
        judul: "Unggah Bukti Transfer Perbankan",
        aktor: "Staf Keuangan SPPG / Supplier",
        inputData: "Foto / Scan Resi Transfer Bank",
        aksiSistem: "Penerimaan file resi dan rendering di canvas previewer.",
        outputData: "Gambar Resi Pembayaran Aktif",
        langkahDetail: [
          "Akses Halaman Verifikasi Pembayaran.",
          "Unggah foto resi transfer bank resmi.",
          "Pastikan nomor referensi dan nominal terbaca jelas."
        ]
      },
      {
        nomor: "2",
        judul: "Ekstraksi Parameter via OCR",
        aktor: "OCR Validation Engine",
        inputData: "Gambar Resi Transfer",
        aksiSistem: "Membaca Nomor Referensi, Nominal (Rp), Tanggal, dan Bank Tujuan.",
        outputData: "Extracted Payment Metadata",
        langkahDetail: [
          "Mesin OCR memproses gambar resi.",
          "Mengekstraksi digit angka nominal dan string nomor referensi.",
          "Menghitung skor confidence kelayakan teks."
        ]
      },
      {
        nomor: "3",
        judul: "Pencocokan Data Auto-Reconciliation",
        aktor: "AI Validation Engine",
        inputData: "Extracted Metadata vs Data PO",
        aksiSistem: "Verifikasi Nominal Match 100% dan pengecekan keunikan Ref ID (Anti-Replay).",
        outputData: "Status Match 100% & Anti-Replay Valid",
        langkahDetail: [
          "Sistem mencocokkan nominal resi dengan tagihan PO.",
          "Memeriksa apakah nomor referensi pernah digunakan sebelumnya.",
          "Status berubah menjadi Terekonsiliasi jika valid."
        ]
      },
      {
        nomor: "4",
        judul: "Transfer Manual & Validasi AI-OCR Bukti Transfer",
        aktor: "Staf SPPG & Mesin TrOCR",
        inputData: "Status Reconciliation Valid",
        aksiSistem: "Memvalidasi resi transfer manual (mencegah manipulasi/fraud) dan mencatat lunas di Ledger.",
        outputData: "Status Pembayaran Lunas & Transaction Hash",
        langkahDetail: [
          "Staf SPPG mentransfer dana manual ke vendor, lalu mengunggah bukti resinya.",
          "Sistem AI-OCR TrOCR memindai resi untuk memastikan nominal sesuai 100% dengan PO.",
          "Status transaksi diperbarui di ledger blockchain."
        ]
      }
    ]
  },
  {
    id: "9.4",
    code: "9.4",
    title: "Audit Pangan & Analisis AI Governance",
    icon: ShieldCheck,
    summary: "Panduan pengawasan kelayakan nutrisi, higiene dapur SPPG, kalkulasi Food Safety Index, dan publikasi bukti audit ke IPFS.",
    steps: [
      {
        nomor: "1",
        judul: "Inspeksi Lapangan & Input Borang",
        aktor: "Auditor Gizi & Dinas Kesehatan",
        inputData: "Parameter Organoleptik, Suhu Penyajian (°C), Kebersihan Dapur",
        aksiSistem: "Menyimpan borang input sampel makanan dan foto pengawasan.",
        outputData: "Draft Laporan Inspeksi Digital",
        langkahDetail: [
          "Auditor mendatangi dapur SPPG atau titik distribusi.",
          "Mengukur suhu makanan dan memeriksa warna/aroma.",
          "Menginput data ke borang digital Halaman Audit Pangan."
        ]
      },
      {
        nomor: "2",
        judul: "Upload & Hashing ke IPFS",
        aktor: "IPFS Network & Blockchain Ledger",
        inputData: "Berkas Laporan Inspeksi",
        aksiSistem: "Menyimpan berkas di IPFS terdistribusi dan mencetak Cryptographic Hash.",
        outputData: "Immutable IPFS Hash",
        langkahDetail: [
          "Klik tombol 'Finalisasi & Upload Hasil Audit ke IPFS'.",
          "Berkas dikunci secara permanen di IPFS.",
          "Hash IPFS tercatat di Blockchain Immutable Ledger."
        ]
      },
      {
        nomor: "3",
        judul: "Kalkulasi Food Safety Index via AI",
        aktor: "AI Governance Engine",
        inputData: "Data Inspeksi, Sensor Suhu, Log Keluhan Sekolah",
        aksiSistem: "Menghitung skor indeks risiko gizi dan mendeteksi anomali.",
        outputData: "Food Safety Risk Score & Risk Status (Hijau/Kuning/Merah)",
        langkahDetail: [
          "Engine memproses seluruh data pengawasan harian.",
          "Mengkalkulasi skor kelayakan gizi dan kebersihan.",
          "Menampilkan indikator status risiko pada dasbor."
        ]
      },
      {
        nomor: "4",
        judul: "Eksekusi Rekomendasi & Sertifikasi",
        aktor: "Sistem B.O.G.A & Auditor",
        inputData: "Status Risk Index",
        aksiSistem: "Memberikan rekomendasi tindakan (Perpanjangan izin / Karantina sementara).",
        outputData: "Badge Sertifikasi / Surat Peringatan Digital",
        langkahDetail: [
          "Jika status Hijau: SPPG memperoleh +5 Poin Reputasi SBT.",
          "Jika status Merah: Sistem menahan rekomendasi pencatatan Ledger dan pembayaran berikutnya."
        ]
      }
    ]
  },
  {
    id: "9.5",
    code: "9.5",
    title: "Feedback Guru/Sekolah & Chatbot AI",
    icon: MessageSquare,
    summary: "Panduan penerimaan makanan di sekolah, konfirmasi porsi, analisis foto hidangan via Computer Vision, dan laporan interaktif via Chatbot.",
    steps: [
      {
        nomor: "1",
        judul: "Ambil Foto Sampel & Input Porsi",
        aktor: "Guru / Operator Sekolah",
        inputData: "Foto Hidangan Makanan, Jumlah Porsi Diterima",
        aksiSistem: "Verifikasi visual komposisi makanan via AI Vision Engine.",
        outputData: "Foto Terverifikasi & Rating Porsi",
        langkahDetail: [
          "Guru menerima paket makanan dari armada kurir.",
          "Buka modul Feedback Sekolah dan ambil foto hidangan.",
          "AI Vision memverifikasi menu nasi, lauk, dan buah."
        ]
      },
      {
        nomor: "2",
        judul: "Borang Penilaian Rating Bintang",
        aktor: "Guru / Operator Sekolah",
        inputData: "Skor Rating (1 - 5 Bintang)",
        aksiSistem: "Mencatat skor kepuasan rasa dan kerapihan kemasan.",
        outputData: "Skor Kepuasan Sekolah",
        langkahDetail: [
          "Pilih tingkat kepuasan pada slider rating bintang.",
          "Pilih 5 Bintang jika hidangan hangat dan porsi pas."
        ]
      },
      {
        nomor: "3",
        judul: "Pelaporan Keluhan via Chatbot AI",
        aktor: "Guru & Conversational AI Chatbot",
        inputData: "Pesan Obrolan Bahasa Alami (Teks/Suara)",
        aksiSistem: "Parsing teks via NLP, pengelompokan tingkat isu, dan attachment foto.",
        outputData: "Tiket Laporan Terkategori",
        langkahDetail: [
          "Klik tombol 'Buka Chat' pada modul Chatbot Assistant.",
          "Ketik keluhan (misal: 'Porsi kurang 20 kotak').",
          "Chatbot memproses pesan dan menerbitkan tiket."
        ]
      },
      {
        nomor: "4",
        judul: "Eskalasi Real-Time ke Auditor",
        aktor: "Backend B.O.G.A & Auditor Dashboard",
        inputData: "Tiket Laporan Chatbot",
        aksiSistem: "Mendorong laporan ke Feed Auditor sebagai pembobot peringatan sistem.",
        outputData: "Status Eskalasi Auditor & Update SBT",
        langkahDetail: [
          "Laporan langsung muncul di Dasbor Monitoring Auditor.",
          "Menjadi faktor evaluasi kelayakan pencatatan Ledger audit pembayaran."
        ]
      }
    ]
  },
  {
    id: "9.6",
    code: "9.6",
    title: "Monitoring dan Investigasi Anomali",
    icon: Search,
    summary: "Panduan pengawasan makro oleh BGN/KPK, penelaahan bukti terpadu Single-Pane-of-Glass, serta eksekusi sanksi pembekuan entitas.",
    steps: [
      {
        nomor: "1",
        judul: "Akses Dasbor Monitoring Makro",
        aktor: "Auditor / Otoritas BGN & KPK",
        inputData: "Kredensial Akses Otoritas",
        aksiSistem: "Menampilkan daftar kasus anomali berbendera merah (System-Flagged).",
        outputData: "Daftar Kasus Anomali Aktif",
        langkahDetail: [
          "Masuk ke Dasbor Monitoring & Investigasi B.O.G.A.",
          "Tinjau daftar kasus yang ditandai otomatis oleh AI."
        ]
      },
      {
        nomor: "2",
        judul: "Penelaahan Kasus (Single-Pane-of-Glass)",
        aktor: "Auditor Utama",
        inputData: "ID Kasus Anomali (misal: ARB-001)",
        aksiSistem: "Menyajikan seluruh rantai bukti pendukung dalam 1 panel terpadu.",
        outputData: "Tampilan Rantai Bukti Digital Integratif",
        langkahDetail: [
          "Pilih salah satu kasus pada tabel pemantauan.",
          "Tinjau bukti OCR resi, rute GPS geofencing, foto guru, dan audit trail."
        ]
      },
      {
        nomor: "3",
        judul: "Analisis Rekam Jejak SBT",
        aktor: "Auditor Utama",
        inputData: "Metadata Token Reputasi SBT Vendor",
        aksiSistem: "Membuka inspector metadata token reputasi on-chain.",
        outputData: "Skor Reputasi Historis & Red Flags",
        langkahDetail: [
          "Klik tombol 'Inspeksi SBT' pada dasbor reputasi.",
          "Periksa histori ketepatan waktu dan catatan sanksi terdahulu."
        ]
      },
      {
        nomor: "4",
        judul: "Eksekusi Action Plan & Sanksi",
        aktor: "Auditor / Otoritas Pengawas",
        inputData: "Keputusan Tindakan Sanksi",
        aksiSistem: "Menerbitkan Peringatan, Pembekuan Pembayaran, atau Pencabutan Whitelist Audit.",
        outputData: "Status Whitelist Suspended & Log Sanksi",
        langkahDetail: [
          "Tekan tombol 'Bekukan Whitelist' jika terbukti melanggar.",
          "Sistem membekukan alamat wallet dari lelang pengadaan berikutnya."
        ]
      }
    ]
  }
];

export default function DokumentasiManualPage() {
  const [activeSection, setActiveSection] = useState<ManualSection>(MANUAL_SECTIONS[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = MANUAL_SECTIONS.filter(
    (sec) =>
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.code.includes(searchQuery)
  );

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col">
      {/* Page Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur px-6 py-4">
        <PageHeader
          title="Bab 9: Dokumentasi Cara Penggunaan (Manual Pengguna)"
          subtitle="Panduan operasional rinci alur kerja ekosistem B.O.G.A dari pendaftaran supplier, pengadaan, rekonsiliasi, audit pangan, hingga pengawasan investigasi."
        />
      </div>

      {/* Main Layout - Zero Gap Grid (Sidebar Index + Detail Content) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border">
        
        {/* Left Navigation Index (4 Cols) */}
        <div className="lg:col-span-4 bg-card/20 flex flex-col">
          
          <div className="p-4 border-b border-border bg-muted/20 space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm">Daftar Modul Manual Pengguna</span>
            </div>
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari modul (misal: 9.3)..."
                className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="divide-y divide-border flex-1 overflow-y-auto">
            {filteredSections.map((sec) => {
              const isSelected = activeSection.id === sec.id;
              const IconComp = sec.icon;
              return (
                <div
                  key={sec.id}
                  onClick={() => setActiveSection(sec)}
                  className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${
                    isSelected ? "bg-primary/10 border-l-4 border-l-primary" : "hover:bg-muted/30"
                  }`}
                >
                  <div className={`p-2 rounded border ${isSelected ? "bg-primary/20 border-primary text-primary" : "bg-muted border-border text-muted-foreground"}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-primary">{sec.code}</span>
                      <ChevronRight className={`w-4 h-4 ${isSelected ? "text-primary" : "text-muted-foreground/40"}`} />
                    </div>
                    <h4 className="font-semibold text-sm leading-snug mt-0.5 text-foreground">{sec.title}</h4>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">{sec.summary}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Detail Manual Flow (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col bg-background p-6 space-y-6 overflow-y-auto">
          
          {/* Section Banner */}
          <div className="p-5 rounded-lg border border-border bg-card/40 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/10 text-primary border-primary/30 font-mono text-xs">
                  Modul Operasional {activeSection.code}
                </Badge>
              </div>
              <h2 className="text-xl font-bold text-foreground mt-2">{activeSection.title}</h2>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{activeSection.summary}</p>
            </div>
          </div>

          {/* Sequential Step Cards (Zero Gap Flow) */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" /> Tahapan Langkah Operasional Presisi
            </h3>

            <div className="space-y-4">
              {activeSection.steps.map((step) => (
                <div key={step.nomor} className="p-5 rounded-lg border border-border bg-card/20 space-y-4">
                  <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center font-mono font-bold text-sm text-primary">
                        {step.nomor}
                      </div>
                      <h4 className="font-semibold text-sm text-foreground">{step.judul}</h4>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">
                      Aktor: {step.aktor}
                    </Badge>
                  </div>

                  {/* IO Parameter Table */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded border border-border bg-background/60 space-y-1">
                      <span className="text-[10px] uppercase font-mono text-muted-foreground block">Input Data Utama</span>
                      <span className="font-semibold text-foreground">{step.inputData}</span>
                    </div>

                    <div className="p-3 rounded border border-border bg-background/60 space-y-1">
                      <span className="text-[10px] uppercase font-mono text-primary block">Aksi Komputasi Sistem</span>
                      <span className="font-semibold text-primary">{step.aksiSistem}</span>
                    </div>

                    <div className="p-3 rounded border border-border bg-background/60 space-y-1">
                      <span className="text-[10px] uppercase font-mono text-emerald-500 block">Output Hasil / Status</span>
                      <span className="font-semibold text-emerald-500">{step.outputData}</span>
                    </div>
                  </div>

                  {/* Step Instructions */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Panduan Instruksi Antarmuka:</span>
                    <ul className="space-y-1 text-xs text-muted-foreground pl-4 list-disc">
                      {step.langkahDetail.map((inst, idx) => (
                        <li key={idx} className="leading-relaxed">{inst}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
