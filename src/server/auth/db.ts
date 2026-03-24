import postgres from "postgres";

let sqlInstance: ReturnType<typeof postgres> | null = null;

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      "DATABASE_URL non impostata: serve una connection string Postgres (es. Neon, Supabase) per login, registrazione e lista desideri."
    );
  }
  return url;
}

export function getSql(): ReturnType<typeof postgres> {
  if (sqlInstance) return sqlInstance;
  sqlInstance = postgres(getDatabaseUrl(), {
    max: Number(process.env.DATABASE_POOL_MAX ?? 5),
    idle_timeout: 20,
    connect_timeout: 15,
  });
  return sqlInstance;
}

let schemaReady: Promise<void> | null = null;

export function ensureAuthSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = runMigrations();
  }
  return schemaReady;
}

async function runMigrations(): Promise<void> {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      first_name TEXT NOT NULL DEFAULT '',
      last_name TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
      expires_at BIGINT NOT NULL
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions (expires_at)
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS wishlist (
      user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
      movie_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      poster_path TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, movie_id)
    )
  `;
}

export async function purgeExpiredSessions(): Promise<void> {
  await ensureAuthSchema();
  const sql = getSql();
  const now = Math.floor(Date.now() / 1000);
  await sql`DELETE FROM sessions WHERE expires_at < ${now}`;
}
