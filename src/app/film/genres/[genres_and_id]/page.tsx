import { getMovieByFilters } from "@/api/movie/movie-per-genres";
import { Hero } from "@/components/hero";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import MovieList from "./_components/movie-list";

export default async function MoviePerGenresPage({
  params,
}: {
  params: Promise<{ genres_and_id: string; year?: string }>;
}) {
  const queryClient = new QueryClient();
  const year = (await params).year;
  const genres_and_id = (await params).genres_and_id;
  const genreId = +genres_and_id.split("-")[0];
  const genreLabelRaw = genres_and_id.split("-")[1];
  const genreLabel = (
    genreLabelRaw.charAt(0).toUpperCase() + genreLabelRaw.slice(1).toLowerCase()
  ).replace("%20", " ");

  const selectedYear = year ? Number(year) : undefined;

  await queryClient.prefetchQuery({
    queryKey: ["movies", genreId, selectedYear],
    queryFn: () => getMovieByFilters(genreId, 1, selectedYear),
  });

  const data = await getMovieByFilters(genreId, 1, selectedYear);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col">
        <Hero movie={data.results[0]} />
        <div className="flex flex-col gap-3 px-5 w-full">
          <h1 className="text-3xl text-white font-extrabold">{genreLabel}</h1>
          <form method="GET">
            <select
              name="year"
              defaultValue={selectedYear?.toString()}
              className="bg-gray-900 text-white p-2 rounded-md"
            >
              {[2025, 2024, 2023, 2022, 2021, 2020].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <button type="submit" className="hidden" />
          </form>
          <MovieList genre_id={genreId} />
        </div>
      </div>
    </HydrationBoundary>
  );
}
