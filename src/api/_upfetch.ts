import { up } from "up-fetch";

export const upfetch = up(fetch, () => ({
  baseUrl: "https://api.themoviedb.org/3",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_MOVIE_DB_API_KEY}`,
  },
}));
