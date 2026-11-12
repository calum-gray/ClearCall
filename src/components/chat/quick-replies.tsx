"use client";

interface QuickRepliesProps {
  replies: string[];
  disabled?: boolean;
  onSelect: (text: string) => void;
}

export function QuickReplies({ replies, disabled, onSelect }: QuickRepliesProps) {
  if (!replies.length) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {replies.map((reply) => (
        <button
          key={reply}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(reply)}
          className="rounded-full border border-[var(--cc-brand)]/30 bg-white/70 px-3 py-1.5 text-xs font-medium text-[var(--cc-brand)] transition hover:bg-[var(--cc-brand)] hover:text-white disabled:opacity-50"
        >
          {reply}
        </button>
      ))}
    </div>
  );
}
