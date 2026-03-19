import { useQuery } from "@tanstack/react-query";
import { getMovieByGenre } from "@/api/movie/movie-per-genres";
import { MoviesCarousel } from "./movie-carousel";
import { MOVIE_GENRES } from "../routes/-const";
import { Link } from "@tanstack/react-router";
import { Movie } from "@/types/movie";

type MoviesByGenre = {
  id: number;
  genreLabel: string;
  movies: Movie[];
};

export const MoviePerGenresSection = () => {
  const { data } = useQuery({
    queryKey: ["movies-by-genres"],
    queryFn: async (): Promise<MoviesByGenre[]> => {
      return Promise.all(
        MOVIE_GENRES.map(async (genre) => {
          const { results } = await getMovieByGenre(genre.id, 1);
          return {
            id: genre.id,
            genreLabel: genre.label,
            movies: results,
          };
        })
      );
    },
  });

  return (
    <section className="relative flex flex-col gap-16 pb-12 pt-10 md:gap-20 md:pb-20 md:pt-14">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(90%,48rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-mv-gold/30 to-transparent"
        aria-hidden
      />
      {data?.map((genre, index) => (
        <SectionContainer key={genre.id}>
          <div
            className="animate-mv-fade-up"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <div className="mb-6 flex items-end justify-between gap-4">
              <SectionTitle id={genre.id} title={genre.genreLabel} />
            </div>
            <MoviesCarousel movies={genre.movies} />
          </div>
        </SectionContainer>
      ))}
    </section>
  );
};

export const SectionContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="flex flex-col px-4 md:px-10">{children}</div>;
};

export const SectionTitle = ({ title, id }: { title: string; id: number }) => {
  return (
    <Link
      to={`/film/genres/$genres_and_id`}
      params={{ genres_and_id: `${id}-${title.toLowerCase()}` }}
      search={{ year: undefined }}
      className="group inline-flex flex-col gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-mv-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-mv-void rounded-sm"
    >
      <span className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-mv-gold/70 transition-colors group-hover:text-mv-gold-bright">
        Esplora
      </span>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-mv-cream md:text-4xl">
        {title}
        <span className="ml-2 inline-block text-mv-gold transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </h2>
    </Link>
  );
};
