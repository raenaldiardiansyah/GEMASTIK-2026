export type StatusVendor = "aktif" | "nonaktif" | "suspend";
export type StatusDelivery = "delivered" | "on_transit" | "pending" | "gagal";
export type KategoriVendor = "katering" | "logistik" | "supplier_bahan";
export type TipeMenu = "nasi_box" | "snack" | "minuman" | "buah";
export type ArahPengiriman = "vendor_ke_sppg" | "sppg_ke_sekolah";


export interface Sekolah {
  id: number;
  nama: string;
  jenjang: "SD" | "SMP" | "SMA";
  kelurahan: string;
  kecamatan: string;
  kota: string;
  lat: number;
  lng: number;
  total_siswa: number;
  mulai_mbg: string;
}

export interface Vendor {
  id: number;
  nama: string;
  kategori: KategoriVendor;
  status: StatusVendor;
  rating: number;
  kontak_pic: string;
  no_telp: string;
  email: string;
  alamat: string;
  lat: number;
  lng: number;
  sertifikasi: string[];
  bergabung_sejak: string;
  total_pengiriman: number;
  on_time_rate: number;
}

export interface VendorSekolah {
  id: number;
  vendor_id: number;
  sekolah_id: number;
  porsi_per_hari: number;
  harga_per_porsi: number;
  kontrak_mulai: string;
  kontrak_selesai: string;
  menu_default: TipeMenu[];
  is_primary: boolean;
}

export interface Delivery {
  id: number;
  vendor_sekolah_id: number;
  tanggal: string;
  status: StatusDelivery;
  porsi_dikirim: number;
  porsi_diterima: number;
  jam_tiba: string;
  jam_target: string;
  catatan: string | null;
  bukti_url: string | null;
}

export interface SPPGStudentSentiment {
  avgRating: number;
  totalReviews: number;
  trendingKeywords: { word: string; count: number; sentiment: "positive" | "negative" | "neutral" }[];
  distribution: number[];
}

export interface VendorReview {
  id: number;
  vendor_id: number;
  userName: string;
  userClass: string;
  date: string;
  rating: number; // 1-5
  subRatings: {
    rasa: number;
    porsi: number;
    kebersihan: number;
  };
  comment: string;
  isFollowedUp: boolean;
}

export interface Material {
  id: number;
  name: string;
  type: string;
  price: number;
  rating: number;
  reviews: number;
}

// SPPG = Satuan Pelayanan Pangan Gizi (dapur produksi sentral MBG)
export interface SPPG {
  id: number;
  nama: string;         // nama dapur
  kecamatan: string;
  kota: string;
  lat: number;
  lng: number;
  kapasitas_porsi: number; // max porsi/hari
  vendor_id: number;       // vendor katering yang mengelola dapur ini
  rating: number;
  on_time_rate: number;
}

// Relasi: SPPG melayani beberapa sekolah (SPPG → Sekolah)
export interface SPPGSekolah {
  id: number;
  sppg_id: number;
  sekolah_id: number;
  porsi_per_hari: number;
}

export const sekolahList: Sekolah[] = [
  { id: 1, nama: "SMAN 3 Bandung",        jenjang: "SMA", kelurahan: "Merdeka",      kecamatan: "Sumur Bandung", kota: "Bandung", lat: -6.9135, lng: 107.6186, total_siswa: 920, mulai_mbg: "2025-02-01" },
  { id: 2, nama: "SMPN 2 Bandung",        jenjang: "SMP", kelurahan: "Citarum",      kecamatan: "Bandung Wetan", kota: "Bandung", lat: -6.9104, lng: 107.6141, total_siswa: 750, mulai_mbg: "2025-01-15" },
  { id: 3, nama: "SDN 061 Cirengel",      jenjang: "SD",  kelurahan: "Cipaganti",    kecamatan: "Coblong",       kota: "Bandung", lat: -6.9015, lng: 107.6112, total_siswa: 410, mulai_mbg: "2025-02-10" },
  { id: 4, nama: "SMPN 5 Bandung",        jenjang: "SMP", kelurahan: "Merdeka",      kecamatan: "Sumur Bandung", kota: "Bandung", lat: -6.9112, lng: 107.6125, total_siswa: 810, mulai_mbg: "2025-03-01" },
  { id: 5, nama: "SDN 164 Karang Pawulang",jenjang: "SD",  kelurahan: "Turangga",     kecamatan: "Lengkong",      kota: "Bandung", lat: -6.9247, lng: 107.6321, total_siswa: 460, mulai_mbg: "2025-01-20" },
  { id: 6, nama: "SMAN 20 Bandung",       jenjang: "SMA", kelurahan: "Citarum",      kecamatan: "Bandung Wetan", kota: "Bandung", lat: -6.9078, lng: 107.6212, total_siswa: 880, mulai_mbg: "2025-02-05" },
];

export const vendorList: Vendor[] = [
  {
    id: 1, nama: "CV Katering Bandung Juara", kategori: "katering", status: "aktif",
    rating: 4.9, kontak_pic: "Dadang Hermawan", no_telp: "0812-2233-4455",
    email: "ops@bdgjuara.id", alamat: "Jl. Dago No. 102, Bandung",
    lat: -6.8850, lng: 107.6130,
    sertifikasi: ["Halal MUI", "BPOM", "ISO 22000"],
    bergabung_sejak: "2024-11-01", total_pengiriman: 442, on_time_rate: 98.2,
  },
  {
    id: 2, nama: "PT Gizi Priangan Utama", kategori: "katering", status: "aktif",
    rating: 4.6, kontak_pic: "Euis Rosita", no_telp: "0813-1122-3344",
    email: "admin@gizipriangan.com", alamat: "Jl. Soekarno Hatta No. 456, Bandung",
    lat: -6.9450, lng: 107.6320,
    sertifikasi: ["Halal MUI", "BPOM"],
    bergabung_sejak: "2024-12-15", total_pengiriman: 215, on_time_rate: 96.1,
  },
  {
    id: 3, nama: "Logistik Parahyangan Express", kategori: "logistik", status: "aktif",
    rating: 4.7, kontak_pic: "Asep Sunandar", no_telp: "0821-4455-6677",
    email: "fleet@paraexpress.co.id", alamat: "Jl. Pasteur No. 12, Bandung",
    lat: -6.8980, lng: 107.5950,
    sertifikasi: ["ISO 9001"],
    bergabung_sejak: "2025-01-05", total_pengiriman: 312, on_time_rate: 98.8,
  },
  {
    id: 4, nama: "Agro Lembang Segar", kategori: "supplier_bahan", status: "aktif",
    rating: 4.5, kontak_pic: "Cecep Mulyana", no_telp: "0819-7788-9900",
    email: "supply@agrolembang.id", alamat: "Jl. Raya Lembang No. 54, Lembang",
    lat: -6.8150, lng: 107.6180,
    sertifikasi: ["Halal MUI", "Organic Certified"],
    bergabung_sejak: "2025-01-20", total_pengiriman: 167, on_time_rate: 93.4,
  },
  {
    id: 5, nama: "Katering Pasundan Berkah", kategori: "katering", status: "aktif",
    rating: 4.8, kontak_pic: "Yanti Marlina", no_telp: "0856-2233-4455",
    email: "order@pasundanberkah.id", alamat: "Jl. Buah Batu No. 201, Bandung",
    lat: -6.9380, lng: 107.6250,
    sertifikasi: ["Halal MUI", "BPOM", "ISO 22000"],
    bergabung_sejak: "2024-10-10", total_pengiriman: 512, on_time_rate: 97.4,
  },
  {
    id: 6, nama: "CV Food Hub Jabar", kategori: "katering", status: "suspend",
    rating: 3.1, kontak_pic: "Iwan Setiawan", no_telp: "0878-5566-7788",
    email: "info@fhubjabar.com", alamat: "Jl. Kopo No. 341, Bandung",
    lat: -6.9550, lng: 107.5850,
    sertifikasi: ["Halal MUI"],
    bergabung_sejak: "2025-02-01", total_pengiriman: 45, on_time_rate: 72.3,
  },
];

export const vendorSekolahList: VendorSekolah[] = [
  { id: 1,  vendor_id: 1, sekolah_id: 1, porsi_per_hari: 680, harga_per_porsi: 15000, kontrak_mulai: "2025-02-01", kontrak_selesai: "2025-07-31", menu_default: ["nasi_box","minuman"], is_primary: true  },
  { id: 2,  vendor_id: 3, sekolah_id: 1, porsi_per_hari: 680, harga_per_porsi: 0,     kontrak_mulai: "2025-02-01", kontrak_selesai: "2025-07-31", menu_default: [],                    is_primary: false },
  { id: 3,  vendor_id: 5, sekolah_id: 2, porsi_per_hari: 320, harga_per_porsi: 15000, kontrak_mulai: "2025-01-15", kontrak_selesai: "2025-07-31", menu_default: ["nasi_box","buah"],   is_primary: true  },
  { id: 4,  vendor_id: 2, sekolah_id: 2, porsi_per_hari: 320, harga_per_porsi: 14500, kontrak_mulai: "2025-01-15", kontrak_selesai: "2025-07-31", menu_default: ["nasi_box"],          is_primary: false },
  { id: 5,  vendor_id: 1, sekolah_id: 3, porsi_per_hari: 410, harga_per_porsi: 15000, kontrak_mulai: "2025-02-10", kontrak_selesai: "2025-07-31", menu_default: ["nasi_box","minuman"],is_primary: true  },
  { id: 6,  vendor_id: 4, sekolah_id: 3, porsi_per_hari: 410, harga_per_porsi: 0,     kontrak_mulai: "2025-02-10", kontrak_selesai: "2025-07-31", menu_default: [],                    is_primary: false },
  { id: 7,  vendor_id: 2, sekolah_id: 4, porsi_per_hari: 290, harga_per_porsi: 14500, kontrak_mulai: "2025-03-01", kontrak_selesai: "2025-07-31", menu_default: ["nasi_box"],          is_primary: true  },
  { id: 8,  vendor_id: 5, sekolah_id: 5, porsi_per_hari: 360, harga_per_porsi: 15000, kontrak_mulai: "2025-01-20", kontrak_selesai: "2025-07-31", menu_default: ["nasi_box","buah"],   is_primary: true  },
  { id: 9,  vendor_id: 3, sekolah_id: 5, porsi_per_hari: 360, harga_per_porsi: 0,     kontrak_mulai: "2025-01-20", kontrak_selesai: "2025-07-31", menu_default: [],                    is_primary: false },
  { id: 10, vendor_id: 1, sekolah_id: 6, porsi_per_hari: 820, harga_per_porsi: 15000, kontrak_mulai: "2025-02-05", kontrak_selesai: "2025-07-31", menu_default: ["nasi_box","minuman","buah"], is_primary: true },
  { id: 11, vendor_id: 2, sekolah_id: 6, porsi_per_hari: 820, harga_per_porsi: 14500, kontrak_mulai: "2025-02-05", kontrak_selesai: "2025-07-31", menu_default: ["nasi_box"],          is_primary: false },
];

