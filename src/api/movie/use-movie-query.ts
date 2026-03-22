import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getMovieByFilters,
  type GenreDiscoverSort,
} from "./movie-per-genres";

export const useInfiniteMovieByGenreQuery = ({
  genreId,
  year,
  sort = "popularity",
}: {
  genreId: number;
  year?: number;
  sort?: GenreDiscoverSort;
}) => {
  return useInfiniteQuery({
    queryKey: ["movie", genreId, year ?? "all", sort],
    queryFn: ({ pageParam = 1 }) =>
      getMovieByFilters(genreId, pageParam, { year, sort }),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : null,
    initialPageParam: 1,
    staleTime: 300000,
  });
};
