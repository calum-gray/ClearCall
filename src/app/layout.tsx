import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import Link from "next/link";
import { company } from "@/lib/company";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${company.chatbotName} | ${company.tradingName} Customer Service`,
  description: `${company.chatbotFullName} — AI-enabled (offline NLU) customer service chatbot for ${company.legalName}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className={`${manrope.variable} ${sora.variable} antialiased`}>
        <div className="cc-atmosphere relative min-h-screen">
          <div className="cc-hero-mesh pointer-events-none absolute inset-0" aria-hidden />
          <header className="relative z-10 border-b border-[var(--cc-line)]/70 bg-white/40 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <Link href="/" className="group flex items-center gap-2.5">
                <span className="relative flex size-9 items-center justify-center rounded-xl bg-[var(--cc-brand)] text-sm font-bold text-white shadow-sm">
                  CC
                  <span className="cc-signal absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-[#f0783c]" />
                </span>
                <span className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight text-[var(--cc-ink)] group-hover:text-[var(--cc-brand)]">
                  {company.tradingName}
                </span>
              </Link>
              <nav className="flex items-center gap-4 text-sm text-[var(--cc-muted)]">
                <Link href="/" className="hover:text-[var(--cc-brand)]">
                  Assistant
                </Link>
                <Link href="/ops" className="hover:text-[var(--cc-brand)]">
                  Ops
                </Link>
              </nav>
            </div>
          </header>
          <main className="relative z-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