export const deliveryList: Delivery[] = [
  { id: 1,  vendor_sekolah_id: 1,  tanggal: "2025-04-01", status: "delivered",  porsi_dikirim: 680, porsi_diterima: 680, jam_tiba: "06:45", jam_target: "07:00", catatan: null, bukti_url: null },
  { id: 2,  vendor_sekolah_id: 1,  tanggal: "2025-04-02", status: "delivered",  porsi_dikirim: 680, porsi_diterima: 675, jam_tiba: "07:10", jam_target: "07:00", catatan: "5 porsi rusak kemasan", bukti_url: null },
  { id: 3,  vendor_sekolah_id: 1,  tanggal: "2025-04-03", status: "on_transit", porsi_dikirim: 680, porsi_diterima: 0,   jam_tiba: "--",    jam_target: "07:00", catatan: null, bukti_url: null },
  { id: 4,  vendor_sekolah_id: 3,  tanggal: "2025-04-01", status: "delivered",  porsi_dikirim: 320, porsi_diterima: 320, jam_tiba: "06:55", jam_target: "07:00", catatan: null, bukti_url: null },
  { id: 5,  vendor_sekolah_id: 3,  tanggal: "2025-04-02", status: "delivered",  porsi_dikirim: 320, porsi_diterima: 320, jam_tiba: "06:50", jam_target: "07:00", catatan: null, bukti_url: null },
  { id: 6,  vendor_sekolah_id: 3,  tanggal: "2025-04-03", status: "pending",    porsi_dikirim: 0,   porsi_diterima: 0,   jam_tiba: "--",    jam_target: "07:00", catatan: "Menunggu konfirmasi", bukti_url: null },
  { id: 7,  vendor_sekolah_id: 5,  tanggal: "2025-04-01", status: "delivered",  porsi_dikirim: 410, porsi_diterima: 410, jam_tiba: "06:40", jam_target: "07:00", catatan: null, bukti_url: null },
  { id: 8,  vendor_sekolah_id: 7,  tanggal: "2025-04-01", status: "delivered",  porsi_dikirim: 290, porsi_diterima: 290, jam_tiba: "07:05", jam_target: "07:00", catatan: null, bukti_url: null },
  { id: 9,  vendor_sekolah_id: 8,  tanggal: "2025-04-01", status: "delivered",  porsi_dikirim: 360, porsi_diterima: 358, jam_tiba: "06:58", jam_target: "07:00", catatan: "2 porsi tumpah", bukti_url: null },
  { id: 10, vendor_sekolah_id: 10, tanggal: "2025-04-01", status: "delivered",  porsi_dikirim: 820, porsi_diterima: 820, jam_tiba: "06:30", jam_target: "07:00", catatan: null, bukti_url: null },
  { id: 11,  vendor_sekolah_id: 10, tanggal: "2025-04-02", status: "delivered",  porsi_dikirim: 820, porsi_diterima: 815, jam_tiba: "06:55", jam_target: "07:00", catatan: "5 porsi sayur tidak lengkap", bukti_url: null },
  { id: 12,  vendor_sekolah_id: 10, tanggal: "2025-04-03", status: "on_transit", porsi_dikirim: 820, porsi_diterima: 0,   jam_tiba: "--",    jam_target: "07:00", catatan: null, bukti_url: null },
];

export const sppgList: SPPG[] = [
  { id: 1, nama: "SPPG Dago Bandung",        kecamatan: "Coblong",       kota: "Bandung", lat: -6.8920, lng: 107.6150, kapasitas_porsi: 1200, vendor_id: 1, rating: 4.8, on_time_rate: 97.5 },
  { id: 2, nama: "SPPG Soekarno Hatta",      kecamatan: "Bojongloa Kaler", kota: "Bandung", lat: -6.9430, lng: 107.6210, kapasitas_porsi: 900,  vendor_id: 2, rating: 4.4, on_time_rate: 94.2 },
  { id: 3, nama: "SPPG Buah Batu",           kecamatan: "Lengkong",      kota: "Bandung", lat: -6.9400, lng: 107.6270, kapasitas_porsi: 1100, vendor_id: 5, rating: 4.7, on_time_rate: 96.8 },
];

export const sppgSekolahList: SPPGSekolah[] = [
  // SPPG Dago melayani SMAN 3, SDN 061, SMAN 20
  { id: 1, sppg_id: 1, sekolah_id: 1, porsi_per_hari: 680 },
  { id: 2, sppg_id: 1, sekolah_id: 3, porsi_per_hari: 410 },
  { id: 3, sppg_id: 1, sekolah_id: 6, porsi_per_hari: 820 },
  // SPPG Soekarno Hatta melayani SMPN 2, SMPN 5
  { id: 4, sppg_id: 2, sekolah_id: 2, porsi_per_hari: 320 },
  { id: 5, sppg_id: 2, sekolah_id: 4, porsi_per_hari: 290 },
  // SPPG Buah Batu melayani SDN 164
  { id: 6, sppg_id: 3, sekolah_id: 5, porsi_per_hari: 360 },
];

export const tenderMaterials: Material[] = [
  // Karbohidrat
  { id: 1, name: 'Beras Premium SLYP (5kg)', type: 'Karbohidrat', price: 78000, rating: 4.9, reviews: 1240 },
  { id: 2, name: 'Beras Medium IR64 (5kg)', type: 'Karbohidrat', price: 65000, rating: 4.7, reviews: 856 },
  { id: 3, name: 'Kentang Dieng Grade A', type: 'Karbohidrat', price: 18000, rating: 4.8, reviews: 432 },
  // Protein Hewani
  { id: 4, name: 'Daging Sapi Lokal Segar', type: 'Protein Hewani', price: 135000, rating: 4.9, reviews: 521 },
  { id: 5, name: 'Ayam Broiler Karkas (1kg)', type: 'Protein Hewani', price: 38000, rating: 4.8, reviews: 928 },
  { id: 6, name: 'Telur Ayam Omega-3 (Box)', type: 'Protein Hewani', price: 32000, rating: 4.9, reviews: 2150 },
  { id: 7, name: 'Ikan Kembung Banjar Segar', type: 'Protein Hewani', price: 42000, rating: 4.6, reviews: 312 },
  // Protein Nabati
  { id: 8, name: 'Tahu Putih Kualitas Super', type: 'Protein Nabati', price: 12000, rating: 4.7, reviews: 654 },
  { id: 9, name: 'Tempe Kedelai Murni (Papan)', type: 'Protein Nabati', price: 8000, rating: 4.8, reviews: 890 },
  // Sayuran
  { id: 10, name: 'Wortel Berastagi Pilihan', type: 'Sayuran', price: 14000, rating: 4.7, reviews: 215 },
  { id: 11, name: 'Bayam Hidroponik Segar', type: 'Sayuran', price: 12000, rating: 4.9, reviews: 143 },
  { id: 12, name: 'Kubis Segar (Pack)', type: 'Sayuran', price: 9000, rating: 4.5, reviews: 88 },
  // Sembako
  { id: 13, name: 'Minyak Goreng Sawit (2L)', type: 'Sembako', price: 34000, rating: 4.8, reviews: 3421 },
  { id: 14, name: 'Gula Pasir Kristal Putih', type: 'Sembako', price: 17500, rating: 4.7, reviews: 1205 },
  { id: 15, name: 'Garam Beryodium (Pack)', type: 'Sembako', price: 5000, rating: 4.6, reviews: 432 },
];

