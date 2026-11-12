import type { IntentDefinition } from "./types";

/** Intents Clara knows. `examples` are sample phrases used by the offline scorer. */
export const INTENT_CATALOGUE: IntentDefinition[] = [
  {
    id: "greeting",
    description: "Customer opens or greets the assistant",
    examples: ["hello", "hi clara", "good morning", "hey there"],
    keywords: ["hello", "hi", "hey", "morning", "afternoon", "evening", "greetings"],
  },
  {
    id: "goodbye",
    description: "Customer ends the conversation",
    examples: ["bye", "thanks goodbye", "that's all", "speak later"],
    keywords: ["bye", "goodbye", "thanks", "thank", "later", "done", "cheers"],
  },
  {
    id: "help",
    description: "Customer asks what Clara can do",
    examples: ["what can you help with", "menu", "options", "how does this work"],
    keywords: ["help", "menu", "options", "capabilities", "assist", "support"],
  },
  {
    id: "check_balance",
    description: "Customer wants remaining data, minutes, or credit",
    examples: [
      "what's my data balance",
      "how much credit do I have",
      "remaining minutes",
      "check my allowance",
    ],
    keywords: [
      "balance",
      "remaining",
      "allowance",
      "credit",
      "minutes",
      "data left",
      "usage",
    ],
    requiresAccount: true,
  },
  {
    id: "billing_enquiry",
    description: "Customer asks about bills, charges, or payments",
    examples: [
      "why is my bill high",
      "when is my next payment",
      "explain this charge",
      "billing query",
    ],
    keywords: [
      "bill",
      "billing",
      "invoice",
      "payment",
      "charge",
      "direct debit",
      "overcharged",
      "cost",
    ],
    requiresAccount: true,
  },
  {
    id: "report_outage",
    description: "Customer reports no service or network issues",
    examples: [
      "no signal at home",
      "internet is down",
      "network outage",
      "can't connect to 5g",
    ],
    keywords: [
      "outage",
      "down",
      "offline",
      "no signal",
      "no service",
      "fault",
      "not working",
      "disconnected",
      "slow broadband",
    ],
  },
  {
    id: "data_roaming",
    description: "Customer asks about roaming abroad",
    examples: [
      "does roaming work in spain",
      "how much is eu roaming",
      "turn on data roaming",
    ],
    keywords: ["roaming", "abroad", "eu", "europe", "travel", "overseas", "spain", "france"],
  },
  {
    id: "sim_swap",
    description: "Customer needs a replacement or eSIM transfer",
    examples: ["lost my sim", "replace sim card", "transfer to esim", "sim swap"],
    keywords: ["sim", "esim", "swap", "replace", "lost phone", "stolen", "new sim"],
    requiresAccount: true,
  },
  {
    id: "plan_upgrade",
    description: "Customer wants to change or upgrade their plan",
    examples: ["upgrade my plan", "more data please", "switch to unlimited", "change tariff"],
    keywords: ["upgrade", "plan", "tariff", "unlimited", "switch", "more data", "package"],
  },
  {
    id: "complaint",
    description: "Customer raises a formal complaint",
    examples: ["I want to complain", "raise a complaint", "this is unacceptable"],
    keywords: ["complaint", "complain", "unhappy", "disgusted", "ofcom", "escalate issue"],
    escalate: true,
  },
  {
    id: "store_locator",
    description: "Customer wants a nearby ClearCall store",
    examples: ["nearest store", "shop near me", "find a clearcall store"],
    keywords: ["store", "shop", "branch", "nearest", "locator", "open today"],
  },
  {
    id: "speak_to_agent",
    description: "Customer requests a human agent",
    examples: ["speak to a person", "human agent", "talk to someone", "live advisor"],
    keywords: ["human", "agent", "advisor", "person", "operator", "representative", "live chat"],
    escalate: true,
  },
];

export function getIntent(id: string): IntentDefinition | undefined {
  return INTENT_CATALOGUE.find((intent) => intent.id === id);
}
