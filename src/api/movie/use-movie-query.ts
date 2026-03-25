import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getMovieByFilters,
  type GenreDiscoverSort,
} from "./movie-per-genres";

export const useInfiniteMovieByGenreQuery = ({
  genreId,
  yearMin,
  yearMax,
  sort = "popularity",
}: {
  genreId: number;
  yearMin?: number;
  yearMax?: number;
  sort?: GenreDiscoverSort;
}) => {
  const rangeKey =
    yearMin != null || yearMax != null
      ? `${yearMin ?? "x"}-${yearMax ?? "x"}`
      : "all";

  return useInfiniteQuery({
    queryKey: ["movie", genreId, rangeKey, sort],
    queryFn: ({ pageParam = 1 }) =>
      getMovieByFilters(genreId, pageParam, { yearMin, yearMax, sort }),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : null,
    initialPageParam: 1,
    staleTime: 300000,
  });
};
