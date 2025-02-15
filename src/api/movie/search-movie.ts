"use server";
import { Movies } from "@/types/movie";
import { upfetch } from "../upfetch";

export const getMovieBySearch = async (query: string): Promise<Movies> => {
  return upfetch<Movies>(
    `/search/movie${query ? `?query=${encodeURIComponent(query)}` : null}`
  );
};
