import type { MovieImages, MovieWatchProviders } from "./movie";

/** Elemento lista / discover / trending (TMDB TV). */
export type TV = {
  backdrop_path: string | null;
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  genre_ids: number[];
  popularity: number;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
  /** Talvolta presente in risposte discover / trending. */
  number_of_seasons?: number;
};

export type TVs = {
  page: number;
  results: TV[];
  total_pages: number;
  total_results: number;
};

export type TVDetails = {
  backdrop_path: string | null;
  created_by: { id: number; credit_id: string; name: string; gender: number; profile_path: string | null }[];
  episode_run_time: number[];
  first_air_date: string;
  genres: { id: number; name: string }[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  name: string;
  networks: { id: number; name: string; logo_path: string | null; origin_country: string }[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: { iso_3166_1: string; name: string }[];
  status: string;
  tagline: string | null;
  type: string;
  vote_average: number;
  vote_count: number;
};

export type TVImages = MovieImages;

export type TVWatchProviders = MovieWatchProviders;

export type TVEpisode = {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number | null;
  season_number: number;
  show_id: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
};

export type TVSeasonDetails = {
  _id: string;
  air_date: string;
  episodes: TVEpisode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
};
