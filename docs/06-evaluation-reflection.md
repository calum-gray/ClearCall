# Evaluation and reflection

## Does it do what we said it would?

For this coursework, yes — within the scope we set. Clara has a web UI, classifies intents, picks up account numbers/postcodes, answers from our knowledge content, saves sessions, can flag escalations, shows quick replies, has an ops list, a health check, and an AI service interface with offline NLU.

What it doesn’t do (on purpose / for time):

- It only knows the intents we taught it — not every possible sentence  
- Only two demo accounts in the fake billing data  
- No real CRM or live billing system hooked up  

## Non-functional checks

| NFR | Result | Notes |
| --- | --- | --- |
| Usability | Met | Works on desktop/phone; Enter sends a message |
| Performance | Met | Offline replies are usually under a second here |
| Reliability | Met | Bad input gets a clear error; failures get a safe reply |
| Maintainability | Met | Split into modules with docs |
| Scalability | Partly | Queue helps concurrency; JSON files wouldn’t scale forever |
| Security | OK for demo | No secrets; length limits; fake accounts only |

## Reflection

We chose offline NLU instead of a hosted LLM because the marker has to run whatever we upload. We can’t rely on API keys or a network call that might fail on demo day. Keeping `IAiService` means we could still add a real provider later without rewriting the chat flow.

If we had more time after the module, we’d probably move storage to a proper database, build a simple screen for advisors to pick up escalations, add more training phrases, and only then consider a real LLM with careful controls (telecom advice shouldn’t invent policy).

## K25 — product quality

We tried to keep quality in check with TypeScript/ESLint, automated tests, logging, input checks, and Git. For security we avoided real customer data and didn’t hardcode secrets.
