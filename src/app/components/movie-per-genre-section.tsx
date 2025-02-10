import { getMovieByGenre } from "@/api/movie/movie-per-genres";
import { MoviesCarousel } from "./movie-carousel";
import { MOVIE_GENRES } from "../const";
import Link from "next/link";

export const MoviePerGenresSection = async () => {
  const moviesByGenre = await Promise.all(
    MOVIE_GENRES.map(async (genre) => {
      const { results } = await getMovieByGenre(genre.id, 1);
      return {
        id: genre.id,
        genreLabel: genre.label,
        movies: results,
      };
    })
  );

  return (
    <section className="flex flex-col gap-8 h-full">
      {moviesByGenre.map((genre) => (
        <SectionContainer key={genre.genreLabel}>
          <div className="flex justify-between items-center">
            <SectionTitle id={genre.id} title={genre.genreLabel} />
          </div>
          <MoviesCarousel movies={genre.movies} />
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
  return <div className={`flex flex-col px-4 md:px-8`}>{children}</div>;
};

export const SectionTitle = ({ title, id }: { title: string; id: number }) => {
  return (
    <Link href={`/film/genres/${id}-${title.toLowerCase()}`} prefetch>
      <h2 className="text-3xl font-extrabold text-white mb-4">{title}</h2>
    </Link>
  );
};
