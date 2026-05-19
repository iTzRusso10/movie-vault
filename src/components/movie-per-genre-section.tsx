import { useInfiniteQuery } from "@tanstack/react-query";
import { getMovieByFilters } from "@/api/movie/movie-per-genres";
import { MoviesCarousel } from "./movie-carousel";
import { MOVIE_GENRES } from "../routes/-const";
import { Link } from "@tanstack/react-router";
import { Movie } from "@/types/movie";
import { useIntersectionObserver } from "crustack/hooks";

/** Generi caricati per ogni “pagina”: meno richieste parallele al primo paint. */
const GENRES_PAGE_SIZE = 4;

const GENRE_ROWS_STALE_MS = 1000 * 60 * 10;

type MoviesByGenre = {
  id: number;
  genreLabel: string;
  movies: Movie[];
};

export const MoviePerGenresSection = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["movies-by-genres-paged"],
    initialPageParam: 0,
    staleTime: GENRE_ROWS_STALE_MS,
    queryFn: async ({ pageParam }) => {
      const start = pageParam * GENRES_PAGE_SIZE;
      const slice = MOVIE_GENRES.slice(start, start + GENRES_PAGE_SIZE);
      const rows: MoviesByGenre[] = await Promise.all(
        slice.map(async (genre) => {
          const indexInAll = MOVIE_GENRES.findIndex((g) => g.id === genre.id);
          const sort = indexInAll % 2 === 0 ? "popularity" : "rated";
          const { results } = await getMovieByFilters(genre.id, 1, { sort });
          return {
            id: genre.id,
            genreLabel: genre.label,
            movies: results,
          };
        }),
      );
      return rows;
    },
    getNextPageParam: (_lastPage, allPages) => {
      const loaded = allPages.reduce((acc, page) => acc + page.length, 0);
      return loaded < MOVIE_GENRES.length ? allPages.length : undefined;
    },
  });

  const flatGenres = data?.pages.flat() ?? [];

  const { ref: sentinelRef } = useIntersectionObserver((entry) => {
    if (!entry.isIntersecting) return;
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  });

  return (
    <section className="relative flex flex-col gap-16 pb-12 pt-10 md:gap-20 md:pb-20 md:pt-14">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(90%,48rem)] -translate-x-1/2"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(192,132,252,0.35), transparent)",
        }}
        aria-hidden
      />
      {isLoading && (
        <div className="flex flex-col gap-12 px-4 md:px-10" aria-busy>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="mv-shimmer h-8 w-48 rounded-xl bg-mv-panel ring-1 ring-white/5" />
              <div className="flex gap-3 overflow-hidden">
                {Array.from({ length: 6 }).map((__, j) => (
                  <div
                    key={j}
                    className="mv-shimmer aspect-[2/3] w-[28%] shrink-0 rounded-2xl bg-mv-panel ring-1 ring-white/5 sm:w-[22%] md:w-[18%]"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {isError && (
        <p className="px-4 text-center font-sans text-sm text-mv-ember-glow md:px-10">
          Non siamo riusciti a caricare i generi. Ricarica la pagina.
        </p>
      )}
      {flatGenres.map((genre, index) => (
        <SectionContainer key={genre.id}>
          <div
            className="animate-mv-fade-up"
            style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
          >
            <div className="mb-6 flex items-end justify-between gap-4">
              <SectionTitle id={genre.id} title={genre.genreLabel} />
            </div>
            <MoviesCarousel movies={genre.movies} />
          </div>
        </SectionContainer>
      ))}
      {hasNextPage ? (
        <div ref={sentinelRef} className="flex min-h-16 justify-center py-6">
          {isFetchingNextPage ? (
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-mv-cream-muted animate-pulse-sm">
              Altri generi…
            </span>
          ) : null}
        </div>
      ) : flatGenres.length > 0 ? (
        <p className="pb-4 text-center font-sans text-xs text-mv-cream-muted/70">
          Hai visto tutti i generi.
        </p>
      ) : null}
    </section>
  );
};

export const SectionContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="flex flex-col px-4 md:px-10">{children}</div>;
};

export const SectionTitle = ({ title, id }: { title: string; id: number }) => {
  return (
    <Link
      to={`/film/genres/$genres_and_id`}
      params={{ genres_and_id: `${id}-${title.toLowerCase()}` }}
      search={{ yearMin: undefined, yearMax: undefined, sort: undefined }}
      className="group inline-flex flex-col gap-2 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-mv-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-mv-void"
    >
      <span className="inline-flex w-fit items-center rounded-full border border-mv-gold/18 bg-mv-gold/6 px-2.5 py-0.5 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.3em] text-mv-gold/75 backdrop-blur-sm transition-all duration-200 group-hover:border-mv-gold/35 group-hover:bg-mv-gold/12 group-hover:text-mv-gold-bright">
        Esplora
      </span>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-mv-cream md:text-4xl">
        {title}
        <span className="ml-2 inline-block text-mv-gold-bright transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2">
          →
        </span>
      </h2>
    </Link>
  );
};
