import { getTrendMovie } from "@/api/movie/trend-movie";
import { MoviePerGenresSection } from "../../components/movie-per-genre-section";
import { TvPerGenresSection } from "../../components/tv-per-genre-section";
import { Hero } from "../../components/hero";
import { getWatchProviders } from "@/api/movie/watch-providers";
import { createFileRoute } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { getMovieById } from "@/api/movie/find-movie-by-id";
import { getMovieVideos } from "@/api/movie/movie-trailer";
import { getMovieImages } from "@/api/movie/movie-images";

const HERO_PREFETCH_STALE = 1000 * 60 * 5;

export const Route = createFileRoute("/(home)/")({
  component: Home,
  loader: async ({ context }) => {
    const trendMovie = await getTrendMovie();
    const watchProviders = await getWatchProviders(trendMovie.id);
    const { queryClient } = context as { queryClient: QueryClient };

    await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ["movie", trendMovie.id],
        queryFn: () => getMovieById(trendMovie.id),
        staleTime: HERO_PREFETCH_STALE,
      }),
      queryClient.ensureQueryData({
        queryKey: ["movie-videos", trendMovie.id],
        queryFn: () => getMovieVideos(trendMovie.id),
        staleTime: HERO_PREFETCH_STALE,
      }),
      queryClient.ensureQueryData({
        queryKey: ["movie-images", trendMovie.id],
        queryFn: () => getMovieImages(trendMovie.id),
        staleTime: HERO_PREFETCH_STALE,
      }),
    ]);

    return {
      trendMovie,
      watchProviders,
    };
  },
});

function Home() {
  const { trendMovie, watchProviders } = Route.useLoaderData();

  return (
    <div className="flex flex-col">
      <Hero movie={trendMovie} watchProviders={watchProviders.results} />
      <MoviePerGenresSection />
      <TvPerGenresSection />
    </div>
  );
}
