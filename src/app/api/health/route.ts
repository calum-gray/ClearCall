import { NextResponse } from "next/server";
import { getAiService } from "@/lib/chatbot/ai-service";
import { company } from "@/lib/company";

export const runtime = "nodejs";

export async function GET() {
  const ai = getAiService();
  return NextResponse.json({
    status: "ok",
    service: company.chatbotFullName,
    organisation: company.legalName,
    ai: ai.meta,
    timestamp: new Date().toISOString(),
  });
}
