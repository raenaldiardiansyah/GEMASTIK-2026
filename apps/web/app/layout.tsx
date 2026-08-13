import "./globals.css";
import Navbar from "@/components/ui/navbar";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import MainWrapper from "@/components/ui/main-wrapper";

import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata = {
  title: "GIZANTARA GIZANTARA — End-to-End Traceability Program MBG",
  description:
    "Platform end-to-end traceability untuk program Makan Bergizi Gratis: verifikasi vendor, pengadaan, audit pembayaran via OCR, distribusi geofencing, dan reputasi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${spaceGrotesk.variable} dark`} style={{ colorScheme: "dark" }}>
      <body className="min-h-screen flex flex-col relative font-sans antialiased bg-[#0F172A] text-foreground">
        <Providers>

          <Navbar />
          <MainWrapper>{children}</MainWrapper>
        </Providers>
        <Toaster position="bottom-right" visibleToasts={3} richColors />
      </body>
    </html>
  );
}
