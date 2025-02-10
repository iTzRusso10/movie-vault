import { getTrendMovie } from "@/api/movie/trend-movie";
import { MoviePerGenresSection } from "../../components/movie-per-genre-section";
import { Hero } from "../../components/hero";

export default async function Home() {
  const trendMovie = await getTrendMovie();

  return (
    <div className="flex flex-col">
      <Hero movie={trendMovie} />
      <MoviePerGenresSection />
    </div>
  );
}
