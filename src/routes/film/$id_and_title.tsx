import { getMovieById } from "@/api/movie/find-movie-by-id";
import { getWatchProviders } from "@/api/movie/watch-providers";
import { Hero } from "@/components/hero";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/film/$id_and_title")({
  component: SingleFilmPage,
  loader: async ({ params }) => {
    const { id_and_title } = params;
    const movieId = +id_and_title.split("-")[0];
    const movie = await getMovieById(movieId);
    const watchProviders = await getWatchProviders(movieId);
    return { movie, watchProviders };
  },
});

function SingleFilmPage() {
  const { watchProviders, movie } = Route.useLoaderData();
  return (
    <div className="flex flex-col">
      <Hero movie={movie} watchProviders={watchProviders.results} />
      <section className="p-3">
        <div className="animate-slide-left-md">
          <h2 className="md:hidden text-3xl font-extrabold text-white mb-4">
            Overview
          </h2>
          <p className="text-md md:hidden text-white">{movie.overview}</p>
        </div>
      </section>
    </div>
  );
}
