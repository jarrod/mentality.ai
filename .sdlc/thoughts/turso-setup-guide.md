# Turso Setup Guide (Airo)

How to configure and use Turso for Airo—both **cloud (Turso via Vercel)** and **local (embedded libSQL)**—based on `package.json`, `src/lib/utils/db.ts`, and `drizzle.config.ts`.

---

## 1. How the DB is provided

- **Runtime client:** `@libsql/client` in `package.json`—no separate Turso CLI install. The app talks to Turso/libSQL via this dependency.
- **Cloud database:** Created and managed via **Vercel** (e.g. Vercel Storage / Turso integration). You get `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` from the Vercel project, not from the Turso CLI.
- **Schema:** Pushed with **Drizzle** (`bun run db:push` for cloud, `bun run db:push:local` for local).

---

## 2. Cloud (Turso via Vercel)

1. **Create/provision the DB** in the Vercel project (Turso integration).
2. **Get credentials** from Vercel (env vars or project settings): `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`.
3. **Put them in `.env`** (or rely on Vercel env in production):
   - `TURSO_DATABASE_URL="libsql://..."`
   - `TURSO_AUTH_TOKEN="..."`
   - Do **not** set `USE_EMBEDDED_REPLICA` (or set it to `false`).
4. **Push schema:** `bun run db:push`
5. **Inspect data:** `bun run db:studio`

---

## 3. Local (embedded libSQL / SQLite)

- **Client:** Same `@libsql/client`; with `USE_EMBEDDED_REPLICA=true` the app uses a local SQLite file (see `src/lib/utils/db.ts`).
- **Env:** `USE_EMBEDDED_REPLICA=true` and optionally `TURSO_LOCAL_DB_PATH=file:.turso/local.db`.
- **Directory:** `mkdir -p .turso` if needed.
- **Push schema:** `bun run db:push:local`
- **Studio:** `bun run db:studio:local`

No Turso account or CLI required for local-only work.

---

## 4. Summary

| Item              | Your setup                                      |
|-------------------|--------------------------------------------------|
| Turso CLI         | Not needed; libSQL via `@libsql/client`         |
| Cloud DB creation | Vercel (Turso integration)                      |
| Schema changes    | Drizzle: `db:push` (cloud), `db:push:local` (local) |
