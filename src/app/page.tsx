import Link from "next/link";
import { ChatPanel } from "@/components/chat/chat-panel";
import { company } from "@/lib/company";

export default function HomePage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-12 lg:py-14">
      <section className="cc-rise flex flex-col justify-center">
        <p className="font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-tight text-[var(--cc-brand)] sm:text-5xl md:text-6xl">
          {company.tradingName}
        </p>
        <h1 className="mt-4 max-w-xl font-[family-name:var(--font-heading)] text-2xl font-medium leading-snug text-[var(--cc-ink)] sm:text-3xl">
          Chat with {company.chatbotName} for quick support answers.
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-[var(--cc-muted)] sm:text-lg">
          Ask about bills, outages, roaming, or SIM issues. Clara runs on our own
          offline matching — no external AI API needed for the demo.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#clara"
            className="inline-flex items-center justify-center rounded-full bg-[var(--cc-brand)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--cc-brand-deep)]"
          >
            Open chat
          </a>
          <Link
            href="/ops"
            className="inline-flex items-center justify-center rounded-full border border-[var(--cc-brand)]/30 bg-white/60 px-5 py-2.5 text-sm font-semibold text-[var(--cc-brand)] transition hover:bg-white"
          >
            Session list
          </Link>
        </div>
        <ul className="mt-10 grid max-w-lg gap-2 text-sm text-[var(--cc-muted)]">
          <li>Handles common telecom questions (balance, billing, outages, etc.)</li>
          <li>Built with OOP, async code, HTTP APIs, and JSON storage</li>
          <li>Offline NLU with a place to plug in another AI service later</li>
        </ul>
      </section>

      <section id="clara" className="cc-rise-delay min-h-[32rem]">
        <ChatPanel />
      </section>
    </div>
  );
}
