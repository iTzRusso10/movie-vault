import { randomBytes } from "node:crypto";
import { ensureAuthSchema, getSql, purgeExpiredSessions } from "./db";
import { SESSION_TTL_SEC } from "./constants";

export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export async function createSession(userId: number): Promise<string> {
  await purgeExpiredSessions();
  await ensureAuthSchema();
  const sql = getSql();
  const token = generateSessionToken();
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SEC;
  await sql`
    INSERT INTO sessions (token, user_id, expires_at)
    VALUES (${token}, ${userId}, ${expiresAt})
  `;
  return token;
}

export async function deleteSessionByToken(token: string): Promise<void> {
  await ensureAuthSchema();
  const sql = getSql();
  await sql`DELETE FROM sessions WHERE token = ${token}`;
}

export type SessionUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};

export async function findUserBySessionToken(
  token: string | null
): Promise<SessionUser | null> {
  if (!token) return null;
  await purgeExpiredSessions();
  await ensureAuthSchema();
  const sql = getSql();
  const now = Math.floor(Date.now() / 1000);
  const rows = await sql`
    SELECT
      u.id,
      u.email,
      u.first_name AS "firstName",
      u.last_name AS "lastName"
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token = ${token} AND s.expires_at >= ${now}
    LIMIT 1
  `;
  const row = rows[0] as
    | {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
      }
    | undefined;
  if (!row) return null;
  return {
    id: Number(row.id),
    email: row.email,
    firstName: row.firstName ?? "",
    lastName: row.lastName ?? "",
  };
}
