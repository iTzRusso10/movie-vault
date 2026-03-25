import type { TVs } from "@/types/tv";
import { upfetch } from "../_upfetch";

export type TVDiscoverSort = "popularity" | "rated";

export type TVDiscoverOptions = {
  yearMin?: number;
  yearMax?: number;
  sort?: TVDiscoverSort;
};

export const getTVByGenre = async (
  genreId: number,
  page: number,
): Promise<TVs> => {
  return upfetch<TVs>("/discover/tv", {
    params: { with_genres: genreId, page },
  });
};

export const getTVByFilters = async (
  genreId: number,
  page: number,
  options?: TVDiscoverOptions,
): Promise<TVs> => {
  const { yearMin, yearMax, sort = "popularity" } = options ?? {};

  const params: Record<string, string | number> = {
    with_genres: genreId,
    page,
    sort_by: sort === "rated" ? "vote_average.desc" : "popularity.desc",
  };

  if (yearMin !== undefined || yearMax !== undefined) {
    const current = new Date().getFullYear();
    const minY = yearMin ?? 1950;
    const maxY = yearMax ?? current;
    const from = Math.min(minY, maxY);
    const to = Math.max(minY, maxY);
    params["first_air_date.gte"] = `${from}-01-01`;
    params["first_air_date.lte"] = `${to}-12-31`;
  }

  if (sort === "rated") {
    params["vote_count.gte"] = 250;
  }

  return upfetch<TVs>("/discover/tv", { params });
};
