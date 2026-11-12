# Problem definition

## What’s going wrong

ClearCall still leans on human advisors for a lot of basic questions. When call volume goes up, wait times go up too. Simple things like checking data left or asking about roaming shouldn’t need a long phone wait if we can answer them in chat.

## Why it matters to the company

| Goal | How Clara helps |
| --- | --- |
| Happier customers | Quicker answers for common questions |
| Lower support cost | Fewer routine chats need a paid agent |
| Consistent answers | Same approved wording every time |
| Handle more chats | Several sessions at once without hiring linearly |

## What we built (developer view)

We needed a chat system that can:

1. Work out what the customer is asking (intent)
2. Pull out useful details (account number, postcode)
3. Keep track of the conversation
4. Save the chat history
5. Show a usable UI
6. Use an “AI / NLU” style component without needing a paid API for the live demo

So we wrote an offline matcher (keywords + example phrases + regexes) behind an `IAiService` interface. That still counts as AI integration for the module, but the demo stays reliable offline.

## How we’ll know it worked

1. Core telecom intents work as listed in the requirements  
2. Sessions save properly and concurrent chats don’t collide  
3. We have unit, integration, and UAT evidence  
4. It runs from the Canvas zip with no extra setup
