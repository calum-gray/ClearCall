import { INTENT_CATALOGUE } from "./intents";
import type { ExtractedEntities, IntentId, NluResult } from "./types";

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "am",
  "i",
  "my",
  "me",
  "to",
  "for",
  "of",
  "and",
  "or",
  "on",
  "in",
  "at",
  "do",
  "does",
  "can",
  "you",
  "please",
  "with",
  "this",
  "that",
  "it",
]);

/**
 * Offline intent matcher.
 * Scores the user message against keyword lists and example phrases,
 * and pulls out simple entities (account number, postcode, etc.) with regex.
 * No remote LLM — good for demos and unit tests.
 */
export class OfflineNluEngine {
  private readonly confidenceThreshold: number;

  constructor(confidenceThreshold = 0.28) {
    this.confidenceThreshold = confidenceThreshold;
  }

  classify(utterance: string): NluResult {
    const normalised = utterance.toLowerCase().trim();
    const tokens = this.tokenize(normalised);
    const entities = this.extractEntities(utterance);
    const scores: Partial<Record<IntentId, number>> = {};

    for (const intent of INTENT_CATALOGUE) {
      scores[intent.id] = this.scoreIntent(normalised, tokens, intent.keywords, intent.examples);
    }

    let bestIntent: IntentId = "fallback";
    let bestScore = 0;
    for (const [intent, score] of Object.entries(scores) as [IntentId, number][]) {
      if (score > bestScore) {
        bestScore = score;
        bestIntent = intent;
      }
    }

    if (bestScore < this.confidenceThreshold) {
      bestIntent = "fallback";
    }

    return {
      intent: bestIntent,
      confidence: Number(bestScore.toFixed(3)),
      entities,
      tokens,
      scores,
    };
  }

  tokenize(text: string): string[] {
    return text
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
  }

  extractEntities(utterance: string): ExtractedEntities {
    const entities: ExtractedEntities = {};

    const account = utterance.match(/\bCC[-\s]?(\d{8})\b/i);
    if (account) {
      entities.accountNumber = `CC-${account[1]}`;
    }

    const postcode = utterance.match(
      /\b([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})\b/i,
    );
    if (postcode) {
      entities.postcode = postcode[1].toUpperCase().replace(/\s+/g, " ").replace(/(\d)([A-Z]{2})$/, "$1 $2");
    }

    const phone = utterance.match(/\b(?:0|\+44)\d{9,10}\b/);
    if (phone) {
      entities.phoneNumber = phone[0];
    }

    const plan = utterance.match(/\b(essential\s*20|everyday\s*50|unlimited\s*plus)\b/i);
    if (plan) {
      entities.planName = plan[1].replace(/\s+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }

    return entities;
  }

  private scoreIntent(
    normalised: string,
    tokens: string[],
    keywords: string[],
    examples: string[],
  ): number {
    let score = 0;
    const tokenSet = new Set(tokens);

    for (const keyword of keywords) {
      const parts = keyword.toLowerCase().split(/\s+/);
      if (parts.length === 1) {
        if (tokenSet.has(parts[0]) || normalised.includes(parts[0])) {
          score += 0.22;
        }
      } else if (normalised.includes(keyword.toLowerCase())) {
        score += 0.35;
      }
    }

    for (const example of examples) {
      const exampleTokens = this.tokenize(example.toLowerCase());
      if (exampleTokens.length === 0) continue;
      const overlap = exampleTokens.filter((t) => tokenSet.has(t)).length;
      const ratio = overlap / exampleTokens.length;
      score += ratio * 0.45;
      if (normalised === example.toLowerCase()) {
        score += 0.5;
      }
    }

    return Math.min(score, 1);
  }
}
