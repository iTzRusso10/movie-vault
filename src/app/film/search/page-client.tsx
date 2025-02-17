"use client";

import { getMovieBySearch } from "@/api/movie/search-movie";
import { MovieCard } from "@/components/movie-card";
import { useHideMobileKeyboard } from "@/hook/useHideMobileKeyboard";
import { Movies } from "@/types/movie";
import { useMountEffect } from "crustack/hooks";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchPageClient() {
  useHideMobileKeyboard();
  const [movies, setMovies] = useState<Movies>();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useMountEffect(() => {
    if (!query) return;

    const searchMovies = async () => {
      try {
        const movies = await getMovieBySearch(query);
        setMovies(movies);
      } catch (e) {
        console.error(e);
      }
    };

    searchMovies();
  });

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
