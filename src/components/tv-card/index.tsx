import { MovieRatingStars } from "@/components/movie-rating-stars";
import type { TV } from "@/types/tv";
import { getFilmImage } from "@/utils";
import { Link } from "@tanstack/react-router";

export const TvCard = ({ tv }: { tv: TV }) => {
  const firstYear = tv.first_air_date
    ? new Date(tv.first_air_date).getFullYear()
    : NaN;

  return (
    <article className="group flex h-full flex-col">
      <Link
        to="/serie/$id_and_title"
        params={{ id_and_title: `${tv.id}-${tv.name}` }}
        className="block h-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-mv-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-mv-void"
      >
        <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-white/8 transition-all duration-500 ease-out group-hover:ring-mv-gold/38 group-hover:shadow-[0_0_36px_-4px_rgba(212,165,116,0.28),0_20px_60px_-8px_rgba(0,0,0,0.65)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/4 bg-linear-to-b from-white/[0.035] to-transparent" />
          <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-mv-void via-mv-void/10 to-transparent opacity-55 transition-opacity duration-500 group-hover:opacity-75" />
          <img
            loading="lazy"
            width={500}
            height={750}
            src={getFilmImage(tv.poster_path, "w500")}
            className="aspect-[2/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            alt={`Locandina di ${tv.name}`}
            decoding="async"
          />
          <div className="mv-glass-card absolute bottom-0 left-0 right-0 z-20 p-3 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100 translate-y-2">
            <p className="font-display text-sm font-semibold leading-tight text-mv-cream line-clamp-2 drop-shadow-md">
              {tv.name}
            </p>
          </div>
        </div>
        <div className="mt-2 space-y-1.5 px-0.5">
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-mv-gold/80">
              {Number.isFinite(firstYear) ? firstYear : "—"}
            </p>
            <span className="h-px max-w-8 flex-1 bg-gradient-to-r from-mv-gold/40 to-transparent" />
          </div>
          <MovieRatingStars
            voteAverage={tv.vote_average}
            voteCount={tv.vote_count}
            size="sm"
            className="opacity-95"
          />
          {tv.number_of_seasons != null && tv.number_of_seasons > 0 ? (
            <p className="font-sans text-[0.65rem] font-medium tabular-nums text-mv-cream-muted/90">
              {tv.number_of_seasons}{" "}
              {tv.number_of_seasons === 1 ? "stagione" : "stagioni"}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
};
