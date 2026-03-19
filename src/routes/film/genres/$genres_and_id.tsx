import { getMovieByFilters } from "@/api/movie/movie-per-genres";
import { Hero } from "@/components/hero";
import {
  dehydrate,
  HydrationBoundary,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import MovieList from "./-components/movie-list";

export const Route = createFileRoute("/film/genres/$genres_and_id")({
  validateSearch: (search: Record<string, unknown>) => {
    const raw = search.year;
    if (raw === undefined || raw === "" || raw === null) {
      return { year: undefined as number | undefined };
    }
    const n =
      typeof raw === "number" ? raw : Number.parseInt(String(raw), 10);
    return {
      year: Number.isFinite(n) ? n : undefined,
    };
  },
  loaderDeps: ({ search: { year } }) => ({ year }),
  loader: async ({ params, deps }) => {
    const genres_and_id = params.genres_and_id;
    const genreId = +genres_and_id.split("-")[0];
    const genreLabelRaw = genres_and_id.split("-")[1];
    const genreLabel = (
      genreLabelRaw.charAt(0).toUpperCase() +
      genreLabelRaw.slice(1).toLowerCase()
    ).replace("%20", " ");

    const data = await getMovieByFilters(genreId, 1, deps.year);

    return { data, genreLabel, genreId, year: deps.year };
  },
  component: MoviePerGenresPage,
});

function MoviePerGenresPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = Route.useParams();
  const { data, genreLabel, genreId, year } = Route.useLoaderData();
  const { year: searchYear } = Route.useSearch();

  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: current - 1949 }, (_, i) => current - i);
  }, []);

  const heroMovie = data.results[0];

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div
        className={`flex flex-col ${!heroMovie ? "pt-28 md:pt-32" : ""}`}
      >
        {heroMovie ? <Hero movie={heroMovie} /> : null}
        <div className="flex flex-col gap-6 px-4 pb-16 pt-8 md:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-mv-gold/70">
                Genere
              </p>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-mv-cream md:text-5xl">
                {genreLabel}
              </h1>
            </div>
            <label className="flex w-full flex-col gap-2 font-sans text-xs font-medium uppercase tracking-wider text-mv-cream-muted sm:w-auto sm:min-w-[220px]">
              Anno
              <select
                className="rounded-xl border border-mv-gold/25 bg-mv-panel/90 px-4 py-3 font-sans text-sm font-normal normal-case tracking-normal text-mv-cream outline-none transition-all focus:border-mv-gold/50 focus:shadow-[0_0_0_3px_rgba(212,165,116,0.1)]"
                value={searchYear ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  navigate({
                    to: "/film/genres/$genres_and_id",
                    params,
                    search: {
                      year: v === "" ? undefined : Number(v),
                    },
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
          </div>
          {!heroMovie && (
            <p className="font-sans text-sm text-mv-cream-muted">
              Nessun film trovato per questo genere
              {year !== undefined ? ` nell'anno ${year}` : ""}.
            </p>
          )}
          <MovieList genre_id={genreId} year={year} />
        </div>
      </div>
    </HydrationBoundary>
  );
}
