import type { MovieVideos } from "@/types/movie";

const TYPE_PRIORITY: Record<string, number> = {
  Trailer: 0,
  Teaser: 1,
  Clip: 2,
  Featurette: 3,
  "Behind the Scenes": 4,
  Bloopers: 5,
  "Opening Credits": 6,
};

function typeRank(type: string): number {
  return TYPE_PRIORITY[type] ?? 40;
}

function isYoutubeSite(site: string | undefined): boolean {
  return (site ?? "").toLowerCase() === "youtube";
}

/**
 * Miglior video YouTube per hero / modale: TMDB spesso usa Teaser/Clip al posto di "Trailer".
 */
export function pickYoutubeTrailer(
  results: MovieVideos["results"] | undefined,
): MovieVideos["results"][number] | undefined {
  if (!results?.length) return undefined;
  const yt = results.filter((v) => isYoutubeSite(v.site) && v.key);
  if (!yt.length) return undefined;

  return [...yt].sort((a, b) => {
    const off = Number(b.official) - Number(a.official);
    if (off !== 0) return off;
    const tr = typeRank(a.type) - typeRank(b.type);
    if (tr !== 0) return tr;
    return (b.size ?? 0) - (a.size ?? 0);
  })[0];
}
