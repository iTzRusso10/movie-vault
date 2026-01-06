import { MovieVideos } from "@/types/movie";
import { upfetch } from "../_upfetch";

export const getMovieVideos = async (movieId: number): Promise<MovieVideos> => {
  return upfetch<MovieVideos>(`/movie/${movieId}/videos`);
};
