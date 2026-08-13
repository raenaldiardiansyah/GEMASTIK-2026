import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode } & Record<string, unknown>) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

import { HeroSection } from "@/components/landing/HeroSection";
import { FaqSection } from "@/components/landing/FaqSection";

describe("Landing Page", () => {
  it("hero menampilkan CTA Masuk dan Lihat alur", () => {
    render(<HeroSection />);
    expect(screen.getByRole("link", { name: /Masuk/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Lihat 5 Fase Alur/ })).toBeInTheDocument();
  });

  it("hero menampilkan lead copy Bahasa", () => {
    render(<HeroSection />);
    expect(
      screen.getByText(/Memverifikasi vendor, memantau pengadaan, mengaudit pembayaran/)
    ).toBeInTheDocument();
  });

  it("FAQ mengganti konten saat pertanyaan diklik", () => {
    render(<FaqSection />);
    const secondQuestion = screen.getByText("Bagaimana alur pembayaran bekerja?");
    fireEvent.click(secondQuestion);
    expect(
      screen.getByText(/OCR membaca tanggal, nominal, pengirim, penerima, bank, dan refID/)
    ).toBeInTheDocument();
  });
});