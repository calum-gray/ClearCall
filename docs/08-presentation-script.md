# 15-minute presentation plan (±1)

Everyone should speak. Demo from the Canvas zip only — no fixing bugs on the day.

| Mins | Section | Talk about | Notes |
| --- | --- | --- | --- |
| 0–2 | Company + problem | Who ClearCall is; why queues are bad | Keep it non-technical |
| 2–5 | Requirements + design | Show a couple of diagrams; why offline NLU | Point at `docs/04-design` |
| 5–10 | Live demo | Balance → outage → escalate → Ops page | See checklist below |
| 10–13 | Build + tests | OOP, APIs, storage, Vitest | Show `npm test` if useful |
| 13–15 | What worked / didn’t + Q&A | Limits and what we’d do next | Honest is fine |

## Demo checklist

1. `npm install && npm run dev`  
2. Home page loads — ClearCall + Clara  
3. Ask for balance with `CC-10482931`  
4. Ask about outage at `M1 1AE`  
5. Ask to speak to an agent → open **Ops** and show Escalated  
6. Optional: show tests passing on another screen  

## Audience tip

For non-technical people: problem, demo, benefit.  
For technical people: how NLU works, the session queue, tests.
