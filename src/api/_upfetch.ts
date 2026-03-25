import { up } from "up-fetch";

/** Lingua testi TMDB (titoli, trame, generi, ecc.). */
const TMDB_LANGUAGE = "it-IT";

export const upfetch = up(fetch, () => ({
  baseUrl: "https://api.themoviedb.org/3",
  params: {
    language: TMDB_LANGUAGE,
  },
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_MOVIE_DB_API_KEY}`,
  },
}));
