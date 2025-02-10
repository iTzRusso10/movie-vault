import { getMovieByGenre } from "@/api/movie/movie-per-genres";
import React from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import GenresClientPage from "./page-client";

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
      <GenresClientPage data={data} genreId={genreId} genreLabel={genreLabel} />
    </HydrationBoundary>
  );
}
