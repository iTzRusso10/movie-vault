import { Hero } from "@/app/components/hero";
import MovieList from "./_components/movie-list";
import { Movies } from "@/types/movie";

export default function GenresClientPage({
  data,
  genreLabel,
  genreId,
}: {
  data: Movies;
  genreLabel: string;
  genreId: number;
}) {
  return (
    <div className="flex flex-col">
      <Hero movie={data.results[0]} />
      <div className="flex flex-col gap-3 px-5 w-full">
        <h1 className="text-3xl text-white font-extrabold">{genreLabel}</h1>
        <MovieList genre_id={genreId} />
      </div>
    </div>
  );
}
