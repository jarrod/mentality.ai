---
name: worktree-cleanup
description: Safely remove a git worktree and delete its branch with confirmation.
---

# Worktree Cleanup

Use this skill when the user asks to delete a worktree and its branch.

## Quick usage

- Script: `scripts/worktree-remove.sh`
- From any directory under the repo, run:

```bash
./main/.claude/skills/worktree-cleanup/scripts/worktree-remove.sh <dir> [branch]
```

## Behavior

- Resolves the bare repo root by finding the `.bare` marker.
- Confirms the worktree path and branch name before deletion.
- Removes the worktree directory via `git worktree remove`.
- Deletes the branch via `git branch -D`.

## Parameters

- `<dir>`: Worktree directory name.
- `[branch]`: Optional branch name. Defaults to `feature/<dir>`.
