"use server";
import { Movie } from "@/types/movie";
import { upfetch } from "../upfetch";

export const getTrendMovie = async (): Promise<Movie> => {
  return upfetch<{ results: Movie[] }>("/trending/movie/day", {
    next: { revalidate: 1800 },
  }).then(({ results }) => results[0]);
};
