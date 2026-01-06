import { useQuery } from "@tanstack/react-query";
import { HeroProps } from "..";
import { getMovieVideos } from "@/api/movie/movie-trailer";
import { getMovieById } from "@/api/movie/find-movie-by-id";
import { getMovieImages } from "@/api/movie/movie-images";
import { HeroTitle } from "./hero-title";
import { HeroGenres } from "./hero-genres";
import { HeroOverview } from "./hero-overview";
import { HeroActions } from "./hero-actions";
import { HeroProductionInfo } from "./hero-production-info";
import { HeroWatchProviders } from "./hero-watch-providers";

export const HeroContent = ({ movie, watchProviders }: HeroProps) => {
  const movieId = movie.id;

  const { data: movieDetails } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => getMovieById(movieId),
  });

  const { data: videos } = useQuery({
    queryKey: ["movie-videos", movieId],
    queryFn: () => getMovieVideos(movieId),
  });

  const { data: images } = useQuery({
    queryKey: ["movie-images", movieId],
    queryFn: () => getMovieImages(movieId),
  });

  if (!movieDetails || !videos || !images) return;

  const trailer = videos.results.find((v) => v.type === "Trailer");
  const releaseYear = new Date(movie.release_date).getFullYear();

  return (
    <div className="flex h-full">
      <div className="relative w-full flex flex-col items-start justify-center h-full px-3 md:px-6 max-w-2xl text-white gap-4 animate-slide-right-md">
        <HeroTitle
          images={images}
          movieDetails={movieDetails}
          year={releaseYear}
        />
        <HeroGenres genres={movieDetails.genres} />
        <HeroOverview overview={movieDetails.overview} />
        <HeroActions
          movieTrailer={trailer}
          voteAverage={movieDetails.vote_average * 10}
        />
        <HeroProductionInfo companies={movieDetails.production_companies} />
        <HeroWatchProviders watchProviders={watchProviders ?? {}} />
      </div>
    </div>
  );
};
