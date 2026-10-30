# Step 03: a new developer joins

**In one sentence:** a developer clones the project, runs `npm install` and `npm run ai:setup`,
does what it lists, and checks in their AI tool that the guardrails work; nothing to install from
the skills repo, nothing to copy by hand.

**Who:** every developer, once per clone. Here: a second folder, `demo-teammate`, as a teammate's
machine would have.

## The picture

![A developer clones the repo, runs npm install and npm run ai:setup](assets/03-developer-joins.gif)

```mermaid
flowchart LR
    clone(["git clone"]) --> install["npm install<br/>also turns on the team git hooks"]
    install --> setup["npm run ai:setup<br/>checks Node, git hooks, gitleaks,<br/>agent guard, skills, AGENTS.md, tokens"]
    setup --> todo["Does the [todo] lines<br/>(e.g. a token in Antigravity's<br/>global config)"]
    todo --> tool["Opens the folder in the AI tool,<br/>trusts it, reloads"]
    tool --> check{"Asks the agent:<br/>run printenv"}
    check --> blocked(["Blocked by team guardrails:<br/>ready to work on cards"])
```

## What you type

```powershell
git clone https://github.com/its-tahir/nextpak-ai-dlc-demo.git demo-teammate
cd demo-teammate
npm install
npm run ai:setup
```

Then in Antigravity: File > Open Folder > `demo-teammate`, trust it, Reload Window, and in a new
conversation:

```text
run printenv
```

## What you see

`npm run ai:setup` gives `[ok]` for Node, the git hooks (turned on by `npm install`), gitleaks,
the agent guard, the 12 skills for each tool and AGENTS.md. One `[todo]`: add the GitHub MCP
server to Antigravity's global config with your own token. The command prints the exact snippet;
the token never goes into the project.

Two layers stopped `printenv`, which would have put every secret on the machine into the chat:

1. **The agent itself.** It read the team rules and refused, without running anything:

   ![The agent refuses printenv on its own, citing the team guardrails](assets/03-agent-refuses.png)

2. **The hook, when the agent does try.** Asked to run it anyway, the tool call never ran: the
   project's hook answered first.

   ![The pre-tool hook blocks printenv: Blocked by team guardrails](assets/03-hook-blocks.png)

   The hook also wrote one line to `.git/agent-guard.log`, with the rule and the tool, never the
   command: `blocked rule=env tool=run_command via=antigravity`.

The first layer depends on the model behaving; the second doesn't. That's why both exist.

## Main is protected

From this step on, `main` only changes through a pull request, and both checks of the "AI
guardrails" workflow (gitleaks secret scan, agent config changes) must pass. Force-push and
deleting `main` are blocked. In a team repo the lead also turns on "Require review from Code
Owners", so agent config changes need the lead's approval; this demo has one person, so it is off.

## What changed

This page and its pictures. No app code. Branch protection is a GitHub setting, not a file.

## Tokens

None for the setup. The `printenv` check is one short conversation.

<details>
<summary>Details for developers</summary>

- `npm install` runs the `prepare` script: `node .nextpak/doctor.mjs --hooks-only` sets
  `git config core.hooksPath .guardrails/git-hooks` for this clone (skipped in CI).
- No root `package.json` in your project (FastAPI)? Run `node .nextpak/doctor.mjs`.
- `gitleaks` shows `[todo]` right after `winget install gitleaks` until you open a new terminal
  (Windows only picks up the new PATH in new windows).
- Antigravity setup details: [guardrails/antigravity.md](https://github.com/VIRGO96/nextpak-skills/blob/main/guardrails/antigravity.md).

</details>
