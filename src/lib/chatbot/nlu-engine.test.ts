import { describe, expect, it } from "vitest";
import { OfflineNluEngine } from "./nlu-engine";

describe("OfflineNluEngine", () => {
  const nlu = new OfflineNluEngine();

  it("classifies greetings", () => {
    const result = nlu.classify("Hello Clara");
    expect(result.intent).toBe("greeting");
    expect(result.confidence).toBeGreaterThan(0.28);
  });

  it("classifies balance requests and extracts account numbers", () => {
    const result = nlu.classify("What's my data balance for CC-10482931?");
    expect(result.intent).toBe("check_balance");
    expect(result.entities.accountNumber).toBe("CC-10482931");
  });

  it("classifies outage reports and extracts postcodes", () => {
    const result = nlu.classify("There is a network outage near M1 1AE");
    expect(result.intent).toBe("report_outage");
    expect(result.entities.postcode?.replace(/\s+/g, "")).toBe("M11AE");
  });

  it("falls back on nonsense input", () => {
    const result = nlu.classify("purple elephant dancing");
    expect(result.intent).toBe("fallback");
  });

  it("detects agent escalation intent", () => {
    const result = nlu.classify("I want to speak to a human agent please");
    expect(result.intent).toBe("speak_to_agent");
  });
});
