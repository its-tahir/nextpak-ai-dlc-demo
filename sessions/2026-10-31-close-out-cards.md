# 2026-10-31 - Close out cards, ADR for overdue UTC, and acceptance criteria rule

Ticket / branch: Add due dates to todos, Can't un-tick a completed todo / `docs/step-09-close-out`

## Done
- Closed out cards "Add due dates to todos" (PR #5) and "Can't un-tick a completed todo" (PR #7) on NextSprint board: all checklist items marked completed, tasks moved to completed list with `isComplete: true`.
- Logged ADR 0001 (`docs/decisions/0001-overdue-uses-server-utc-date.md`) recording decision that "Overdue" uses server date in UTC instead of browser clock.
- Linked ADR 0001 in `docs/domains/todos.md`.
- Added rule to `AGENTS.md` under Conventions: acceptance criteria must state where each criterion applies (UI, API, or both) to prevent single-layer implementations (e.g. API only). Selected AGENTS.md rule because acceptance criteria ambiguity spans all project cards and cannot be automated mechanically.
- Removed `.gitkeep` files from `docs/decisions/` and `sessions/`.

## Pending
- Follow-up card on backlog: "Change or remove a todo's due date in the UI" (id: `26ab8043-04e5-494d-bf21-43c7418f2fc4`).

## Known issues
- None.

## Next steps
1. Merge pull request for `docs/step-09-close-out`.
2. Pick up backlog card for editing due dates in UI when scheduled.

## Docs touched
- `docs/decisions/0001-overdue-uses-server-utc-date.md`
- `docs/domains/todos.md`
- `AGENTS.md`
- `sessions/2026-10-31-close-out-cards.md`

## Verification
- `npm test` -> `api`: Test Files 1 passed (1), Tests 22 passed (22); `web`: Test Files 1 passed (1), Tests 9 passed (9). Total 31 passed, 0 failed.
- `npm run typecheck` -> clean (0 errors)
- `npm run build` -> clean (0 errors)
