import { Movies } from "@/types/movie";
import { upfetch } from "../_upfetch";

/** Per genere + filtri. TMDB: /discover/movie (non /movie/top_rated, che è globale). */
export type GenreDiscoverSort = "popularity" | "rated";

export type GenreDiscoverOptions = {
  year?: number;
  /** `rated` = vote_average.desc + min voti (evita 10/10 con 3 voti). */
  sort?: GenreDiscoverSort;
};

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
  options?: GenreDiscoverOptions
): Promise<Movies> => {
  const { year, sort = "popularity" } = options ?? {};

  const params: Record<string, string | number> = {
    with_genres: genreId,
    page,
    sort_by: sort === "rated" ? "vote_average.desc" : "popularity.desc",
  };

  if (year !== undefined) {
    params.primary_release_year = year;
  }

  if (sort === "rated") {
    params["vote_count.gte"] = 250;
  }

  return upfetch<Movies>(`/discover/movie`, { params });
};
