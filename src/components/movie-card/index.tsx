import { Movie } from "@/types/movie";
import { getFilmImage } from "@/utils";
import { Link } from "@tanstack/react-router";

export const MovieCard = ({ movie }: { movie: Movie }) => {
  const releaseYear = new Date(movie.release_date).getFullYear();

  return (
    <article className="group flex h-full flex-col">
      <Link
        to={`/film/$id_and_title`}
        params={{ id_and_title: `${movie.id}-${movie.title}` }}
        className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-mv-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-mv-void rounded-xl"
      >
        <div className="relative w-full overflow-hidden rounded-xl ring-1 ring-mv-gold/15 transition-all duration-500 ease-out group-hover:ring-mv-gold/45 group-hover:shadow-gold-glow">
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-mv-void via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />
          <img
            loading="lazy"
            width={500}
            height={750}
            src={getFilmImage(movie.poster_path, "w500")}
            className="aspect-[2/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            alt={`Locandina di ${movie.title}`}
            decoding="async"
          />
          <div className="absolute bottom-0 left-0 right-0 z-20 p-3 opacity-0 transition-all duration-300 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0">
            <p className="font-display text-sm font-semibold leading-tight text-mv-cream line-clamp-2 drop-shadow-md">
              {movie.title}
            </p>
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-2 px-0.5">
          <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-mv-gold/80">
            {Number.isFinite(releaseYear) ? releaseYear : "—"}
          </p>
          <span className="h-px flex-1 max-w-8 bg-gradient-to-r from-mv-gold/40 to-transparent" />
        </div>
      </Link>
    </article>
  );
};
