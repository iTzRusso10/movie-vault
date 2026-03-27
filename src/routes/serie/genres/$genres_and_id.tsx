import {
  getTVByFilters,
  type TVDiscoverSort,
} from "@/api/tv/tv-per-genres";
import { useItalianTvCatalog } from "@/api/use-italian-catalog";
import { Hero } from "@/components/hero";
import {
  dehydrate,
  HydrationBoundary,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import TvList from "./-components/tv-list";
import { TV_GENRES } from "@/routes/-const";

const RELEASE_YEAR_MIN = 1950;

function releaseYearMax(): number {
  return new Date().getFullYear();
}

function parseYear(search: Record<string, unknown>): number | undefined {
  const raw = search.year;
  if (raw === undefined || raw === "" || raw === null) return undefined;
  const n = typeof raw === "number" ? raw : Number.parseInt(String(raw), 10);
  return Number.isFinite(n) ? n : undefined;
}

function parseYearParam(
  search: Record<string, unknown>,
  key: string,
): number | undefined {
  const raw = search[key];
  if (raw === undefined || raw === "" || raw === null) return undefined;
  const n = typeof raw === "number" ? raw : Number.parseInt(String(raw), 10);
  return Number.isFinite(n) ? n : undefined;
}

function parseSortRated(search: Record<string, unknown>): boolean {
  return search.sort === "rated";
}

function clampYear(y: number): number {
  const max = releaseYearMax();
  return Math.min(max, Math.max(RELEASE_YEAR_MIN, y));
}

export const Route = createFileRoute("/serie/genres/$genres_and_id")({
  validateSearch: (search: Record<string, unknown>) => {
    let yearMin = parseYearParam(search, "yearMin");
    let yearMax = parseYearParam(search, "yearMax");
    const legacy = parseYear(search);
    if (
      legacy !== undefined &&
      yearMin === undefined &&
      yearMax === undefined
    ) {
      yearMin = legacy;
      yearMax = legacy;
    }
    if (yearMin !== undefined) yearMin = clampYear(yearMin);
    if (yearMax !== undefined) yearMax = clampYear(yearMax);
    if (
      yearMin !== undefined &&
      yearMax !== undefined &&
      yearMin > yearMax
    ) {
      [yearMin, yearMax] = [yearMax, yearMin];
    }
    return {
      yearMin,
      yearMax,
      sort: parseSortRated(search) ? ("rated" as const) : undefined,
      ita: search.ita === true || search.ita === "true" ? (true as const) : undefined,
    };
  },
  loaderDeps: ({ search: { yearMin, yearMax, sort } }) => ({
    yearMin,
    yearMax,
    sort,
  }),
  loader: async ({ params, deps }) => {
    const genres_and_id = params.genres_and_id;
    const idMatch = /^(\d+)/.exec(genres_and_id);
    const genreId = idMatch ? +idMatch[1] : NaN;
    const genreLabel =
      TV_GENRES.find((g) => g.id === genreId)?.label ?? "Genere";

    const sortMode: TVDiscoverSort =
      deps.sort === "rated" ? "rated" : "popularity";

    const data = await getTVByFilters(genreId, 1, {
      yearMin: deps.yearMin,
      yearMax: deps.yearMax,
      sort: sortMode,
    });

    return {
      data,
      genreLabel,
      genreId,
      yearMin: deps.yearMin,
      yearMax: deps.yearMax,
      sort: sortMode,
    };
  },
  component: TvPerGenresPage,
});

function TvPerGenresPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = Route.useParams();
  const { data, genreLabel, genreId, sort } = Route.useLoaderData();
  const { yearMin: sMin, yearMax: sMax, sort: searchSort, ita: searchIta } = Route.useSearch();

  const yMaxBound = useMemo(() => releaseYearMax(), []);

  const displayMin = sMin ?? RELEASE_YEAR_MIN;
  const displayMax = sMax ?? yMaxBound;

  const [draftMin, setDraftMin] = useState(displayMin);
  const [draftMax, setDraftMax] = useState(displayMax);

  const italianOnly = searchIta === true;

  const { italianIds, isLoading: italianCatalogLoading } =
    useItalianTvCatalog(italianOnly);

  useEffect(() => {
    setDraftMin(displayMin);
    setDraftMax(displayMax);
  }, [displayMin, displayMax]);

  const heroShow = italianOnly && italianIds
    ? data.results.find((s) => italianIds.has(s.id)) ?? data.results[0]
    : data.results[0];

  const navigateYearSearch = (
    yearMin: number | undefined,
    yearMax: number | undefined,
  ) => {
    navigate({
      to: "/serie/genres/$genres_and_id",
      params,
      search: {
        yearMin,
        yearMax,
        sort: searchSort,
        ita: searchIta,
      },
      replace: true,
      resetScroll: false,
    });
  };

  const applyYearRange = () => {
    let min = clampYear(Number(draftMin) || RELEASE_YEAR_MIN);
    let max = clampYear(Number(draftMax) || yMaxBound);
    if (min > max) [min, max] = [max, min];
    setDraftMin(min);
    setDraftMax(max);
    const isAll = min === RELEASE_YEAR_MIN && max === yMaxBound;
    navigateYearSearch(isAll ? undefined : min, isAll ? undefined : max);
  };

  const clearYearRange = () => {
    setDraftMin(RELEASE_YEAR_MIN);
    setDraftMax(yMaxBound);
    navigateYearSearch(undefined, undefined);
  };

  const hasYearFilter = sMin !== undefined || sMax !== undefined;

  const yearFilterLabel = hasYearFilter
    ? `${displayMin}–${displayMax}`
    : null;

  const yearSpread = yMaxBound - RELEASE_YEAR_MIN;
  const fillLowPct =
    yearSpread > 0
      ? ((draftMin - RELEASE_YEAR_MIN) / yearSpread) * 100
      : 0;
  const fillHighPct =
    yearSpread > 0
      ? ((draftMax - RELEASE_YEAR_MIN) / yearSpread) * 100
      : 100;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={`flex flex-col ${!heroShow ? "pt-4 md:pt-6" : ""}`}>
        {heroShow ? <Hero kind="tv" movie={heroShow} /> : null}
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
            <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-end">
              <div className="flex w-full min-w-0 flex-col gap-1.5 rounded-lg border border-mv-gold/20 bg-mv-panel/50 px-3 py-2 sm:max-w-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-sans text-[0.6rem] font-semibold uppercase tracking-wider text-mv-cream-muted">
                    Periodo (prima TV)
                  </span>
                  {hasYearFilter ? (
                    <button
                      type="button"
                      onClick={clearYearRange}
                      className="font-sans text-[0.6rem] font-semibold uppercase tracking-wide text-mv-gold-bright underline decoration-mv-gold/35 underline-offset-2 hover:text-mv-cream"
                    >
                      Tutti
                    </button>
                  ) : null}
                </div>
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex items-center justify-between gap-2 font-sans text-[0.7rem] font-semibold tabular-nums leading-none text-mv-cream">
                    <span className="text-mv-gold/90">{draftMin}</span>
                    <span className="text-mv-gold/90">{draftMax}</span>
                  </div>
                  <div className="relative h-6 w-full shrink-0">
                    <div
                      className="pointer-events-none absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-mv-ink"
                      aria-hidden
                    />
                    <div
                      className="pointer-events-none absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-mv-gold/45"
                      style={{
                        left: `${fillLowPct}%`,
                        width: `${Math.max(0, fillHighPct - fillLowPct)}%`,
                      }}
                      aria-hidden
                    />
                    <input
                      type="range"
                      aria-label="Anno minimo"
                      className="mv-dual-range absolute inset-x-0 top-0 z-1 h-6 w-full cursor-pointer"
                      min={RELEASE_YEAR_MIN}
                      max={draftMax}
                      value={draftMin}
                      onChange={(e) =>
                        setDraftMin(clampYear(Number(e.target.value)))
                      }
                    />
                    <input
                      type="range"
                      aria-label="Anno massimo"
                      className="mv-dual-range absolute inset-x-0 top-0 z-2 h-6 w-full cursor-pointer"
                      min={draftMin}
                      max={yMaxBound}
                      value={draftMax}
                      onChange={(e) =>
                        setDraftMax(clampYear(Number(e.target.value)))
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={applyYearRange}
                    className="mt-0.5 w-full rounded-md border border-mv-gold/35 bg-mv-gold/10 py-1 font-sans text-[0.6rem] font-semibold uppercase tracking-wider text-mv-gold-bright transition-colors hover:bg-mv-gold/18 sm:w-auto sm:self-end sm:px-3"
                  >
                    Applica
                  </button>
                </div>
              </div>
              <label className="flex w-full flex-col gap-2 font-sans text-xs font-medium uppercase tracking-wider text-mv-cream-muted sm:w-auto sm:min-w-[220px]">
                Ordine
                <select
                  className="rounded-xl border border-mv-gold/25 bg-mv-panel/90 px-4 py-3 font-sans text-sm font-normal normal-case tracking-normal text-mv-cream outline-none transition-all focus:border-mv-gold/50 focus:shadow-[0_0_0_3px_rgba(212,165,116,0.1)]"
                  value={searchSort === "rated" ? "rated" : ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    navigate({
                      to: "/serie/genres/$genres_and_id",
                      params,
                      search: {
                        yearMin: sMin,
                        yearMax: sMax,
                        sort: v === "rated" ? "rated" : undefined,
                        ita: searchIta,
                      },
                      replace: true,
                      resetScroll: false,
                    });
                  }}
                >
                  <option value="">Popolarità (TMDB)</option>
                  <option value="rated">Più apprezzati</option>
                </select>
              </label>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-mv-gold/20 bg-mv-panel/50 px-3 py-2.5 transition-colors select-none hover:border-mv-gold/40 sm:self-end">
                <input
                  type="checkbox"
                  checked={italianOnly}
                  onChange={(e) => {
                    navigate({
                      to: "/serie/genres/$genres_and_id",
                      params,
                      search: {
                        yearMin: sMin,
                        yearMax: sMax,
                        sort: searchSort,
                        ita: e.target.checked ? true : undefined,
                      },
                      replace: true,
                      resetScroll: false,
                    });
                  }}
                  className="h-4 w-4 shrink-0 cursor-pointer appearance-none rounded border border-mv-gold/40 bg-mv-ink transition-colors checked:border-mv-gold checked:bg-mv-gold"
                />
                <span className="font-sans text-[0.65rem] font-semibold uppercase tracking-wider text-mv-cream-muted">
                  Solo con italiano nello stream
                </span>
                {italianOnly && italianCatalogLoading ? (
                  <span className="font-sans text-[0.6rem] text-mv-gold/60">
                    …
                  </span>
                ) : null}
              </label>
            </div>
            {sort === "rated" ? (
              <p className="max-w-xl font-sans text-xs leading-relaxed text-mv-cream-muted">
                Ordinati per voto medio su TMDB, solo serie con almeno 250
                voti.
              </p>
            ) : null}
          </div>
          {!heroShow && (
            <p className="font-sans text-sm text-mv-cream-muted">
              Nessuna serie trovata per questo genere
              {yearFilterLabel ? ` nel periodo ${yearFilterLabel}` : ""}
              {sort === "rated" ? " con questi criteri" : ""}.
            </p>
          )}
          <TvList
            genre_id={genreId}
            yearMin={sMin}
            yearMax={sMax}
            sort={sort}
            italianIds={italianOnly ? italianIds : null}
            heroId={heroShow?.id}
          />
        </div>
      </div>
    </HydrationBoundary>
  );
}
