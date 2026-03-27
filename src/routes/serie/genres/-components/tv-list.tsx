import { useInfiniteTVByGenreQuery } from "@/api/tv/use-tv-query";
import type { TVDiscoverSort } from "@/api/tv/tv-per-genres";
import type { TV } from "@/types/tv";
import { TvCard } from "@/components/tv-card";
import { Skeleton } from "@/components/skeleton";
import { useIntersectionObserver } from "crustack/hooks";
import type { InfiniteData } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef } from "react";

type DiscoverPage = {
  results: TV[];
  page: number;
  total_pages: number;
};

const IO_ROOT_MARGIN = "0px 0px 1600px 0px";
const PLAIN_BURST_TMDB_PAGES = 6;
const ITALIAN_BURST_TARGET = 20;
const ITALIAN_BURST_MAX_TMDB_PAGES = 12;
const SCROLL_PREFETCH_PX = 1800;

function countItalianMatches(
  data: InfiniteData<DiscoverPage> | undefined,
  heroId: number | undefined,
  italianIds: Set<number>,
): number {
  if (!data?.pages?.length) return 0;
  const seen = new Set<number>();
  let n = 0;
  for (const p of data.pages) {
    for (const s of p.results) {
      if (s.id === heroId || seen.has(s.id)) continue;
      seen.add(s.id);
      if (italianIds.has(s.id)) n++;
    }
  }
  return n;
}

function sentinelIsNearBottom(el: HTMLElement | null): boolean {
  if (!el) return false;
  return el.getBoundingClientRect().top <= window.innerHeight + SCROLL_PREFETCH_PX;
}

export default function TvList({
  genre_id,
  yearMin,
  yearMax,
  sort = "popularity",
  italianIds,
  heroId,
}: {
  genre_id: number;
  yearMin?: number;
  yearMax?: number;
  sort?: TVDiscoverSort;
  italianIds?: Set<number> | null;
  heroId?: number;
}) {
  const { data, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } =
    useInfiniteTVByGenreQuery({
      genreId: genre_id,
      yearMin,
      yearMax,
      sort,
    });

  const isIntersectingRef = useRef(false);
  const burstLockRef = useRef(false);
  const uniqueRef = useRef(new Map<number, TV>());
  const prevPagesLenRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const queryResetKey = `${genre_id}|${yearMin ?? ""}|${yearMax ?? ""}|${sort}|${heroId ?? ""}`;
  useEffect(() => {
    uniqueRef.current.clear();
    prevPagesLenRef.current = 0;
  }, [queryResetKey]);

  const runLoadWave = useCallback(async () => {
    if (burstLockRef.current || !hasNextPage) return;
    burstLockRef.current = true;
    try {
      if (!italianIds) {
        let result = await fetchNextPage();
        let tmdbFetches = 1;
        while (
          result.hasNextPage &&
          tmdbFetches < PLAIN_BURST_TMDB_PAGES
        ) {
          result = await fetchNextPage();
          tmdbFetches++;
        }
        return;
      }
      let result = await fetchNextPage();
      let tmdbFetches = 1;
      while (
        result.hasNextPage &&
        tmdbFetches < ITALIAN_BURST_MAX_TMDB_PAGES &&
        countItalianMatches(result.data, heroId, italianIds) <
          ITALIAN_BURST_TARGET
      ) {
        result = await fetchNextPage();
        tmdbFetches++;
      }
    } finally {
      burstLockRef.current = false;
    }
  }, [italianIds, hasNextPage, fetchNextPage, heroId]);

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
    if (!isIntersectingRef.current || !hasNextPage || isFetchingNextPage) return;
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

  const shows = useMemo(() => {
    const pages = data?.pages ?? [];
    const map = uniqueRef.current;
    if (pages.length < prevPagesLenRef.current) {
      map.clear();
      prevPagesLenRef.current = 0;
    }
    for (let i = prevPagesLenRef.current; i < pages.length; i++) {
      for (const tv of pages[i].results) {
        if (tv.id !== heroId) map.set(tv.id, tv);
      }
    }
    prevPagesLenRef.current = pages.length;
    const all = [...map.values()];
    return italianIds ? all.filter((s) => italianIds.has(s.id)) : all;
  }, [data?.pages, heroId, italianIds]);

  const endOfList = !hasNextPage && !isLoading;
  const stillSearching = !!italianIds && (hasNextPage || isFetchingNextPage);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {italianIds && !isLoading ? (
        <p className="w-full font-sans text-xs tabular-nums text-mv-cream-muted">
          <span className="font-semibold text-mv-gold-bright">{shows.length}</span>
          {" serie con italiano disponibili"}
          {stillSearching ? (
            <span className="ml-1 animate-pulse text-mv-gold/50">
              (ricerca in corso…)
            </span>
          ) : null}
        </p>
      ) : null}
      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {shows.map((tv) => (
          <TvCard key={tv.id} tv={tv} />
        ))}
        {isLoading &&
          Array.from({ length: 20 }).map((_, i) => (
            <Skeleton.Text
              key={i}
              className="aspect-[2/3] min-h-[400px] rounded-xl bg-mv-panel ring-1 ring-mv-gold/10"
            />
          ))}
      </div>

      {endOfList && shows.length === 0 && italianIds ? (
        <p className="font-sans text-sm text-mv-cream-muted">
          Nessuna serie con italiano disponibile nello stream per questo genere.
        </p>
      ) : null}

      {endOfList && shows.length > 0 ? (
        <p className="py-4 font-sans text-[0.6rem] uppercase tracking-wider text-mv-cream-muted/40">
          Fine della lista
        </p>
      ) : null}

      <div ref={setSentinel} className="h-4 w-full shrink-0" aria-hidden />
    </div>
  );
}
