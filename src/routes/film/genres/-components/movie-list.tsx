import { useInfiniteMovieByGenreQuery } from "@/api/movie/use-movie-query";
import type { GenreDiscoverSort } from "@/api/movie/movie-per-genres";
import type { Movie } from "@/types/movie";
import { MovieCard } from "@/components/movie-card";
import { Skeleton } from "@/components/skeleton";
import { VirtualGrid } from "@/components/virtual-grid";
import { useIntersectionObserver } from "crustack/hooks";
import { useCallback, useEffect, useMemo, useRef } from "react";

/** Estende la zona “in vista” verso il basso così il caricamento parte prima del bordo fine pagina. */
/** Valore fisso: `min()` in rootMargin non è supportato ovunque. */
const IO_ROOT_MARGIN = "0px 0px 1600px 0px";

/** Senza filtro ITA: quante pagine TMDB scaricare per ondata (evita 1 pagina / scroll). */
const PLAIN_BURST_TMDB_PAGES = 6;

/** Con filtro ITA: chiamate al server per ondata (ognuna porta ≥20 titoli). */
const ITALIAN_BURST_REQUESTS = 2;

/** Pixel oltre il basso viewport: se il sentinel è qui sotto, consideriamo “vicino al fondo”. */
const SCROLL_PREFETCH_PX = 1800;

function sentinelIsNearBottom(el: HTMLElement | null): boolean {
  if (!el) return false;
  return (
    el.getBoundingClientRect().top <= window.innerHeight + SCROLL_PREFETCH_PX
  );
}

export default function MovieList({
  genre_id,
  yearMin,
  yearMax,
  sort = "popularity",
  italianOnly = false,
  heroId,
}: {
  genre_id: number;
  yearMin?: number;
  yearMax?: number;
  sort?: GenreDiscoverSort;
  italianOnly?: boolean;
  heroId?: number;
}) {
  const { data, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } =
    useInfiniteMovieByGenreQuery({
      genreId: genre_id,
      yearMin,
      yearMax,
      sort,
      italianOnly,
    });

  const isIntersectingRef = useRef(false);
  const burstLockRef = useRef(false);
  const uniqueRef = useRef(new Map<number, Movie>());
  const prevPagesLenRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const queryResetKey = `${genre_id}|${yearMin ?? ""}|${yearMax ?? ""}|${sort}|${heroId ?? ""}|${italianOnly}`;
  const resetKeyRef = useRef(queryResetKey);

  const runLoadWave = useCallback(async () => {
    if (burstLockRef.current || !hasNextPage) return;
    burstLockRef.current = true;
    try {
      const burst = italianOnly
        ? ITALIAN_BURST_REQUESTS
        : PLAIN_BURST_TMDB_PAGES;
      let result = await fetchNextPage();
      let fetches = 1;
      while (result.hasNextPage && fetches < burst) {
        result = await fetchNextPage();
        fetches++;
      }
    } finally {
      burstLockRef.current = false;
    }
  }, [italianOnly, hasNextPage, fetchNextPage]);

  const runLoadWaveRef = useRef(runLoadWave);
  runLoadWaveRef.current = runLoadWave;

  const { ref: setIoTarget } = useIntersectionObserver(
    (entry) => {
      isIntersectingRef.current = entry.isIntersecting;
      if (!entry.isIntersecting || burstLockRef.current) return;
      void runLoadWaveRef.current();
    },
    { rootMargin: IO_ROOT_MARGIN },
  );

  const setSentinel = useCallback(
    (node: HTMLDivElement | null) => {
      sentinelRef.current = node;
      setIoTarget(node);
    },
    [setIoTarget],
  );

  const pageCount = data?.pages.length ?? 0;

  useEffect(() => {
    if (!isIntersectingRef.current || !hasNextPage || isFetchingNextPage)
      return;
    if (burstLockRef.current) return;
    void runLoadWave();
  }, [pageCount, hasNextPage, isFetchingNextPage, runLoadWave]);

  useEffect(() => {
    let raf = 0;
    const checkScrollPrefetch = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!hasNextPage || isFetchingNextPage || burstLockRef.current) return;
        if (!sentinelIsNearBottom(sentinelRef.current)) return;
        isIntersectingRef.current = true;
        void runLoadWaveRef.current();
      });
    };

    window.addEventListener("scroll", checkScrollPrefetch, { passive: true });
    window.addEventListener("resize", checkScrollPrefetch);
    checkScrollPrefetch();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", checkScrollPrefetch);
      window.removeEventListener("resize", checkScrollPrefetch);
    };
  }, [hasNextPage, isFetchingNextPage, pageCount]);

  const movies = useMemo(() => {
    const pages = data?.pages ?? [];
    const map = uniqueRef.current;
    if (
      resetKeyRef.current !== queryResetKey ||
      pages.length < prevPagesLenRef.current
    ) {
      map.clear();
      prevPagesLenRef.current = 0;
      resetKeyRef.current = queryResetKey;
    }
    for (let i = prevPagesLenRef.current; i < pages.length; i++) {
      for (const movie of pages[i].results) {
        if (movie.id !== heroId) map.set(movie.id, movie);
      }
    }
    prevPagesLenRef.current = pages.length;
    return [...map.values()];
  }, [data?.pages, heroId, queryResetKey]);

  const endOfList = !hasNextPage && !isLoading;
  const stillSearching = italianOnly && (hasNextPage || isFetchingNextPage);

  return (
    <div className="flex flex-col items-center gap-4">
      {italianOnly && !isLoading ? (
        <p className="w-full font-sans text-xs tabular-nums text-mv-cream-muted">
          <span className="font-semibold text-mv-gold-bright">
            {movies.length}
          </span>
          {" film con italiano disponibili"}
          {stillSearching ? (
            <span className="ml-1 animate-pulse text-mv-gold/50">
              (ricerca in corso…)
            </span>
          ) : null}
        </p>
      ) : null}
      <VirtualGrid
        items={movies}
        getKey={(movie) => movie.id}
        renderItem={(movie) => <MovieCard movie={movie} />}
      />
      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {isLoading &&
          Array.from({ length: 20 }).map((_, i) => (
            <Skeleton.Text
              key={i}
              className="aspect-[2/3] min-h-[400px] rounded-xl bg-mv-panel ring-1 ring-mv-gold/10"
            />
          ))}
      </div>

      {endOfList && movies.length === 0 && italianOnly ? (
        <p className="font-sans text-sm text-mv-cream-muted">
          Nessun film con italiano disponibile nello stream per questo genere.
        </p>
      ) : null}

      {endOfList && movies.length > 0 ? (
        <p className="py-4 font-sans text-[0.6rem] uppercase tracking-wider text-mv-cream-muted/40">
          Fine della lista
        </p>
      ) : null}

      <div ref={setSentinel} className="h-4 w-full shrink-0" aria-hidden />
    </div>
  );
}
