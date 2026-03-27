import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getMovieVideos } from "@/api/movie/movie-trailer";
import { getTVVideos } from "@/api/tv/tv-videos";
import { getFilmImage } from "@/utils";
import type { HeroProps } from ".";
import { pickYoutubeTrailer } from "./pick-youtube-trailer";

const HERO_QUERY_STALE = 1000 * 60 * 5;

export const HeroImage = ({ movie, kind = "movie" }: HeroProps) => {
  const id = movie.id;
  const isTv = kind === "tv";

  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const { data: videos } = useQuery({
    queryKey: isTv ? ["tv-videos", id] : ["movie-videos", id],
    queryFn: () => (isTv ? getTVVideos(id) : getMovieVideos(id)),
    staleTime: HERO_QUERY_STALE,
  });

  const trailerKey = pickYoutubeTrailer(videos?.results)?.key ?? null;
  const useTrailerBg = Boolean(trailerKey) && !reduceMotion;

  useEffect(() => {
    setIframeLoaded(false);
  }, [trailerKey]);

  /** `disablekb` / `fs=0` riducono UI; titolo e barra si mascherano con zoom + overlay. */
  const embedSrc = useTrailerBg
    ? `https://www.youtube.com/embed/${encodeURIComponent(trailerKey)}?autoplay=1&mute=1&controls=0&loop=1&playlist=${encodeURIComponent(trailerKey)}&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&fs=0`
    : null;

  return (
    <div className="absolute inset-0 h-full w-full animate-slide-up-md">
      <div className="relative h-full w-full overflow-hidden">
        <img
          width={1280}
          height={720}
          className={`h-full w-full object-cover object-center brightness-[1.08] saturate-[1.05] transition-opacity duration-700 ease-out ${
            useTrailerBg && iframeLoaded ? "opacity-0" : "opacity-100"
          }`}
          alt=""
          src={getFilmImage(movie.backdrop_path, "w1280")}
          fetchPriority="high"
          decoding="async"
        />
        {embedSrc ? (
          <div
            className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out ${
              iframeLoaded ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden
          >
            <div className="absolute inset-0 overflow-hidden">
              <iframe
                title=""
                className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.77vh] min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.22] border-0"
                src={embedSrc}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                referrerPolicy="strict-origin-when-cross-origin"
                onLoad={() => setIframeLoaded(true)}
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 z-1 h-[min(14vh,100px)] bg-linear-to-b from-mv-void from-40% to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-[min(22vh,140px)] bg-linear-to-t from-mv-void from-35% to-transparent" />
            </div>
          </div>
        ) : null}
      </div>
      <div className="absolute inset-0 bg-linear-to-r from-mv-void/55 via-mv-void/28 to-mv-void/5 md:from-mv-void/45 md:via-mv-void/22 md:to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-mv-void/75 via-mv-void/18 to-transparent" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          background:
            "linear-gradient(115deg, rgba(158,47,61,0.45) 0%, transparent 42%, rgba(212,165,116,0.12) 100%)",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-mv-gold/35 to-transparent" />
    </div>
  );
};
