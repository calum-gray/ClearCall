import { randomUUID } from "crypto";
import { getAiService, type IAiService } from "./ai-service";
import { getSessionStore, type SessionStore } from "./session-store";
import { ValidationError } from "./errors";
import { logger } from "./logger";
import { company } from "@/lib/company";
import type { ChatMessage, ChatResponse, SessionContext } from "./types";

/**
 * One queue per session so two messages in the same chat don't get mixed up.
 * Different sessions can still run in parallel on the event loop.
 */
class SessionQueue {
  private readonly tails = new Map<string, Promise<unknown>>();

  enqueue<T>(sessionKey: string, task: () => Promise<T>): Promise<T> {
    const previous = this.tails.get(sessionKey) ?? Promise.resolve();
    const next = previous.catch(() => undefined).then(task);
    this.tails.set(
      sessionKey,
      next.then(
        () => undefined,
        () => undefined,
      ),
    );
    return next;
  }
}

export class DialogueManager {
  private readonly ai: IAiService;
  private readonly store: SessionStore;
  private readonly queue = new SessionQueue();

  constructor(ai: IAiService = getAiService(), store: SessionStore = getSessionStore()) {
    this.ai = ai;
    this.store = store;
  }

  async startSession(): Promise<ChatResponse> {
    const session = await this.store.create();
    const welcome = this.buildAssistantMessage(
      `Welcome to ${company.tradingName}. I'm ${company.chatbotName}, your digital assistant. Ask me about balances, bills, outages, roaming, SIM swaps, plans, or stores.`,
      "greeting",
      1,
      ["Check my balance", "Report an outage", "Help", "Speak to an agent"],
    );
    await this.store.appendMessage(session.id, welcome);
    return {
      sessionId: session.id,
      reply: welcome,
      context: session.context,
      nlu: { intent: "greeting", confidence: 1, entities: {} },
    };
  }

  async handleMessage(sessionId: string | undefined, message: string): Promise<ChatResponse> {
    const trimmed = message?.trim();
    if (!trimmed) {
      throw new ValidationError("Message must not be empty.");
    }
    if (trimmed.length > 2000) {
      throw new ValidationError("Message exceeds the 2000 character limit.");
    }

    let activeSessionId = sessionId;
    if (!activeSessionId) {
      const created = await this.store.create();
      activeSessionId = created.id;
    }

    return this.queue.enqueue(activeSessionId, () =>
      this.processTurn(activeSessionId!, trimmed),
    );
  }

  private async processTurn(sessionId: string, message: string): Promise<ChatResponse> {
    const session = await this.store.get(sessionId);
    const userMessage: ChatMessage = {
      id: randomUUID(),
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };
    await this.store.appendMessage(sessionId, userMessage);

    try {
      const aiReply = await this.ai.generateReply(message, session.context);
      const nextContext: SessionContext = {
        ...session.context,
        turnCount: session.context.turnCount + 1,
        lastIntent: aiReply.intent,
        accountNumber: aiReply.entities.accountNumber ?? session.context.accountNumber,
        postcode: aiReply.entities.postcode ?? session.context.postcode,
        escalationRequested:
          session.context.escalationRequested || Boolean(aiReply.escalate),
      };

      const assistantMessage = this.buildAssistantMessage(
        aiReply.text,
        aiReply.intent,
        aiReply.confidence,
        aiReply.quickReplies,
      );
      await this.store.appendMessage(sessionId, assistantMessage, nextContext);

      logger.info("turn completed", {
        sessionId,
        intent: aiReply.intent,
        confidence: aiReply.confidence,
        provider: aiReply.meta.provider,
      });

      return {
        sessionId,
        reply: assistantMessage,
        context: nextContext,
        nlu: {
          intent: aiReply.intent,
          confidence: aiReply.confidence,
          entities: aiReply.entities,
        },
      };
    } catch (error) {
      logger.error("dialogue turn failed", {
        sessionId,
        error: error instanceof Error ? error.message : String(error),
      });
      const fallback = this.buildAssistantMessage(
        "Sorry — something went wrong while processing that. Please try again, or ask to speak to an agent.",
        "fallback",
        0,
        ["Speak to an agent", "Help"],
      );
      await this.store.appendMessage(sessionId, fallback);
      return {
        sessionId,
        reply: fallback,
        context: session.context,
        nlu: { intent: "fallback", confidence: 0, entities: {} },
      };
    }
  }

  private buildAssistantMessage(
    content: string,
    intent: ChatMessage["intent"],
    confidence: number,
    quickReplies?: string[],
  ): ChatMessage {
    return {
      id: randomUUID(),
      role: "assistant",
      content,
      timestamp: new Date().toISOString(),
      intent,
      confidence,
      quickReplies,
    };
  }
}

const globalDm = globalThis as unknown as { __claraDialogueManager?: DialogueManager };

export function getDialogueManager(): DialogueManager {
  if (!globalDm.__claraDialogueManager) {
    globalDm.__claraDialogueManager = new DialogueManager();
  }
  return globalDm.__claraDialogueManager;
}
