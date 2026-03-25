import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  vixsrcListUrl,
  VIXSRC_PREFERRED_LANG,
} from "@/routes/-const";

const movieIdSchema = z.object({
  movieId: z.number().int().positive(),
});

const listUrl = () => vixsrcListUrl("movie", VIXSRC_PREFERRED_LANG);

type CatalogCache = {
  ids: Set<number>;
  fetchedAt: number;
};

let catalogCache: CatalogCache | null = null;
const CATALOG_TTL_MS = 1000 * 60 * 15;

async function getVixsrcMovieIdSet(): Promise<Set<number>> {
  const now = Date.now();
  if (catalogCache && now - catalogCache.fetchedAt < CATALOG_TTL_MS) {
    return catalogCache.ids;
  }

  const ctrl = new AbortController();
  const timeoutId = setTimeout(() => ctrl.abort(), 60_000);
  let res: Response;
  try {
    res = await fetch(listUrl(), {
      redirect: "follow",
      headers: {
        Accept: "application/json",
        "User-Agent": "MovieVault/1.0 (catalog sync)",
      },
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    throw new Error(`vixsrc list ${res.status}`);
  }

  const rows = (await res.json()) as unknown;
  if (!Array.isArray(rows)) {
    throw new Error("vixsrc list: risposta non è un array");
  }

  const ids = new Set<number>();
  for (const row of rows) {
    if (
      row &&
      typeof row === "object" &&
      "tmdb_id" in row &&
      typeof (row as { tmdb_id: unknown }).tmdb_id === "number"
    ) {
      ids.add((row as { tmdb_id: number }).tmdb_id);
    }
  }

  catalogCache = { ids, fetchedAt: now };
  return ids;
}

/**
 * True se `movieId` è nel catalogo VixSRC per `lang` (allineato a StreamEmbed).
 */
export const vixsrcMovieInCatalogFn = createServerFn({ method: "POST" })
  .inputValidator(movieIdSchema)
  .handler(async (ctx) => {
    const { data } = ctx as { data: z.infer<typeof movieIdSchema> };
    try {
      const ids = await getVixsrcMovieIdSet();
      return { inCatalog: ids.has(data.movieId) } as const;
    } catch {
      return { inCatalog: null } as const;
    }
  });
