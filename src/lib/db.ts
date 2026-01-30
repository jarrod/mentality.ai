import { drizzle } from 'drizzle-orm/libsql'

// Singleton instance
let dbInstance: ReturnType<typeof drizzle> | null = null

/**
 * Factory method to create and return a common database connection.
 * Uses a singleton pattern to ensure only one connection instance is created.
 *
 * In development with USE_EMBEDDED_REPLICA=true:
 * - Creates a local SQLite file that syncs with Turso
 * - Provides fast local reads/writes with background sync
 *
 * In production or when USE_EMBEDDED_REPLICA is not set:
 * - Connects directly to Turso
 */
export function getDb() {
  if (dbInstance) return dbInstance

  const url = process.env.TURSO_DATABASE_URL || ''
  const authToken = process.env.TURSO_AUTH_TOKEN || ''
  const useEmbeddedReplica = process.env.USE_EMBEDDED_REPLICA === 'true'

  if (useEmbeddedReplica) {
    const localPath = process.env.TURSO_LOCAL_DB_PATH || 'file:.turso/local.db'
    // Use pure local SQLite for development - no remote sync
    // WARNING: Changes are local only and won't sync to Turso
    // This is for development speed only
    dbInstance = drizzle({
      connection: {
        url: localPath,
      },
    })
  } else {
    // Direct connection to Turso
    dbInstance = drizzle({
      connection: {
        url,
        authToken,
      },
    })
  }

  return dbInstance
}
