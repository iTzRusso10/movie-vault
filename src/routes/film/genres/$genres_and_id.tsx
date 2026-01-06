import { getMovieByFilters } from "@/api/movie/movie-per-genres";
import { Hero } from "@/components/hero";
import {
  dehydrate,
  HydrationBoundary,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import MovieList from "./-components/movie-list";

export const Route = createFileRoute("/film/genres/$genres_and_id")({
  component: MoviePerGenresPage,
  loader: async ({ params }) => {
    const genres_and_id = params.genres_and_id;
    const genreId = +genres_and_id.split("-")[0];
    const genreLabelRaw = genres_and_id.split("-")[1];
    const genreLabel = (
      genreLabelRaw.charAt(0).toUpperCase() +
      genreLabelRaw.slice(1).toLowerCase()
    ).replace("%20", " ");

    const data = await getMovieByFilters(genreId, 1);

    return { data, genreLabel, genreId };
  },
});

function MoviePerGenresPage() {
  const queryClient = useQueryClient();
  const { data, genreLabel, genreId } = Route.useLoaderData();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col">
        <Hero movie={data.results[0]} />
        <div className="flex flex-col gap-3 px-5 w-full">
          <h1 className="text-3xl text-white font-extrabold">{genreLabel}</h1>
          <MovieList genre_id={genreId} />
        </div>
      </div>
    </HydrationBoundary>
  );
}
