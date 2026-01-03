"use server";
import { Movies } from "@/types/movie";
import { upfetch } from "../upfetch";

export const getMovieByGenre = async (
  genreId: number,
  page: number
): Promise<Movies> => {
  return upfetch<Movies>(`/discover/movie`, {
    params: { with_genres: genreId, page: page },
  });
};
export const getMovieByFilters = async (
  genreId: number,
  page: number,
  year?: number
): Promise<Movies> => {
  return upfetch<Movies>(`/discover/movie`, {
    params: { with_genres: genreId, page: page, primary_release_year: year },
  });
};