export const vendorReviews: VendorReview[] = [
  // Reviews for CV Katering Bandung Juara (ID 1)
  {
    id: 1, vendor_id: 1, userName: "Andi Saputra", userClass: "10-A", date: "2025-04-01",
    rating: 5, subRatings: { rasa: 5, porsi: 4, kebersihan: 5 },
    comment: "Rasa makanannya enak sekali, bumbunya pas. Porsinya cukup mengenyangkan.",
    isFollowedUp: false
  },
  {
    id: 2, vendor_id: 1, userName: "Budi Santoso", userClass: "12-C", date: "2025-04-02",
    rating: 4, subRatings: { rasa: 4, porsi: 3, kebersihan: 5 },
    comment: "Makanan oke, tapi porsinya kadang kurang banyak buat saya yang habis olahraga.",
    isFollowedUp: true
  },
  {
    id: 3, vendor_id: 1, userName: "Citra Lestari", userClass: "11-B", date: "2025-04-03",
    rating: 5, subRatings: { rasa: 5, porsi: 5, kebersihan: 5 },
    comment: "Sangat memuaskan, pengiriman selalu tepat waktu sebelum jam istirahat.",
    isFollowedUp: false
  },
  {
    id: 31, vendor_id: 1, userName: "Rizky Ramadhan", userClass: "10-B", date: "2025-04-04",
    rating: 2, subRatings: { rasa: 2, porsi: 4, kebersihan: 4 },
    comment: "Nasi Keras sekali hari ini, susah dikunyah. Tolong diperhatikan kateringnya.",
    isFollowedUp: false
  },
  {
    id: 32, vendor_id: 1, userName: "Siti Aminah", userClass: "11-C", date: "2025-04-04",
    rating: 2, subRatings: { rasa: 2, porsi: 3, kebersihan: 5 },
    comment: "Sama seperti yang lain, laporan saya juga Nasi Keras banget. Ayamnya enak tapi nasinya gagal.",
    isFollowedUp: false
  },
  {
    id: 33, vendor_id: 1, userName: "Fajar Siddiq", userClass: "12-A", date: "2025-04-05",
    rating: 2, subRatings: { rasa: 2, porsi: 2, kebersihan: 3 },
    comment: "Lauknya sudah dingin saat sampai ke kelas, padahal rasanya lumayan.",
    isFollowedUp: false
  },
  // Reviews for CV Food Hub Jabar (ID 6) - The poor performer
  {
    id: 4, vendor_id: 6, userName: "Deni Ramdani", userClass: "10-C", date: "2025-03-25",
    rating: 2, subRatings: { rasa: 2, porsi: 3, kebersihan: 2 },
    comment: "Nasinya agak keras dan sayurnya agak basi, tolong diperbaiki kualitasnya.",
    isFollowedUp: false
  },
  {
    id: 5, vendor_id: 6, userName: "Eka Wijaya", userClass: "12-A", date: "2025-03-28",
    rating: 1, subRatings: { rasa: 1, porsi: 2, kebersihan: 1 },
    comment: "Pengiriman sangat lambat, sudah lewat jam istirahat baru sampai. Makanan dingin.",
    isFollowedUp: false
  },
  {
    id: 6, vendor_id: 6, userName: "Farhan Hakim", userClass: "11-D", date: "2025-04-01",
    rating: 3, subRatings: { rasa: 3, porsi: 2, kebersihan: 3 },
    comment: "Rasa lumayan tapi porsinya sangat sedikit dibanding vendor sebelumnya.",
    isFollowedUp: true
  },
  {
    id: 61, vendor_id: 6, userName: "Gilang Dirga", userClass: "10-D", date: "2025-04-02",
    rating: 1, subRatings: { rasa: 1, porsi: 1, kebersihan: 1 },
    comment: "Sayur basi lagi, sudah 3 kali kejadian bulan ini. Sangat mengecewakan.",
    isFollowedUp: false
  },
  // Reviews for PT Gizi Priangan Utama (ID 2)
  {
    id: 7, vendor_id: 2, userName: "Gisela Putri", userClass: "10-B", date: "2025-04-01",
    rating: 4, subRatings: { rasa: 4, porsi: 4, kebersihan: 4 },
    comment: "Menu variatif dan bergizi. Kebersihan kemasan sangat terjaga.",
    isFollowedUp: false
  },
  {
    id: 8, vendor_id: 2, userName: "Herianto", userClass: "12-B", date: "2025-04-02",
    rating: 5, subRatings: { rasa: 5, porsi: 4, kebersihan: 5 },
    comment: "Sangat suka dengan ayam bakarnya, bumbunya meresap sampai ke dalam.",
    isFollowedUp: false
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// NEW DATA: 13-Langkah GIZANTARA B.O.G.A
// ═══════════════════════════════════════════════════════════════════════════════

// ── Langkah 3: Vendor Commodities (Katalog + HET/PIHPS) ───────────────────

export interface Commodity {
  id: string;
  vendorId: number;
  name: string;
  category: "karbo" | "protein_hewani" | "protein_nabati" | "sayuran" | "sembako" | "buah";
  unit: string;
  price: number;
  hetPrice: number;
  pihpsPrice: number;
  stock: number;
  minStock: number;
  isMarkup: boolean;
  image: string;
  createdAt: string;
}

export const vendorCommodities: Commodity[] = [
  // Vendor 1 — CV Katering Bandung Juara
  { id: "COM-001", vendorId: 1, name: "Beras Premium SLYP", category: "karbo", unit: "kg", price: 14500, hetPrice: 15000, pihpsPrice: 14800, stock: 850, minStock: 200, isMarkup: false, image: "/placeholder-beras.jpg", createdAt: "2025-03-01" },
  { id: "COM-002", vendorId: 1, name: "Ayam Broiler Karkas", category: "protein_hewani", unit: "kg", price: 37000, hetPrice: 38000, pihpsPrice: 37500, stock: 320, minStock: 80, isMarkup: false, image: "/placeholder-ayam.jpg", createdAt: "2025-03-01" },
  { id: "COM-003", vendorId: 1, name: "Telur Ayam Omega-3", category: "protein_hewani", unit: "butir", price: 2800, hetPrice: 3000, pihpsPrice: 2900, stock: 5000, minStock: 1000, isMarkup: false, image: "/placeholder-telur.jpg", createdAt: "2025-03-01" },
  { id: "COM-004", vendorId: 1, name: "Minyak Goreng Sawit 2L", category: "sembako", unit: "botol", price: 33000, hetPrice: 34000, pihpsPrice: 33500, stock: 150, minStock: 30, isMarkup: false, image: "/placeholder-minyak.jpg", createdAt: "2025-03-05" },
  { id: "COM-005", vendorId: 1, name: "Bayam Hidroponik", category: "sayuran", unit: "ikat", price: 6000, hetPrice: 7000, pihpsPrice: 6500, stock: 200, minStock: 50, isMarkup: false, image: "/placeholder-bayam.jpg", createdAt: "2025-03-05" },
  // Vendor 2 — PT Gizi Priangan Utama
  { id: "COM-006", vendorId: 2, name: "Beras Medium IR64", category: "karbo", unit: "kg", price: 12500, hetPrice: 13000, pihpsPrice: 12800, stock: 600, minStock: 150, isMarkup: false, image: "/placeholder-beras.jpg", createdAt: "2025-03-02" },
  { id: "COM-007", vendorId: 2, name: "Ikan Kembung Segar", category: "protein_hewani", unit: "kg", price: 41000, hetPrice: 42000, pihpsPrice: 41500, stock: 180, minStock: 40, isMarkup: false, image: "/placeholder-ikan.jpg", createdAt: "2025-03-02" },
  { id: "COM-008", vendorId: 2, name: "Tahu Putih Super", category: "protein_nabati", unit: "papan", price: 12000, hetPrice: 12000, pihpsPrice: 11800, stock: 400, minStock: 80, isMarkup: false, image: "/placeholder-tahu.jpg", createdAt: "2025-03-02" },
  { id: "COM-009", vendorId: 2, name: "Tempe Kedelai Murni", category: "protein_nabati", unit: "papan", price: 8500, hetPrice: 8000, pihpsPrice: 8200, stock: 350, minStock: 70, isMarkup: true, image: "/placeholder-tempe.jpg", createdAt: "2025-03-02" },
  // Vendor 4 — Agro Lembang Segar (supplier_bahan)
  { id: "COM-010", vendorId: 4, name: "Wortel Berastagi Pilihan", category: "sayuran", unit: "kg", price: 13500, hetPrice: 14000, pihpsPrice: 13800, stock: 280, minStock: 60, isMarkup: false, image: "/placeholder-wortel.jpg", createdAt: "2025-03-03" },
  { id: "COM-011", vendorId: 4, name: "Kubis Segar", category: "sayuran", unit: "kg", price: 8500, hetPrice: 9000, pihpsPrice: 8800, stock: 350, minStock: 70, isMarkup: false, image: "/placeholder-kubis.jpg", createdAt: "2025-03-03" },
  { id: "COM-012", vendorId: 4, name: "Kentang Dieng Grade A", category: "karbo", unit: "kg", price: 17500, hetPrice: 18000, pihpsPrice: 17800, stock: 400, minStock: 100, isMarkup: false, image: "/placeholder-kentang.jpg", createdAt: "2025-03-03" },
  { id: "COM-013", vendorId: 4, name: "Pisang Ambon", category: "buah", unit: "sisir", price: 18000, hetPrice: 20000, pihpsPrice: 19000, stock: 120, minStock: 30, isMarkup: false, image: "/placeholder-pisang.jpg", createdAt: "2025-03-10" },
  // Vendor 5 — Katering Pasundan Berkah
  { id: "COM-014", vendorId: 5, name: "Beras Premium SLYP", category: "karbo", unit: "kg", price: 14800, hetPrice: 15000, pihpsPrice: 14800, stock: 700, minStock: 180, isMarkup: false, image: "/placeholder-beras.jpg", createdAt: "2025-03-01" },
  { id: "COM-015", vendorId: 5, name: "Daging Sapi Lokal", category: "protein_hewani", unit: "kg", price: 138000, hetPrice: 135000, pihpsPrice: 136000, stock: 80, minStock: 20, isMarkup: true, image: "/placeholder-sapi.jpg", createdAt: "2025-03-01" },
  { id: "COM-016", vendorId: 5, name: "Ayam Broiler Karkas", category: "protein_hewani", unit: "kg", price: 37500, hetPrice: 38000, pihpsPrice: 37500, stock: 250, minStock: 60, isMarkup: false, image: "/placeholder-ayam.jpg", createdAt: "2025-03-01" },
  { id: "COM-017", vendorId: 5, name: "Gula Pasir Kristal", category: "sembako", unit: "kg", price: 17000, hetPrice: 17500, pihpsPrice: 17200, stock: 200, minStock: 50, isMarkup: false, image: "/placeholder-gula.jpg", createdAt: "2025-03-08" },
  { id: "COM-018", vendorId: 5, name: "Garam Beryodium", category: "sembako", unit: "pack", price: 5000, hetPrice: 5000, pihpsPrice: 4800, stock: 500, minStock: 100, isMarkup: false, image: "/placeholder-garam.jpg", createdAt: "2025-03-08" },
];

// ── Langkah 4-8: Purchase Orders + Payment Status ─────────────────────────

export type PaymentStatus =
  | "MENUNGGU_KONFIRMASI"
  | "DIPROSES"
  | "SIAP_AMBIL"
  | "QC_REVIEW"
  | "QC_APPROVED"
  | "MENUNGGU_BUKTI_TRANSFER"
  | "OCR_VALIDATING"
  | "PAYMENT_VERIFIED"
  | "UNDERPAID"
  | "MANUAL_REVIEW"
  | "COMPLETED"
  | "EXPIRED"
  | "DISPUTE";

export interface POItem {
  itemName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  subtotal: number;
}

export interface Signatures {
  qc: "SIGNED" | "PENDING" | "REVISION";
  admin: "SIGNED" | "PENDING" | "REVISION";
  logistik: "SIGNED" | "PENDING" | "REVISION";
}

export interface PurchaseOrder {
  id: string;
  sppgId: number;
  vendorId: number;
  orderDate: string;
  deliveryDate: string;
  status: PaymentStatus;
  items: POItem[];
  totalAmount: number;
  signatures: Signatures;
  paymentProofId?: string;
  pickupPin?: string;
  qcNotes?: string;
  hashLedger?: string;
  revisionNote?: string;
}

export const purchaseOrders: PurchaseOrder[] = [
  // PO-2026-0001: COMPLETED (full flow Vendor 1 → SPPG 1)
  {
    id: "PO-2026-0001", sppgId: 1, vendorId: 1,
    orderDate: "2025-03-15", deliveryDate: "2025-03-17",
    status: "COMPLETED",
    items: [
      { itemName: "Beras Premium SLYP", quantity: 100, unit: "kg", pricePerUnit: 14500, subtotal: 1450000 },
      { itemName: "Ayam Broiler Karkas", quantity: 80, unit: "kg", pricePerUnit: 37000, subtotal: 2960000 },
      { itemName: "Telur Ayam Omega-3", quantity: 2000, unit: "butir", pricePerUnit: 2800, subtotal: 5600000 },
      { itemName: "Minyak Goreng Sawit 2L", quantity: 30, unit: "botol", pricePerUnit: 33000, subtotal: 990000 },
      { itemName: "Bayam Hidroponik", quantity: 100, unit: "ikat", pricePerUnit: 6000, subtotal: 600000 },
    ],
    totalAmount: 11600000,
    signatures: { qc: "SIGNED", admin: "SIGNED", logistik: "SIGNED" },
    paymentProofId: "PP-001",
    hashLedger: "0x8F2a3B7c1D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1D2e3F4a5B6c7D8e9F0a",
  },
  // PO-2026-0002: PAYMENT_VERIFIED (Vendor 2 → SPPG 2)
  {
    id: "PO-2026-0002", sppgId: 2, vendorId: 2,
    orderDate: "2025-03-20", deliveryDate: "2025-03-22",
    status: "PAYMENT_VERIFIED",
    items: [
      { itemName: "Beras Medium IR64", quantity: 80, unit: "kg", pricePerUnit: 12500, subtotal: 1000000 },
      { itemName: "Ikan Kembung Segar", quantity: 50, unit: "kg", pricePerUnit: 41000, subtotal: 2050000 },
      { itemName: "Tahu Putih Super", quantity: 40, unit: "papan", pricePerUnit: 12000, subtotal: 480000 },
    ],
    totalAmount: 3530000,
    signatures: { qc: "SIGNED", admin: "SIGNED", logistik: "SIGNED" },
    paymentProofId: "PP-002",
    hashLedger: "0x1A2b3C4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0b1C2d3E4f5A6b7C8d9E0f1A2b",
  },
  // PO-2026-0003: MENUNGGU_BUKTI_TRANSFER (Vendor 5 → SPPG 3, QC sudah approve)
  {
    id: "PO-2026-0003", sppgId: 3, vendorId: 5,
    orderDate: "2025-03-25", deliveryDate: "2025-03-27",
    status: "MENUNGGU_BUKTI_TRANSFER",
    items: [
      { itemName: "Beras Premium SLYP", quantity: 120, unit: "kg", pricePerUnit: 14800, subtotal: 1776000 },
      { itemName: "Ayam Broiler Karkas", quantity: 60, unit: "kg", pricePerUnit: 37500, subtotal: 2250000 },
      { itemName: "Gula Pasir Kristal", quantity: 25, unit: "kg", pricePerUnit: 17000, subtotal: 425000 },
    ],
    totalAmount: 4451000,
    signatures: { qc: "SIGNED", admin: "SIGNED", logistik: "SIGNED" },
  },
  // PO-2026-0004: UNDERPAID (Vendor 1 → SPPG 1, OCR deteksi kurang bayar)
  {
    id: "PO-2026-0004", sppgId: 1, vendorId: 1,
    orderDate: "2025-03-28", deliveryDate: "2025-03-30",
    status: "UNDERPAID",
    items: [
      { itemName: "Beras Premium SLYP", quantity: 150, unit: "kg", pricePerUnit: 14500, subtotal: 2175000 },
      { itemName: "Telur Ayam Omega-3", quantity: 3000, unit: "butir", pricePerUnit: 2800, subtotal: 8400000 },
    ],
    totalAmount: 10575000,
    signatures: { qc: "SIGNED", admin: "SIGNED", logistik: "SIGNED" },
    paymentProofId: "PP-003",
    qcNotes: "Barang diterima lengkap, kualitas baik",
  },
  // PO-2026-0005: MENUNGGU_KONFIRMASI (Vendor 2 → SPPG 2, baru dibuat)
  {
    id: "PO-2026-0005", sppgId: 2, vendorId: 2,
    orderDate: "2025-04-01", deliveryDate: "2025-04-03",
    status: "MENUNGGU_KONFIRMASI",
    items: [
      { itemName: "Beras Medium IR64", quantity: 90, unit: "kg", pricePerUnit: 12500, subtotal: 1125000 },
      { itemName: "Tempe Kedelai Murni", quantity: 60, unit: "papan", pricePerUnit: 8500, subtotal: 510000 },
    ],
    totalAmount: 1635000,
    signatures: { qc: "PENDING", admin: "PENDING", logistik: "PENDING" },
  },
  // PO-2026-0006: SIAP_AMBIL (Vendor 5 → SPPG 3)
  {
    id: "PO-2026-0006", sppgId: 3, vendorId: 5,
    orderDate: "2025-04-01", deliveryDate: "2025-04-02",
    status: "SIAP_AMBIL",
    items: [
      { itemName: "Daging Sapi Lokal", quantity: 30, unit: "kg", pricePerUnit: 138000, subtotal: 4140000 },
      { itemName: "Garam Beryodium", quantity: 50, unit: "pack", pricePerUnit: 5000, subtotal: 250000 },
    ],
    totalAmount: 4390000,
    signatures: { qc: "PENDING", admin: "PENDING", logistik: "PENDING" },
    pickupPin: "847291",
  },
  // PO-2026-0007: MANUAL_REVIEW (Vendor 4 → SPPG 1, OCR gagal baca)
  {
    id: "PO-2026-0007", sppgId: 1, vendorId: 4,
    orderDate: "2025-03-30", deliveryDate: "2025-04-01",
    status: "MANUAL_REVIEW",
    items: [
      { itemName: "Wortel Berastagi Pilihan", quantity: 100, unit: "kg", pricePerUnit: 13500, subtotal: 1350000 },
      { itemName: "Kubis Segar", quantity: 80, unit: "kg", pricePerUnit: 8500, subtotal: 680000 },
      { itemName: "Pisang Ambon", quantity: 40, unit: "sisir", pricePerUnit: 18000, subtotal: 720000 },
    ],
    totalAmount: 2750000,
    signatures: { qc: "SIGNED", admin: "SIGNED", logistik: "SIGNED" },
    paymentProofId: "PP-004",
    qcNotes: "Kualitas baik, sayuran segar",
  },
  // PO-2026-0008: EXPIRED (Vendor 1 → SPPG 1)
  {
    id: "PO-2026-0008", sppgId: 1, vendorId: 1,
    orderDate: "2025-03-10", deliveryDate: "2025-03-12",
    status: "EXPIRED",
    items: [
      { itemName: "Minyak Goreng Sawit 2L", quantity: 50, unit: "botol", pricePerUnit: 33000, subtotal: 1650000 },
    ],
    totalAmount: 1650000,
    signatures: { qc: "PENDING", admin: "PENDING", logistik: "PENDING" },
    revisionNote: "Batas waktu konfirmasi 72 jam terlampaui.",
  },
  // PO-2026-0009: QC_REVIEW (Vendor 5 → SPPG 3, QC revisi)
  {
    id: "PO-2026-0009", sppgId: 3, vendorId: 5,
    orderDate: "2025-04-02", deliveryDate: "2025-04-03",
    status: "QC_REVIEW",
    items: [
      { itemName: "Beras Premium SLYP", quantity: 80, unit: "kg", pricePerUnit: 14800, subtotal: 1184000 },
      { itemName: "Ayam Broiler Karkas", quantity: 40, unit: "kg", pricePerUnit: 37500, subtotal: 1500000 },
    ],
    totalAmount: 2684000,
    signatures: { qc: "REVISION", admin: "PENDING", logistik: "SIGNED" },
    revisionNote: "Kualitas ayam perlu diperiksa ulang — ada 5kg yang tidak sesuai standar.",
  },
];

// ── Langkah 7-8: Payment Proofs (OCR Bukti Transfer) ──────────────────────

export interface PaymentProof {
  id: string;
  poId: string;
  uploadedAt: string;
  imageUrl: string;
  ocrResult: {
    tanggal: string;
    nominal: number;
    namaPengirim: string;
    namaPenerima: string;
    bank: string;
    referenceId: string;
    confidence: number;
  };
  matchStatus: "MATCH" | "UNDERPAID" | "OVERPAID" | "MANUAL_REVIEW";
  matchDetail: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export const paymentProofs: PaymentProof[] = [
  {
    id: "PP-001", poId: "PO-2026-0001",
    uploadedAt: "2025-03-18T10:30:00",
    imageUrl: "/simulasi/bukti-transfer-001.jpg",
    ocrResult: {
      tanggal: "2025-03-18", nominal: 11600000,
      namaPengirim: "SPPG Dago Bandung", namaPenerima: "CV Katering Bandung Juara",
      bank: "Bank Mandiri", referenceId: "TRX-2025031810301234",
      confidence: 97,
    },
    matchStatus: "MATCH",
    matchDetail: "Nominal PO Rp 11.600.000 = Transfer Rp 11.600.000. MATCH 100%.",
    verifiedAt: "2025-03-18T10:35:00",
    verifiedBy: "Sistem OCR Otomatis",
  },
  {
    id: "PP-002", poId: "PO-2026-0002",
    uploadedAt: "2025-03-23T09:15:00",
    imageUrl: "/simulasi/bukti-transfer-002.jpg",
    ocrResult: {
      tanggal: "2025-03-23", nominal: 3530000,
      namaPengirim: "SPPG Soekarno Hatta", namaPenerima: "PT Gizi Priangan Utama",
      bank: "Bank BCA", referenceId: "TRX-2025032309155678",
      confidence: 94,
    },
    matchStatus: "MATCH",
    matchDetail: "Nominal PO Rp 3.530.000 = Transfer Rp 3.530.000. MATCH 100%.",
    verifiedAt: "2025-03-23T09:20:00",
    verifiedBy: "Sistem OCR Otomatis",
  },
  {
    id: "PP-003", poId: "PO-2026-0004",
    uploadedAt: "2025-03-31T14:20:00",
    imageUrl: "/simulasi/bukti-transfer-003.jpg",
    ocrResult: {
      tanggal: "2025-03-31", nominal: 5000000,
      namaPengirim: "SPPG Dago Bandung", namaPenerima: "CV Katering Bandung Juara",
      bank: "Bank Mandiri", referenceId: "TRX-2025033114209012",
      confidence: 96,
    },
    matchStatus: "UNDERPAID",
    matchDetail: "Nominal PO Rp 10.575.000 vs Transfer Rp 5.000.000. Kurang Rp 5.575.000 (52.7%).",
  },
  {
    id: "PP-004", poId: "PO-2026-0007",
    uploadedAt: "2025-04-02T11:45:00",
    imageUrl: "/simulasi/bukti-transfer-004.jpg",
    ocrResult: {
      tanggal: "2025-04-02", nominal: 0,
      namaPengirim: "", namaPenerima: "",
      bank: "", referenceId: "",
      confidence: 23,
    },
    matchStatus: "MANUAL_REVIEW",
    matchDetail: "OCR tidak berhasil membaca bukti transfer. Confidence 23%. Perlu review manual oleh operator.",
  },
  {
    id: "PP-005", poId: "PO-2026-0003",
    uploadedAt: "",
    imageUrl: "",
    ocrResult: {
      tanggal: "", nominal: 0,
      namaPengirim: "", namaPenerima: "",
      bank: "", referenceId: "",
      confidence: 0,
    },
    matchStatus: "MANUAL_REVIEW",
    matchDetail: "Bukti transfer belum diupload. Menunggu SPPG upload.",
  },
];

// ── Langkah 9: Ledger Audit (Immutable) ───────────────────────────────────

export interface LedgerEntry {
  id: string;
  timestamp: string;
  type: "VENDOR_REGISTERED" | "PO_CREATED" | "GOODS_RECEIVED" | "QC_APPROVED" | "PAYMENT_UPLOADED" | "PAYMENT_VERIFIED" | "DELIVERY_VERIFIED" | "DISPUTE_OPENED" | "VENDOR_WHITELISTED";
  actorRole: "vendor" | "sppg" | "pemerintah" | "logistik" | "system";
  actorName: string;
  entityId: string;
  description: string;
  dataSummary: Record<string, string | number>;
  hashPrev: string;
  hashCurrent: string;
}

export const ledgerEntries: LedgerEntry[] = [
  {
    id: "LE-001", timestamp: "2025-03-01T08:00:00",
    type: "VENDOR_REGISTERED", actorRole: "vendor", actorName: "Dadang Hermawan",
    entityId: "VENDOR-1", description: "CV Katering Bandung Juara mendaftar sebagai vendor MBG",
    dataSummary: { nib: "9120012345678", npwp: "01.234.567.8-001.000", bank: "Bank Mandiri" },
    hashPrev: "0x0000000000000000000000000000000000000000000000000000000000000000",
    hashCurrent: "0xA1b2C3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0C1d2E3f4A5b6C7d8E9f0A1b2",
  },
  {
    id: "LE-002", timestamp: "2025-03-02T09:30:00",
    type: "VENDOR_WHITELISTED", actorRole: "pemerintah", actorName: "Operator BGN",
    entityId: "VENDOR-1", description: "CV Katering Bandung Juara disetujui dan masuk whitelist",
    dataSummary: { ocrScore: 98, documentStatus: "valid", sertifikasi: "Halal MUI, BPOM, ISO 22000" },
    hashPrev: "0xA1b2C3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0C1d2E3f4A5b6C7d8E9f0A1b2",
    hashCurrent: "0xB2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1D2e3F4a5B6c7D8e9F0a1B2c3",
  },
  {
    id: "LE-003", timestamp: "2025-03-15T10:00:00",
    type: "PO_CREATED", actorRole: "sppg", actorName: "SPPG Dago Bandung",
    entityId: "PO-2026-0001", description: "Purchase Order PO-2026-0001 dibuat: 5 komoditas senilai Rp 11.600.000",
    dataSummary: { vendor: "CV Katering Bandung Juara", totalItems: 5, totalAmount: 11600000 },
    hashPrev: "0xB2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1D2e3F4a5B6c7D8e9F0a1B2c3",
    hashCurrent: "0xC3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0C1d2E3f4A5b6C7d8E9f0A1b2C3d4",
  },
  {
    id: "LE-004", timestamp: "2025-03-17T07:30:00",
    type: "GOODS_RECEIVED", actorRole: "sppg", actorName: "SPPG Dago Bandung",
    entityId: "PO-2026-0001", description: "Barang PO-2026-0001 diterima lengkap oleh SPPG",
    dataSummary: { porsiDiterima: "100%", fotoSuratJalan: "hash:0xD4e5...", kondisi: "Baik" },
    hashPrev: "0xC3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0C1d2E3f4A5b6C7d8E9f0A1b2C3d4",
    hashCurrent: "0xD4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1D2e3F4a5B6c7D8e9F0a1B2c3D4e5",
  },
  {
    id: "LE-005", timestamp: "2025-03-17T08:00:00",
    type: "QC_APPROVED", actorRole: "sppg", actorName: "Petugas QC SPPG Dago",
    entityId: "PO-2026-0001", description: "QC menyetujui kualitas barang. 3 tanda tangan digital lengkap.",
    dataSummary: { qc: "SIGNED", admin: "SIGNED", logistik: "SIGNED" },
    hashPrev: "0xD4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1D2e3F4a5B6c7D8e9F0a1B2c3D4e5",
    hashCurrent: "0xE5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0C1d2E3f4A5b6C7d8E9f0A1b2C3d4E5f6",
  },
  {
    id: "LE-006", timestamp: "2025-03-18T10:30:00",
    type: "PAYMENT_UPLOADED", actorRole: "sppg", actorName: "SPPG Dago Bandung",
    entityId: "PO-2026-0001", description: "Bukti transfer diunggah untuk PO-2026-0001",
    dataSummary: { nominal: 11600000, bank: "Bank Mandiri", refId: "TRX-2025031810301234" },
    hashPrev: "0xE5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0C1d2E3f4A5b6C7d8E9f0A1b2C3d4E5f6",
    hashCurrent: "0xF6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1D2e3F4a5B6c7D8e9F0a1B2c3D4e5F6a7",
  },
  {
    id: "LE-007", timestamp: "2025-03-18T10:35:00",
    type: "PAYMENT_VERIFIED", actorRole: "system", actorName: "Sistem OCR B.O.G.A",
    entityId: "PO-2026-0001", description: "OCR memverifikasi bukti transfer PO-2026-0001: MATCH 100%",
    dataSummary: { poAmount: 11600000, transferAmount: 11600000, status: "MATCH", confidence: 97 },
    hashPrev: "0xF6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1D2e3F4a5B6c7D8e9F0a1B2c3D4e5F6a7",
    hashCurrent: "0x8F2a3B7c1D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1D2e3F4a5B6c7D8e9F0a",
  },
  {
    id: "LE-008", timestamp: "2025-03-19T06:45:00",
    type: "DELIVERY_VERIFIED", actorRole: "logistik", actorName: "Logistik Parahyangan Express",
    entityId: "PO-2026-0001", description: "Distribusi ke SMAN 3 Bandung terverifikasi. Geofence: 23m (≤50m).",
    dataSummary: { sekolah: "SMAN 3 Bandung", porsi: 680, geofenceDistance: 23, qrScan: "valid" },
    hashPrev: "0x8F2a3B7c1D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1D2e3F4a5B6c7D8e9F0a",
    hashCurrent: "0x9A3b4C5d6E7f8A9b0C1d2E3f4A5b6C7d8E9f0A1b2C3d4E5f6A7b8C9d0E1f2A3b4",
  },
  // PO-2026-0002 chain
  {
    id: "LE-009", timestamp: "2025-03-20T09:00:00",
    type: "PO_CREATED", actorRole: "sppg", actorName: "SPPG Soekarno Hatta",
    entityId: "PO-2026-0002", description: "Purchase Order PO-2026-0002 dibuat: 3 komoditas senilai Rp 3.530.000",
    dataSummary: { vendor: "PT Gizi Priangan Utama", totalItems: 3, totalAmount: 3530000 },
    hashPrev: "0x9A3b4C5d6E7f8A9b0C1d2E3f4A5b6C7d8E9f0A1b2C3d4E5f6A7b8C9d0E1f2A3b4",
    hashCurrent: "0xAB4c5D6e7F8a9B0c1D2e3F4a5B6c7D8e9F0a1B2c3D4e5F6a7B8c9D0e1F2a3B4c5",
  },
  {
    id: "LE-010", timestamp: "2025-03-23T09:20:00",
    type: "PAYMENT_VERIFIED", actorRole: "system", actorName: "Sistem OCR B.O.G.A",
    entityId: "PO-2026-0002", description: "OCR memverifikasi bukti transfer PO-2026-0002: MATCH 100%",
    dataSummary: { poAmount: 3530000, transferAmount: 3530000, status: "MATCH", confidence: 94 },
    hashPrev: "0xAB4c5D6e7F8a9B0c1D2e3F4a5B6c7D8e9F0a1B2c3D4e5F6a7B8c9D0e1F2a3B4c5",
    hashCurrent: "0x1A2b3C4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0b1C2d3E4f5A6b7C8d9E0f1A2b",
  },
  // PO-2026-0004 (underpaid)
  {
    id: "LE-011", timestamp: "2025-03-28T10:00:00",
    type: "PO_CREATED", actorRole: "sppg", actorName: "SPPG Dago Bandung",
    entityId: "PO-2026-0004", description: "Purchase Order PO-2026-0004 dibuat senilai Rp 10.575.000",
    dataSummary: { vendor: "CV Katering Bandung Juara", totalAmount: 10575000 },
    hashPrev: "0x1A2b3C4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0b1C2d3E4f5A6b7C8d9E0f1A2b",
    hashCurrent: "0xBC5d6E7f8A9b0C1d2E3f4A5b6C7d8E9f0A1b2C3d4E5f6A7b8C9d0E1f2A3b4C5d6",
  },
  {
    id: "LE-012", timestamp: "2025-03-31T14:25:00",
    type: "PAYMENT_UPLOADED", actorRole: "sppg", actorName: "SPPG Dago Bandung",
    entityId: "PO-2026-0004", description: "Bukti transfer diunggah — OCR mendeteksi UNDERPAID Rp 5.575.000",
    dataSummary: { poAmount: 10575000, transferAmount: 5000000, selisih: -5575000, status: "UNDERPAID" },
    hashPrev: "0xBC5d6E7f8A9b0C1d2E3f4A5b6C7d8E9f0A1b2C3d4E5f6A7b8C9d0E1f2A3b4C5d6",
    hashCurrent: "0xCD6e7F8a9B0c1D2e3F4a5B6c7D8e9F0a1B2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7",
  },
  // Vendor 2 registration
  {
    id: "LE-013", timestamp: "2025-03-01T09:00:00",
    type: "VENDOR_REGISTERED", actorRole: "vendor", actorName: "Euis Rosita",
    entityId: "VENDOR-2", description: "PT Gizi Priangan Utama mendaftar sebagai vendor MBG",
    dataSummary: { nib: "9120098765432", bank: "Bank BCA" },
    hashPrev: "0xCD6e7F8a9B0c1D2e3F4a5B6c7D8e9F0a1B2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7",
    hashCurrent: "0xDE7f8A9b0C1d2E3f4A5b6C7d8E9f0A1b2C3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8",
  },
  {
    id: "LE-014", timestamp: "2025-03-02T10:00:00",
    type: "VENDOR_WHITELISTED", actorRole: "pemerintah", actorName: "Operator BGN",
    entityId: "VENDOR-2", description: "PT Gizi Priangan Utama disetujui whitelist",
    dataSummary: { ocrScore: 95, sertifikasi: "Halal MUI, BPOM" },
    hashPrev: "0xDE7f8A9b0C1d2E3f4A5b6C7d8E9f0A1b2C3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8",
    hashCurrent: "0xEF8a9B0c1D2e3F4a5B6c7D8e9F0a1B2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9",
  },
];

// ── Langkah 5: Inventory Movements (Inbound/Outbound) ─────────────────────

export interface InventoryMovement {
  id: string;
  vendorId: number;
  commodityId: string;
  commodityName: string;
  type: "inbound" | "outbound";
  quantity: number;
  unit: string;
  date: string;
  poId?: string;
  notes: string;
  hashSHA256: string;
}

export const inventoryMovements: InventoryMovement[] = [
  // Vendor 1 Inbound
  { id: "MOV-001", vendorId: 1, commodityId: "COM-001", commodityName: "Beras Premium SLYP", type: "inbound", quantity: 500, unit: "kg", date: "2025-03-10", notes: "Pengadaan stok awal dari petani Subang", hashSHA256: "sha256:a1b2c3d4e5" },
  { id: "MOV-002", vendorId: 1, commodityId: "COM-002", commodityName: "Ayam Broiler Karkas", type: "inbound", quantity: 200, unit: "kg", date: "2025-03-10", notes: "Stok dari RPH Bandung", hashSHA256: "sha256:f6a7b8c9d0" },
  { id: "MOV-003", vendorId: 1, commodityId: "COM-003", commodityName: "Telur Ayam Omega-3", type: "inbound", quantity: 5000, unit: "butir", date: "2025-03-12", notes: "Stok dari peternakan Lembang", hashSHA256: "sha256:e1f2a3b4c5" },
  { id: "MOV-004", vendorId: 1, commodityId: "COM-004", commodityName: "Minyak Goreng Sawit 2L", type: "inbound", quantity: 100, unit: "botol", date: "2025-03-12", notes: "Pengadaan dari distributor resmi", hashSHA256: "sha256:d6e7f8a9b0" },
  { id: "MOV-005", vendorId: 1, commodityId: "COM-005", commodityName: "Bayam Hidroponik", type: "inbound", quantity: 200, unit: "ikat", date: "2025-03-14", notes: "Pasokan dari kebun hidroponik Cimahi", hashSHA256: "sha256:c1d2e3f4a5" },
  { id: "MOV-006", vendorId: 1, commodityId: "COM-001", commodityName: "Beras Premium SLYP", type: "inbound", quantity: 400, unit: "kg", date: "2025-03-25", notes: "Restocking bulanan", hashSHA256: "sha256:b6c7d8e9f0" },
  // Vendor 1 Outbound (linked to POs)
  { id: "MOV-007", vendorId: 1, commodityId: "COM-001", commodityName: "Beras Premium SLYP", type: "outbound", quantity: 100, unit: "kg", date: "2025-03-16", poId: "PO-2026-0001", notes: "Pengiriman ke SPPG Dago - PO-2026-0001", hashSHA256: "sha256:a9b0c1d2e3" },
  { id: "MOV-008", vendorId: 1, commodityId: "COM-002", commodityName: "Ayam Broiler Karkas", type: "outbound", quantity: 80, unit: "kg", date: "2025-03-16", poId: "PO-2026-0001", notes: "Pengiriman ke SPPG Dago - PO-2026-0001", hashSHA256: "sha256:f4a5b6c7d8" },
  { id: "MOV-009", vendorId: 1, commodityId: "COM-003", commodityName: "Telur Ayam Omega-3", type: "outbound", quantity: 2000, unit: "butir", date: "2025-03-16", poId: "PO-2026-0001", notes: "Pengiriman ke SPPG Dago - PO-2026-0001", hashSHA256: "sha256:e9f0a1b2c3" },
  // Vendor 2 Inbound
  { id: "MOV-010", vendorId: 2, commodityId: "COM-006", commodityName: "Beras Medium IR64", type: "inbound", quantity: 400, unit: "kg", date: "2025-03-11", notes: "Stok dari penggilingan Garut", hashSHA256: "sha256:d4e5f6a7b8" },
  { id: "MOV-011", vendorId: 2, commodityId: "COM-007", commodityName: "Ikan Kembung Segar", type: "inbound", quantity: 150, unit: "kg", date: "2025-03-11", notes: "Pasokan dari TPI Pelabuhan Ratu", hashSHA256: "sha256:c9d0e1f2a3" },
  // Vendor 2 Outbound
  { id: "MOV-012", vendorId: 2, commodityId: "COM-006", commodityName: "Beras Medium IR64", type: "outbound", quantity: 80, unit: "kg", date: "2025-03-21", poId: "PO-2026-0002", notes: "Pengiriman ke SPPG Soekarno Hatta - PO-2026-0002", hashSHA256: "sha256:b4c5d6e7f8" },
  // Vendor 4 Inbound
  { id: "MOV-013", vendorId: 4, commodityId: "COM-010", commodityName: "Wortel Berastagi Pilihan", type: "inbound", quantity: 200, unit: "kg", date: "2025-03-15", notes: "Langsung dari petani Lembang", hashSHA256: "sha256:a3b4c5d6e7" },
  { id: "MOV-014", vendorId: 4, commodityId: "COM-011", commodityName: "Kubis Segar", type: "inbound", quantity: 250, unit: "kg", date: "2025-03-15", notes: "Pasokan dari pasar Caringin", hashSHA256: "sha256:f8a9b0c1d2" },
  // Vendor 5 Inbound
  { id: "MOV-015", vendorId: 5, commodityId: "COM-014", commodityName: "Beras Premium SLYP", type: "inbound", quantity: 600, unit: "kg", date: "2025-03-08", notes: "Pengadaan awal dari Karawang", hashSHA256: "sha256:e3f4a5b6c7" },
  { id: "MOV-016", vendorId: 5, commodityId: "COM-016", commodityName: "Ayam Broiler Karkas", type: "inbound", quantity: 200, unit: "kg", date: "2025-03-08", notes: "Stok dari RPH Cileunyi", hashSHA256: "sha256:d8e9f0a1b2" },
  // Vendor 5 Outbound
  { id: "MOV-017", vendorId: 5, commodityId: "COM-014", commodityName: "Beras Premium SLYP", type: "outbound", quantity: 120, unit: "kg", date: "2025-03-26", poId: "PO-2026-0003", notes: "Pengiriman ke SPPG Buah Batu - PO-2026-0003", hashSHA256: "sha256:c3d4e5f6a7" },
];

// ── Vendor Dashboard Stats Helper ─────────────────────────────────────────

export interface VendorDashboardStats {
  vendorId: number;
  totalRevenue: number;
  activeOrders: number;
  activeProducts: number;
  totalInbound: number;
  monthlyRevenue: { month: string; amount: number }[];
  poStatusBreakdown: { status: string; count: number }[];
}

export function getVendorDashboardStats(vendorId: number): VendorDashboardStats {
  const vPOs = purchaseOrders.filter(po => po.vendorId === vendorId);
  const vCommodities = vendorCommodities.filter(c => c.vendorId === vendorId);
  const vInbound = inventoryMovements.filter(m => m.vendorId === vendorId && m.type === "inbound");

  const totalRevenue = vPOs
    .filter(po => ["COMPLETED", "PAYMENT_VERIFIED"].includes(po.status))
    .reduce((sum, po) => sum + po.totalAmount, 0);

  const activeOrders = vPOs.filter(po =>
    !["COMPLETED", "EXPIRED"].includes(po.status)
  ).length;

  const statusCounts: Record<string, number> = {};
  vPOs.forEach(po => {
    statusCounts[po.status] = (statusCounts[po.status] || 0) + 1;
  });

  return {
    vendorId,
    totalRevenue,
    activeOrders,
    activeProducts: vCommodities.length,
    totalInbound: vInbound.length,
    monthlyRevenue: [
      { month: "Jan", amount: Math.round(totalRevenue * 0.15) },
      { month: "Feb", amount: Math.round(totalRevenue * 0.22) },
      { month: "Mar", amount: Math.round(totalRevenue * 0.35) },
      { month: "Apr", amount: Math.round(totalRevenue * 0.28) },
    ],
    poStatusBreakdown: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
  };
}

// ── Vendor History Events ─────────────────────────────────────────────────

export type HistoryEventType =
  | "PO_CREATED" | "PAYMENT_VERIFIED" | "QC_APPROVED"
  | "INBOUND_RECORDED" | "OUTBOUND_RECORDED"
  | "DELIVERY_VERIFIED" | "DISPUTE_OPENED" | "REVIEW_RECEIVED";

export interface VendorHistoryEvent {
  id: string;
  vendorId: number;
  type: HistoryEventType;
  title: string;
  subtitle: string;
  detail: string;
  amount?: number;
  date: string;
  hashRef?: string;
}

export const vendorHistoryEvents: VendorHistoryEvent[] = [
  // Vendor 1
  { id: "EVT-001", vendorId: 1, type: "PAYMENT_VERIFIED", title: "Pembayaran Terverifikasi", subtitle: "PO-2026-0001 · SPPG Dago Bandung", detail: "OCR memverifikasi bukti transfer Rp 11.600.000. MATCH 100%.", amount: 11600000, date: "2025-03-18", hashRef: "0x8F2a...9F0a" },
  { id: "EVT-002", vendorId: 1, type: "QC_APPROVED", title: "QC Disetujui", subtitle: "PO-2026-0001 · SPPG Dago Bandung", detail: "3 tanda tangan digital lengkap (QC, Admin, Logistik).", date: "2025-03-17" },
  { id: "EVT-003", vendorId: 1, type: "DELIVERY_VERIFIED", title: "Distribusi Terverifikasi", subtitle: "SMAN 3 Bandung · 680 porsi", detail: "QR scan + GPS valid. Geofence: 23m (≤50m). Tepat waktu.", date: "2025-03-19" },
  { id: "EVT-004", vendorId: 1, type: "PO_CREATED", title: "PO Baru Diterima", subtitle: "PO-2026-0004 · SPPG Dago Bandung", detail: "Pesanan baru untuk 150 kg Beras + 3000 butir Telur. Total Rp 10.575.000.", amount: 10575000, date: "2025-03-28" },
  { id: "EVT-005", vendorId: 1, type: "INBOUND_RECORDED", title: "Inbound Tercatat", subtitle: "500 kg Beras Premium SLYP", detail: "Stok masuk dari petani Subang. Hash surat jalan tercatat di ledger.", date: "2025-03-10", hashRef: "sha256:a1b2c3" },
  { id: "EVT-006", vendorId: 1, type: "OUTBOUND_RECORDED", title: "Outbound Tercatat", subtitle: "100 kg Beras → SPPG Dago", detail: "Pengiriman untuk PO-2026-0001. Hash tercatat di ledger.", date: "2025-03-16", hashRef: "sha256:a9b0c1" },
  { id: "EVT-007", vendorId: 1, type: "REVIEW_RECEIVED", title: "Ulasan Siswa Diterima", subtitle: "SMAN 3 Bandung · ⭐ 4.7/5", detail: "3 ulasan baru dari siswa. Rata-rata 4.7 — rasa 4.7, porsi 4.0, kebersihan 5.0.", date: "2025-04-03" },
  { id: "EVT-008", vendorId: 1, type: "INBOUND_RECORDED", title: "Restocking Beras", subtitle: "400 kg Beras Premium SLYP", detail: "Restocking bulanan dari Subang.", date: "2025-03-25", hashRef: "sha256:b6c7d8" },
  // Vendor 2
  { id: "EVT-009", vendorId: 2, type: "PAYMENT_VERIFIED", title: "Pembayaran Terverifikasi", subtitle: "PO-2026-0002 · SPPG Soekarno Hatta", detail: "OCR memverifikasi bukti transfer Rp 3.530.000. MATCH 100%.", amount: 3530000, date: "2025-03-23", hashRef: "0x1A2b...1A2b" },
  { id: "EVT-010", vendorId: 2, type: "PO_CREATED", title: "PO Baru Diterima", subtitle: "PO-2026-0005 · SPPG Soekarno Hatta", detail: "Pesanan baru: 90 kg Beras + 60 papan Tempe. Menunggu konfirmasi.", amount: 1635000, date: "2025-04-01" },
  { id: "EVT-011", vendorId: 2, type: "INBOUND_RECORDED", title: "Inbound Tercatat", subtitle: "400 kg Beras Medium IR64", detail: "Stok masuk dari penggilingan Garut.", date: "2025-03-11", hashRef: "sha256:d4e5f6" },
  // Vendor 4
  { id: "EVT-012", vendorId: 4, type: "PO_CREATED", title: "PO Baru Diterima", subtitle: "PO-2026-0007 · SPPG Dago Bandung", detail: "Pesanan sayur-mayur 3 komoditas senilai Rp 2.750.000.", amount: 2750000, date: "2025-03-30" },
  { id: "EVT-013", vendorId: 4, type: "DISPUTE_OPENED", title: "Review Manual Diperlukan", subtitle: "PO-2026-0007 · Bukti Transfer", detail: "OCR gagal membaca bukti transfer (confidence 23%). Menunggu review manual operator.", date: "2025-04-02" },
  // Vendor 5
  { id: "EVT-014", vendorId: 5, type: "PO_CREATED", title: "PO Baru Diterima", subtitle: "PO-2026-0003 · SPPG Buah Batu", detail: "Pesanan 3 komoditas senilai Rp 4.451.000. QC sudah approve.", amount: 4451000, date: "2025-03-25" },
  { id: "EVT-015", vendorId: 5, type: "PO_CREATED", title: "PO Baru Diterima", subtitle: "PO-2026-0006 · SPPG Buah Batu", detail: "Pesanan Daging Sapi + Garam senilai Rp 4.390.000. Siap diambil.", amount: 4390000, date: "2025-04-01" },
  { id: "EVT-016", vendorId: 5, type: "OUTBOUND_RECORDED", title: "Outbound Tercatat", subtitle: "120 kg Beras → SPPG Buah Batu", detail: "Pengiriman untuk PO-2026-0003.", date: "2025-03-26", hashRef: "sha256:c3d4e5" },
  { id: "EVT-017", vendorId: 5, type: "REVIEW_RECEIVED", title: "Ulasan Siswa Diterima", subtitle: "SMPN 2 Bandung · ⭐ 4.5/5", detail: "Ulasan positif dari siswa.", date: "2025-04-02" },
];

// ── Student NLP Sentiment Categories (Langkah 12) ─────────────────────────

export interface StudentNLPCategory {
  category: string;
  count: number;
  sentiment: "negative" | "positive" | "neutral";
  keywords: string[];
  reviewIds: number[];
}

export function getStudentNLPCategories(vendorId: number): StudentNLPCategory[] {
  const reviews = vendorReviews.filter(r => r.vendor_id === vendorId);
  if (reviews.length === 0) return [];

  const categories: StudentNLPCategory[] = [];
  const patterns: { category: string; keywords: string[]; sentiment: "negative" | "positive" | "neutral" }[] = [
    { category: "Nasi Keras / Tidak Matang", keywords: ["keras", "kurang matang", "nasi keras"], sentiment: "negative" },
    { category: "Lauk Dingin", keywords: ["dingin", "sudah dingin"], sentiment: "negative" },
    { category: "Sayuran Basi", keywords: ["basi", "tidak segar"], sentiment: "negative" },
    { category: "Porsi Kurang", keywords: ["porsi sedikit", "kurang banyak", "porsi kurang"], sentiment: "negative" },
    { category: "Rasa Enak", keywords: ["enak", "bumbu pas", "memuaskan", "lezat"], sentiment: "positive" },
    { category: "Pengiriman Tepat Waktu", keywords: ["tepat waktu", "sebelum jam"], sentiment: "positive" },
    { category: "Kebersihan Baik", keywords: ["bersih", "higienis", "kebersihan terjaga"], sentiment: "positive" },
    { category: "Menu Variatif", keywords: ["variatif", "bergizi"], sentiment: "positive" },
  ];

  for (const pattern of patterns) {
    const matchedReviews = reviews.filter(r =>
      pattern.keywords.some(k => r.comment.toLowerCase().includes(k))
    );
    if (matchedReviews.length > 0) {
      categories.push({
        category: pattern.category,
        count: matchedReviews.length,
        sentiment: pattern.sentiment,
        keywords: pattern.keywords,
        reviewIds: matchedReviews.map(r => r.id),
      });
    }
  }

  return categories.sort((a, b) => b.count - a.count);
}

// ── OSRM Dummy Routes (Fallback saat offline) ─────────────────────────────

export const dummyRoutes: Record<string, [number, number][]> = {
  // Vendor 1 (Dago) → SMAN 3 Bandung
  "1-1": [[-6.885, 107.613], [-6.889, 107.614], [-6.893, 107.615], [-6.900, 107.616], [-6.907, 107.617], [-6.9135, 107.6186]],
  // Vendor 5 (Buah Batu) → SMPN 2 Bandung
  "5-2": [[-6.938, 107.625], [-6.930, 107.621], [-6.922, 107.618], [-6.915, 107.615], [-6.9104, 107.6141]],
  // Vendor 1 (Dago) → SDN 061 Cirengel
  "1-3": [[-6.885, 107.613], [-6.889, 107.612], [-6.895, 107.611], [-6.9015, 107.6112]],
  // Vendor 3 (Pasteur) → SDN 164 Karang Pawulang
  "3-5": [[-6.898, 107.595], [-6.905, 107.600], [-6.912, 107.610], [-6.918, 107.620], [-6.9247, 107.6321]],
  // Vendor 2 (Soekarno Hatta) → SMPN 5 Bandung
  "2-4": [[-6.945, 107.632], [-6.935, 107.625], [-6.925, 107.618], [-6.9112, 107.6125]],
  // Fallback: straight line generic
  "default": [[-6.92, 107.61], [-6.91, 107.62]],
};

export function getDummyRoute(vendorId: number, sekolahId: number): [number, number][] {
  return dummyRoutes[`${vendorId}-${sekolahId}`] || dummyRoutes["default"];
}

// ── PO Helpers ────────────────────────────────────────────────────────────

export function getPurchaseOrdersByVendor(vendorId: number): PurchaseOrder[] {
  return purchaseOrders.filter(po => po.vendorId === vendorId);
}

export function getPurchaseOrdersBySppg(sppgId: number): PurchaseOrder[] {
  return purchaseOrders.filter(po => po.sppgId === sppgId);
}

export function getPaymentProofByPO(poId: string): PaymentProof | undefined {
  return paymentProofs.find(pp => pp.poId === poId);
}

export function getLedgerByEntity(entityId: string): LedgerEntry[] {
  return ledgerEntries.filter(le => le.entityId === entityId);
}

export function getVendorCommodities(vendorId: number): Commodity[] {
  return vendorCommodities.filter(c => c.vendorId === vendorId);
}

export function getInventoryMovements(vendorId: number, type?: "inbound" | "outbound"): InventoryMovement[] {
  return inventoryMovements.filter(m => m.vendorId === vendorId && (!type || m.type === type));
}

export function getVendorHistoryEvents(vendorId: number): VendorHistoryEvent[] {
  return vendorHistoryEvents.filter(e => e.vendorId === vendorId).sort((a, b) => b.date.localeCompare(a.date));
}

// ═══════════════════════════════════════════════════════════════════════════════
// END NEW DATA
// ═══════════════════════════════════════════════════════════════════════════════

export function getVendorsBySekolah(sekolahId: number) {
  return vendorSekolahList
    .filter((vs) => vs.sekolah_id === sekolahId)
    .map((vs) => ({
      ...vs,
      vendor: vendorList.find((v) => v.id === vs.vendor_id)!,
    }));
}

export function getDeliveriesByVendorSekolah(vsId: number, limit = 5): Delivery[] {
  return deliveryList
    .filter((d) => d.vendor_sekolah_id === vsId)
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
    .slice(0, limit);
}

export function getSekolahBySPPG(sppgId: number) {
  return sppgSekolahList
    .filter((ss) => ss.sppg_id === sppgId)
    .map((ss) => sekolahList.find((s) => s.id === ss.sekolah_id)!);
}

// ─── Dashboard Aggregate Functions ─────────────────────────────────────────

export type DashboardPeriode = "1H" | "7H" | "30H";
export type JenjangFilter = "SD" | "SMP" | "SMA";

/** Helper: ISO date string N days ago */
function daysAgo(n: number): string {
  const d = new Date("2025-04-03"); // anchor = latest date in data
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

/** Deliveries for a given date range */
function deliveriesInRange(from: string, to: string) {
  return deliveryList.filter((d) => d.tanggal >= from && d.tanggal <= to);
}

// ── 1. KPI Summary ───────────────────────────────────────────────────────────

export interface KPISummary {
  totalPorsi: number;
  totalPorsiPrev: number;
  totalPengeluaran: number;
  totalPengeluaranPrev: number;
  onTimeRate: number;
  onTimeRatePrev: number;
  sengketaAktif: number;
  sengketaAktifPrev: number;
  vendorPending: number;
}

export function getKPISummary(periode: DashboardPeriode): KPISummary {
  const days = periode === "1H" ? 1 : periode === "7H" ? 7 : 30;
  const toDate = daysAgo(0);
  const fromDate = daysAgo(days - 1);
  const prevTo = daysAgo(days);
  const prevFrom = daysAgo(days * 2 - 1);

  const curr = deliveriesInRange(fromDate, toDate);
  const prev = deliveriesInRange(prevFrom, prevTo);

  const calcPorsi = (list: Delivery[]) =>
    list.filter((d) => d.status === "delivered").reduce((s, d) => s + d.porsi_diterima, 0);

  const calcPengeluaran = (list: Delivery[]) =>
    list
      .filter((d) => d.status === "delivered")
      .reduce((s, d) => {
        const vs = vendorSekolahList.find((v) => v.id === d.vendor_sekolah_id);
        return s + d.porsi_diterima * (vs?.harga_per_porsi ?? 15000);
      }, 0);

  const onTimeDelivered = (list: Delivery[]) =>
    list.filter(
      (d) => d.status === "delivered" && d.jam_tiba !== "--" && d.jam_tiba <= d.jam_target
    ).length;
  const totalDelivered = (list: Delivery[]) => list.filter((d) => d.status === "delivered").length;

  const currOTCount = onTimeDelivered(curr);
  const currTotalD = totalDelivered(curr);
  const prevOTCount = onTimeDelivered(prev);
  const prevTotalD = totalDelivered(prev);

  return {
    totalPorsi: calcPorsi(curr),
    totalPorsiPrev: calcPorsi(prev),
    totalPengeluaran: calcPengeluaran(curr),
    totalPengeluaranPrev: calcPengeluaran(prev),
    onTimeRate: currTotalD > 0 ? Math.round((currOTCount / currTotalD) * 1000) / 10 : 0,
    onTimeRatePrev: prevTotalD > 0 ? Math.round((prevOTCount / prevTotalD) * 1000) / 10 : 0,
    sengketaAktif: curr.filter((d) => d.catatan && d.catatan.toLowerCase().includes("sengketa")).length,
    sengketaAktifPrev: prev.filter((d) => d.catatan && d.catatan.toLowerCase().includes("sengketa")).length,
    vendorPending: vendorList.filter((v) => v.status === "suspend").length,
  };
}

// ── 2. Delivery Trend (Porsi + Pengeluaran) ──────────────────────────────────

export interface TrendDataPoint {
  label: string;
  porsi: number;
  pengeluaran: number;
  porsiSD: number;
  porsiSMP: number;
  porsiSMA: number;
  isAvgPrev?: boolean;
}

export function getDeliveryTrend(periode: DashboardPeriode, jenjang?: JenjangFilter[]): { series: TrendDataPoint[]; avgPrev: number } {
  const days = periode === "1H" ? 1 : periode === "7H" ? 7 : 30;
  const LABELS_DAY = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  // Helper: check if a delivery matches the jenjang filter
  const matchesJenjang = (d: Delivery) => {
    if (!jenjang || jenjang.length === 0) return true;
    const vs = vendorSekolahList.find((v) => v.id === d.vendor_sekolah_id);
    const s = vs ? sekolahList.find((sc) => sc.id === vs.sekolah_id) : null;
    return s ? jenjang.includes(s.jenjang as JenjangFilter) : false;
  };

  const series: TrendDataPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = daysAgo(i);
    const all = deliveryList.filter((d) => d.tanggal === date && d.status === "delivered");
    const delivs = all.filter(matchesJenjang);

    const getJenjangPorsi = (j: string) =>
      delivs
        .filter((d) => {
          const vs = vendorSekolahList.find((v) => v.id === d.vendor_sekolah_id);
          const s = vs ? sekolahList.find((sc) => sc.id === vs.sekolah_id) : null;
          return s?.jenjang === j;
        })
        .reduce((s, d) => s + d.porsi_diterima, 0);

    const totalPorsi = delivs.reduce((s, d) => s + d.porsi_diterima, 0);
    const pengeluaran = delivs.reduce((s, d) => {
      const vs = vendorSekolahList.find((v) => v.id === d.vendor_sekolah_id);
      return s + d.porsi_diterima * (vs?.harga_per_porsi ?? 15000);
    }, 0);

    const dayLabel = days <= 7 ? LABELS_DAY[new Date(date).getDay()] : date.slice(8, 10);
    series.push({
      label: dayLabel,
      porsi: totalPorsi,
      pengeluaran,
      porsiSD: getJenjangPorsi("SD"),
      porsiSMP: getJenjangPorsi("SMP"),
      porsiSMA: getJenjangPorsi("SMA"),
    });
  }

  const prevSeries: number[] = [];
  for (let i = days * 2 - 1; i >= days; i--) {
    const date = daysAgo(i);
    const p = deliveryList
      .filter((d) => d.tanggal === date && d.status === "delivered" && matchesJenjang(d))
      .reduce((s, d) => s + d.porsi_diterima, 0);
    prevSeries.push(p);
  }
  const avgPrev = prevSeries.length > 0 ? Math.round(prevSeries.reduce((a, b) => a + b, 0) / prevSeries.length) : 0;

  return { series, avgPrev };
}

// ── 3. On-Time Rate Series ────────────────────────────────────────────────────

export interface OnTimeRatePoint {
  label: string;
  rate: number;
}

export function getOnTimeRateSeries(periode: DashboardPeriode, jenjang?: JenjangFilter[]): { series: OnTimeRatePoint[]; current: number; prev: number } {
  const days = periode === "1H" ? 1 : periode === "7H" ? 7 : 30;
  const LABELS_DAY = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const matchesJenjang = (d: Delivery) => {
    if (!jenjang || jenjang.length === 0) return true;
    const vs = vendorSekolahList.find((v) => v.id === d.vendor_sekolah_id);
    const s = vs ? sekolahList.find((sc) => sc.id === vs.sekolah_id) : null;
    return s ? jenjang.includes(s.jenjang as JenjangFilter) : false;
  };

  const series: OnTimeRatePoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = daysAgo(i);
    const delivs = deliveryList.filter((d) => d.tanggal === date && d.status === "delivered" && matchesJenjang(d));
    const onTime = delivs.filter((d) => d.jam_tiba !== "--" && d.jam_tiba <= d.jam_target).length;
    const rate = delivs.length > 0 ? Math.round((onTime / delivs.length) * 1000) / 10 : 0;
    const label = days <= 7 ? LABELS_DAY[new Date(date).getDay()] : date.slice(8, 10);
    series.push({ label, rate });
  }

  const currDelivs = deliveriesInRange(daysAgo(days - 1), daysAgo(0)).filter((d) => d.status === "delivered" && matchesJenjang(d));
  const currOT = currDelivs.filter((d) => d.jam_tiba !== "--" && d.jam_tiba <= d.jam_target).length;
  const current = currDelivs.length > 0 ? Math.round((currOT / currDelivs.length) * 1000) / 10 : 0;

  const prevDelivs = deliveriesInRange(daysAgo(days * 2 - 1), daysAgo(days)).filter((d) => d.status === "delivered" && matchesJenjang(d));
  const prevOT = prevDelivs.filter((d) => d.jam_tiba !== "--" && d.jam_tiba <= d.jam_target).length;
  const prev = prevDelivs.length > 0 ? Math.round((prevOT / prevDelivs.length) * 1000) / 10 : 0;

  return { series, current, prev };
}

// ── 4. Status per Jenjang ─────────────────────────────────────────────────────

export interface JenjangStatusData {
  jenjang: "SD" | "SMP" | "SMA";
  delivered: number;
  on_transit: number;
  pending: number;
  gagal: number;
  total: number;
  completionPct: number;
}

export function getStatusPerJenjang(periode: DashboardPeriode): JenjangStatusData[] {
  const days = periode === "1H" ? 1 : periode === "7H" ? 7 : 30;
  const from = daysAgo(days - 1);
  const to = daysAgo(0);
  const range = deliveriesInRange(from, to);

  return (["SD", "SMP", "SMA"] as const).map((jenjang) => {
    const filtered = range.filter((d) => {
      const vs = vendorSekolahList.find((v) => v.id === d.vendor_sekolah_id);
      const s = vs ? sekolahList.find((sc) => sc.id === vs.sekolah_id) : null;
      return s?.jenjang === jenjang;
    });

    const delivered = filtered.filter((d) => d.status === "delivered").length;
    const on_transit = filtered.filter((d) => d.status === "on_transit").length;
    const pending = filtered.filter((d) => d.status === "pending").length;
    const gagal = filtered.filter((d) => d.status === "gagal").length;
    const total = filtered.length;

    return {
      jenjang,
      delivered,
      on_transit,
      pending,
      gagal,
      total,
      completionPct: total > 0 ? Math.round((delivered / total) * 100) : 0,
    };
  });
}

// ── 5. Vendor Ranking ─────────────────────────────────────────────────────────

export interface VendorRankingItem {
  id: number;
  nama: string;
  onTimeRate: number;
  status: StatusVendor;
  kategori: KategoriVendor;
  totalPengiriman: number;
}

export function getVendorRanking(): VendorRankingItem[] {
  return vendorList
    .map((v) => ({
      id: v.id,
      nama: v.nama,
      onTimeRate: v.on_time_rate,
      status: v.status,
      kategori: v.kategori,
      totalPengiriman: v.total_pengiriman,
    }))
    .sort((a, b) => a.onTimeRate - b.onTimeRate); // ascending = yang paling buruk di atas
}

// ── 6. Compliance Scores ──────────────────────────────────────────────────────

export interface ComplianceCategoryScore {
  kategori: "Vendor" | "Sekolah" | "Armada";
  skor: number;
  skorPrev: number;
  trend: "up" | "down" | "stable";
  trendValue: number;
  entities: {
    nama: string;
    status: "patuh" | "perhatian" | "tidak_patuh";
    skor: number;
  }[];
}

export function getComplianceScores(): ComplianceCategoryScore[] {
  const vendorSkor = Math.round(
    (vendorList.filter((v) => v.status === "aktif").length / vendorList.length) * 100
  );
  const vendorPrev = 97;

  const deliveredRatio = deliveryList.filter((d) => d.status === "delivered").length / Math.max(deliveryList.length, 1);
  const sekolahSkor = Math.round(deliveredRatio * 100);
  const sekolahPrev = 89;

  const onTimeArmada = deliveryList.filter(
    (d) => d.status === "delivered" && d.jam_tiba !== "--" && d.jam_tiba <= d.jam_target
  ).length;
  const armadaSkor = deliveryList.length > 0 ? Math.round((onTimeArmada / deliveryList.length) * 100) : 0;
  const armadaPrev = 91;

  return [
    {
      kategori: "Vendor",
      skor: vendorSkor,
      skorPrev: vendorPrev,
      trend: vendorSkor > vendorPrev ? "up" : vendorSkor < vendorPrev ? "down" : "stable",
      trendValue: Math.abs(vendorSkor - vendorPrev),
      entities: vendorList.map((v) => ({
        nama: v.nama,
        status: v.status === "aktif" ? "patuh" : v.status === "suspend" ? "tidak_patuh" : "perhatian",
        skor: Math.round(v.on_time_rate),
      })),
    },
    {
      kategori: "Sekolah",
      skor: sekolahSkor,
      skorPrev: sekolahPrev,
      trend: sekolahSkor > sekolahPrev ? "up" : sekolahSkor < sekolahPrev ? "down" : "stable",
      trendValue: Math.abs(sekolahSkor - sekolahPrev),
      entities: sekolahList.map((s) => {
        const delivs = deliveryList.filter((d) => {
          const vs = vendorSekolahList.find((v) => v.id === d.vendor_sekolah_id);
          return vs?.sekolah_id === s.id;
        });
        const ok = delivs.filter((d) => d.status === "delivered").length;
        const pct = delivs.length > 0 ? Math.round((ok / delivs.length) * 100) : 0;
        return {
          nama: s.nama,
          status: pct >= 90 ? "patuh" : pct >= 70 ? "perhatian" : "tidak_patuh",
          skor: pct,
        };
      }),
    },
    {
      kategori: "Armada",
      skor: armadaSkor,
      skorPrev: armadaPrev,
      trend: armadaSkor > armadaPrev ? "up" : armadaSkor < armadaPrev ? "down" : "stable",
      trendValue: Math.abs(armadaSkor - armadaPrev),
      entities: [
        { nama: "Armada 1 – Bandung Utara (SPPG Dago)", status: "patuh" as const, skor: 96 },
        { nama: "Armada 2 – Bandung Selatan (SPPG Buah Batu)", status: "patuh" as const, skor: 94 },
        { nama: "Armada 3 – Bandung Tengah (SPPG Soekarno Hatta)", status: "perhatian" as const, skor: 82 },
      ],
    },
  ];
}

// ── 7. School Table Data ──────────────────────────────────────────────────────

export type SchoolDeliveryStatus = "terkirim" | "on_transit" | "gagal" | "sengketa" | "pending";

export interface SchoolTableRow {
  id: number;
  nama: string;
  jenjang: "SD" | "SMP" | "SMA";
  kecamatan: string;
  kota: string;
  lat: number;
  lng: number;
  status: SchoolDeliveryStatus;
  porsiDiterima: number;
  porsiTarget: number;
  jamTiba: string;
  jamTarget: string;
  selisihMenit: number | null; // positif = terlambat, negatif = lebih awal
  vendorNama: string;
  catatan: string | null;
}

export function getSchoolTableData(periode: DashboardPeriode, jenjangFilter?: JenjangFilter[]): SchoolTableRow[] {
  const days = periode === "1H" ? 1 : periode === "7H" ? 7 : 30;
  const from = daysAgo(days - 1);
  const to = daysAgo(0);

  const STATUS_ORDER: Record<SchoolDeliveryStatus, number> = {
    sengketa: 0, gagal: 1, on_transit: 2, pending: 3, terkirim: 4,
  };

  return sekolahList
    .filter((s) => !jenjangFilter || jenjangFilter.length === 0 || jenjangFilter.includes(s.jenjang))
    .map((s) => {
      const vsLinks = vendorSekolahList.filter((vs) => vs.sekolah_id === s.id && vs.is_primary);
      const vs = vsLinks[0];
      const vendor = vs ? vendorList.find((v) => v.id === vs.vendor_id) : null;

      // latest delivery in range
      const delivs = deliveryList
        .filter((d) => vs && d.vendor_sekolah_id === vs.id && d.tanggal >= from && d.tanggal <= to)
        .sort((a, b) => b.tanggal.localeCompare(a.tanggal));

      const latest = delivs[0];

      let status: SchoolDeliveryStatus = "pending";
      let porsiDiterima = 0;
      let jamTiba = "--";
      let selisihMenit: number | null = null;
      let catatan: string | null = null;

      if (latest) {
        porsiDiterima = latest.porsi_diterima;
        jamTiba = latest.jam_tiba;
        catatan = latest.catatan;

        if (latest.catatan?.toLowerCase().includes("sengketa")) {
          status = "sengketa";
        } else if (latest.status === "delivered") {
          status = "terkirim";
        } else if (latest.status === "on_transit") {
          status = "on_transit";
        } else if (latest.status === "gagal") {
          status = "gagal";
        } else {
          status = "pending";
        }

        // calculate selisih in minutes
        if (latest.jam_tiba !== "--" && latest.jam_target !== "--") {
          const [ha, ma] = latest.jam_tiba.split(":").map(Number);
          const [ht, mt] = latest.jam_target.split(":").map(Number);
          selisihMenit = (ha * 60 + ma) - (ht * 60 + mt);
        }
      }

      return {
        id: s.id,
        nama: s.nama,
        jenjang: s.jenjang,
        kecamatan: s.kecamatan,
        kota: s.kota,
        lat: s.lat,
        lng: s.lng,
        status,
        porsiDiterima,
        porsiTarget: vs?.porsi_per_hari ?? s.total_siswa,
        jamTiba,
        jamTarget: latest?.jam_target ?? "07:00",
        selisihMenit,
        vendorNama: vendor?.nama ?? "—",
        catatan,
      };
    })
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
}

// ── 8. Activity Log ───────────────────────────────────────────────────────────

export interface ActivityLogItem {
  id: string;
  type: "success" | "warning" | "refund" | "info";
  message: string;
  timeLabel: string; // "5 menit lalu"
  href: string;
}

export function getActivityLog(): ActivityLogItem[] {
  // Derive activity from delivery events + static system events
  const items: ActivityLogItem[] = [];

  deliveryList.forEach((d) => {
    const vs = vendorSekolahList.find((v) => v.id === d.vendor_sekolah_id);
    const sekolah = vs ? sekolahList.find((s) => s.id === vs.sekolah_id) : null;
    const vendor = vs ? vendorList.find((v) => v.id === vs.vendor_id) : null;

    if (d.status === "delivered" && d.catatan) {
      items.push({
        id: `d-catatan-${d.id}`,
        type: "warning",
        message: `${sekolah?.nama ?? "Sekolah"}: ${d.catatan}`,
        timeLabel: `${d.id * 7} menit lalu`,
        href: "/goverment/pengawasan",
      });
    }
    if (d.status === "on_transit") {
      items.push({
        id: `d-transit-${d.id}`,
        type: "info",
        message: `Pengiriman ke ${sekolah?.nama ?? "Sekolah"} sedang dalam perjalanan`,
        timeLabel: `${d.id * 4} menit lalu`,
        href: "/goverment/pengawasan",
      });
    }
    if (d.status === "pending") {
      items.push({
        id: `d-pending-${d.id}`,
        type: "warning",
        message: `Pengiriman ke ${sekolah?.nama ?? "Sekolah"} belum terkonfirmasi`,
        timeLabel: `${d.id * 5} menit lalu`,
        href: "/goverment/verifikasi",
      });
    }
  });

  // Static system events
  items.push(
    { id: "sys-1", type: "success", message: "CV Katering Bandung Juara: SBT disetujui", timeLabel: "2 jam lalu", href: "/goverment/pengajuan" },
    { id: "sys-2", type: "refund", message: "Refund Rp 4.200.000 dieksekusi ke kas negara", timeLabel: "4 jam lalu", href: "/goverment/verifikasi" },
    { id: "sys-3", type: "info", message: "Laporan distribusi Minggu ke-14 tersedia", timeLabel: "6 jam lalu", href: "/goverment/riwayat" },
    { id: "sys-4", type: "warning", message: "Stok bahan baku Agro Lembang Segar menipis", timeLabel: "8 jam lalu", href: "/goverment/pengajuan" },
  );

  return items.slice(0, 20);
}

// ── 9. Delivery Heatmap (simulated, 7 days × 24 hours) ───────────────────────

export interface HeatmapCell {
  day: number;   // 0=Minggu ... 6=Sabtu
  hour: number;  // 0–23
  volume: number;
}

// Seeded PRNG (mulberry32) — deterministic, avoids SSR/CSR hydration mismatch
function heatmapRand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 0xffffffff;
  };
}

