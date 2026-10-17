import { useInfiniteQuery } from "@tanstack/react-query";
import { italianMovieDiscoverFn } from "@/server/stream/italian-discover.server-fns";
import { TMDB_MAX_PAGE } from "../_upfetch";
import {
  getMovieByFilters,
  type GenreDiscoverSort,
} from "./movie-per-genres";

export const useInfiniteMovieByGenreQuery = ({
  genreId,
  yearMin,
  yearMax,
  sort = "popularity",
  italianOnly = false,
}: {
  genreId: number;
  yearMin?: number;
  yearMax?: number;
  sort?: GenreDiscoverSort;
  /** Solo titoli con audio italiano su VixSRC (filtrati lato server). */
  italianOnly?: boolean;
}) => {
  const rangeKey =
    yearMin != null || yearMax != null
      ? `${yearMin ?? "x"}-${yearMax ?? "x"}`
      : "all";

  return useInfiniteQuery({
    queryKey: ["movie", genreId, rangeKey, sort, italianOnly ? "ita" : "all"],
    queryFn: ({ pageParam = 1 }) =>
      italianOnly
        ? italianMovieDiscoverFn({
            data: { genreId, page: pageParam, yearMin, yearMax, sort },
          })
        : getMovieByFilters(genreId, pageParam, { yearMin, yearMax, sort }),
    // TMDB `/discover` rifiuta page > 500 anche se `total_pages` è più alto.
    getNextPageParam: (lastPage) =>
      lastPage.page < Math.min(lastPage.total_pages, TMDB_MAX_PAGE)
        ? lastPage.page + 1
        : null,
    initialPageParam: 1,
    staleTime: 300000,
  });
};
