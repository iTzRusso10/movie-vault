import bcrypt from "bcryptjs";
import { ensureAuthSchema, getSql } from "./db";

const BCRYPT_ROUNDS = 10;

export function hashPassword(plain: string): string {
  return bcrypt.hashSync(plain, BCRYPT_ROUNDS);
}

export function verifyPassword(plain: string, hash: string): boolean {
  return bcrypt.compareSync(plain, hash);
}

export async function createUser(
  email: string,
  passwordHash: string,
  firstName: string,
  lastName: string
): Promise<number> {
  await ensureAuthSchema();
  const sql = getSql();
  const normalized = email.toLowerCase().trim();
  const rows = await sql`
    INSERT INTO users (email, password_hash, first_name, last_name)
    VALUES (${normalized}, ${passwordHash}, ${firstName.trim()}, ${lastName.trim()})
    RETURNING id
  `;
  const row = rows[0] as { id: number } | undefined;
  if (row?.id == null) throw new Error("Impossibile creare l'utente.");
  return Number(row.id);
}

export async function updateUserNames(
  userId: number,
  firstName: string,
  lastName: string
): Promise<void> {
  await ensureAuthSchema();
  const sql = getSql();
  await sql`
    UPDATE users
    SET first_name = ${firstName.trim()}, last_name = ${lastName.trim()}
    WHERE id = ${userId}
  `;
}

export async function findUserWithHashByEmail(
  email: string
): Promise<{
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
} | null> {
  await ensureAuthSchema();
  const sql = getSql();
  const normalized = email.toLowerCase().trim();
  const rows = await sql`
    SELECT id, email, password_hash, first_name, last_name
    FROM users
    WHERE email = ${normalized}
    LIMIT 1
  `;
  return (rows[0] as
    | {
        id: number;
        email: string;
        password_hash: string;
        first_name: string;
        last_name: string;
      }
    | undefined) ?? null;
}
