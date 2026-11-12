import { describe, expect, it } from "vitest";
import { mkdtemp } from "fs/promises";
import os from "os";
import path from "path";
import { DialogueManager } from "./dialogue-manager";
import { OfflineNluService } from "./ai-service";
import { SessionStore } from "./session-store";

describe("DialogueManager integration", () => {
  it("runs a multi-turn conversation with persistence", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "clara-sessions-"));
    const store = new SessionStore(dir);
    const manager = new DialogueManager(new OfflineNluService(), store);

    const started = await manager.startSession();
    expect(started.reply.role).toBe("assistant");

    const balance = await manager.handleMessage(
      started.sessionId,
      "What is my balance for CC-10482931?",
    );
    expect(balance.nlu.intent).toBe("check_balance");
    expect(balance.reply.content).toContain("31.4");

    const stored = await store.get(started.sessionId);
    expect(stored.messages.length).toBeGreaterThanOrEqual(3);
    expect(stored.context.accountNumber).toBe("CC-10482931");
  });

  it("serialises concurrent turns on the same session", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "clara-sessions-"));
    const store = new SessionStore(dir);
    const manager = new DialogueManager(new OfflineNluService(), store);
    const started = await manager.startSession();

    const [a, b] = await Promise.all([
      manager.handleMessage(started.sessionId, "hello"),
      manager.handleMessage(started.sessionId, "help"),
    ]);

    expect(a.sessionId).toBe(started.sessionId);
    expect(b.sessionId).toBe(started.sessionId);
    const stored = await store.get(started.sessionId);
    // welcome + 2 user + 2 assistant
    expect(stored.messages.length).toBe(5);
  });
});
