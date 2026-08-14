"use client";

import { useMemo, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import type { AuthModeType as AuthMode, RoleType as Role } from "@/app/auth/login/page";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-browser-client";
import dynamic from "next/dynamic";
import { ClipboardList, ShieldCheck, GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const LocationPickerMapLibre = dynamic(
  () => import("@/components/ui/LocationPickerMapLibre"),
  {
    ssr: false,
    loading: () => <div className="h-[220px] w-full animate-pulse rounded-xl bg-slate-100" />
  }
);

interface LoginFormProps {
  className?: string;
  mode?: AuthMode;
  role?: Role;
  onModeChange?: (mode: AuthMode) => void;
  onBack?: () => void;
}

function RoleSubChoice({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: { id: string; label: string; desc: string; icon: LucideIcon }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="w-full text-left mt-2">
      <p className="font-bold text-[10px] uppercase tracking-[0.15em] text-slate-900 ml-1 mb-1.5">
        {title}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          const isActive = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={cn(
                "flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
                isActive
                  ? "bg-slate-50 border-slate-950 shadow-sm ring-1 ring-slate-950"
                  : "bg-white border-slate-200 hover:border-slate-950 hover:bg-slate-50"
              )}
            >
              <div
                className={cn(
                  "flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center transition-colors",
                  isActive ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600"
                )}
              >
                <opt.icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className={cn("text-[11px] font-bold truncate", isActive ? "text-slate-900" : "text-slate-700")}>
                  {opt.label}
                </p>
                <p className="text-[9px] text-slate-500 truncate">{opt.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FileUploadField({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      onChange(`https://r2.boga.id/temp/${file.name}`);
      toast.success(`${label} berhasil diunggah.`);
    }, 1500);
  };

  return (
    <div className="grid gap-1">
      <Label className="font-bold text-[10px] uppercase tracking-[0.15em] text-slate-900 ml-1">{label}</Label>
      <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={cn(
          "flex items-center justify-between px-3 h-9 text-sm rounded-lg border transition-all text-xs font-medium",
          value
            ? "border-emerald-200 bg-emerald-50/50 text-emerald-700"
            : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
        )}
      >
        <div className="flex items-center gap-2">
          {isUploading ? (
            <svg className="animate-spin h-3.5 w-3.5 text-emerald-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : value ? (
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" className="text-emerald-600">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
          )}
          <span className="truncate max-w-[180px]">
            {isUploading ? "Mengunggah..." : value ? value.split("/").pop() : "Pilih File PDF"}
          </span>
        </div>
        {!isUploading && !value && <span className="text-[9px] uppercase tracking-wider opacity-60">Upload</span>}
        {value && !isUploading && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(""); }}
            className="p-1 hover:bg-emerald-100 rounded-md"
          >
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" className="text-emerald-400">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </button>
    </div>
  );
}

export function LoginForm({
  className,
  mode = "login",
  role,
  onModeChange,
  onBack,
}: LoginFormProps) {
  const isSignup = mode === "signup";
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDev = process.env.NODE_ENV === "development";

  // SPPG sub-area selection (Portal vs Admin)
  const [sppgArea, setSppgArea] = useState<"portal" | "admin">("portal");

  // Sekolah sub-area selection (Admin vs Siswa)
  const [sekolahArea, setSekolahArea] = useState<"admin" | "siswa">("admin");

  // Auth fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Basic Signup fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailSignup, setEmailSignup] = useState("");
  const [phone, setPhone] = useState("");
  const [passwordSignup, setPasswordSignup] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Vendor Specific fields (Multi-step)
  const [vendorStep, setVendorStep] = useState(1);
  const [nik, setNik] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [nibNumber, setNibNumber] = useState("");
  // Deterministic wallet address - seeded for consistent rendering across rerenders
  const walletSeed = useRef(7);
  const walletAddress = useMemo(() => {
    walletSeed.current = walletSeed.current + 1;
    let s = walletSeed.current >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    const hex = ((t ^ (t >>> 14)) >>> 0).toString(16).padStart(40, '0');
    return "0x" + hex;
  }, []);

  const [npwpNumber, setNpwpNumber] = useState("");
  // Documents
  const [aktaUrl, setAktaUrl] = useState("");
  const [skUrl, setSkUrl] = useState("");
  const [npwpUrl, setNpwpUrl] = useState("");
  const [nibUrl, setNibUrl] = useState("");
  const [sppgReadyUrl, setSppgReadyUrl] = useState("");
  // Banking
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");

  // Map / Location states
  const [lat, setLat] = useState(-6.9175); // Default Bandung
  const [lng, setLng] = useState(107.6191);

  const redirectByRole: Record<string, string> = {
    sekolah: "/sekolah/admin",
    goverment: "/goverment/dashboard",
    pemerintah: "/goverment/dashboard",
    sppg: "/sppg/dashboard",
    admin: "/sppg/admin/dashboard",
    qc: "/sppg/qc/inspeksi",
    vendor: "/vendor/dashboard",
    logistik: "/logistik/dashboard",
  };

  type AppRole = "admin" | "sppg" | "logistik" | "sekolah" | "vendor";

  const safeNext = useMemo(() => {
    const next = searchParams.get("next");
    if (!next) return null;
    if (!next.startsWith("/")) return null;
    if (next.startsWith("//")) return null;
    if (next.includes("://")) return null;
    return next;
  }, [searchParams]);

  const requiredRoleForPath = (pathname: string): AppRole | null => {
    if (pathname.startsWith("/goverment")) return "admin";
    if (pathname.startsWith("/vendor")) return "vendor";
    if (pathname.startsWith("/supplier")) return "sppg";
    if (pathname.startsWith("/logistik")) return "logistik";
    if (pathname.startsWith("/sekolah")) return "sekolah";
    return null;
  };

  const dashboardHrefByRole = (appRole: string): string => {
    if (appRole === "admin") return "/goverment/dashboard";
    if (appRole === "sppg") return "/sppg/dashboard";
    if (appRole === "logistik") return "/logistik/dashboard";
    if (appRole === "sekolah") return "/sekolah/admin";
    if (appRole === "vendor") return "/vendor/dashboard";
    return "/";
  };

  const appRoleFromUiRoleId = (uiRoleId: string): AppRole | null => {
    if (uiRoleId === "goverment") return "admin";
    if (uiRoleId === "vendor") return "vendor";
    if (uiRoleId === "sppg") return "sppg";
    if (uiRoleId === "logistik") return "logistik";
    if (uiRoleId === "sekolah") return "sekolah";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      toast.error("Terjadi kesalahan: Peran tidak ditemukan!");
      return;
    }

    if (isSubmitting) return;

    // Vendor Signup Flow (Multi-step)
    if (isSignup && role.id === "vendor") {
      if (vendorStep < 5) {
        // Validation disabled per user request for testing
        setVendorStep(v => v + 1);
        return;
      }
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(
      isSignup ? "Mendaftarkan ke GIZANTARA..." : "Sedang mengautentikasi (Simulasi)..."
    );

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      if (isSignup) {
        if (role.id === "vendor") {
          toast.dismiss(loadingToast);
          toast.success("Registrasi Simulasi Berhasil! Silakan Login.");
          onModeChange?.("login");
          setVendorStep(1);
          return;
        }
        toast.dismiss(loadingToast);
        toast.error("Registrasi untuk role ini belum tersedia secara manual.");
        return;
      }

      // Ã¢â€â‚¬Ã¢â€â‚¬ LOGIN MANUAL (MOCK) Ã¢â€â‚¬Ã¢â€â‚¬
      if (!email || !password) {
        throw new Error("Email dan Password tidak boleh kosong!");
      }

      const dummyToken = "dummy_jwt_token_" + Date.now();
      const dummyUser = {
        id: role.id === "vendor" ? "VND-" + Math.random().toString(36).substr(2, 6).toUpperCase() : "USR-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
        nama: "Pengguna Demo " + role.label,
        email: email,
        peran: role.id
      };

      toast.dismiss(loadingToast);

      // Simpan Ke LocalStorage & Cookie
      localStorage.setItem("boga_token", dummyToken);
      localStorage.setItem("boga_user", JSON.stringify(dummyUser));
      localStorage.setItem("boga_is_auth", "true");
      localStorage.setItem("boga_user_role", dummyUser.peran);
      document.cookie = `boga_token=${dummyToken}; path=/`;
      document.cookie = `boga_is_auth=true; path=/`;
      document.cookie = `boga_user_role=${dummyUser.peran}; path=/`;
      document.cookie = `boga_vendor_id=${dummyUser.id}; path=/`;

      toast.success(`Selamat datang kembali, ${dummyUser.nama}! (Simulasi)`);

      // Redirect berdasarkan role
      const target =
        role.id === "sppg"
          ? sppgArea === "admin"
            ? "/sppg/admin/dashboard"
            : "/sppg/dashboard"
          : role.id === "sekolah"
            ? sekolahArea === "siswa"
              ? "/sekolah/siswa"
              : "/sekolah/admin"
            : redirectByRole[dummyUser.peran.toLowerCase()] || "/vendor/dashboard";
      window.location.href = target;
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitButtonText = isSignup && role?.id === "vendor"
    ? (vendorStep < 5 ? "Lanjut Ke Tahap Berikutnya" : "Kirim Pendaftaran Vendor")
    : (isSignup ? "Buat Akun Sekarang" : "Masuk Sekarang");

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex flex-col p-4 md:p-6 w-full overflow-hidden text-slate-900",
        className
      )}
    >
      {/* --- HEADER (Fixed) --- */}
      <div className="shrink-0 mb-4">
        {/* Back button */}
        {(onBack || (isSignup && role?.id === "vendor" && vendorStep > 1)) && (
          <button
            type="button"
            onClick={() => {
              if (isSignup && role?.id === "vendor" && vendorStep > 1) {
                setVendorStep(v => v - 1);
              } else {
                onBack?.();
              }
            }}
            className="inline-flex items-center gap-1.5 text-[11px] text-slate-900 hover:text-gray-600 transition-colors mb-2"
          >
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Kembali
          </button>
        )}

        <div className="flex flex-col items-center gap-1 text-center">
          <div className="login-logo-container w-8 h-8 flex items-center justify-center font-bold text-base mb-1 shadow-sm">
            <span className="bg-gradient-to-br from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              G
            </span>
          </div>

          {role && (
            <div
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold mb-0.5"
              style={{ background: role.bg, color: role.accent, border: `1px solid ${role.accent}25` }}
            >
              {role.label}
            </div>
          )}

          {!isSignup && role?.id === "sppg" && (
            <RoleSubChoice
              title="Login sebagai apa?"
              value={sppgArea}
              onChange={(v) => setSppgArea(v as "portal" | "admin")}
              options={[
                { id: "portal", label: "Portal SPPG", desc: "E-Katalog & Bidding", icon: ClipboardList },
                { id: "admin", label: "SPPG Admin", desc: "Kontrak & Penilaian", icon: ShieldCheck },
              ]}
            />
          )}

          {!isSignup && role?.id === "sekolah" && (
            <RoleSubChoice
              title="Login sebagai apa?"
              value={sekolahArea}
              onChange={(v) => setSekolahArea(v as "admin" | "siswa")}
              options={[
                { id: "admin", label: "Admin Sekolah", desc: "Kelola sekolah", icon: ShieldCheck },
                { id: "siswa", label: "Guru", desc: "Rating & menu", icon: GraduationCap },
              ]}
            />
          )}

          <h1 className="text-base font-extrabold tracking-tight text-slate-900">
            {isSignup ? "Buat Akun Baru" : "Masuk"}
          </h1>

          {isSignup && role?.id === "vendor" && (
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map(s => (
                <div
                  key={s}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    vendorStep === s ? "w-6 bg-emerald-600" : (vendorStep > s ? "w-3 bg-emerald-200" : "w-3 bg-slate-100")
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- CONTENT (Scrollable Middle) --- */}
      <div className="flex-1 overflow-y-auto pr-1.5 custom-scrollbar min-h-0 space-y-3">
        {/* Ã¢â€â‚¬Ã¢â€â‚¬ LOGIN fields Ã¢â€â‚¬Ã¢â€â‚¬ */}
        {!isSignup && (
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label htmlFor="email" className="font-bold text-[10px] uppercase tracking-[0.15em] text-slate-900 ml-1">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={role?.id === "vendor" ? "vendor@usaha.id" : role?.id === "sekolah" ? "admin@sekolah.sch.id" : "akun@instansi.id"}
                className="h-9 text-sm rounded-lg border-slate-200 bg-white focus-visible:ring-slate-900 transition-all text-slate-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-1">
              <div className="flex items-center">
                <Label htmlFor="password" className="font-bold text-[10px] uppercase tracking-[0.15em] text-slate-900 ml-1">
                  Password
                </Label>
                <Link href="#" onClick={(e) => e.preventDefault()} className="ml-auto text-xs font-bold text-slate-900 hover:text-slate-900/80 transition-colors">
                  Lupa password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                className="h-9 text-sm rounded-lg border-slate-200 bg-white focus-visible:ring-slate-900 transition-all text-slate-900"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isSubmitting}
              />
            </div>

          </div>
        )}

        {/* Ã¢â€â‚¬Ã¢â€â‚¬ SIGNUP fields Ã¢â€â‚¬Ã¢â€â‚¬ */}
        {isSignup && (
          <div className="grid gap-2">
            {/* Vendor Multi-step Signup */}
            {role?.id === "vendor" ? (
              <>
                {vendorStep === 1 && (
                  <div className="grid gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid gap-1">
                      <Label htmlFor="nik" className="font-bold text-[10px] uppercase tracking-[0.15em] text-slate-900 ml-1">NIK (16 Digit)</Label>
                      <Input id="nik" placeholder="3273..." className="h-9 text-sm rounded-lg" value={nik} onChange={(e) => setNik(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="grid gap-1">
                        <Label htmlFor="firstName" className="font-bold text-[10px] uppercase tracking-[0.15em] text-slate-900 ml-1">Nama Depan</Label>
                        <Input id="firstName" placeholder="Budi" className="h-9 text-sm rounded-lg" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                      </div>
                      <div className="grid gap-1">
                        <Label htmlFor="lastName" className="font-bold text-[10px] uppercase tracking-[0.15em] text-slate-900 ml-1">Nama Belakang</Label>
                        <Input id="lastName" placeholder="Santoso" className="h-9 text-sm rounded-lg" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                      </div>
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="emailSignup" className="font-bold text-[10px] uppercase tracking-[0.15em] text-slate-900 ml-1">Email Instansi</Label>
                      <Input id="emailSignup" type="email" placeholder="nama@instansi.id" className="h-9 text-sm rounded-lg" value={emailSignup} onChange={(e) => setEmailSignup(e.target.value)} />
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="phone" className="font-bold text-[10px] uppercase tracking-[0.15em] text-slate-900 ml-1">No. Telepon / WA</Label>
                      <Input id="phone" type="tel" placeholder="+62 8xx..." className="h-9 text-sm rounded-lg" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="grid gap-1">
                        <Label htmlFor="passwordSignup" className="font-bold text-[10px] uppercase tracking-[0.15em] text-slate-900 ml-1">Kata Sandi</Label>
                        <Input id="passwordSignup" type="password" placeholder="Min 8" className="h-9 text-sm rounded-lg" value={passwordSignup} onChange={(e) => setPasswordSignup(e.target.value)} />
                      </div>
                      <div className="grid gap-1">
                        <Label htmlFor="confirmPassword" className="font-bold text-[10px] uppercase tracking-[0.15em] text-slate-900 ml-1">Ulangi</Label>
                        <Input id="confirmPassword" type="password" className="h-9 text-sm rounded-lg" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}

                {vendorStep === 2 && (
                  <div className="grid gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid gap-1">
                      <Label htmlFor="businessName" className="font-bold text-[10px] uppercase tracking-[0.15em] text-slate-900 ml-1">Nama Perusahaan / Usaha</Label>
                      <Input id="businessName" placeholder="PT. Pangan Nusantara" className="h-9 text-sm rounded-lg" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="grid gap-1">
                        <Label htmlFor="nibNumber" className="font-bold text-[10px] uppercase tracking-[0.15em] text-slate-900 ml-1">No. NIB</Label>
                        <Input id="nibNumber" placeholder="9120..." className="h-9 text-sm rounded-lg" value={nibNumber} onChange={(e) => setNibNumber(e.target.value)} />
                      </div>
                      <div className="grid gap-1">
                        <Label htmlFor="npwpNumber" className="font-bold text-[10px] uppercase tracking-[0.15em] text-slate-900 ml-1">No. NPWP</Label>
                        <Input id="npwpNumber" placeholder="01.234..." className="h-9 text-sm rounded-lg" value={npwpNumber} onChange={(e) => setNpwpNumber(e.target.value)} />
                      </div>
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="businessAddress" className="font-bold text-[10px] uppercase tracking-[0.15em] text-slate-900 ml-1">Alamat Lengkap Usaha</Label>
                      <Input id="businessAddress" placeholder="Jl. Soekarno Hatta..." className="h-9 text-sm rounded-lg" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} />
                    </div>

                    <div className="grid gap-1 mt-2">
                      <Label className="font-bold text-[10px] uppercase tracking-[0.15em] text-slate-900 ml-1">Titik Lokasi (Map)</Label>
                      <div className="h-[220px] rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                        <LocationPickerMapLibre
                          initialLat={lat}
                          initialLng={lng}
                          onLocationChange={(newLat, newLng) => {
                            setLat(newLat);
                            setLng(newLng);
                          }}
                        />
                      </div>
                      <p className="text-[9px] text-slate-400 mt-1 italic px-1">
                        Geser pin untuk menentukan koordinat presisi dapur/gudang Anda.
                      </p>
                    </div>
                  </div>
                )}

                {vendorStep === 3 && (
                  <div className="grid gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="rounded-lg border border-amber-100 bg-amber-50 p-2.5 flex gap-2">
                      <div className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-amber-200 flex items-center justify-center text-amber-700">
                        <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round"><path d="M12 8v4M12 16h.01" /></svg>
                      </div>
                      <p className="text-[10px] text-amber-700 leading-tight">
                        Unggah dokumen legalitas dalam format <b>PDF (Maks. 5MB)</b>. Dokumen akan di-hash dan dicatat ke Ledger GIZANTARA.
                      </p>
                    </div>

                    <FileUploadField label="Akta Pendirian" value={aktaUrl} onChange={setAktaUrl} />
                    <FileUploadField label="SK Kemenkumham" value={skUrl} onChange={setSkUrl} />
                    <FileUploadField label="Dokumen NPWP" value={npwpUrl} onChange={setNpwpUrl} />
                    <FileUploadField label="Dokumen NIB" value={nibUrl} onChange={setNibUrl} />
                    <FileUploadField label="Surat Kesiapan SPPG" value={sppgReadyUrl} onChange={setSppgReadyUrl} />
                  </div>
                )}

                {vendorStep === 4 && (
                  <div className="grid gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid gap-1">
                      <Label htmlFor="bankName" className="font-bold text-[10px] uppercase tracking-[0.15em] text-slate-900 ml-1">Nama Bank</Label>
                      <select
                        id="bankName"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="">Ã¢â‚¬â€ Pilih Bank Ã¢â‚¬â€</option>
                        {["Bank BJB", "Bank BRI", "Bank Mandiri", "Bank BNI", "Bank BCA", "Bank CIMB Niaga", "Bank Syariah Indonesia"].map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="bankAccountNumber" className="font-bold text-[10px] uppercase tracking-[0.15em] text-slate-900 ml-1">Nomor Rekening</Label>
                      <Input id="bankAccountNumber" placeholder="1234567890" className="h-9 text-sm rounded-lg" value={bankAccountNumber} onChange={(e) => setBankAccountNumber(e.target.value)} />
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="bankAccountName" className="font-bold text-[10px] uppercase tracking-[0.15em] text-slate-900 ml-1">Atas Nama Rekening</Label>
                      <Input id="bankAccountName" placeholder="Nama sesuai buku tabungan" className="h-9 text-sm rounded-lg" value={bankAccountName} onChange={(e) => setBankAccountName(e.target.value)} />
                    </div>
                  </div>
                )}

                {vendorStep === 5 && (
                  <div className="grid gap-2 animate-in fade-in slide-in-from-right-4 duration-300 pb-4">
                    <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
                      <p className="text-[10px] text-emerald-800 font-medium leading-relaxed">
                        Konfirmasi pendaftaran vendor Anda di bawah ini. Pastikan data sudah sesuai sebelum dicatat ke Ledger.
                      </p>
                    </div>

                    {/* --- Section 1: Identitas Perwakilan --- */}
                    <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                      <div className="px-3.5 py-2 bg-slate-50 flex items-center justify-between border-b border-slate-100">
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">1. Identitas Perwakilan</p>
                        {nik && firstName && lastName && emailSignup && phone ? (
                          <span className="text-[8px] font-black text-emerald-600 uppercase">Lengkap</span>
                        ) : (
                          <span className="text-[8px] font-black text-amber-500 uppercase">Belum Lengkap</span>
                        )}
                      </div>
                      <div className="p-3.5 space-y-3 text-[11px]">
                        <div className="grid gap-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap</span>
                          <p className={cn("font-bold text-slate-700 break-words", (!firstName || !lastName) && "text-amber-500 italic")}>
                            {firstName || lastName ? `${firstName} ${lastName}` : "Belum diisi"}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">NIK</span>
                            <p className={cn("font-medium text-slate-700", !nik && "text-amber-500 italic")}>{nik || "N/A"}</p>
                          </div>
                          <div className="grid gap-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">No. HP / WA</span>
                            <p className={cn("font-medium text-slate-700", !phone && "text-amber-500 italic")}>{phone || "N/A"}</p>
                          </div>
                        </div>
                        <div className="grid gap-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Email Akun</span>
                          <p className={cn("font-medium text-slate-700 break-all", !emailSignup && "text-amber-500 italic")}>{emailSignup || "Belum diisi"}</p>
                        </div>
                      </div>
                    </div>

                    {/* --- Section 2: Data Perusahaan --- */}
                    <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                      <div className="px-3.5 py-2 bg-slate-50 flex items-center justify-between border-b border-slate-100">
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">2. Data Perusahaan</p>
                        {businessName && businessAddress && nibNumber && npwpNumber ? (
                          <span className="text-[8px] font-black text-emerald-600 uppercase">Lengkap</span>
                        ) : (
                          <span className="text-[8px] font-black text-amber-500 uppercase">Belum Lengkap</span>
                        )}
                      </div>
                      <div className="p-3.5 space-y-3 text-[11px]">
                        <div className="grid gap-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Nama Usaha / Bisnis</span>
                          <p className={cn("font-bold text-slate-700 break-words", !businessName && "text-amber-500 italic")}>{businessName || "Belum diisi"}</p>
                        </div>
                        <div className="grid gap-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Alamat Lengkap</span>
                          <p className={cn("font-medium text-slate-700 leading-relaxed break-words", !businessAddress && "text-amber-500 italic")}>{businessAddress || "Belum diisi"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">No. NIB</span>
                            <p className={cn("font-medium text-slate-700", !nibNumber && "text-amber-500 italic")}>{nibNumber || "N/A"}</p>
                          </div>
                          <div className="grid gap-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">No. NPWP</span>
                            <p className={cn("font-medium text-slate-700", !npwpNumber && "text-amber-500 italic")}>{npwpNumber || "N/A"}</p>
                          </div>
                        </div>
                        <div className="grid gap-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider text-emerald-600">Koordinat Lokasi</span>
                          <p className="font-mono text-[10px] text-emerald-700 font-bold bg-emerald-50 w-fit px-2 py-0.5 rounded border border-emerald-100">
                            {lat.toFixed(6)}, {lng.toFixed(6)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* --- Section 3: Checklist Dokumen --- */}
                    <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                      <div className="px-3.5 py-2 bg-slate-50 flex items-center justify-between border-b border-slate-100">
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">3. Checklist Dokumen</p>
                        <span className="text-[9px] font-black text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
                          {[aktaUrl, skUrl, npwpUrl, nibUrl, sppgReadyUrl].filter(Boolean).length} / 5
                        </span>
                      </div>
                      <div className="p-3.5 space-y-2">
                        {[
                          { label: "Akta Pendirian", value: aktaUrl },
                          { label: "SK Kemenkumham", value: skUrl },
                          { label: "NPWP Perusahaan", value: npwpUrl },
                          { label: "Dokumen NIB", value: nibUrl },
                          { label: "Kesiapan SPPG", value: sppgReadyUrl },
                        ].map((doc, i) => (
                          <div key={i} className="flex items-center justify-between text-[11px] py-1 border-b border-slate-50 last:border-0">
                            <span className={cn("font-medium", doc.value ? "text-slate-600" : "text-slate-400")}>{doc.label}</span>
                            {doc.value ? (
                              <div className="flex items-center gap-1 text-emerald-600 font-black uppercase text-[8px]">
                                OK <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4}><path d="M20 6L9 17l-5-5" /></svg>
                              </div>
                            ) : (
                              <span className="text-[8px] font-black text-amber-400 uppercase">Kosong</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* --- Section 4: Data Rekening --- */}
                    <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                      <div className="px-3.5 py-2 bg-slate-50 flex items-center justify-between border-b border-slate-100">
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">4. Data Rekening</p>
                        {bankName && bankAccountNumber && bankAccountName ? (
                          <span className="text-[8px] font-black text-emerald-600 uppercase">Lengkap</span>
                        ) : (
                          <span className="text-[8px] font-black text-amber-500 uppercase">Belum Lengkap</span>
                        )}
                      </div>
                      <div className="p-3.5 space-y-3 text-[11px]">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Bank</span>
                            <p className={cn("font-bold text-slate-700", !bankName && "text-amber-500 italic")}>{bankName || "N/A"}</p>
                          </div>
                          <div className="grid gap-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">No. Rekening</span>
                            <p className={cn("font-bold text-slate-700", !bankAccountNumber && "text-amber-500 italic")}>{bankAccountNumber || "N/A"}</p>
                          </div>
                        </div>
                        <div className="grid gap-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Atas Nama Rekening</span>
                          <p className={cn("font-bold text-slate-700 break-words", !bankAccountName && "text-amber-500 italic")}>{bankAccountName || "Belum diisi"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Default Signup for other roles
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-1">
                    <Label htmlFor="firstName" className="font-bold text-[10px] uppercase tracking-[0.15em] text-slate-900 ml-1">Nama Depan</Label>
                    <Input id="firstName" placeholder="Budi" className="h-9 text-sm rounded-lg" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="lastName" className="font-bold text-[10px] uppercase tracking-[0.15em] text-slate-900 ml-1">Nama Belakang</Label>
                    <Input id="lastName" placeholder="Santoso" className="h-9 text-sm rounded-lg" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="emailSignup" className="font-bold text-[10px] uppercase tracking-[0.15em] text-slate-900 ml-1">Email Instansi</Label>
                  <Input id="emailSignup" type="email" placeholder="nama@instansi.id" className="h-9 text-sm rounded-lg" value={emailSignup} onChange={(e) => setEmailSignup(e.target.value)} />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="phone" className="font-bold text-[10px] uppercase tracking-[0.15em] text-slate-900 ml-1">No. Telepon</Label>
                  <Input id="phone" type="tel" placeholder="+62 8xx..." className="h-9 text-sm rounded-lg" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="passwordSignup" className="font-bold text-[10px] uppercase tracking-[0.15em] text-slate-900 ml-1">Kata Sandi</Label>
                  <Input id="passwordSignup" type="password" placeholder="Min. 8 karakter" className="h-9 text-sm rounded-lg" value={passwordSignup} onChange={(e) => setPasswordSignup(e.target.value)} />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="confirmPassword" className="font-bold text-[10px] uppercase tracking-[0.15em] text-slate-900 ml-1">Konfirmasi Sandi</Label>
                  <Input id="confirmPassword" type="password" placeholder="Ulangi" className="h-9 text-sm rounded-lg" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* --- FOOTER (Fixed) --- */}
      <div className="shrink-0 pt-4 mt-auto">
        {isSignup && (
          <label className="flex items-start gap-2 cursor-pointer mb-2 px-1">
            <input type="checkbox" className="mt-0.5 rounded accent-[hsl(var(--primary))] cursor-pointer shrink-0" defaultChecked />
            <span className="text-[10px] text-gray-500 leading-tight">
              Saya menyetujui <span className="font-bold text-slate-900">Syarat & Ketentuan</span> serta <span className="font-bold text-slate-900">Kebijakan Privasi</span> GIZANTARA
            </span>
          </label>
        )}

        <Button
          type="submit"
          className="w-full h-10 rounded-lg font-bold text-white bg-slate-900 shadow-sm hover:bg-slate-800 transition-all duration-300"
          disabled={isSubmitting}
          style={isSignup && role?.id === "vendor" ? { background: "#065F46" } : undefined}
        >
          {submitButtonText}
        </Button>

        <p className="text-center text-[11px] text-muted-foreground mt-4">
          {isSignup ? "Sudah punya akun? " : "Belum punya akun? "}
          <button
            type="button"
            onClick={() => onModeChange?.(isSignup ? "login" : "signup")}
            className="font-bold text-slate-900 hover:underline"
          >
            {isSignup ? "Masuk di sini" : "Daftar sekarang"}
          </button>
        </p>
      </div>
    </form>
  );
}
