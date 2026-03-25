import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getTVByFilters,
  type TVDiscoverSort,
} from "./tv-per-genres";

export const useInfiniteTVByGenreQuery = ({
  genreId,
  yearMin,
  yearMax,
  sort = "popularity",
}: {
  genreId: number;
  yearMin?: number;
  yearMax?: number;
  sort?: TVDiscoverSort;
}) => {
  const rangeKey =
    yearMin != null || yearMax != null
      ? `${yearMin ?? "x"}-${yearMax ?? "x"}`
      : "all";

  return useInfiniteQuery({
    queryKey: ["tv-discover", genreId, rangeKey, sort],
    queryFn: ({ pageParam = 1 }) =>
      getTVByFilters(genreId, pageParam, { yearMin, yearMax, sort }),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : null,
    initialPageParam: 1,
    staleTime: 300_000,
  });
};
