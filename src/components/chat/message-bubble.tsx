"use client";

import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/chatbot/types";
import { Badge } from "@/components/ui/badge";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[min(100%,36rem)] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
          isUser
            ? "bg-[var(--cc-brand)] text-white rounded-br-md"
            : "bg-white/90 text-[var(--cc-ink)] border border-[var(--cc-line)] rounded-bl-md",
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {!isUser && message.intent && message.intent !== "greeting" && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="text-[10px] font-medium uppercase tracking-wide">
              {message.intent.replace(/_/g, " ")}
            </Badge>
            {typeof message.confidence === "number" && (
              <Badge variant="outline" className="text-[10px]">
                {(message.confidence * 100).toFixed(0)}% confidence
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
