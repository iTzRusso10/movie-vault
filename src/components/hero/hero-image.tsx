import { getFilmImage } from "@/utils";
import { HeroProps } from ".";

export const HeroImage = ({ movie }: HeroProps) => {
  return (
    <div className="absolute inset-0 h-full w-full animate-slide-up-md">
      <img
        width={1920}
        height={1080}
        className="h-full w-full object-cover object-center"
        alt=""
        src={getFilmImage(movie.backdrop_path)}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-mv-void via-mv-void/85 to-mv-void/20 md:via-mv-void/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-mv-void via-mv-void/40 to-transparent" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          background:
            "linear-gradient(115deg, rgba(158,47,61,0.5) 0%, transparent 42%, rgba(212,165,116,0.15) 100%)",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-mv-gold/35 to-transparent" />
    </div>
  );
};
