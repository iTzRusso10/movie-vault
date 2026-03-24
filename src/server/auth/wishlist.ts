import { ensureAuthSchema, getSql } from "./db";

export type WishlistItemRow = {
  movieId: number;
  title: string;
  posterPath: string | null;
  createdAt: string;
};

function formatCreatedAt(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return String(value);
}

export async function listWishlistForUser(
  userId: number
): Promise<WishlistItemRow[]> {
  await ensureAuthSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT
      movie_id AS "movieId",
      title,
      poster_path AS "posterPath",
      created_at AS "createdAt"
    FROM wishlist
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
  return rows.map((r) => {
    const row = r as {
      movieId: number;
      title: string;
      posterPath: string | null;
      createdAt: Date | string;
    };
    return {
      movieId: Number(row.movieId),
      title: row.title,
      posterPath: row.posterPath,
      createdAt: formatCreatedAt(row.createdAt),
    };
  });
}

export async function upsertWishlistItem(
  userId: number,
  movieId: number,
  title: string,
  posterPath: string | null
): Promise<void> {
  await ensureAuthSchema();
  const sql = getSql();
  await sql`
    INSERT INTO wishlist (user_id, movie_id, title, poster_path)
    VALUES (${userId}, ${movieId}, ${title}, ${posterPath})
    ON CONFLICT (user_id, movie_id) DO UPDATE SET
      title = EXCLUDED.title,
      poster_path = EXCLUDED.poster_path
  `;
}

export async function removeWishlistItem(
  userId: number,
  movieId: number
): Promise<boolean> {
  await ensureAuthSchema();
  const sql = getSql();
  const result = await sql`
    DELETE FROM wishlist WHERE user_id = ${userId} AND movie_id = ${movieId}
  `;
  return result.count > 0;
}
