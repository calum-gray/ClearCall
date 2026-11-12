import { articleFor, DEMO_ACCOUNTS, DEMO_OUTAGES } from "./knowledge-base";
import { OfflineNluEngine } from "./nlu-engine";
import { AiServiceUnavailableError } from "./errors";
import { logger } from "./logger";
import type {
  AiReply,
  AiServiceMeta,
  IntentId,
  SessionContext,
} from "./types";
import { getIntent } from "./intents";

/** Anything that can turn a user message + session context into a reply. */
export interface IAiService {
  readonly meta: AiServiceMeta;
  generateReply(message: string, context: SessionContext): Promise<AiReply>;
}

function mergeContext(
  context: SessionContext,
  intent: IntentId,
  entities: AiReply["entities"],
): SessionContext {
  const next: SessionContext = {
    ...context,
    lastIntent: intent,
    turnCount: context.turnCount + 1,
  };
  if (entities.accountNumber) next.accountNumber = entities.accountNumber;
  if (entities.postcode) next.postcode = entities.postcode;
  if (getIntent(intent)?.escalate) next.escalationRequested = true;
  return next;
}

export class OfflineNluService implements IAiService {
  readonly meta: AiServiceMeta = {
    provider: "offline-nlu",
    model: "clara-keyword-v1",
    offline: true,
  };

  private readonly nlu: OfflineNluEngine;

  constructor(nlu = new OfflineNluEngine()) {
    this.nlu = nlu;
  }

  async generateReply(message: string, context: SessionContext): Promise<AiReply> {
    // Small delay so the API path stays async (same shape as a remote call).
    await new Promise((resolve) => setTimeout(resolve, 15 + Math.random() * 40));

    const result = this.nlu.classify(message);
    const enrichedContext = mergeContext(context, result.intent, result.entities);
    const text = this.compose(result.intent, enrichedContext, result.entities, message);
    const article = articleFor(result.intent);

    logger.debug("offline NLU reply", {
      intent: result.intent,
      confidence: result.confidence,
      entities: result.entities,
    });

    return {
      text,
      intent: result.intent,
      confidence: result.confidence,
      entities: result.entities,
      quickReplies: article.quickReplies,
      escalate: Boolean(getIntent(result.intent)?.escalate),
      meta: this.meta,
    };
  }

  private compose(
    intent: IntentId,
    context: SessionContext,
    entities: AiReply["entities"],
    rawMessage: string,
  ): string {
    const account = entities.accountNumber ?? context.accountNumber;
    const postcode = entities.postcode ?? context.postcode;
    const base = articleFor(intent).body;

    if (intent === "check_balance" && account) {
      const demo = DEMO_ACCOUNTS[account];
      if (demo) {
        return (
          `Account ${account} (${demo.name}) — ${demo.plan}\n` +
          `• Data remaining: ${demo.dataLeftGb} GB\n` +
          `• Minutes: ${demo.minutesLeft === 9999 ? "Unlimited" : demo.minutesLeft}\n` +
          `• Next bill: £${demo.nextBillGbp.toFixed(2)}\n` +
          `• Status: ${demo.status}`
        );
      }
      return (
        `I couldn't find demo ledger data for ${account}. ` +
        `Try CC-10482931 or CC-20918344 for the demo.`
      );
    }

    if (intent === "billing_enquiry" && account) {
      const demo = DEMO_ACCOUNTS[account];
      if (demo) {
        return (
          `Latest bill preview for ${account}:\n` +
          `• Plan charge: £${demo.nextBillGbp.toFixed(2)}\n` +
          `• Status: ${demo.status}\n` +
          `• Payment method: Direct Debit on the 8th\n\n` +
          `If a line item looks wrong, I can open a billing review or escalate to an advisor.`
        );
      }
    }

    if (intent === "report_outage" && postcode) {
      const key = postcode.replace(/\s+/g, "");
      const known = DEMO_OUTAGES[key];
      if (known) {
        return `Outage check for ${postcode}:\n${known}\n\nWould you like me to text status updates to your registered number?`;
      }
      return (
        `Outage check for ${postcode}: no active ClearCall incidents on record. ` +
        `Please restart your handset or router. If the problem continues for more than 30 minutes, I can escalate.`
      );
    }

    if (intent === "sim_swap" && account) {
      return (
        `SIM replacement started for ${account}. Reference SW-${account.slice(-4)}-${Date.now().toString().slice(-4)}. ` +
        `Choose delivery: free standard (2–3 days) or £9.99 same-day courier. Reply with your preference or ask for an advisor.`
      );
    }

    if (intent === "plan_upgrade" && entities.planName) {
      return (
        `Great choice — ${entities.planName} has been queued as a pending upgrade. ` +
        `It will activate on your next bill cycle with no early-exit fee. ` +
        `Shall I confirm, or would you like to compare another plan?`
      );
    }

    if (intent === "complaint") {
      const detail = rawMessage.length > 40 ? `\n\nLogged summary: "${rawMessage.trim()}"` : "";
      return `${base}${detail}`;
    }

    if ((intent === "check_balance" || intent === "billing_enquiry" || intent === "sim_swap") && !account) {
      return base;
    }

    if (intent === "report_outage" && !postcode) {
      return base;
    }

    return base;
  }
}

/**
 * Placeholder for a real external LLM. Not configured — throws so we fall
 * back to offline NLU. Kept so the interface is easy to extend later.
 */
export class ExternalLlmStubService implements IAiService {
  readonly meta: AiServiceMeta = {
    provider: "external-llm-stub",
    model: "external-llm-not-configured",
    offline: false,
  };

  async generateReply(message: string, context: SessionContext): Promise<AiReply> {
    void message;
    void context;
    logger.warn("External LLM stub invoked — falling back required");
    throw new AiServiceUnavailableError(
      "External LLM is not set up. Use OfflineNluService instead.",
    );
  }
}

/**
 * Tries the primary AI service; if it fails, uses offline NLU.
 * Set CLARA_AI_PROVIDER=external to exercise the stub path.
 */
export class ResilientAiService implements IAiService {
  readonly meta: AiServiceMeta;
  private readonly primary: IAiService;
  private readonly fallback: IAiService;

  constructor(primary?: IAiService, fallback?: IAiService) {
    const preferExternal = process.env.CLARA_AI_PROVIDER === "external";
    this.fallback = fallback ?? new OfflineNluService();
    this.primary = primary ?? (preferExternal ? new ExternalLlmStubService() : this.fallback);
    this.meta = this.primary.meta;
  }

  async generateReply(message: string, context: SessionContext): Promise<AiReply> {
    try {
      return await this.primary.generateReply(message, context);
    } catch (error) {
      logger.warn("Primary AI provider failed; using offline NLU", {
        error: error instanceof Error ? error.message : String(error),
      });
      const reply = await this.fallback.generateReply(message, context);
      return {
        ...reply,
        text: `${reply.text}\n\n_(Offline reply — the other AI provider wasn’t available.)_`,
      };
    }
  }
}

let singleton: IAiService | null = null;

export function getAiService(): IAiService {
  if (!singleton) {
    singleton = new ResilientAiService();
  }
  return singleton;
}
