import { getHomeTVsMerged } from "@/api/home-feed";
import { getTVById } from "@/api/tv/find-tv-by-id";
import { getTVVideos } from "@/api/tv/tv-videos";
import { getTVImages } from "@/api/tv/tv-images";
import { getTVWatchProviders } from "@/api/tv/tv-watch-providers";
import { Hero } from "@/components/hero";
import { SerieTmdbHighlights } from "@/components/serie-tmdb-highlights";
import { TvPerGenresSection } from "@/components/tv-per-genre-section";
import { createFileRoute } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

const HERO_PREFETCH_STALE = 1000 * 60 * 5;

export const Route = createFileRoute("/serie/")({
  component: SerieHome,
  loader: async ({ context }) => {
    const mergedTV = await getHomeTVsMerged();
    const featuredTV = mergedTV[0];
    if (!featuredTV) {
      throw new Error("Impossibile caricare serie in evidenza dalla TMDB.");
    }
    const watchProviders = await getTVWatchProviders(featuredTV.id);
    const { queryClient } = context as { queryClient: QueryClient };

    queryClient.setQueryData(["home-tv-merged"], mergedTV);

    await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ["tv", featuredTV.id],
        queryFn: () => getTVById(featuredTV.id),
        staleTime: HERO_PREFETCH_STALE,
      }),
      queryClient.ensureQueryData({
        queryKey: ["tv-videos", featuredTV.id],
        queryFn: () => getTVVideos(featuredTV.id),
        staleTime: HERO_PREFETCH_STALE,
      }),
      queryClient.ensureQueryData({
        queryKey: ["tv-images", featuredTV.id],
        queryFn: () => getTVImages(featuredTV.id),
        staleTime: HERO_PREFETCH_STALE,
      }),
    ]);

    return {
      featuredTV,
      watchProviders,
    };
  },
});

function SerieHome() {
  const { featuredTV, watchProviders } = Route.useLoaderData();

  return (
    <div className="flex flex-col">
      <Hero
        kind="tv"
        movie={featuredTV}
        watchProviders={watchProviders.results}
      />
      <SerieTmdbHighlights heroTvId={featuredTV.id} />
      <TvPerGenresSection />
    </div>
  );
}
