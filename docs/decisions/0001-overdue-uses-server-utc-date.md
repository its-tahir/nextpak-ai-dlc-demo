---
status: accepted
date: 2026-10-31
deciders: Tahir Nazir (lead and developer)
---

# 0001. Overdue evaluation uses server date in UTC

## Context and problem statement
When introducing due dates to todos, we needed a consistent definition for when an incomplete todo is considered "Overdue". Users interact with the app across multiple clients and potentially across different time zones or devices with skewed local clocks. If overdue calculation were done on the client, the UI display could disagree with API filtered results (`GET /api/v1/todos?overdue=true`).

## Considered options
1. Client-side evaluation using the browser clock and local time zone
2. Server-side evaluation using the server's current date in UTC

## Decision outcome
Chosen: **Server-side evaluation using the server's current date in UTC**, because:
- **Consistency between API and UI**: The server computes `overdue: boolean` and provides it in the todo payload. The UI displays the "Overdue" badge directly from this property and the API filter `?overdue=true` uses the exact same calculation, guaranteeing that what the user sees in the list matches filtered queries.
- **Clock skew resilience**: Client device clocks can be inaccurate, misconfigured, or in unexpected time zones. A centralized server UTC reference prevents discrepancies.
- **Single source of truth**: The business logic for overdue status lives in one place (`todos.service.ts` passing `todayUTC` to repository queries) rather than being duplicated across frontend and backend codebases.

### Consequences
- Good: Unified definition of overdue across endpoints and UI components; zero clock skew issues between client and server; UI logic remains simple and declarative (`todo.overdue`).
- Bad / trade-off: A user operating in a time zone ahead of or behind UTC will see the overdue boundary transition at 00:00 UTC rather than their local midnight.
- Follow-up: If user-specific time zones are supported in future milestones, the user's preferred time zone can be stored with user settings or passed via request headers, but evaluation will still remain server-authoritative.

## More information
- Feature Card: Add due dates to todos (PR #5)
- Domain doc: [docs/domains/todos.md](../domains/todos.md)

