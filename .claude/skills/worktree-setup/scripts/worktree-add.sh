#!/usr/bin/env bash
# Worktree setup helper for this repo.
# - Adds a worktree and branch from a base branch.
# - Copies main/.env.local into the new worktree when missing.
# - Installs dependencies with bun when package.json exists.
set -euo pipefail

# Resolve the bare repo root by walking up until .bare is found.
root=""
search_dir="$(cd "$(dirname "$0")" && pwd -P)"
while [ -n "$search_dir" ] && [ "$search_dir" != "/" ]; do
  if [ -e "$search_dir/.bare" ]; then
    root="$search_dir"
    break
  fi
  search_dir="$(dirname "$search_dir")"
done

if [ -z "$root" ]; then
  echo "Could not find repo root (missing .bare marker)." >&2
  exit 1
fi
name="${1:?worktree dir name required}"
branch="${2:-feature/$name}"
base="${3:-main}"

# Create the worktree and branch.
cd "$root"
git worktree add "$name" -b "$branch" "$base"

wt="$root/$name"
# Seed environment file from main if present.
if [ -f "$root/main/.env.local" ] && [ ! -f "$wt/.env.local" ]; then
  cp "$root/main/.env.local" "$wt/.env.local"
fi

# Install dependencies for the new worktree.
if [ -f "$wt/package.json" ]; then
  (cd "$wt" && bun install)
fi

# Add worktree folder to the editor workspace (Cursor or VS Code).
if command -v cursor >/dev/null 2>&1; then
  cursor --add "$wt"
elif command -v code >/dev/null 2>&1; then
  code --add "$wt"
else
  echo "Skipping editor add: neither 'cursor' nor 'code' found in PATH." >&2
fi
