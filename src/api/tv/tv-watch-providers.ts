import type { TVWatchProviders } from "@/types/tv";
import { upfetch } from "../_upfetch";

export const getTVWatchProviders = async (tvId: number) => {
  return upfetch<TVWatchProviders>(`tv/${tvId}/watch/providers`);
};
