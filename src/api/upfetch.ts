import { env } from "../env";
import { up } from "up-fetch";

export const upfetch = up(fetch, () => ({
  baseUrl: "https://api.themoviedb.org/3",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${env.MOVIE_DB_API_KEY}`,
  },
}));
