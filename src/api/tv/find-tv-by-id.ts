import type { TVDetails } from "@/types/tv";
import { upfetch } from "../_upfetch";

function needsFallbackText(value: string | null | undefined): boolean {
  return value == null || !String(value).trim();
}

export const getTVById = async (tvId: number): Promise<TVDetails> => {
  const it = await upfetch<TVDetails>(`tv/${tvId}`);
  const needOverview = needsFallbackText(it.overview);
  const needTagline = needsFallbackText(it.tagline);
  if (!needOverview && !needTagline) return it;

  const en = await upfetch<TVDetails>(`tv/${tvId}`, {
    params: { language: "en-US" },
  });

  return {
    ...it,
    overview:
      needOverview && en.overview?.trim() ? en.overview : it.overview,
    tagline:
      needTagline && en.tagline?.trim() ? en.tagline : it.tagline,
  };
};
