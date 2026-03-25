import { getTrendTV } from "@/api/tv/trend-tv";
import { getTVById } from "@/api/tv/find-tv-by-id";
import { getTVVideos } from "@/api/tv/tv-videos";
import { getTVImages } from "@/api/tv/tv-images";
import { getTVWatchProviders } from "@/api/tv/tv-watch-providers";
import { Hero } from "@/components/hero";
import { TvPerGenresSection } from "@/components/tv-per-genre-section";
import { createFileRoute } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

const HERO_PREFETCH_STALE = 1000 * 60 * 5;

export const Route = createFileRoute("/serie/")({
  component: SerieHome,
  loader: async ({ context }) => {
    const trendTV = await getTrendTV();
    const watchProviders = await getTVWatchProviders(trendTV.id);
    const { queryClient } = context as { queryClient: QueryClient };

    await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ["tv", trendTV.id],
        queryFn: () => getTVById(trendTV.id),
        staleTime: HERO_PREFETCH_STALE,
      }),
      queryClient.ensureQueryData({
        queryKey: ["tv-videos", trendTV.id],
        queryFn: () => getTVVideos(trendTV.id),
        staleTime: HERO_PREFETCH_STALE,
      }),
      queryClient.ensureQueryData({
        queryKey: ["tv-images", trendTV.id],
        queryFn: () => getTVImages(trendTV.id),
        staleTime: HERO_PREFETCH_STALE,
      }),
    ]);

    return {
      trendTV,
      watchProviders,
    };
  },
});

function SerieHome() {
  const { trendTV, watchProviders } = Route.useLoaderData();

  return (
    <div className="flex flex-col">
      <Hero
        kind="tv"
        movie={trendTV}
        watchProviders={watchProviders.results}
      />
      <TvPerGenresSection />
    </div>
  );
}
