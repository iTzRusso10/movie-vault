import { HeroImage } from "./hero-image";
import { HeroContent } from "./hero-content";
import { Movie, MovieDetails, MovieWatchProviders } from "@/types/movie";
import type { TV, TVDetails } from "@/types/tv";

export type HeroProps = {
  kind?: "movie" | "tv";
  movie: MovieDetails | Movie | TVDetails | TV;
  watchProviders?: MovieWatchProviders["results"] | null;
};

export const Hero = ({
  movie,
  watchProviders,
  kind = "movie",
}: HeroProps) => {
  return (
    <section className="mv-hero-bleed relative isolate w-full min-h-[70vh] md:min-h-[85vh]">
      <HeroImage movie={movie} />
      <HeroContent
        kind={kind}
        movie={movie}
        watchProviders={watchProviders}
      />
    </section>
  );
};
