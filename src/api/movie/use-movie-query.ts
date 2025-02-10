import { useInfiniteQuery } from "@tanstack/react-query";
import { getMovieByGenre } from "./movie-per-genres";

export const useInfiniteMovieByGenreQuery = ({
  genreId,
}: {
  genreId: number;
}) => {
  return useInfiniteQuery({
    queryKey: ["movie", genreId],
    queryFn: ({ pageParam = 1 }) => getMovieByGenre(genreId, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : null,
    initialPageParam: 1,
    staleTime: 300000,
  });
};
