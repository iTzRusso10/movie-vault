import {
  getMovieByFilters,
  type GenreDiscoverSort,
} from "@/api/movie/movie-per-genres";
import { Hero } from "@/components/hero";
import {
  dehydrate,
  HydrationBoundary,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import MovieList from "./-components/movie-list";

function parseYear(search: Record<string, unknown>): number | undefined {
  const raw = search.year;
  if (raw === undefined || raw === "" || raw === null) return undefined;
  const n = typeof raw === "number" ? raw : Number.parseInt(String(raw), 10);
  return Number.isFinite(n) ? n : undefined;
}

function parseSortRated(search: Record<string, unknown>): boolean {
  return search.sort === "rated";
}

export const Route = createFileRoute("/film/genres/$genres_and_id")({
  validateSearch: (search: Record<string, unknown>) => ({
    year: parseYear(search),
    sort: parseSortRated(search) ? ("rated" as const) : undefined,
  }),
  loaderDeps: ({ search: { year, sort } }) => ({ year, sort }),
  loader: async ({ params, deps }) => {
    const genres_and_id = params.genres_and_id;
    const genreId = +genres_and_id.split("-")[0];
    const genreLabelRaw = genres_and_id.split("-")[1];
    const genreLabel = (
      genreLabelRaw.charAt(0).toUpperCase() +
      genreLabelRaw.slice(1).toLowerCase()
    ).replace("%20", " ");

    const sortMode: GenreDiscoverSort =
      deps.sort === "rated" ? "rated" : "popularity";

    const data = await getMovieByFilters(genreId, 1, {
      year: deps.year,
      sort: sortMode,
    });

    return {
      data,
      genreLabel,
      genreId,
      year: deps.year,
      sort: sortMode,
    };
  },
  component: MoviePerGenresPage,
});

function MoviePerGenresPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = Route.useParams();
  const { data, genreLabel, genreId, year, sort } = Route.useLoaderData();
  const { year: searchYear, sort: searchSort } = Route.useSearch();

  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: current - 1949 }, (_, i) => current - i);
  }, []);

  const heroMovie = data.results[0];

  const goSearch = (next: { year?: number; sort?: "rated" }) => {
    navigate({
      to: "/film/genres/$genres_and_id",
      params,
      search: {
        year: next.year,
        sort: next.sort,
      },
    });
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div
        className={`flex flex-col ${!heroMovie ? "pt-4 md:pt-6" : ""}`}
      >
        {heroMovie ? <Hero movie={heroMovie} /> : null}
        <div className="flex flex-col gap-6 px-4 pb-16 pt-8 md:px-10">
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-mv-gold/70">
                Genere
              </p>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-mv-cream md:text-5xl">
                {genreLabel}
              </h1>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
              <label className="flex w-full flex-col gap-2 font-sans text-xs font-medium uppercase tracking-wider text-mv-cream-muted sm:w-auto sm:min-w-[200px]">
                Anno
                <select
                  className="rounded-xl border border-mv-gold/25 bg-mv-panel/90 px-4 py-3 font-sans text-sm font-normal normal-case tracking-normal text-mv-cream outline-none transition-all focus:border-mv-gold/50 focus:shadow-[0_0_0_3px_rgba(212,165,116,0.1)]"
                  value={searchYear ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    goSearch({
                      year: v === "" ? undefined : Number(v),
                      sort: searchSort,
                    });
                  }}
                >
                  <option value="">Tutti gli anni</option>
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex w-full flex-col gap-2 font-sans text-xs font-medium uppercase tracking-wider text-mv-cream-muted sm:w-auto sm:min-w-[220px]">
                Ordine
                <select
                  className="rounded-xl border border-mv-gold/25 bg-mv-panel/90 px-4 py-3 font-sans text-sm font-normal normal-case tracking-normal text-mv-cream outline-none transition-all focus:border-mv-gold/50 focus:shadow-[0_0_0_3px_rgba(212,165,116,0.1)]"
                  value={searchSort === "rated" ? "rated" : ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    goSearch({
                      year: searchYear,
                      sort: v === "rated" ? "rated" : undefined,
                    });
                  }}
                >
                  <option value="">Popolarità (TMDB)</option>
                  <option value="rated">Più apprezzati</option>
                </select>
              </label>
            </div>
            {sort === "rated" ? (
              <p className="max-w-xl font-sans text-xs leading-relaxed text-mv-cream-muted">
                Ordinati per voto medio su TMDB, solo film con almeno 250
                voti (così non compaiono titoli oscuri con 10/10).
              </p>
            ) : null}
          </div>
          {!heroMovie && (
            <p className="font-sans text-sm text-mv-cream-muted">
              Nessun film trovato per questo genere
              {year !== undefined ? ` nell'anno ${year}` : ""}
              {sort === "rated" ? " con questi criteri" : ""}.
            </p>
          )}
          <MovieList genre_id={genreId} year={year} sort={sort} />
        </div>
      </div>
    </HydrationBoundary>
  );
}
