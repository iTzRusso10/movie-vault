import { Movie } from "@/types/movie";
import { upfetch } from "../_upfetch";

export const getTrendMovie = async (): Promise<Movie> => {
  return upfetch<{ results: Movie[] }>("/trending/movie/day").then(
    ({ results }) => results[0]
  );
};
