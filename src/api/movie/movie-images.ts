"use server";

import { MovieImages } from "@/types/movie";
import { upfetch } from "../upfetch";

export const getMovieImages = async (movieId: number): Promise<MovieImages> => {
  return upfetch<MovieImages>(`/movie/${movieId}/images`, {
    params: { include_image_language: "en" },
  });
};
