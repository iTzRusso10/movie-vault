import { getFilmImage } from "@/utils";
import { HeroProps } from ".";

export const HeroImage = ({ movie }: HeroProps) => {
  return (
    <div className="w-full h-full absolute animate-slide-up-md">
      <img
        width={600}
        height={400}
        className="w-full h-full object-cover inset-0 bg-right bg-no-repeat "
        alt={`${movie.title}-backdrop`}
        src={getFilmImage(movie.backdrop_path)}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-950 via-black/30 to-transparent"></div>
      <div className="absolute bg-gradient-to-t from-black bottom-0 via-black/100 to-transparent w-full h-16"></div>
    </div>
  );
};
