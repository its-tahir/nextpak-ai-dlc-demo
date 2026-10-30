# NextPak AI-DLC demo

A small todo app, built one step at a time, to show how the NextPak team works with AI agents:
setting a project up, getting it AI-ready, picking up a card, fixing a bug, reviewing, and
closing out. Every step is a commit (or a pull request) with a short page that explains it in
plain language, with a picture.

**Start here:** read the steps in order. Each page starts with one sentence that says what the
step does; developers can open the details below it.

| Step | What happens | Who | Page |
|---|---|---|---|
| 00 | The starting point: a normal small project, before any AI setup | Lead | [00 Starting point](walkthrough/00-starting-point.md) |
| 01 | One command sets the project up for the team's AI tools | Lead | next |
| 02 | The agent checks the project is AI-ready, and asks two questions | Lead + agent | next |
| 03 | A new developer joins: clone, install, one check | Developer | next |
| 04 | Sprint planning: two cards on the board | Lead | next |
| 05 | A feature card, from plan to pull request, then review | Developer + agent | next |
| 06 | A bug card: a failing test first, then the fix | Developer + agent | next |
| 07 | A vague request: the agent asks before it changes code | Developer + agent | next |
| 08 | Guardrails: risky actions are blocked, with the reason | Developer + agent | next |
| 09 | Close-out: decisions, handoff, and a lesson for next time | Developer + agent | next |

To see the code as it was at a step: `git checkout step-03` (and `git checkout main` to come back).

The team skills, MCP servers and guardrails come from
[VIRGO96/nextpak-skills](https://github.com/VIRGO96/nextpak-skills).

## The app

A todo list: an Express API (`api/`) and a React app (`web/`).

```bash
npm install
npm run dev        # API on http://localhost:3000, app on http://localhost:5173
npm test           # API and web tests
npm run typecheck
```

- `api/`: Express 5, TypeScript, Zod, Pino. Todos are kept in memory (no database yet).
- `web/`: React, Vite, TypeScript, TanStack Query.
