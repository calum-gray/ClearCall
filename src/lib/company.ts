/** Fake UK telecom company for the MK6004 group project. */
export const company = {
  legalName: "ClearCall Communications Ltd",
  tradingName: "ClearCall",
  chatbotName: "Clara",
  chatbotFullName: "Clara — ClearCall support assistant",
  tagline: "Get help without sitting in a phone queue.",
  sector: "Telecommunications",
  hq: "Manchester, United Kingdom",
  founded: 2011,
  customers: "About 4.2 million UK customers (made-up figure for the brief)",
  products: [
    "Mobile (4G/5G)",
    "Fibre broadband",
    "Landline & VoIP",
    "Business connectivity",
  ],
  mission:
    "Give customers reliable mobile and broadband, with support that is easy to reach.",
  supportChallenge:
    "Lots of the same questions keep coming in — balances, outages, SIM swaps, plan changes — so wait times are getting longer and staff are overloaded.",
} as const;
