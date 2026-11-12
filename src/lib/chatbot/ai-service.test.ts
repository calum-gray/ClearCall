import { describe, expect, it } from "vitest";
import { OfflineNluService, ExternalLlmStubService, ResilientAiService } from "./ai-service";
import { AiServiceUnavailableError } from "./errors";

describe("OfflineNluService", () => {
  const service = new OfflineNluService();

  it("returns a balance summary for the demo account", async () => {
    const reply = await service.generateReply("check my balance CC-10482931", {
      turnCount: 0,
    });
    expect(reply.intent).toBe("check_balance");
    expect(reply.text).toContain("Alex Morgan");
    expect(reply.meta.offline).toBe(true);
  });

  it("returns outage information for a known postcode", async () => {
    const reply = await service.generateReply("report outage at M1 1AE", {
      turnCount: 1,
    });
    expect(reply.intent).toBe("report_outage");
    expect(reply.text.toLowerCase()).toContain("manchester");
  });
});

describe("ExternalLlmStubService", () => {
  it("fails closed when no real AI is configured", async () => {
    const stub = new ExternalLlmStubService();
    await expect(stub.generateReply("hello", { turnCount: 0 })).rejects.toBeInstanceOf(
      AiServiceUnavailableError,
    );
  });
});

describe("ResilientAiService", () => {
  it("falls back to offline NLU when primary fails", async () => {
    const resilient = new ResilientAiService(new ExternalLlmStubService(), new OfflineNluService());
    const reply = await resilient.generateReply("hello", { turnCount: 0 });
    expect(reply.intent).toBe("greeting");
    expect(reply.text).toMatch(/offline reply/i);
  });
});
