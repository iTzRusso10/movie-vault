import type { TVs } from "@/types/tv";
import { upfetch } from "../_upfetch";

export const getTVBySearch = async (query: string): Promise<TVs> => {
  return upfetch<TVs>("/search/tv", {
    params: { query: query.trim() },
  });
};
