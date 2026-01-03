"use client";

import { FaStar } from "react-icons/fa6";
import { useState } from "react";
import { MovieVideo } from "@/types/movie";
import { MovieAverage } from "../../movie-average";
import YoutubeEmbed from "../../youtube-embed";

interface HeroActionsProps {
  movieTrailer?: MovieVideo;
  voteAverage: number;
}

export const HeroActions = ({
  movieTrailer,
  voteAverage,
}: HeroActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex gap-5 items-center">
      <div className="bg-purple-600 rounded-full p-3 md:hidden">
        <FaStar size={25} />
      </div>
      <button className="hidden text-sm md:block px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-300">
        Add to wishlist
      </button>
      {!!movieTrailer && (
        <button
          onClick={() => setIsOpen(true)}
          className="px-6 py-2 bg-white text-sm text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-300"
        >
          Trailer
        </button>
      )}
      <MovieAverage percentage={voteAverage} strokeWidth={6} size={54} />
      {!!movieTrailer && !!isOpen && (
        <YoutubeEmbed
          onClose={() => setIsOpen(false)}
          video_id={movieTrailer.key}
        />
      )}
    </div>
  );
};
