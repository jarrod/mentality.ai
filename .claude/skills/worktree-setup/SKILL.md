---
name: worktree-setup
description: Create git worktrees for this repo and run post-setup steps (copy .env.local, bun install).
model: haiku
---

# Worktree Setup

Use this skill when the user asks to create a new git worktree in this repo or says they are starting a new feature branch.

## Quick usa ge

- Script: `scripts/worktree-add.sh`
- From the `main` worktree, run:

```bash
.claude/skills/worktree-setup/scripts/worktree-add.sh <dir> [branch] [base]
```

## Behavior

- Creates the worktree directory and branch (`feature/<dir>` by default) from `main`.
- Copies `main/.env.local` into the new worktree if it exists and the target file is missing.
- Runs `bun install` if `package.json` exists in the new worktree.

## Parameters

- `<dir>`: Worktree directory name.
- `[branch]`: Optional branch name. Defaults to `feature/<dir>`.
- `[base]`: Optional base branch. Defaults to `main`.
