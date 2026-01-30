import 'dotenv/config'

import { defineConfig } from 'drizzle-kit'

const useEmbeddedReplica = process.env.USE_EMBEDDED_REPLICA === 'true'

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: useEmbeddedReplica ? 'sqlite' : 'turso',
  dbCredentials: useEmbeddedReplica
    ? {
        url: process.env.TURSO_LOCAL_DB_PATH || 'file:.turso/local.db',
      }
    : {
        url: process.env.TURSO_DATABASE_URL || '',
        authToken: process.env.TURSO_AUTH_TOKEN || '',
      },
})
