import { getTrendMovie } from "@/api/movie/trend-movie";
import { MoviePerGenresSection } from "../../components/movie-per-genre-section";
import { Hero } from "../../components/hero";
import { getWatchProviders } from "@/api/movie/watch-providers";

export default async function Home() {
  const trendMovie = await getTrendMovie();
  const watchProviders = await getWatchProviders(trendMovie.id);
  return (
    <div className="flex flex-col">
      <Hero movie={trendMovie} watchProviders={watchProviders.results} />
      <MoviePerGenresSection />
    </div>
  );
}
