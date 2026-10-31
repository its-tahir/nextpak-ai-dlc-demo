# Quick start: how we work with AI agents

Five minutes. For the full story (what happened at each step and why), read [GUIDE.md](GUIDE.md).

![The seven steps, one after the other, with guardrails underneath](walkthrough/assets/ai-dlc-flow.gif)

## The idea

The agent does the work: reading code, writing tests and code, updating the board, opening the
pull request. People make the decisions: what to build, whether the plan is right, whether to
merge, whether the card is done.

## The seven steps

| # | Step | Who | What you do |
|---|---|---|---|
| 1 | Set up (once per project) | Lead | `npx github:VIRGO96/nextpak-skills init` |
| 2 | AI-ready check | Lead + agent | Ask: `is this project AI-ready?`, read what it wrote, answer its questions |
| 3 | Write the card | Lead | Testable acceptance criteria, and say where: UI, API or both |
| 4 | Start the card | Developer + agent | `start card <card title>`, read the plan, say `ok` |
| 5 | Build | Agent | Failing tests first, then code, then a browser check for UI changes |
| 6 | Pull request and review | Agent, then a person | New conversation: `review PR #<n> ... as a teammate`; you merge |
| 7 | QA and close-out | QA, then agent | QA moves the card on; `close out the card ...` saves decisions and lessons |

Joining a project that is already set up: `git clone`, `npm install`, `npm run ai:setup`, then ask
the agent `run printenv` (it must be blocked).

## Prompts to copy

| When | Type |
|---|---|
| New project | `is this project AI-ready?` |
| Start work | `start card <card title>` |
| Approve the plan | `ok, go ahead, tests first.` (add anything the plan missed) |
| A bug | `start card <bug title>` (the agent writes a failing test first) |
| Review someone's PR | `review PR #<n> for the card <title>, as a teammate who didn't write it. Run the tests yourself.` |
| Fix review comments | `address the review findings on PR #<n>` |
| Unsure how to ask | `improve my prompt: <your idea>` |
| Finished | `close out the card <title>: log the decision about <x> as an ADR, write the handoff.` |
| Team updates | `npx github:VIRGO96/nextpak-skills update` (lead, in the project) |

## Five rules

1. **Read everything the agent writes** before you commit or merge it. In this demo the agent
   guessed an API path, called an unclear criterion "met", and moved cards it shouldn't have; a
   person caught each one.
2. **The agent asks, you decide.** It stops for your OK before writing code. Product questions
   (which clock, which layer) are yours.
3. **Tests first, browser for UI.** A failing test before the fix; one real browser run with a
   screenshot when the screen changes.
4. **People merge and move cards past dev done.** The agent stops at dev done.
5. **Never work around a guardrail.** If something is blocked, the message says why and what to do.
   Deploys and force-pushes are done by a person.

## Where to look

- Each step, with pictures: the [README](README.md) table.
- What is installed and how to set up your project: [VIRGO96/nextpak-skills](https://github.com/VIRGO96/nextpak-skills#set-up-a-project).
