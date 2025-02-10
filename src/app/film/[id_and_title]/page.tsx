import { getMovieById } from "@/api/movie/find-movie-by-id";
import { Hero } from "@/app/components/hero";

export default async function SingleFilmPage({
  params,
}: {
  params: Promise<{ id_and_title: string }>;
}) {
  const id_and_title = (await params).id_and_title;
  const movieId = +id_and_title.split("-")[0];

  const movie = await getMovieById(movieId);

  return (
    <div className="flex flex-col">
      <Hero movie={movie} />
      <div className="px-3">
        <h2 className="md:hidden text-3xl font-extrabold text-white mb-4">
          Overview
        </h2>
        <p className="text-md md:hidden text-white">{movie.overview}</p>
      </div>
    </div>
  );
}
