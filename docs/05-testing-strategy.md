# Testing Strategy & Evidence

## Approach

| Level | Tool | Scope |
| --- | --- | --- |
| Unit | Vitest | `OfflineNluEngine`, `OfflineNluService`, stub/resilient AI |
| Integration | Vitest | `DialogueManager` + `SessionStore` with temp directories |
| API / manual | curl / browser | `/api/health`, `/api/chat`, `/api/sessions` |
| UAT | Scripted scenarios below | Checks a marker / customer would care about |

## How to run automated tests

```bash
npm test
```

## Unit & integration coverage (implemented)

- Greeting / balance / outage / fallback / agent intent classification  
- Account & postcode entity extraction  
- Demo ledger enrichment for `CC-10482931`  
- External LLM stub fails closed; resilient service falls back to offline NLU  
- Multi-turn persistence  
- Concurrent turns on one session remain ordered (5 messages after two parallel sends)

## User acceptance test scripts

| UAT | Steps | Expected |
| --- | --- | --- |
| UAT-1 Welcome | Open home page | Clara greets; quick replies visible |
| UAT-2 Balance | Send “balance for CC-10482931” | Shows Alex Morgan / Everyday 50 / data remaining |
| UAT-3 Outage | Send “outage at M1 1AE” | Mentions Manchester congestion |
| UAT-4 Escalation | Send “speak to a human” | Escalation copy; ops flags session |
| UAT-5 Fallback | Send nonsense | Fallback + help suggestions |
| UAT-6 Mobile | Resize to ~390px width | Chat usable; no horizontal page scroll |

## Evaluation against NFRs

See [06-evaluation-reflection.md](./06-evaluation-reflection.md).
