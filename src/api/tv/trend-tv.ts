import type { TV } from "@/types/tv";
import { upfetch } from "../_upfetch";

export const getTrendTV = async (): Promise<TV> => {
  return upfetch<{ results: TV[] }>("/trending/tv/day").then(
    ({ results }) => results[0],
  );
};
