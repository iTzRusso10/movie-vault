import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { TMDB_MAX_PAGE } from "@/api/_upfetch";
import { getMovieByFilters } from "@/api/movie/movie-per-genres";
import { getTVByFilters } from "@/api/tv/tv-per-genres";
import type { Movie } from "@/types/movie";
import type { TV } from "@/types/tv";
import {
  getVixsrcMovieIdSet,
  getVixsrcTvIdSet,
} from "./vixsrc-catalog.server-fns";

/** Pagine TMDB scaricate in parallelo per ogni giro. */
const PAGES_PER_BATCH = 10;
/** Limite di giri per chiamata, così una richiesta non dura troppo. */
const MAX_BATCHES = 5;
/** Ci si ferma appena trovati almeno questi titoli con italiano. */
const MIN_RESULTS = 20;

const discoverSchema = z.object({
  genreId: z.number().int().positive(),
  page: z.number().int().min(1).max(TMDB_MAX_PAGE),
  yearMin: z.number().int().optional(),
  yearMax: z.number().int().optional(),
  sort: z.enum(["popularity", "rated"]),
});

type DiscoverInput = z.infer<typeof discoverSchema>;

/**
 * Stessa forma di una pagina `/discover`: `page` è l'ultima pagina TMDB
 * scansionata, così il client calcola la successiva come al solito.
 */
export type ItalianDiscoverPage<T> = {
  page: number;
  total_pages: number;
  results: T[];
};

/**
 * Scorre `/discover` a blocchi paralleli e tiene solo i titoli presenti nel
 * catalogo VixSRC italiano, invece di scaricare tutto sul client una pagina
 * alla volta.
 */
async function scanItalian<T extends { id: number }>(
  input: DiscoverInput,
  ids: Set<number>,
  fetchPage: (page: number) => Promise<{ total_pages: number; results: T[] }>,
): Promise<ItalianDiscoverPage<T>> {
  const results: T[] = [];
  let lastPage = input.page - 1;
  let totalPages = TMDB_MAX_PAGE;

  for (
    let batch = 0;
    batch < MAX_BATCHES && results.length < MIN_RESULTS && lastPage < totalPages;
    batch++
  ) {
    const from = lastPage + 1;
    const to = Math.min(lastPage + PAGES_PER_BATCH, totalPages);
    const pages = Array.from({ length: to - from + 1 }, (_, i) => from + i);
    const responses = await Promise.all(pages.map(fetchPage));
    for (const res of responses) {
      totalPages = Math.min(res.total_pages, TMDB_MAX_PAGE);
      for (const item of res.results) {
        if (ids.has(item.id)) results.push(item);
      }
    }
    lastPage = to;
  }

  return { page: lastPage, total_pages: totalPages, results };
}

export const italianMovieDiscoverFn = createServerFn({ method: "POST" })
  .inputValidator(discoverSchema)
  .handler(async (ctx): Promise<ItalianDiscoverPage<Movie>> => {
    const { data } = ctx as { data: DiscoverInput };
    const ids = await getVixsrcMovieIdSet();
    return scanItalian(data, ids, (page) =>
      getMovieByFilters(data.genreId, page, data),
    );
  });

export const italianTvDiscoverFn = createServerFn({ method: "POST" })
  .inputValidator(discoverSchema)
  .handler(async (ctx): Promise<ItalianDiscoverPage<TV>> => {
    const { data } = ctx as { data: DiscoverInput };
    const ids = await getVixsrcTvIdSet();
    return scanItalian(data, ids, (page) =>
      getTVByFilters(data.genreId, page, data),
    );
  });
