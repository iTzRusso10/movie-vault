import { Movies } from "@/types/movie";
import { upfetch } from "../_upfetch";

export const getMovieBySearch = async (query: string): Promise<Movies> => {
  return upfetch<Movies>(
    `/search/movie${query ? `?query=${encodeURIComponent(query)}` : null}`
  );
};
