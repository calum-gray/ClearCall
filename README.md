# Clara — ClearCall Customer Service Chatbot

Group project for **MK6004 Advanced Programming** (Assignment 1).

We built a customer service chatbot for a made-up UK telecom company, **ClearCall Communications**. The bot is called **Clara**. It can help with common support questions like balances, bills, outages, roaming, SIM swaps, plan changes, and store finding.

Clara does **not** call ChatGPT or any other paid AI API. It uses our own offline intent matching (keywords + examples + simple entity extraction). There is an `IAiService` interface in the code so we could plug in a real AI provider later if we wanted to — for the demo we keep it offline so it always runs from the Canvas zip.

## Run it

```bash
npm install
npm run dev
```

Then open **http://localhost:3847**.

```bash
npm test       # unit + integration tests
npm run build  # production build
npm run gitlog # creates git-log.txt for the Canvas zip
```

### Demo accounts (for the presentation)

| Account | What it shows |
| --- | --- |
| `CC-10482931` | Alex Morgan — Everyday 50 plan / balance + billing |
| `CC-20918344` | Jordan Patel — Unlimited Plus |
| Postcode `M1 1AE` | Sample outage in Manchester |

## Folder layout

| Path | What it is |
| --- | --- |
| `src/app` | Pages and API routes (Next.js) |
| `src/lib/chatbot` | Main chatbot logic (NLU, dialogue, storage) |
| `src/components/chat` | Chat UI |
| `docs/` | Write-up: requirements, design diagrams, testing, poster notes, etc. |
| `data/sessions/` | Saved chat sessions at runtime (not committed) |

## How this maps to the brief

| Brief ask | Where we did it |
| --- | --- |
| GUI | React chat page + Ops page |
| OOP | Classes in `src/lib/chatbot` |
| Async / concurrency | async handlers + per-session queue |
| Networking | `/api/chat`, `/api/sessions`, `/api/health` |
| Data storage | JSON files via `SessionStore` |
| Error handling | Validation + custom errors + fallback replies |
| AI integration | Offline NLU behind `IAiService` (external stub exists but unused) |
| Tools | Git, npm, Vitest, ESLint, logging |

## Put this on GitHub (group repo)

1. Create a new empty repo on GitHub (no README if you already have this one).
2. On your machine, in this project folder:

```bash
git remote remove origin   # only if origin still points somewhere else
git remote add origin https://github.com/YOUR_ORG_OR_USER/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

3. Invite the rest of the group as collaborators.
4. Agree a simple branch rule (e.g. work on `feature/...`, merge to `main` after a quick review).

More detail: [docs/12-github-setup.md](docs/12-github-setup.md).

## Before Canvas submit

1. Add **group name, student names and numbers** on the poster / cover (`docs/07-poster-outline.md`).
2. Zip the project and include `git-log.txt` from `npm run gitlog`.
3. Demo only from the zip you upload — no last-minute patches on the day.
4. APA7 references: `docs/11-references.md`.
5. Fill in AI use honestly: `docs/10-ai-acknowledgement.md`.

## Optional env vars

| Variable | What it does |
| --- | --- |
| `CLARA_AI_PROVIDER=external` | Tries the external stub (then falls back to offline) |
| `CLARA_LOG_LEVEL=debug` | More detailed logs |

## Licence

Coursework only — for our module assessment.