export function getDeliveryHeatmap(): { cells: HeatmapCell[]; avgPerHour: number[] } {
  // Simulate realistic MBG delivery pattern:
  // Peak: 05:00-07:30, secondary: 11:00-12:00
  const cells: HeatmapCell[] = [];
  const hourlyTotals: number[] = Array(24).fill(0);
  let dayCountNonZero = 0;

  for (let day = 0; day < 7; day++) {
    if (day === 0) continue; // Skip Sunday
    dayCountNonZero++;
    for (let hour = 0; hour < 24; hour++) {
      const rand = heatmapRand(day * 100 + hour); // unique seed per cell
      let base = 0;
      if (hour >= 5 && hour <= 7) base = 1800 - Math.abs(hour - 6) * 400 + rand() * 200;
      else if (hour >= 11 && hour <= 12) base = 600 + rand() * 150;
      else if (hour >= 8 && hour <= 10) base = 200 + rand() * 100;
      const volume = Math.max(0, Math.round(base));
      cells.push({ day, hour, volume });
      hourlyTotals[hour] += volume;
    }
  }

  const avgPerHour = hourlyTotals.map((t) => Math.round(t / Math.max(dayCountNonZero, 1)));
  return { cells, avgPerHour };
}

export function getReviewsByVendor(vendorId: number) {
  return vendorReviews.filter(r => r.vendor_id === vendorId);
}

