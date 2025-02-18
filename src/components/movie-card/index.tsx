"use client";
import { Movie } from "@/types/movie";
import { getFilmImage } from "@/utils";
import { default as NextImage } from "next/image";
import Link from "next/link";

export const MovieCard = ({ movie }: { movie: Movie }) => {
  const releaseYear = new Date(movie.release_date).getFullYear();

  if (!movie.poster_path && !movie.backdrop_path) return;

  return (
    <div className="flex flex-col h-full">
      <Link href={`/film/${movie.id}-${movie.title}`} prefetch scroll>
        <div className="relative w-full">
          <NextImage
            loading="lazy"
            width={500}
            height={1000}
            src={getFilmImage(movie.poster_path)}
            className="rounded-md w-full aspect-[2/3] object-cover"
            alt={`${movie.title}-poster`}
          />
        </div>
        <div className="flex flex-col justify-center items-center">
          <p className="text-white">{releaseYear.toString()}</p>
        </div>
      </Link>
    </div>
  );
};
