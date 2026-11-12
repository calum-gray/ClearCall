export type IntentId =
  | "greeting"
  | "goodbye"
  | "help"
  | "check_balance"
  | "billing_enquiry"
  | "report_outage"
  | "data_roaming"
  | "sim_swap"
  | "plan_upgrade"
  | "complaint"
  | "store_locator"
  | "speak_to_agent"
  | "fallback";

export interface IntentDefinition {
  id: IntentId;
  description: string;
  examples: string[];
  keywords: string[];
  requiresAccount?: boolean;
  escalate?: boolean;
}

export interface ExtractedEntities {
  accountNumber?: string;
  postcode?: string;
  phoneNumber?: string;
  planName?: string;
}

export interface NluResult {
  intent: IntentId;
  confidence: number;
  entities: ExtractedEntities;
  tokens: string[];
  scores: Partial<Record<IntentId, number>>;
}

export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  intent?: IntentId;
  confidence?: number;
  quickReplies?: string[];
}

export interface SessionContext {
  accountNumber?: string;
  customerName?: string;
  postcode?: string;
  lastIntent?: IntentId;
  escalationRequested?: boolean;
  turnCount: number;
}

export interface ChatSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  context: SessionContext;
}

export interface ChatRequest {
  sessionId?: string;
  message: string;
}

export interface ChatResponse {
  sessionId: string;
  reply: ChatMessage;
  context: SessionContext;
  nlu: Pick<NluResult, "intent" | "confidence" | "entities">;
}

export interface AiServiceMeta {
  provider: "offline-nlu" | "external-llm-stub";
  model: string;
  offline: boolean;
}

export interface AiReply {
  text: string;
  intent: IntentId;
  confidence: number;
  entities: ExtractedEntities;
  quickReplies?: string[];
  escalate?: boolean;
  meta: AiServiceMeta;
}
