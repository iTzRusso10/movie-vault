import { getMovieById } from "@/api/movie/find-movie-by-id";
import { getMovieReviews } from "@/api/movie/movie-reviews";
import { getSimilarMovies } from "@/api/movie/similar.movie";
import { getWatchProviders } from "@/api/movie/watch-providers";
import { Hero } from "@/components/hero";
import { MovieCard } from "@/components/movie-card";
import { IMAGE_URL_AVATAR } from "@/routes/-const";
import { MovieReview } from "@/types/movie";
import { createFileRoute } from "@tanstack/react-router";

function reviewAvatarSrc(path: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${IMAGE_URL_AVATAR}${path}`;
}

export const Route = createFileRoute("/film/$id_and_title")({
  component: SingleFilmPage,
  loader: async ({ params }) => {
    const { id_and_title } = params;
    const movieId = +id_and_title.split("-")[0];
    const similarMovies = await getSimilarMovies(movieId);
    const movie = await getMovieById(movieId);
    const watchProviders = await getWatchProviders(movieId);
    const reviews = await getMovieReviews(movieId);
    return { movie, watchProviders, similarMovies, reviews };
  },
});

function SingleFilmPage() {
  const { watchProviders, movie, similarMovies, reviews } =
    Route.useLoaderData();

  return (
    <div className="flex flex-col">
      <Hero movie={movie} watchProviders={watchProviders.results} />
      <section className="border-t border-mv-gold/10 bg-mv-deep/40 px-4 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="animate-slide-left-md">
            <h2 className="mb-3 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-mv-gold/70 md:hidden">
              Trama
            </h2>
            <p className="font-sans text-base leading-relaxed text-mv-cream/90 md:hidden">
              {movie.overview}
            </p>
          </div>
          <ReviewsSection reviews={reviews.results} />
          <div className="animate-slide-left-md mt-14 md:mt-20">
            <h2 className="mb-8 font-display text-3xl font-semibold tracking-tight text-mv-cream md:text-4xl">
              Film simili
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6 lg:gap-6">
              {similarMovies.slice(0, 6).map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ReviewsSection({ reviews }: { reviews: MovieReview[] }) {
  return (
    <div className="animate-slide-left-md mt-12 border-t border-mv-gold/10 pt-12 md:mt-16 md:pt-16">
      <h2 className="mb-8 font-display text-3xl font-semibold tracking-tight text-mv-cream md:text-4xl">
        Recensioni
      </h2>
      {reviews.length === 0 ? (
        <p className="font-sans text-sm text-mv-cream-muted">
          Nessuna recensione nel database TMDB per questo film.
        </p>
      ) : (
        <ul className="flex max-w-3xl flex-col gap-5">
          {reviews.map((rev) => (
            <li
              key={rev.id}
              className="rounded-2xl border border-mv-gold/10 bg-mv-panel/50 p-5 shadow-marquee backdrop-blur-sm transition-colors hover:border-mv-gold/20"
            >
              <div className="mb-3 flex gap-3">
                {reviewAvatarSrc(rev.author_details.avatar_path) ? (
                  <img
                    src={reviewAvatarSrc(rev.author_details.avatar_path)}
                    alt=""
                    className="size-11 shrink-0 rounded-full object-cover ring-1 ring-mv-gold/20"
                  />
                ) : (
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-mv-ember/30 font-sans text-sm font-bold text-mv-gold-bright ring-1 ring-mv-gold/20">
                    {(rev.author_details.name || rev.author || "?")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-sans font-semibold text-mv-cream">
                    {rev.author_details.name || rev.author}
                  </p>
                  {rev.author_details.rating != null && (
                    <p className="font-sans text-sm text-mv-gold">
                      Voto: {rev.author_details.rating}/10
                    </p>
                  )}
                  <p className="font-sans text-xs text-mv-cream-muted">
                    {new Date(rev.created_at).toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <p className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-mv-cream/85">
                {rev.content}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
