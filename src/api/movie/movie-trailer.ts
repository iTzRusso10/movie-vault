"use server";
import { MovieVideos } from "@/types/movie";
import { upfetch } from "../upfetch";

export const getMovieVideos = async (movieId: number): Promise<MovieVideos> => {
  return upfetch<MovieVideos>(`/movie/${movieId}/videos`);
};
