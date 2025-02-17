"use client";

import { getMovieBySearch } from "@/api/movie/search-movie";
import { MovieCard } from "@/components/movie-card";
import { useHideMobileKeyboard } from "@/hook/useHideMobileKeyboard";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/skeleton";

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  useHideMobileKeyboard();

  const { data, isLoading } = useQuery({
    queryKey: ["movies", query],
    queryFn: () => (query ? getMovieBySearch(query) : null),
    enabled: !!query,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 w-full mt-20 px-5">
      {isLoading ? (
        Array.from({ length: 20 }).map((_, i) => (
          <Skeleton.Text
            key={i}
            className="bg-gray-900 aspect-[2/3] h-[300px]"
          />
        ))
      ) : data?.results.length ? (
        data.results.map((movie, i) => <MovieCard key={i} movie={movie} />)
      ) : (
        <div className="text-white">Nessun risultato.</div>
      )}
    </div>
  );
}
