import { Movie } from "@/types/movie";
import { getFilmImage } from "@/utils";
import { Link } from "@tanstack/react-router";

export const MovieCard = ({ movie }: { movie: Movie }) => {
  const releaseYear = new Date(movie.release_date).getFullYear();

  if (!movie.poster_path && !movie.backdrop_path) return;

  return (
    <div className="flex flex-col h-full">
      <Link to={`/film/${movie.id}-${movie.title}`}>
        <div className="relative w-full">
          <img
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