export function getVendorPerformanceStats(vendorId: number) {
  const reviews = getReviewsByVendor(vendorId);
  if (reviews.length === 0) return null;

  const total = reviews.length;
  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / total;
  
  const subAverages = {
    rasa: reviews.reduce((s, r) => s + r.subRatings.rasa, 0) / total,
    porsi: reviews.reduce((s, r) => s + r.subRatings.porsi, 0) / total,
    kebersihan: reviews.reduce((s, r) => s + r.subRatings.kebersihan, 0) / total,
  };

  const distribution = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1
  reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) distribution[5 - r.rating]++;
  });

  return {
    total,
    avgRating,
    subAverages,
    distribution
  };
}

export function getSPPGPerformanceRanking() {
  return sppgList
    .map((s) => ({
      id: s.id,
      nama: s.nama,
      onTimeRate: s.on_time_rate,
      rating: s.rating,
      kecamatan: s.kecamatan,
      kapasitas: s.kapasitas_porsi,
    }))
    .sort((a, b) => b.rating - a.rating);
}

export function getSPPGBySekolah(sekolahId: number) {
  const mapping = sppgSekolahList.find(s => s.sekolah_id === sekolahId);
  return mapping ? sppgList.find(s => s.id === mapping.sppg_id) : null;
}

