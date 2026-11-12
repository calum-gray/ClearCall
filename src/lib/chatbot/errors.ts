export class ChatbotError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code = "CHATBOT_ERROR", status = 400) {
    super(message);
    this.name = "ChatbotError";
    this.code = code;
    this.status = status;
  }
}

export class ValidationError extends ChatbotError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

export class SessionNotFoundError extends ChatbotError {
  constructor(sessionId: string) {
    super(`Session not found: ${sessionId}`, "SESSION_NOT_FOUND", 404);
    this.name = "SessionNotFoundError";
  }
}

export class AiServiceUnavailableError extends ChatbotError {
  constructor(detail: string) {
    super(detail, "AI_UNAVAILABLE", 503);
    this.name = "AiServiceUnavailableError";
  }
}
