"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SessionSummary {
  id: string;
  createdAt: string;
  updatedAt: string;
  turns: number;
  lastIntent: string | null;
  escalationRequested: boolean;
  messageCount: number;
}

export default function OpsPage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const load = useCallback(() => {
    startTransition(async () => {
      setError(null);
      try {
        const res = await fetch("/api/sessions");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to load sessions");
        setSessions(data.sessions ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      }
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-semibold text-[var(--cc-ink)]">
            Session operations
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--cc-muted)]">
            Recent Clara chats saved under{" "}
            <code className="rounded bg-white/70 px-1">data/sessions</code>. Handy in the demo
            to show saved sessions and escalations.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={load} disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          Refresh
        </Button>
      </div>

      {error && (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--cc-line)] bg-white/80">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--cc-line)] bg-[var(--cc-sand)] text-xs uppercase tracking-wide text-[var(--cc-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Session</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium">Turns</th>
              <th className="px-4 py-3 font-medium">Last intent</th>
              <th className="px-4 py-3 font-medium">Flags</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 && !pending && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--cc-muted)]">
                  No sessions yet. Start a chat on the home page.
                </td>
              </tr>
            )}
            {sessions.map((session) => (
              <tr key={session.id} className="border-b border-[var(--cc-line)]/70 last:border-0">
                <td className="px-4 py-3 font-mono text-xs">{session.id.slice(0, 13)}…</td>
                <td className="px-4 py-3 text-[var(--cc-muted)]">
                  {new Date(session.updatedAt).toLocaleString("en-GB")}
                </td>
                <td className="px-4 py-3">{session.turns}</td>
                <td className="px-4 py-3">
                  {session.lastIntent ? (
                    <Badge variant="secondary">{session.lastIntent.replace(/_/g, " ")}</Badge>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  {session.escalationRequested ? (
                    <Badge className="bg-[#f0783c] text-white hover:bg-[#f0783c]">Escalated</Badge>
                  ) : (
                    <span className="text-[var(--cc-muted)]">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