export function getSPPGPerformanceStats(sppgId: number) {
  const sppg = sppgList.find(s => s.id === sppgId);
  if (!sppg) return null;

  // Simulate stats similar to vendor
  return {
    total: 85, // simulated from multiple schools
    avgRating: sppg.rating,
    subAverages: {
      rasa: sppg.rating - 0.1,
      porsi: sppg.rating + 0.1,
      kebersihan: sppg.rating,
    },
    distribution: [40, 30, 10, 3, 2] // 5, 4, 3, 2, 1
  };
}

export function getSPPGStudentSentiment(sppgId: number): SPPGStudentSentiment | null {
  const sppg = sppgList.find(s => s.id === sppgId);
  if (!sppg) return null;

  // In this dummy system, we map reviews from the vendor managed by the SPPG
  const reviews = vendorReviews.filter(r => r.vendor_id === sppg.vendor_id);
  
  if (reviews.length === 0) {
    return {
      avgRating: 0,
      totalReviews: 0,
      trendingKeywords: [
        { word: "Cukup", count: 2, sentiment: "neutral" },
        { word: "Standar", count: 1, sentiment: "neutral" }
      ],
      distribution: [0, 0, 0, 0, 0]
    };
  }

  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  
  const distribution = [0, 0, 0, 0, 0];
  reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) {
      distribution[5 - r.rating]++;
    }
  });

  // Simple keyword tally (Mock logic for demo)
  const keywordsArr = [
    { word: "Nasi Keras", sentiment: "negative" as const },
    { word: "Rasa Enak", sentiment: "positive" as const },
    { word: "Porsi Pas", sentiment: "positive" as const },
    { word: "Higienis", sentiment: "positive" as const },
    { word: "Tepat Waktu", sentiment: "positive" as const },
    { word: "Sayur Basi", sentiment: "negative" as const },
    { word: "Dingin", sentiment: "negative" as const },
    { word: "Daging Keras", sentiment: "negative" as const },
  ];

  // Match keywords in comments
  const tally = keywordsArr.map(k => {
    const count = reviews.filter(r => r.comment.toLowerCase().includes(k.word.toLowerCase())).length;
    return { ...k, count };
  }).filter(k => k.count > 0).sort((a, b) => b.count - a.count);

  return {
    avgRating,
    totalReviews: reviews.length,
    trendingKeywords: tally.length > 0 ? tally : [
      { word: "Fresh", count: 12, sentiment: "positive" },
      { word: "Bersih", count: 8, sentiment: "positive" },
      { word: "Lengkap", count: 5, sentiment: "neutral" }
    ],
    distribution
  };
}
