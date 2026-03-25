import type { TVSeasonDetails } from "@/types/tv";
import { upfetch } from "../_upfetch";

export const getTVSeason = async (tvId: number, seasonNumber: number) => {
  return upfetch<TVSeasonDetails>(`tv/${tvId}/season/${seasonNumber}`);
};
