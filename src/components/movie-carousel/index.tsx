import { MovieCard } from "../movie-card";
import { Movie } from "@/types/movie";
import {
  ShadcnCarousel,
  ShadcnCarouselContent,
  ShadcnCarouselItem,
} from "../shadcn-carousel";

export function MoviesCarousel({ movies }: { movies: Movie[] }) {
  return (
    <ShadcnCarousel
      opts={{
        align: "center",
        skipSnaps: true,
      }}
      gap={14}
    >
      <ShadcnCarouselContent className="h-auto">
        {movies.map((movie) => (
          <ShadcnCarouselItem
            key={movie.id}
            className={
              "!basis-[45%] sm:!basis-[30%] md:!basis-[23%] lg:!basis-[19%] xl:!basis-[14%]"
            }
          >
            <div className="relative w-full h-full">
              <MovieCard movie={movie} />
            </div>
          </ShadcnCarouselItem>
        ))}
      </ShadcnCarouselContent>
    </ShadcnCarousel>
  );
}
