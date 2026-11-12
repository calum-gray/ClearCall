import { NextResponse } from "next/server";
import { getSessionStore } from "@/lib/chatbot/session-store";
import { ChatbotError } from "@/lib/chatbot/errors";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const store = getSessionStore();

    if (id) {
      const session = await store.get(id);
      return NextResponse.json(session);
    }

    const sessions = await store.list(25);
    return NextResponse.json({
      count: sessions.length,
      sessions: sessions.map((s) => ({
        id: s.id,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        turns: s.context.turnCount,
        lastIntent: s.context.lastIntent ?? null,
        escalationRequested: s.context.escalationRequested ?? false,
        messageCount: s.messages.length,
      })),
    });
  } catch (error) {
    if (error instanceof ChatbotError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status },
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
