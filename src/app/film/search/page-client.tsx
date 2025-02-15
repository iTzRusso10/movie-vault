"use client";

import { getMovieBySearch } from "@/api/movie/search-movie";
import { MovieCard } from "@/components/movie-card";
import { Movies } from "@/types/movie";
import { useUpdateEffect } from "crustack/hooks";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchPageClient() {
  const [movies, setMovies] = useState<Movies>();
  const searchParams = useSearchParams().get("query");

  useUpdateEffect(() => {
    if (!searchParams) return;

    const searchMovies = async () => {
      try {
        const movies = await getMovieBySearch(searchParams);
        setMovies(movies);
      } catch (e) {
        console.error(e);
      }
    };

    searchMovies();
  }, [searchParams]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 w-full mt-20">
      {movies?.results.length ? (
        movies.results.map((movie, i) => <MovieCard key={i} movie={movie} />)
      ) : (
        <div className="text-white">Nessun risultato.</div>
      )}
    </div>
  );
}
