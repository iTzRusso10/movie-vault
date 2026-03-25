import type { TV } from "@/types/tv";
import { upfetch } from "../_upfetch";

export const getSimilarTV = async (tvId: number): Promise<TV[]> => {
  const res = await upfetch<{ results: TV[] }>(`tv/${tvId}/similar`);
  return res.results;
};
