import { useInfiniteQuery } from "@tanstack/react-query";
import { getMovieByFilters } from "./movie-per-genres";

export const useInfiniteMovieByGenreQuery = ({
  genreId,
  year,
}: {
  genreId: number;
  year?: number;
}) => {
  return useInfiniteQuery({
    queryKey: ["movie", genreId, year ?? "all"],
    queryFn: ({ pageParam = 1 }) =>
      getMovieByFilters(genreId, pageParam, year),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : null,
    initialPageParam: 1,
    staleTime: 300000,
  });
};
