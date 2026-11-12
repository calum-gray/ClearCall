import { NextResponse } from "next/server";
import { getDialogueManager } from "@/lib/chatbot/dialogue-manager";
import { chatRequestSchema } from "@/lib/chatbot/schemas";
import { ChatbotError } from "@/lib/chatbot/errors";
import { logger } from "@/lib/chatbot/logger";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const manager = getDialogueManager();
    const result = await manager.handleMessage(parsed.data.sessionId, parsed.data.message);
    return NextResponse.json(result);
  } catch (error) {
    logger.error("POST /api/chat failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    if (error instanceof ChatbotError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status },
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT() {
  try {
    const manager = getDialogueManager();
    const result = await manager.startSession();
    return NextResponse.json(result);
  } catch (error) {
    logger.error("PUT /api/chat failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: "Failed to start session" }, { status: 500 });
  }
}
