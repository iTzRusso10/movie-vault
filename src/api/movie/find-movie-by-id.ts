import { MovieDetails } from "@/types/movie";
import { upfetch } from "../_upfetch";

export const getMovieById = async (movieId: number): Promise<MovieDetails> => {
  return upfetch<MovieDetails>(`movie/${movieId}`);
};
