import { env } from "../env";
import { up } from "up-fetch";

export const upfetch = up(fetch, () => ({
  baseUrl: "https://api.themoviedb.org/3",
  params: {
    language: "en-US",
  },
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${env.MOVIE_DB_API_KEY}`,
  },
}));
