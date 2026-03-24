import { FaPlay, FaStar } from "react-icons/fa6";
import { useState } from "react";
import StreamEmbed from "@/components/stream-embed";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { MovieVideo } from "@/types/movie";
import { MovieAverage } from "../../movie-average";
import YoutubeEmbed from "../../youtube-embed";

interface HeroActionsProps {
  movieId: number;
  movieTitle: string;
  posterPath: string | null;
  movieTrailer?: MovieVideo;
  voteAverage: number;
}

export const HeroActions = ({
  movieId,
  movieTitle,
  posterPath,
  movieTrailer,
  voteAverage,
}: HeroActionsProps) => {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [streamOpen, setStreamOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-4 md:gap-5">
      <div className="flex rounded-full border border-mv-gold/25 bg-mv-panel/80 p-3 md:hidden">
        <FaStar className="text-mv-gold-bright" size={22} />
      </div>
      <WishlistButton
        variant="hero"
        movieId={movieId}
        title={movieTitle}
        posterPath={posterPath}
      />
      <button
        type="button"
        onClick={() => {
          setTrailerOpen(false);
          setStreamOpen(true);
        }}
        className="inline-flex items-center gap-2 rounded-lg border border-mv-ember/40 bg-mv-ember/15 px-6 py-2.5 font-sans text-sm font-semibold text-mv-cream transition-all hover:border-mv-ember-glow/55 hover:bg-mv-ember/25"
      >
        <FaPlay className="shrink-0 text-mv-gold-bright" size={14} />
        Riproduci
      </button>
      {!!movieTrailer && (
        <button
          type="button"
          onClick={() => {
            setStreamOpen(false);
            setTrailerOpen(true);
          }}
          className="rounded-lg border border-mv-cream/25 bg-mv-cream/5 px-6 py-2.5 font-sans text-sm font-semibold text-mv-cream transition-all hover:border-mv-cream/50 hover:bg-mv-cream/10"
        >
          Trailer
        </button>
      )}
      <MovieAverage percentage={voteAverage} strokeWidth={5} size={56} />
      {!!movieTrailer && trailerOpen ? (
        <YoutubeEmbed
          onClose={() => setTrailerOpen(false)}
          video_id={movieTrailer.key}
        />
      ) : null}
      {streamOpen ? (
        <StreamEmbed
          movieId={movieId}
          movieTitle={movieTitle}
          onClose={() => setStreamOpen(false)}
        />
      ) : null}
    </div>
  );
};
