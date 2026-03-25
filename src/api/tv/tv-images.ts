import type { TVImages } from "@/types/tv";
import { upfetch } from "../_upfetch";

export const getTVImages = async (tvId: number) => {
  return upfetch<TVImages>(`tv/${tvId}/images`);
};
