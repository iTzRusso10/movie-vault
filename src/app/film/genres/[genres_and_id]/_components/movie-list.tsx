"use client";

import { useInfiniteMovieByGenreQuery } from "@/api/movie/use-movie-query";
import { MovieCard } from "@/components/movie-card";
import { Skeleton } from "@/components/skeleton";
import { useIntersectionObserver } from "crustack/hooks";

export default function MovieList({ genre_id }: { genre_id: number }) {
  const { data, hasNextPage, fetchNextPage, isLoading } =
    useInfiniteMovieByGenreQuery({
      genreId: genre_id,
    });

  const { ref } = useIntersectionObserver((entry) => {
    if (!entry.isIntersecting) return;
    if (!hasNextPage) return;
    fetchNextPage();
  });

  const filteredData = Array.from(
    new Map(
      data?.pages
        .flatMap((movies) => movies.results)
        .map((movie) => [movie.id, movie])
    ).values()
  );

  const [, ...rest] = filteredData;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 w-full">
        {rest.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
        {!!isLoading &&
          Array.from({ length: 20 }).map((_, i) => (
            <Skeleton.Text
              key={i}
              className="bg-gray-900 aspect-[2/3] h- full min-h-[400px]"
            />
          ))}
      </div>
      <div ref={ref} />
    </div>
  );
}
