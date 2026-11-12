export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

/**
 * Lightweight structured logger for the chatbot runtime.
 * Keeps an in-memory ring buffer useful for demos and integration tests.
 */
export class ChatbotLogger {
  private readonly minLevel: LogLevel;
  private readonly buffer: LogEntry[] = [];
  private readonly maxEntries: number;

  constructor(minLevel: LogLevel = "info", maxEntries = 200) {
    this.minLevel = minLevel;
    this.maxEntries = maxEntries;
  }

  private shouldLog(level: LogLevel): boolean {
    return LEVEL_ORDER[level] >= LEVEL_ORDER[this.minLevel];
  }

  private write(level: LogLevel, message: string, context?: Record<string, unknown>) {
    if (!this.shouldLog(level)) return;
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };
    this.buffer.push(entry);
    if (this.buffer.length > this.maxEntries) {
      this.buffer.shift();
    }
    const payload = context ? `${message} ${JSON.stringify(context)}` : message;
    const sink = level === "debug" ? console.log : console[level];
    sink(`[clara:${level}] ${payload}`);
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.write("debug", message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.write("info", message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.write("warn", message, context);
  }

  error(message: string, context?: Record<string, unknown>) {
    this.write("error", message, context);
  }

  recent(limit = 50): LogEntry[] {
    return this.buffer.slice(-limit);
  }
}

export const logger = new ChatbotLogger(
  process.env.CLARA_LOG_LEVEL === "debug" ? "debug" : "info",
);
