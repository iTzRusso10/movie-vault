import { HeroImage } from "./hero-image";
import { HeroContent } from "./hero-content";
import { Movie, MovieDetails } from "@/types/movie";

export type HeroProps = {
  movie: MovieDetails | Movie;
};

export const Hero = ({ movie }: HeroProps) => {
  return (
    <section className="relative w-full h-[65vh] md:h-[80vh]">
      <HeroImage movie={movie} />
      <HeroContent movie={movie} />
    </section>
  );
};
