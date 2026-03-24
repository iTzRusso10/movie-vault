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

const HERO_QUERY_STALE = 1000 * 60 * 5;

export const HeroContent = ({ movie, watchProviders }: HeroProps) => {
  const movieId = movie.id;

  const { data: movieDetails } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => getMovieById(movieId),
    staleTime: HERO_QUERY_STALE,
  });

  const { data: videos } = useQuery({
    queryKey: ["movie-videos", movieId],
    queryFn: () => getMovieVideos(movieId),
    staleTime: HERO_QUERY_STALE,
  });

  const { data: images } = useQuery({
    queryKey: ["movie-images", movieId],
    queryFn: () => getMovieImages(movieId),
    staleTime: HERO_QUERY_STALE,
  });

  if (!movieDetails || !videos || !images) return;

  const trailer = videos.results.find((v) => v.type === "Trailer");
  const releaseYear = new Date(movie.release_date).getFullYear();

  return (
    <div className="relative z-10 flex min-h-[70vh] md:min-h-[85vh]">
      <div className="flex w-full max-w-2xl flex-col items-start justify-end gap-5 px-4 pb-14 pt-[var(--mv-nav-clearance)] text-mv-cream md:justify-center md:gap-6 md:px-10 md:pb-20 md:pt-32 animate-slide-right-md">
        <HeroTitle
          images={images}
          movieDetails={movieDetails}
          year={releaseYear}
        />
        <HeroGenres genres={movieDetails.genres} />
        <HeroOverview overview={movieDetails.overview} />
        <HeroActions
          movieId={movieDetails.id}
          movieTitle={movieDetails.title}
          posterPath={movieDetails.poster_path}
          movieTrailer={trailer}
          voteAverage={movieDetails.vote_average * 10}
        />
        <HeroProductionInfo companies={movieDetails.production_companies} />
        <HeroWatchProviders watchProviders={watchProviders ?? {}} />
      </div>
    </div>
  );
};
