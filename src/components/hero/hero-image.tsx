import { getFilmImage } from "@/utils";
import { HeroProps } from ".";

export const HeroImage = ({ movie }: HeroProps) => {
  return (
    <div className="absolute inset-0 h-full w-full animate-slide-up-md">
      <img
        width={1280}
        height={720}
        className="h-full w-full object-cover object-center brightness-[1.08] saturate-[1.05]"
        alt=""
        src={getFilmImage(movie.backdrop_path, "w1280")}
        fetchPriority="high"
        decoding="async"
      />
      {/* Overlay più leggeri: il backdrop resta leggibile */}
      <div className="absolute inset-0 bg-gradient-to-r from-mv-void/55 via-mv-void/28 to-mv-void/5 md:from-mv-void/45 md:via-mv-void/22 md:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-mv-void/75 via-mv-void/18 to-transparent" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          background:
            "linear-gradient(115deg, rgba(158,47,61,0.45) 0%, transparent 42%, rgba(212,165,116,0.12) 100%)",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-mv-gold/35 to-transparent" />
    </div>
  );
};
