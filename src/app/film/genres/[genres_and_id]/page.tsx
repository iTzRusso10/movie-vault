import { getMovieByGenre } from "@/api/movie/movie-per-genres";
import React from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Hero } from "@/components/hero";
import MovieList from "./_components/movie-list";

export default async function MoviePerGenresPage({
  params,
}: {
  params: Promise<{ genres_and_id: string }>;
}) {
  const queryClient = new QueryClient();
  const genres_and_id = (await params).genres_and_id;
  const genreId = +genres_and_id.split("-")[0];
  const genreLabelRaw = genres_and_id.split("-")[1];

  const genreLabel = (
    genreLabelRaw.charAt(0).toUpperCase() + genreLabelRaw.slice(1).toLowerCase()
  ).replace("%20", " ");

  await queryClient.prefetchQuery({
    queryKey: ["movies", genreId],
    queryFn: () => getMovieByGenre(genreId, 1),
  });

  const data = await getMovieByGenre(genreId, 1);

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
