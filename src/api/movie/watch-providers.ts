import { MovieWatchProviders } from "@/types/movie";
import { upfetch } from "../upfetch";

export const getWatchProviders = async (movieId: number) => {
  return upfetch<MovieWatchProviders>(`/movie/${movieId}/watch/providers`);
};
