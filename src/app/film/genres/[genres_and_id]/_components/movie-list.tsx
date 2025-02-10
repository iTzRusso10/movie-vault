"use client";

import { useInfiniteMovieByGenreQuery } from "@/api/movie/use-movie-query";
import { MovieCard } from "@/app/components/movie-card";
import { useIntersectionObserver } from "crustack/hooks";

export default function MovieList({ genre_id }: { genre_id: number }) {
  const { data, hasNextPage, fetchNextPage, isLoading } =
    useInfiniteMovieByGenreQuery({
      genreId: genre_id,
    });

  const numberOfMoviesLoaded = data?.pages.reduce(
    (acc, page) => acc + page.results.length,
    0
  );

  const { ref } = useIntersectionObserver((entry) => {
    if (!entry.isIntersecting) return;
    if (!hasNextPage) return;
    fetchNextPage();
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 w-full">
        {data?.pages.map((movies) =>
          movies.results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        )}
      </div>
      <div ref={ref} />
    </div>
  );
}
