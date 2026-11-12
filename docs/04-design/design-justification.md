# Why we designed it this way

| Concern | What we chose | Why |
| --- | --- | --- |
| Usability | Chat UI + quick reply buttons + confidence tags | Less typing; markers can see what intent fired |
| Maintainability | OOP modules + `IAiService` | Easier to add intents or swap the “brain” later |
| Scalability | Queue per session + HTTP APIs | Stops two messages in the same chat overwriting each other |
| Security | Zod checks, length limit, demo accounts only | Safer for a coursework demo; nothing secret in the repo |
| Performance | Offline keyword NLU + memory cache | Fast replies with no internet dependency in the demo |
| AI integration | Offline NLU first; external stub unused | Covers the brief’s AI/API point without needing a live LLM |

## Coding standards we followed

- TypeScript with strict checking  
- ESLint (Next.js defaults)  
- Clear class names (`DialogueManager`, `OfflineNluEngine`, etc.)  
- Shared error types under `ChatbotError`
