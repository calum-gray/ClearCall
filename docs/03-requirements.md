# Requirements Analysis

## Functional requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| FR1 | Users can open a chat session and exchange messages with Clara via a web GUI | Must |
| FR2 | System classifies user utterances into supported intents (greeting, balance, billing, outage, roaming, SIM, plans, complaint, store, agent, help, goodbye, fallback) | Must |
| FR3 | System extracts entities (account number `CC-########`, UK postcode, plan name) where present | Must |
| FR4 | System returns contextual replies from the ClearCall knowledge base / demo ledger | Must |
| FR5 | System persists session transcripts and context to durable storage | Must |
| FR6 | Users can request human escalation; sessions are flagged accordingly | Must |
| FR7 | Quick-reply suggestions are offered after assistant turns | Should |
| FR8 | Operations staff can list recent sessions (ops dashboard) | Should |
| FR9 | Health endpoint reports service and AI provider metadata | Should |
| FR10 | AI logic sits behind `IAiService` (we use offline NLU; stub exists for a future external provider) | Must |

## Non-functional requirements

| ID | Requirement | Target |
| --- | --- | --- |
| NFR1 | Usability | Clear branding, mobile-responsive chat, keyboard send (Enter) |
| NFR2 | Performance | Typical reply < 1s on local hardware for offline NLU |
| NFR3 | Reliability | Validation errors return 400; unexpected failures return safe fallback copy |
| NFR4 | Maintainability | Modular OOP packages under `src/lib/chatbot`; documented APIs |
| NFR5 | Scalability | Per-session async queue; stateless HTTP handlers; file store replaceable |
| NFR6 | Security | Input length limits; no secrets required; demo accounts only (no live PII) |
| NFR7 | Observability | Structured logging; intent/confidence surfaced in UI |
| NFR8 | Testability | Unit + integration tests via Vitest; reproducible demo fixtures |

## Out of scope

- Real payment processing or CRM write-back  
- Live network telemetry feeds  
- Calling a real hosted LLM in the live demo (stub only for now)
