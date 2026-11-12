import type { IntentId } from "./types";

export interface KnowledgeArticle {
  intent: IntentId;
  title: string;
  body: string;
  quickReplies?: string[];
}

/** Fixed replies for each intent. Kept static so the demo always behaves the same. */
export const KNOWLEDGE_BASE: KnowledgeArticle[] = [
  {
    intent: "greeting",
    title: "Welcome",
    body: "Hello — I'm Clara, ClearCall's digital assistant. I can help with balances, billing, outages, roaming, SIM swaps, plan changes, and store locations. How can I help today?",
    quickReplies: ["Check my balance", "Report an outage", "Billing help", "Speak to an agent"],
  },
  {
    intent: "goodbye",
    title: "Close",
    body: "Thanks for contacting ClearCall. If you need anything else, I'm here 24/7. Take care!",
    quickReplies: ["Start a new chat"],
  },
  {
    intent: "help",
    title: "Capabilities",
    body: "I can help with:\n• Mobile/data balances\n• Bills and payments\n• Network outages\n• EU & international roaming\n• SIM / eSIM replacements\n• Plan upgrades\n• Store finder\n• Escalating to a human advisor\n\nJust type your question in plain English.",
    quickReplies: ["Check my balance", "Roaming abroad", "Find a store"],
  },
  {
    intent: "check_balance",
    title: "Balance",
    body: "I can look up remaining allowances once I have your account number (format CC-########).\n\nFor a quick demo, try CC-10482931.",
    quickReplies: ["Use demo account CC-10482931", "Billing help", "Speak to an agent"],
  },
  {
    intent: "billing_enquiry",
    title: "Billing",
    body: "ClearCall bills are issued on the 1st of each month and collected by Direct Debit on the 8th. Common surprises include out-of-bundle roaming, handset instalments, and add-ons.\n\nShare your account number (CC-########) and I can summarise the latest bill using our demo ledger.",
    quickReplies: ["Use demo account CC-10482931", "Raise a complaint", "Speak to an agent"],
  },
  {
    intent: "report_outage",
    title: "Outage",
    body: "Sorry you're having trouble connecting. I can check known faults by postcode.\n\nPlease reply with your UK postcode (e.g. M1 1AE). If no known incident is found, I'll guide you through restart steps and offer escalation.",
    quickReplies: ["M1 1AE", "Speak to an agent"],
  },
  {
    intent: "data_roaming",
    title: "Roaming",
    body: "ClearCall includes Fair Use EU/EEA roaming on most consumer plans (up to your UK data allowance). Outside the EU, day passes start from £6/day for 500MB.\n\nEnable Data Roaming under Settings → Mobile Network before you travel, and keep Wi‑Fi Calling on for UK numbers.",
    quickReplies: ["Upgrade my plan", "Check my balance", "Speak to an agent"],
  },
  {
    intent: "sim_swap",
    title: "SIM / eSIM",
    body: "Lost, damaged, or upgrading to eSIM? I can start a SIM replacement once I verify your account.\n\nProvide your ClearCall account number (CC-########). Standard replacements are £0 for the first swap in 12 months; same-day courier is £9.99 in mainland UK.",
    quickReplies: ["Use demo account CC-10482931", "Speak to an agent"],
  },
  {
    intent: "plan_upgrade",
    title: "Plans",
    body: "Popular ClearCall plans:\n• Essential 20 — 20GB, unlimited UK calls/texts — £18/mo\n• Everyday 50 — 50GB — £24/mo\n• Unlimited Plus — unlimited UK data + EU roam — £32/mo\n\nUpgrades take effect on your next bill cycle with no early exit fee when moving up a tier. Which plan interests you?",
    quickReplies: ["Unlimited Plus", "Check my balance", "Speak to an agent"],
  },
  {
    intent: "complaint",
    title: "Complaint",
    body: "I'm sorry we haven't met your expectations. I can log a formal complaint and have an advisor contact you within one working day.\n\nPlease briefly describe the issue. If you'd rather talk now, choose Speak to an agent.",
    quickReplies: ["Speak to an agent", "Billing help", "Report an outage"],
  },
  {
    intent: "store_locator",
    title: "Stores",
    body: "ClearCall Experience Stores near major cities:\n• Manchester Arndale — Open 09:00–18:00\n• Birmingham Bullring — Open 09:30–18:00\n• London Westfield Stratford — Open 10:00–20:00\n\nShare a postcode for the nearest partner retailer, or book a video appointment with an advisor.",
    quickReplies: ["M1 1AE", "Speak to an agent"],
  },
  {
    intent: "speak_to_agent",
    title: "Escalation",
    body: "I'll connect you with a ClearCall advisor. Typical wait is under 4 minutes between 08:00–20:00 UK time.\n\nI've flagged this session for human handover. An advisor will see your chat history so you don't need to repeat yourself.",
    quickReplies: ["Check my balance", "End chat"],
  },
  {
    intent: "fallback",
    title: "Fallback",
    body: "I didn't quite catch that. Try asking about balances, bills, outages, roaming, SIM swaps, plan upgrades, or store locations — or say \"help\" for a menu.",
    quickReplies: ["Help", "Speak to an agent", "Check my balance"],
  },
];

export function articleFor(intent: IntentId): KnowledgeArticle {
  return (
    KNOWLEDGE_BASE.find((article) => article.intent === intent) ??
    KNOWLEDGE_BASE.find((article) => article.intent === "fallback")!
  );
}

/** Deterministic demo ledger used when a known account number is supplied. */
export const DEMO_ACCOUNTS: Record<
  string,
  {
    name: string;
    plan: string;
    dataLeftGb: number;
    minutesLeft: number;
    nextBillGbp: number;
    status: string;
  }
> = {
  "CC-10482931": {
    name: "Alex Morgan",
    plan: "Everyday 50",
    dataLeftGb: 31.4,
    minutesLeft: 9999,
    nextBillGbp: 24.0,
    status: "Active — Direct Debit healthy",
  },
  "CC-20918344": {
    name: "Jordan Patel",
    plan: "Unlimited Plus",
    dataLeftGb: 999,
    minutesLeft: 9999,
    nextBillGbp: 32.0,
    status: "Active — handset finance £12/mo remaining",
  },
};

export const DEMO_OUTAGES: Record<string, string> = {
  M11AE: "Known mobile congestion in Manchester City Centre until ~18:00 today. Engineers on site.",
  B12AA: "No active ClearCall incidents near B1 2AA. Try a router/phone restart if issues continue.",
  E201AA: "Fibre maintenance window in Stratford (E20) overnight 00:00–05:00. Mobile unaffected.",
};
