import { getHomeMoviesMerged } from "@/api/home-feed";
import { HomeTmdbHighlights } from "../../components/home-tmdb-highlights";
import { MoviePerGenresSection } from "../../components/movie-per-genre-section";
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
    const mergedMovies = await getHomeMoviesMerged();
    const featuredMovie = mergedMovies[0];
    if (!featuredMovie) {
      throw new Error("Impossibile caricare film in evidenza dalla TMDB.");
    }
    const watchProviders = await getWatchProviders(featuredMovie.id);
    const { queryClient } = context as { queryClient: QueryClient };

    queryClient.setQueryData(["home-movies-merged"], mergedMovies);

    await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ["movie", featuredMovie.id],
        queryFn: () => getMovieById(featuredMovie.id),
        staleTime: HERO_PREFETCH_STALE,
      }),
      queryClient.ensureQueryData({
        queryKey: ["movie-videos", featuredMovie.id],
        queryFn: () => getMovieVideos(featuredMovie.id),
        staleTime: HERO_PREFETCH_STALE,
      }),
      queryClient.ensureQueryData({
        queryKey: ["movie-images", featuredMovie.id],
        queryFn: () => getMovieImages(featuredMovie.id),
        staleTime: HERO_PREFETCH_STALE,
      }),
    ]);

    return {
      featuredMovie,
      watchProviders,
    };
  },
});

function Home() {
  const { featuredMovie, watchProviders } = Route.useLoaderData();

  return (
    <div className="flex flex-col">
      <Hero movie={featuredMovie} watchProviders={watchProviders.results} />
      <HomeTmdbHighlights heroMovieId={featuredMovie.id} />
      <MoviePerGenresSection />
    </div>
  );
}
