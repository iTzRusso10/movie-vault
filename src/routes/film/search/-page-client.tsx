import { getMovieBySearch } from "@/api/movie/search-movie";
import { getTVBySearch } from "@/api/tv/search-tv";
import { MovieCard } from "@/components/movie-card";
import { TvCard } from "@/components/tv-card";
import { useHideMobileKeyboard } from "@/hook/useHideMobileKeyboard";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/skeleton";
import { useState } from "react";

type SearchTab = "film" | "tv";

export default function SearchPageClient({ query }: { query: string }) {
  useHideMobileKeyboard();
  const [tab, setTab] = useState<SearchTab>("film");

  const movieQ = useQuery({
    queryKey: ["search-movies", query],
    queryFn: () => (query ? getMovieBySearch(query) : null),
    enabled: !!query,
    staleTime: 1000 * 60 * 5,
  });

  const tvQ = useQuery({
    queryKey: ["search-tv", query],
    queryFn: () => (query ? getTVBySearch(query) : null),
    enabled: !!query,
    staleTime: 1000 * 60 * 5,
  });

  const movieLoading = movieQ.isLoading;
  const tvLoading = tvQ.isLoading;
  const movies = movieQ.data?.results ?? [];
  const shows = tvQ.data?.results ?? [];

  const skeletonGrid = (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6 lg:gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton.Text
          key={i}
          className="aspect-2/3 min-h-[220px] rounded-xl bg-mv-panel ring-1 ring-mv-gold/10"
        />
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      {query ? (
        <p className="mb-6 font-sans text-sm text-mv-cream-muted">
          Risultati per{" "}
          <span className="font-semibold text-mv-gold-bright">«{query}»</span>
        </p>
      ) : (
        <p className="mb-6 font-sans text-sm text-mv-cream-muted">
          Inserisci un termine nella barra di ricerca.
        </p>
      )}

      {!query ? null : (
        <div className="flex flex-col gap-6">
          <div
            role="tablist"
            aria-label="Tipo di contenuto"
            className="flex w-full gap-1 rounded-xl border border-mv-gold/20 bg-mv-panel/40 p-1 sm:inline-flex sm:w-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={tab === "film"}
              id="search-tab-film"
              onClick={() => setTab("film")}
              className={`min-w-0 flex-1 rounded-lg px-4 py-2.5 font-sans text-sm font-semibold transition-colors sm:flex-initial sm:min-w-[140px] ${
                tab === "film"
                  ? "bg-mv-gold/15 text-mv-gold-bright ring-1 ring-mv-gold/35"
                  : "text-mv-cream-muted hover:text-mv-cream"
              }`}
            >
              Film
              {!movieLoading && movieQ.data ? (
                <span className="ml-1.5 tabular-nums opacity-80">
                  ({movies.length})
                </span>
              ) : null}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "tv"}
              id="search-tab-tv"
              onClick={() => setTab("tv")}
              className={`min-w-0 flex-1 rounded-lg px-4 py-2.5 font-sans text-sm font-semibold transition-colors sm:flex-initial sm:min-w-[140px] ${
                tab === "tv"
                  ? "bg-mv-gold/15 text-mv-gold-bright ring-1 ring-mv-gold/35"
                  : "text-mv-cream-muted hover:text-mv-cream"
              }`}
            >
              Serie TV
              {!tvLoading && tvQ.data ? (
                <span className="ml-1.5 tabular-nums opacity-80">
                  ({shows.length})
                </span>
              ) : null}
            </button>
          </div>

          <div
            role="tabpanel"
            aria-labelledby={tab === "film" ? "search-tab-film" : "search-tab-tv"}
          >
            {tab === "film" ? (
              movieLoading ? (
                skeletonGrid
              ) : movies.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6 lg:gap-6">
                  {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl border border-mv-gold/10 bg-mv-panel/40 px-6 py-10 text-center font-sans text-sm text-mv-cream-muted">
                  Nessun film corrispondente.
                </p>
              )
            ) : tvLoading ? (
              skeletonGrid
            ) : shows.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6 lg:gap-6">
                {shows.map((tv) => (
                  <TvCard key={tv.id} tv={tv} />
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-mv-gold/10 bg-mv-panel/40 px-6 py-10 text-center font-sans text-sm text-mv-cream-muted">
                Nessuna serie TV corrispondente.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
