import type { Movie } from "@/types/movie";
import type { TV } from "@/types/tv";
import { upfetch } from "./_upfetch";

/** Unisce più liste TMDB senza duplicati: round-robin (cinema → popolari → votati → …). */
function mergeByRoundRobin<T extends { id: number }>(lists: T[][]): T[] {
  const out: T[] = [];
  const seen = new Set<number>();
  const maxLen = Math.max(0, ...lists.map((l) => l.length));
  for (let i = 0; i < maxLen; i++) {
    for (const list of lists) {
      const item = list[i];
      if (item && !seen.has(item.id)) {
        seen.add(item.id);
        out.push(item);
      }
    }
  }
  return out;
}

export async function getHomeMoviesMerged(): Promise<Movie[]> {
  const [nowPlaying, popular, topRated] = await Promise.all([
    upfetch<{ results: Movie[] }>("/movie/now_playing", {
      params: { page: 1, region: "IT" },
    }),
    upfetch<{ results: Movie[] }>("/movie/popular", { params: { page: 1 } }),
    upfetch<{ results: Movie[] }>("/movie/top_rated", { params: { page: 1 } }),
  ]);
  return mergeByRoundRobin([
    nowPlaying.results,
    popular.results,
    topRated.results,
  ]);
}

export async function getHomeTVsMerged(): Promise<TV[]> {
  const [popular, topRated] = await Promise.all([
    upfetch<{ results: TV[] }>("/tv/popular", { params: { page: 1 } }),
    upfetch<{ results: TV[] }>("/tv/top_rated", { params: { page: 1 } }),
  ]);
  return mergeByRoundRobin([popular.results, topRated.results]);
}
