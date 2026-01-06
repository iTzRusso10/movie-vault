import { getTrendMovie } from "@/api/movie/trend-movie";
import { MoviePerGenresSection } from "../../components/movie-per-genre-section";
import { Hero } from "../../components/hero";
import { getWatchProviders } from "@/api/movie/watch-providers";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(home)/")({
  component: Home,
  loader: async () => {
    const trendMovie = await getTrendMovie();
    const watchProviders = await getWatchProviders(trendMovie.id);

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
    </div>
  );
}
