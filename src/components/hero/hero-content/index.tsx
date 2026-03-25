import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { HeroProps } from "..";
import { getMovieVideos } from "@/api/movie/movie-trailer";
import { getMovieById } from "@/api/movie/find-movie-by-id";
import { getMovieImages } from "@/api/movie/movie-images";
import { getTVById } from "@/api/tv/find-tv-by-id";
import { getTVVideos } from "@/api/tv/tv-videos";
import { getTVImages } from "@/api/tv/tv-images";
import { vixsrcMovieInCatalogFn } from "@/server/stream/vixsrc-catalog.server-fns";
import type { MovieDetails, MovieImages, MovieVideos } from "@/types/movie";
import type { TVDetails } from "@/types/tv";
import { HeroTitle } from "./hero-title";
import { HeroGenres } from "./hero-genres";
import { HeroOverview } from "./hero-overview";
import { HeroActions } from "./hero-actions";
import { HeroProductionInfo } from "./hero-production-info";
import { HeroWatchProviders } from "./hero-watch-providers";

const HERO_QUERY_STALE = 1000 * 60 * 5;

export const HeroContent = ({
  movie,
  watchProviders,
  kind = "movie",
}: HeroProps) => {
  const id = movie.id;
  const isTv = kind === "tv";
  const vixsrcCatalogFn = useServerFn(vixsrcMovieInCatalogFn);

  const { data: details } = useQuery<MovieDetails | TVDetails>({
    queryKey: isTv ? ["tv", id] : ["movie", id],
    queryFn: () => (isTv ? getTVById(id) : getMovieById(id)),
    staleTime: HERO_QUERY_STALE,
  });

  const { data: videos } = useQuery<MovieVideos>({
    queryKey: isTv ? ["tv-videos", id] : ["movie-videos", id],
    queryFn: () => (isTv ? getTVVideos(id) : getMovieVideos(id)),
    staleTime: HERO_QUERY_STALE,
  });

  const { data: images } = useQuery<MovieImages>({
    queryKey: isTv ? ["tv-images", id] : ["movie-images", id],
    queryFn: () => (isTv ? getTVImages(id) : getMovieImages(id)),
    staleTime: HERO_QUERY_STALE,
  });

  const { data: vixsrcCatalog, isPending: vixsrcPending } = useQuery({
    queryKey: ["vixsrc-catalog-movie-it", id],
    queryFn: () => vixsrcCatalogFn({ data: { movieId: id } }),
    enabled: !isTv,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
  });

  if (!details || !videos || !images) return;

  const trailer = videos.results.find((v) => v.type === "Trailer");

  const releaseYear = isTv
    ? new Date((details as TVDetails).first_air_date).getFullYear()
    : new Date((details as MovieDetails).release_date).getFullYear();

  const showStreamButton = isTv
    ? false
    : vixsrcPending
      ? false
      : vixsrcCatalog?.inCatalog !== false;

  const headline = isTv
    ? (details as TVDetails).name
    : (details as MovieDetails).title;

  const runtimeMovie = !isTv ? (details as MovieDetails).runtime : null;
  const epRun = isTv ? (details as TVDetails).episode_run_time?.[0] : null;
  const nSeasons = isTv ? (details as TVDetails).number_of_seasons : null;

  return (
    <div className="relative z-10 flex min-h-[70vh] md:min-h-[85vh]">
      <div className="flex w-full max-w-2xl flex-col items-start justify-end gap-5 px-4 pb-14 pt-[var(--mv-nav-clearance)] text-mv-cream md:justify-center md:gap-6 md:px-10 md:pb-20 md:pt-32 animate-slide-right-md">
        <HeroTitle
          images={images}
          headline={headline}
          year={releaseYear}
          tagline={details.tagline}
          runtimeMinutes={runtimeMovie}
          episodeRuntimeMinutes={epRun ?? null}
          numberOfSeasons={nSeasons}
        />
        <HeroGenres genres={details.genres} />
        <HeroOverview overview={details.overview} />
        <HeroActions
          kind={kind}
          movieId={details.id}
          movieTitle={headline}
          posterPath={details.poster_path}
          movieTrailer={trailer}
          voteAverage={details.vote_average}
          voteCount={details.vote_count}
          showStreamButton={showStreamButton}
          showWishlist={!isTv}
        />
        <HeroProductionInfo companies={details.production_companies} />
        <HeroWatchProviders watchProviders={watchProviders ?? {}} />
      </div>
    </div>
  );
};
