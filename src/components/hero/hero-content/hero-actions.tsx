import { FaPlay, FaStar } from "react-icons/fa6";
import { useState } from "react";
import StreamEmbed from "@/components/stream-embed";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import type { VixsrcItalianCatalog } from "@/lib/stream-embed-candidates";
import { MovieVideo } from "@/types/movie";
import { MovieRatingStars } from "@/components/movie-rating-stars";
import YoutubeEmbed from "../../youtube-embed";

interface HeroActionsProps {
  kind?: "movie" | "tv";
  movieId: number;
  movieTitle: string;
  posterPath: string | null;
  movieTrailer?: MovieVideo;
  voteAverage: number;
  voteCount: number;
  showStreamButton?: boolean;
  /** Lingua richiesta al player VixSRC per i film. */
  streamLang?: "it" | "en";
  /** Catalogo VixSRC IT per il film (solo `movie`). */
  vixsrcInItalian?: VixsrcItalianCatalog;
  showWishlist?: boolean;
}

export const HeroActions = ({
  kind = "movie",
  movieId,
  movieTitle,
  posterPath,
  movieTrailer,
  voteAverage,
  voteCount,
  showStreamButton = true,
  streamLang = "it",
  vixsrcInItalian = null,
  showWishlist = true,
}: HeroActionsProps) => {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [streamOpen, setStreamOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-4 md:gap-5">
      <div
        className="flex rounded-full border border-mv-gold/18 bg-mv-gold/6 p-3 shadow-[0_0_24px_rgba(192,132,252,0.2)] md:hidden"
        style={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <FaStar className="text-mv-gold-bright" size={22} />
      </div>
      {showWishlist && kind === "movie" ? (
        <WishlistButton
          variant="hero"
          movieId={movieId}
          title={movieTitle}
          posterPath={posterPath}
        />
      ) : null}
      {showStreamButton ? (
        <button
          type="button"
          onClick={() => {
            setTrailerOpen(false);
            setStreamOpen(true);
          }}
          className="mv-btn-gradient inline-flex items-center gap-2.5 rounded-xl px-6 py-2.5 font-sans text-sm font-bold text-white active:scale-95"
        >
          <FaPlay className="shrink-0 text-mv-gold-bright" size={14} />
          {streamLang === "it" ? "Riproduci" : "Riproduci in lingua originale"}
        </button>
      ) : null}
      {!!movieTrailer && (
        <button
          type="button"
          onClick={() => {
            setStreamOpen(false);
            setTrailerOpen(true);
          }}
          className="rounded-xl border border-white/12 px-6 py-2.5 font-sans text-sm font-semibold text-mv-cream transition-all duration-300 hover:border-white/22 hover:bg-white/8 active:scale-95"
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            backgroundColor: "rgba(255,255,255,0.04)",
          }}
        >
          Trailer
        </button>
      )}
      <MovieRatingStars
        voteAverage={voteAverage}
        voteCount={voteCount}
        size="lg"
        className="md:ml-1"
      />
      {!!movieTrailer && trailerOpen ? (
        <YoutubeEmbed
          onClose={() => setTrailerOpen(false)}
          video_id={movieTrailer.key}
        />
      ) : null}
      {streamOpen && showStreamButton ? (
        <StreamEmbed
          movieId={movieId}
          movieTitle={movieTitle}
          preferItalian={streamLang === "it"}
          vixsrcInItalian={vixsrcInItalian}
          onClose={() => setStreamOpen(false)}
        />
      ) : null}
    </div>
  );
};
