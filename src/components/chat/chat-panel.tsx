"use client";

import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { Send, Loader2, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageBubble } from "./message-bubble";
import { QuickReplies } from "./quick-replies";
import type { ChatMessage, ChatResponse } from "@/lib/chatbot/types";
import { company } from "@/lib/company";

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [booting, setBooting] = useState(true);
  const [pending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);
  const sending = pending || booting;

  useEffect(() => {
    void bootstrap();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, quickReplies, error]);

  async function bootstrap() {
    setBooting(true);
    setError(null);
    try {
      const res = await fetch("/api/chat", { method: "PUT" });
      if (!res.ok) throw new Error("Could not start a support session.");
      const data = (await res.json()) as ChatResponse;
      setSessionId(data.sessionId);
      setMessages([data.reply]);
      setQuickReplies(data.reply.quickReplies ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect.");
    } finally {
      setBooting(false);
    }
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const optimistic: ChatMessage = {
      id: `local-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput("");
    setQuickReplies([]);
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, message: trimmed }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Request failed");
        }
        const payload = data as ChatResponse;
        setSessionId(payload.sessionId);
        setMessages((prev) => [...prev, payload.reply]);
        setQuickReplies(payload.reply.quickReplies ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <div className="flex h-full min-h-[28rem] flex-col overflow-hidden rounded-[1.75rem] border border-[var(--cc-line)] bg-[var(--cc-panel)] shadow-[0_24px_60px_-28px_rgba(11,55,64,0.45)]">
      <header className="flex items-center justify-between gap-3 border-b border-[var(--cc-line)] bg-white/60 px-4 py-3 backdrop-blur">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--cc-ink)]">
            {company.chatbotName}
            <span className="ml-2 text-xs font-normal text-[var(--cc-muted)]">
              Online
            </span>
          </p>
          <p className="truncate text-xs text-[var(--cc-muted)]">
            Session {sessionId ? sessionId.slice(0, 8) : "…"}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void bootstrap()}
          disabled={sending}
          className="shrink-0"
        >
          <RotateCcw className="size-3.5" />
          New chat
        </Button>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {booting && (
          <div className="flex items-center gap-2 text-sm text-[var(--cc-muted)]">
            <Loader2 className="size-4 animate-spin" />
            Starting {company.chatbotName}…
          </div>
        )}
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {pending && (
          <div className="flex items-center gap-2 text-sm text-[var(--cc-muted)]">
            <Loader2 className="size-4 animate-spin" />
            {company.chatbotName} is thinking…
          </div>
        )}
        <QuickReplies
          replies={quickReplies}
          disabled={sending}
          onSelect={(text) => void sendMessage(text)}
        />
        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={onSubmit}
        className="border-t border-[var(--cc-line)] bg-white/70 p-3 backdrop-blur"
      >
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${company.chatbotName} about bills, outages, roaming…`}
            rows={2}
            disabled={sending}
            className="min-h-[3rem] resize-none bg-white"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void sendMessage(input);
              }
            }}
          />
          <Button type="submit" disabled={sending || !input.trim()} size="lg" className="h-12 px-4">
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </div>
        <p className="mt-2 text-[11px] text-[var(--cc-muted)]">
          Demo accounts: CC-10482931 · CC-20918344 · Try postcode M1 1AE for outages
        </p>
      </form>
    </div>
  );
}
