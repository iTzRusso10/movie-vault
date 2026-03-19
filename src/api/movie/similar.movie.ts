import { Movie, Movies } from "@/types/movie";
import { upfetch } from "../_upfetch";

export const getSimilarMovies = async (movieId: number): Promise<Movie[]> => {
  return upfetch<Movies>(`/movie/${movieId}/similar`, {
    params: { page: 1 },
  }).then((res) => res.results);
};
