import { FaStar } from "react-icons/fa6";
import { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

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
      {!!movieTrailer && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-lg border border-mv-cream/25 bg-mv-cream/5 px-6 py-2.5 font-sans text-sm font-semibold text-mv-cream transition-all hover:border-mv-cream/50 hover:bg-mv-cream/10"
        >
          Trailer
        </button>
      )}
      <MovieAverage percentage={voteAverage} strokeWidth={5} size={56} />
      {!!movieTrailer && !!isOpen && (
        <YoutubeEmbed
          onClose={() => setIsOpen(false)}
          video_id={movieTrailer.key}
        />
      )}
    </div>
  );
};
