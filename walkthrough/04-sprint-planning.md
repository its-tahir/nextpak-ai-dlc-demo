# Step 04: sprint planning, two cards on the board

**In one sentence:** the lead writes two cards on the NextSprint board, a feature and the bug the
agent found in step 02, each with what "done" means, and moves them to todo.

**Who:** the lead.

## The picture

![The todo list on the board: the bug card and the feature card](assets/04-board-todo.png)

```mermaid
flowchart LR
    idea(["Feature idea:<br/>due dates"]) --> feature["FEATURE card<br/>user story + 6 acceptance criteria<br/>+ out of scope"]
    found(["Step 02: the agent asked,<br/>the lead said it's a bug"]) --> bug["BUG card<br/>steps to reproduce,<br/>expected and actual"]
    feature & bug --> backlog["backlog"] --> todo["todo<br/>(this sprint)"]
    todo -. "step 05 and 06" .-> agent(["The developer's agent<br/>picks them up"])
```

## What a good card has

The agent works from the card, so the card has to say what the lead wants, in words a test can
check. Vague cards make the agent guess (step 07 shows what happens then).

**Feature: "Add due dates to todos"** (label FEATURE, priority medium)

- A user story: who wants it and why.
- Six acceptance criteria, each one testable, for example: "`GET /api/v1/todos?overdue=true`
  returns only todos that are not completed and whose due date is before today (today = the
  server's date in UTC)".
- Out of scope: reminders, times of day, sorting by date.

**Bug: "Can't un-tick a completed todo"** (label BUG, priority high)

![The bug card: found by, steps to reproduce, expected and actual](assets/04-bug-card.png)

- Where it was found (the readiness check in step 02), steps to reproduce, expected and actual.

## The board's lists

backlog, todo, doing, dev done, QA testing, client review, completed. The agent moves a card
from todo to doing when the developer starts it, and to dev done when the pull request is open.
It never goes further: QA testing and completed are for people.

## What changed

Two cards on the board, and this page. No app code.

## Tokens

None: the cards were written by the lead.

<details>
<summary>Details for developers</summary>

- The labels `BUG` and `FEATURE` matter: the `nextsprint-workflow` skill follows the bug path
  (a failing test first, root cause) for cards labelled `BUG`.
- Each card has an assignee and no team lead: NextSprint doesn't allow the same person as both,
  and in this demo the lead and the developer are one person.
- Acceptance criteria become the card's checklist when the work starts (step 05).

</details>
