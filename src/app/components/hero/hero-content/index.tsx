import { HeroProps } from "..";
import { getMovieVideos } from "@/api/movie/movie-trailer";
import { getMovieById } from "@/api/movie/find-movie-by-id";
import { HeroTitle } from "./hero-title";
import { HeroGenres } from "./hero-genres";
import { HeroOverview } from "./hero-overview";
import { HeroActions } from "./hero-actions";
import { HeroProductionInfo } from "./hero-production-info";

export const HeroContent = async ({ movie }: HeroProps) => {
  const movieDetails = await getMovieById(movie.id);
  const movieVideo = (await getMovieVideos(movie.id)).results;
  const movieTrailer = movieVideo.find((video) => video.type === "Trailer");
  const relaseYear = new Date(movie.release_date).getFullYear();

  return (
    <div className="flex h-full motion-translate-x-in-[-25%] motion-translate-y-in-[0%]">
      <div className="relative w-full flex flex-col items-start justify-center h-full px-3 md:px-6 max-w-2xl text-white gap-4">
        <HeroTitle title={movie.title} year={relaseYear} />
        <HeroGenres genres={movieDetails.genres} />
        <HeroOverview overview={movieDetails.overview} />
        <HeroActions
          movieTrailer={movieTrailer}
          voteAverage={movieDetails.vote_average * 10}
        />
        <HeroProductionInfo companies={movieDetails.production_companies} />
      </div>
    </div>
  );
};
