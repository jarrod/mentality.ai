---
name: bun-runtime
description: Guidance for bun-based workflows including scripts, package management, and runtime constraints.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - Bash(bun:*)
user-invocable: true
---

## Overview

Use this skill when running or recommending scripts, dependency changes, or runtime-specific behavior for bun-based projects.

## Core Practices

- Prefer bun commands (e.g., bun install, bun run, bun test)
- Avoid npm or pnpm unless explicitly requested
- Match script names to existing package.json entries

## When to Use bun test

- Run `bun test` for unit and integration tests defined with `bun:test`
- Use `bun test --only` during focused debugging
- Use `bun test --todo` to surface TODO tests that now pass
- For type-level tests with `expectTypeOf`, run `bunx tsc --noEmit`

## Sample Commands

- Install deps: `bun install`
- Run dev script: `bun run dev`
- Run file directly: `bun run src/index.ts`
- Watch a file: `bun --watch run src/index.ts`
- Run a Node-based CLI with Bun: `bun run --bun vite`
- List scripts: `bun run`

## Additional Resources

- Check project docs for bun-specific conventions
- Bun test writing reference: [Testing reference](references/TESTING.md)
- Bun runtime reference: [Runtime reference](references/RUNTIME.md)
