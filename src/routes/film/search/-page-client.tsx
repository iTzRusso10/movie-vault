import { getMovieBySearch } from "@/api/movie/search-movie";
import { MovieCard } from "@/components/movie-card";
import { useHideMobileKeyboard } from "@/hook/useHideMobileKeyboard";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/skeleton";

export default function SearchPageClient({ query }: { query: string }) {
  useHideMobileKeyboard();

  const { data, isLoading } = useQuery({
    queryKey: ["movies", query],
    queryFn: () => (query ? getMovieBySearch(query) : null),
    enabled: !!query,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      {query ? (
        <p className="mb-8 font-sans text-sm text-mv-cream-muted">
          Risultati per{" "}
          <span className="font-semibold text-mv-gold-bright">«{query}»</span>
        </p>
      ) : null}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6 lg:gap-6">
        {isLoading ? (
          Array.from({ length: 18 }).map((_, i) => (
            <Skeleton.Text
              key={i}
              className="aspect-[2/3] min-h-[220px] rounded-xl bg-mv-panel ring-1 ring-mv-gold/10"
            />
          ))
        ) : data?.results.length ? (
          data.results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <div className="col-span-full rounded-2xl border border-mv-gold/10 bg-mv-panel/40 px-6 py-12 text-center font-sans text-mv-cream-muted">
            {query
              ? "Nessun risultato per questa ricerca."
              : "Inserisci un termine nella barra di ricerca."}
          </div>
        )}
      </div>
    </div>
  );
}
