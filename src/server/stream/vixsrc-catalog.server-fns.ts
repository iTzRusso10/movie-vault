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
 * `inItalian === true` se il film è nel catalogo VixSRC con `lang=it`.
 * Se false o null, l’UI usa `lang` di fallback (es. EN) e il bottone “in lingua originale”.
 */
export const vixsrcMovieInCatalogFn = createServerFn({ method: "POST" })
  .inputValidator(movieIdSchema)
  .handler(async (ctx) => {
    const { data } = ctx as { data: z.infer<typeof movieIdSchema> };
    try {
      const ids = await getVixsrcMovieIdSet();
      return { inItalian: ids.has(data.movieId) } as const;
    } catch {
      return { inItalian: null } as const;
    }
  });

/**
 * Restituisce TUTTI gli ID TMDB film presenti nel catalogo VixSRC italiano.
 * Il set è cachato server-side (15 min TTL); il client dovrebbe cacharlo a lungo.
 */
export const vixsrcAllMovieIdsFn = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const ids = await getVixsrcMovieIdSet();
      return { ids: [...ids] } as const;
    } catch {
      return { ids: null } as const;
    }
  },
);

/* ——— Serie TV (catalogo show) ——— */

const tvIdSchema = z.object({
  tvId: z.number().int().positive(),
});

let catalogTvCache: CatalogCache | null = null;

async function getVixsrcTvIdSet(): Promise<Set<number>> {
  const now = Date.now();
  if (catalogTvCache && now - catalogTvCache.fetchedAt < CATALOG_TTL_MS) {
    return catalogTvCache.ids;
  }

  const ctrl = new AbortController();
  const timeoutId = setTimeout(() => ctrl.abort(), 60_000);
  let res: Response;
  try {
    res = await fetch(vixsrcListUrl("tv", VIXSRC_PREFERRED_LANG), {
      redirect: "follow",
      headers: {
        Accept: "application/json",
        "User-Agent": "MovieVault/1.0 (vixsrc tv catalog)",
      },
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    throw new Error(`vixsrc tv list ${res.status}`);
  }

  const rows = (await res.json()) as unknown;
  if (!Array.isArray(rows)) {
    throw new Error("vixsrc tv list: risposta non è un array");
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

  catalogTvCache = { ids, fetchedAt: now };
  return ids;
}

export const vixsrcTvInCatalogFn = createServerFn({ method: "POST" })
  .inputValidator(tvIdSchema)
  .handler(async (ctx) => {
    const { data } = ctx as { data: z.infer<typeof tvIdSchema> };
    try {
      const ids = await getVixsrcTvIdSet();
      return { inCatalog: ids.has(data.tvId) } as const;
    } catch {
      return { inCatalog: null } as const;
    }
  });

/**
 * Restituisce TUTTI gli ID TMDB serie presenti nel catalogo VixSRC italiano.
 */
export const vixsrcAllTvIdsFn = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const ids = await getVixsrcTvIdSet();
      return { ids: [...ids] } as const;
    } catch {
      return { ids: null } as const;
    }
  },
);

/* ——— Episodi (indice per show|stagione) ——— */

type EpisodeIndexCache = {
  byShowSeason: Map<string, Set<number>>;
  fetchedAt: number;
};

let episodeIndexCache: EpisodeIndexCache | null = null;

async function getVixsrcEpisodeIndex(): Promise<Map<string, Set<number>>> {
  const now = Date.now();
  if (
    episodeIndexCache &&
    now - episodeIndexCache.fetchedAt < CATALOG_TTL_MS
  ) {
    return episodeIndexCache.byShowSeason;
  }

  const ctrl = new AbortController();
  const timeoutId = setTimeout(() => ctrl.abort(), 120_000);
  let res: Response;
  try {
    res = await fetch(vixsrcListUrl("episode", VIXSRC_PREFERRED_LANG), {
      redirect: "follow",
      headers: {
        Accept: "application/json",
        "User-Agent": "MovieVault/1.0 (vixsrc episode catalog)",
      },
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    throw new Error(`vixsrc episode list ${res.status}`);
  }

  const rows = (await res.json()) as unknown;
  if (!Array.isArray(rows)) {
    throw new Error("vixsrc episode list: risposta non è un array");
  }

  const byShowSeason = new Map<string, Set<number>>();
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const r = row as { tmdb_id?: unknown; s?: unknown; e?: unknown };
    if (
      typeof r.tmdb_id === "number" &&
      typeof r.s === "number" &&
      typeof r.e === "number"
    ) {
      const k = `${r.tmdb_id}|${r.s}`;
      if (!byShowSeason.has(k)) {
        byShowSeason.set(k, new Set());
      }
      byShowSeason.get(k)!.add(r.e);
    }
  }

  episodeIndexCache = { byShowSeason, fetchedAt: now };
  return byShowSeason;
}

const tvSeasonSchema = z.object({
  tvId: z.number().int().positive(),
  season: z.number().int().min(0),
});

/** Numeri episodio presenti su VixSRC per TMDB show + stagione. */
export const vixsrcSeasonEpisodesInCatalogFn = createServerFn({
  method: "POST",
})
  .inputValidator(tvSeasonSchema)
  .handler(async (ctx) => {
    const { data } = ctx as { data: z.infer<typeof tvSeasonSchema> };
    try {
      const idx = await getVixsrcEpisodeIndex();
      const set = idx.get(`${data.tvId}|${data.season}`) ?? new Set<number>();
      return {
        episodes: [...set].sort((a, b) => a - b),
      } as const;
    } catch {
      return { episodes: null } as const;
    }
  });
