import type { MovieVideos } from "@/types/movie";
import { upfetch } from "../_upfetch";

export const getTVVideos = async (tvId: number) => {
  return upfetch<MovieVideos>(`tv/${tvId}/videos`);
};
