import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode } & Record<string, unknown>) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("next/dynamic", () => ({
  __esModule: true,
  default: (loader: () => { then: (m: Record<string, unknown>) => unknown }) => {
    const mod = loader();
    const target = { then: mod.then };
    const Comp = ({ ...props }: Record<string, unknown>) => {
      return <div data-testid="login-form-mock" {...props} />;
    };
    void target;
    return Comp;
  },
}));

import LoginPage from "@/app/auth/login/page";

describe("Auth Flow", () => {
  it("menampilkan pilihan peran saat pertama dibuka", () => {
    render(<LoginPage />);
    expect(screen.getByText("Selamat datang")).toBeInTheDocument();
    expect(screen.getAllByText("Pemerintah").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Vendor").length).toBeGreaterThan(0);
  });

  it("pilih peran langsung memunculkan form login", async () => {
    render(<LoginPage />);

    // In the new design, selecting the role immediately proceeds to the form.
    // The role button contains the text "Pemerintah"
    const pemerintahButton = screen.getByText("Pemerintah").closest("button");
    if (!pemerintahButton) throw new Error("Button not found");
    
    fireEvent.click(pemerintahButton);

    expect(await screen.findByTestId("login-form-mock")).toBeInTheDocument();
  });
});