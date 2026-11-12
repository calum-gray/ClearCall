# System Architecture

```mermaid
flowchart TB
  subgraph client [Browser]
    GUI[React Chat GUI]
    Ops[Ops Dashboard]
  end

  subgraph next [Next.js App Router]
    ChatAPI["/api/chat"]
    SessAPI["/api/sessions"]
    Health["/api/health"]
    DM[DialogueManager]
    AI[IAiService / Offline NLU]
    Store[SessionStore]
  end

  subgraph data [Persistence]
    JSON[(data/sessions/*.json)]
  end

  GUI --> ChatAPI
  Ops --> SessAPI
  ChatAPI --> DM
  DM --> AI
  DM --> Store
  Store --> JSON
  Health --> AI
```

## Layers

1. **Presentation** — branded React GUI (`ChatPanel`, ops table).  
2. **API / networking** — HTTP JSON route handlers.  
3. **Domain** — dialogue management, NLU, knowledge base.  
4. **Infrastructure** — JSON session store, logger, AI service interface.
