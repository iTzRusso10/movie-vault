import { useQuery } from "@tanstack/react-query";
import {
  vixsrcAllMovieIdsFn,
  vixsrcAllTvIdsFn,
} from "@/server/stream/vixsrc-catalog.server-fns";

const STALE_MS = 1000 * 60 * 30;

export function useItalianMovieCatalog(enabled: boolean) {
  const { data, isLoading } = useQuery({
    queryKey: ["vixsrc-italian-movie-ids"],
    queryFn: async () => {
      const res = await vixsrcAllMovieIdsFn();
      if (!res.ids) return null;
      return new Set(res.ids);
    },
    staleTime: STALE_MS,
    gcTime: STALE_MS * 2,
    enabled,
  });

  return { italianIds: data ?? null, isLoading: enabled && isLoading };
}

export function useItalianTvCatalog(enabled: boolean) {
  const { data, isLoading } = useQuery({
    queryKey: ["vixsrc-italian-tv-ids"],
    queryFn: async () => {
      const res = await vixsrcAllTvIdsFn();
      if (!res.ids) return null;
      return new Set(res.ids);
    },
    staleTime: STALE_MS,
    gcTime: STALE_MS * 2,
    enabled,
  });

  return { italianIds: data ?? null, isLoading: enabled && isLoading };
}
