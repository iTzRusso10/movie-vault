import { HeroImage } from "./hero-image";
import { HeroContent } from "./hero-content";
import { Movie, MovieDetails, MovieWatchProviders } from "@/types/movie";

export type HeroProps = {
  movie: MovieDetails | Movie;
  watchProviders?: MovieWatchProviders["results"] | null;
};

export const Hero = ({ movie, watchProviders }: HeroProps) => {
  return (
    <section className="mv-hero-bleed relative isolate w-full min-h-[70vh] md:min-h-[85vh]">
      <HeroImage movie={movie} />
      <HeroContent movie={movie} watchProviders={watchProviders} />
    </section>
  );
};
