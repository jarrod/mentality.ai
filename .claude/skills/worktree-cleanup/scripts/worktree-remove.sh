#!/usr/bin/env bash
# Worktree cleanup helper.
# - Confirms before deletion.
# - Removes worktree directory.
# - Deletes branch after removal.
set -euo pipefail

name="${1:?worktree dir name required}"
branch="${2:-feature/$name}"
root=""

# Resolve the bare repo root by walking up until .bare is found.
search_dir="$(pwd -P)"
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

wt="$root/$name"

cat <<MSG
About to remove:
- Worktree: $wt
- Branch:   $branch
MSG

read -r -p "Proceed? (y/N): " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
  echo "Aborted."
  exit 0
fi

cd "$root"
if [ -d "$wt" ]; then
  git worktree remove "$name"
else
  echo "Worktree directory missing: $wt (continuing)" >&2
  git worktree prune
fi
git branch -D "$branch"

# Remove the worktree folder from the editor workspace (best-effort).
if command -v cursor >/dev/null 2>&1; then
  cursor --remove "$wt" >/dev/null 2>&1 || true
elif command -v code >/dev/null 2>&1; then
  code --remove "$wt" >/dev/null 2>&1 || true
fi
