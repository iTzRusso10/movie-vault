/* eslint-disable no-restricted-globals */
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    MOVIE_DB_API_KEY: z.string(),
  },
  runtimeEnv: {
    MOVIE_DB_API_KEY: process.env.MOVIE_DB_API_KEY,
  },
});
