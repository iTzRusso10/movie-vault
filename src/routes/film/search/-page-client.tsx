import { getMovieBySearch } from "@/api/movie/search-movie";
import { getTVBySearch } from "@/api/tv/search-tv";
import { MovieCard } from "@/components/movie-card";
import { TvCard } from "@/components/tv-card";
import { useHideMobileKeyboard } from "@/hook/useHideMobileKeyboard";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/skeleton";

export default function SearchPageClient({ query }: { query: string }) {
  useHideMobileKeyboard();

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
          className="aspect-[2/3] min-h-[220px] rounded-xl bg-mv-panel ring-1 ring-mv-gold/10"
        />
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      {query ? (
        <p className="mb-8 font-sans text-sm text-mv-cream-muted">
          Risultati per{" "}
          <span className="font-semibold text-mv-gold-bright">«{query}»</span>
          {" — "}
          <span className="text-mv-cream-muted/90">film e serie TV</span>
        </p>
      ) : (
        <p className="mb-8 font-sans text-sm text-mv-cream-muted">
          Inserisci un termine nella barra di ricerca.
        </p>
      )}

      {!query ? null : (
        <div className="flex flex-col gap-12 md:gap-14">
          <section aria-labelledby="search-film-heading">
            <h2
              id="search-film-heading"
              className="mb-5 font-display text-2xl font-semibold tracking-tight text-mv-cream md:text-3xl"
            >
              Film
            </h2>
            {movieLoading ? (
              skeletonGrid
            ) : movies.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6 lg:gap-6">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-mv-gold/10 bg-mv-panel/40 px-6 py-8 text-center font-sans text-sm text-mv-cream-muted">
                Nessun film corrispondente.
              </p>
            )}
          </section>

          <section aria-labelledby="search-tv-heading">
            <h2
              id="search-tv-heading"
              className="mb-5 font-display text-2xl font-semibold tracking-tight text-mv-cream md:text-3xl"
            >
              Serie TV
            </h2>
            {tvLoading ? (
              skeletonGrid
            ) : shows.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6 lg:gap-6">
                {shows.map((tv) => (
                  <TvCard key={tv.id} tv={tv} />
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-mv-gold/10 bg-mv-panel/40 px-6 py-8 text-center font-sans text-sm text-mv-cream-muted">
                Nessuna serie TV corrispondente.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
