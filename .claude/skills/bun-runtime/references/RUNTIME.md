# Bun Runtime Reference

Source: https://bun.com/docs/runtime.md

## Run Files

- Execute files with `bun run <file>` or `bun <file>`.
- Bun transpiles TS/TSX/JSX on the fly.

```bash
bun run index.ts
bun index.tsx
```

## Watch Mode

```bash
bun --watch run index.tsx
```

- Place bun flags immediately after `bun`.
- `bun run dev --watch` passes `--watch` to the script and is ignored by bun.

## Run package.json Scripts

```bash
bun run <script>
```

- `bun <script>` also works, but built-in bun commands take precedence.
- `bun run` with no args lists available scripts.
- Lifecycle hooks `pre<script>` and `post<script>` are respected.

## Use Bun for Node-based CLIs

- Many CLIs have a `node` shebang. Use `--bun` to force Bun.

```bash
bun run --bun vite
```

## Workspace Filtering

```bash
bun run --filter 'ba*' <script>
```

## Run from stdin

```bash
echo "console.log('Hello')" | bun run -
```

## Console Depth

```bash
bun --console-depth 5 run index.tsx
```

- Default `console.log` depth is `2`.

## Memory Mode

```bash
bun --smol run index.tsx
```

- Reduces memory usage, may reduce performance.

## Resolution Order (bun run)

1. package.json scripts
2. source files
3. binaries from project packages
4. system commands

## Common Runtime Flags (selected)

- `--watch` auto-restart on file change
- `--hot` auto-reload in runtime/test/bundler
- `--no-clear-screen` keep terminal output on reload
- `--inspect`, `--inspect-wait`, `--inspect-brk` for debugging
- `--env-file` load environment variables
- `--cwd` set working directory
- `--config` set `bunfig.toml`
- `--no-install` disable auto install
- `--prefer-offline` avoid network checks
