"use server";
import { MovieDetails } from "@/types/movie";
import { upfetch } from "../upfetch";

export const getMovieById = async (movieId: number): Promise<MovieDetails> => {
  return upfetch<MovieDetails>(`movie/${movieId}`, {
    next: { revalidate: 86400 },
  });
};
