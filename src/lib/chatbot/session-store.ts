import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { ChatMessage, ChatSession, SessionContext } from "./types";
import { SessionNotFoundError } from "./errors";
import { logger } from "./logger";

const DEFAULT_CONTEXT = (): SessionContext => ({
  turnCount: 0,
  escalationRequested: false,
});

/**
 * Saves chat sessions as JSON under data/sessions.
 * Keeps an in-memory cache; disk writes are queued so files don't corrupt.
 */
export class SessionStore {
  private readonly cache = new Map<string, ChatSession>();
  private readonly dir: string;
  private writeChain: Promise<void> = Promise.resolve();
  private loaded = false;

  constructor(dir = path.join(process.cwd(), "data", "sessions")) {
    this.dir = dir;
  }

  private async ensureReady() {
    if (this.loaded) return;
    await fs.mkdir(this.dir, { recursive: true });
    try {
      const files = await fs.readdir(this.dir);
      await Promise.all(
        files
          .filter((f) => f.endsWith(".json"))
          .map(async (file) => {
            try {
              const raw = await fs.readFile(path.join(this.dir, file), "utf8");
              const session = JSON.parse(raw) as ChatSession;
              this.cache.set(session.id, session);
            } catch (error) {
              logger.warn("Skipping corrupt session file", { file, error: String(error) });
            }
          }),
      );
    } catch (error) {
      logger.error("Failed to load sessions directory", { error: String(error) });
    }
    this.loaded = true;
  }

  private enqueueWrite(task: () => Promise<void>) {
    // Serialise disk writes to avoid interleaved JSON corruption under concurrency.
    this.writeChain = this.writeChain.then(task).catch((error) => {
      logger.error("Session persistence write failed", { error: String(error) });
    });
    return this.writeChain;
  }

  private async persist(session: ChatSession) {
    const file = path.join(this.dir, `${session.id}.json`);
    const tmp = `${file}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(session, null, 2), "utf8");
    await fs.rename(tmp, file);
  }

  async create(): Promise<ChatSession> {
    await this.ensureReady();
    const now = new Date().toISOString();
    const session: ChatSession = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      messages: [],
      context: DEFAULT_CONTEXT(),
    };
    this.cache.set(session.id, session);
    await this.enqueueWrite(() => this.persist(session));
    logger.info("session created", { sessionId: session.id });
    return structuredClone(session);
  }

  async get(sessionId: string): Promise<ChatSession> {
    await this.ensureReady();
    const session = this.cache.get(sessionId);
    if (!session) throw new SessionNotFoundError(sessionId);
    return structuredClone(session);
  }

  async list(limit = 20): Promise<ChatSession[]> {
    await this.ensureReady();
    return [...this.cache.values()]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, limit)
      .map((s) => structuredClone(s));
  }

  async appendMessage(
    sessionId: string,
    message: ChatMessage,
    context?: SessionContext,
  ): Promise<ChatSession> {
    await this.ensureReady();
    const session = this.cache.get(sessionId);
    if (!session) throw new SessionNotFoundError(sessionId);

    session.messages.push(message);
    if (context) session.context = context;
    session.updatedAt = new Date().toISOString();
    this.cache.set(sessionId, session);
    await this.enqueueWrite(() => this.persist(session));
    return structuredClone(session);
  }

  async updateContext(sessionId: string, context: SessionContext): Promise<ChatSession> {
    await this.ensureReady();
    const session = this.cache.get(sessionId);
    if (!session) throw new SessionNotFoundError(sessionId);
    session.context = context;
    session.updatedAt = new Date().toISOString();
    this.cache.set(sessionId, session);
    await this.enqueueWrite(() => this.persist(session));
    return structuredClone(session);
  }
}

const globalStore = globalThis as unknown as { __claraSessionStore?: SessionStore };

export function getSessionStore(): SessionStore {
  if (!globalStore.__claraSessionStore) {
    globalStore.__claraSessionStore = new SessionStore();
  }
  return globalStore.__claraSessionStore;
}
