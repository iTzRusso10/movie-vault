import { useQuery } from "@tanstack/react-query";
import { getMovieByGenre } from "@/api/movie/movie-per-genres";
import { MoviesCarousel } from "./movie-carousel";
import { MOVIE_GENRES } from "../routes/-const";
import { Link } from "@tanstack/react-router";

type MoviesByGenre = {
  id: number;
  genreLabel: string;
  movies: any[];
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

  console.log(data);

  return (
    <section className="flex flex-col gap-8 h-full">
      {data?.map((genre) => (
        <SectionContainer key={genre.id}>
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
    <Link to={`/film/genres/${id}-${title.toLowerCase()}`}>
      <h2 className="text-3xl font-extrabold text-white mb-4">{title}</h2>
    </Link>
  );
};
