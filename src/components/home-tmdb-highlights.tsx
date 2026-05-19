import { getHomeMoviesMerged } from "@/api/home-feed";
import { useQuery } from "@tanstack/react-query";
import { MoviesCarousel } from "./movie-carousel";
import { SectionContainer } from "./movie-per-genre-section";

const STALE_MS = 1000 * 60 * 10;

export function HomeTmdbHighlights({ heroMovieId }: { heroMovieId: number }) {
  const { data: movies, isLoading: moviesLoading } = useQuery({
    queryKey: ["home-movies-merged"],
    queryFn: getHomeMoviesMerged,
    staleTime: STALE_MS,
  });

  const carouselMovies = movies?.filter((m) => m.id !== heroMovieId) ?? [];

  return (
    <section className="relative flex flex-col gap-16 pb-4 pt-6 md:gap-20 md:pb-8 md:pt-10">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(90%,48rem)] -translate-x-1/2"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(192,132,252,0.35), transparent)",
        }}
        aria-hidden
      />
      <SectionContainer>
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex w-fit items-center rounded-full border border-mv-gold/16 bg-mv-gold/6 px-2.5 py-0.5 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.3em] text-mv-gold/72 backdrop-blur-sm">
              TMDB
            </span>
            <h2 className="mt-1.5 font-display text-3xl font-semibold tracking-tight text-mv-cream md:text-4xl">
              Film in evidenza
            </h2>
            <p className="mt-1 max-w-xl font-sans text-sm text-mv-cream-muted">
              Al cinema in Italia, popolari e più votati — in ordine misto,
              senza ripetizioni.
            </p>
          </div>
        </div>
        {moviesLoading ? (
          <div className="flex gap-3 overflow-hidden py-2" aria-busy>
            {Array.from({ length: 6 }).map((_, j) => (
              <div
                key={j}
                className="mv-shimmer aspect-[2/3] w-[28%] shrink-0 rounded-2xl bg-mv-panel ring-1 ring-white/5 sm:w-[22%] md:w-[18%]"
              />
            ))}
          </div>
        ) : carouselMovies.length > 0 ? (
          <MoviesCarousel movies={carouselMovies} />
        ) : (
          <p className="font-sans text-sm text-mv-cream-muted">
            Nessun film da mostrare.
          </p>
        )}
      </SectionContainer>
    </section>
  );
}
