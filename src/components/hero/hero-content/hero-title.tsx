import { IMAGE_URL_ORIGINAL } from "@/routes/-const";
import { MovieDetails, MovieImages } from "@/types/movie";

interface HeroTitleProps {
  year: number;
  images: MovieImages;
  movieDetails: MovieDetails;
}

export const HeroTitle = ({ year, images, movieDetails }: HeroTitleProps) => {
  return (
    <>
      {!getLogo(images) ? (
        <h1 className="truncate !leading-normal text-wrap w-full text-3xl line-clamp-2 md:text-5xl font-extrabold">
          {movieDetails.title}
        </h1>
      ) : (
        <img
          alt="film-logo"
          width={getLogo(images)?.width}
          height={getLogo(images)?.height}
          src={`${IMAGE_URL_ORIGINAL}` + getLogo(images)?.file_path}
          className="w-auto h-auto md:max-w-[400px] md:max-h-[75px] max-w-[220px] max-h-[50px]"
        />
      )}
      {!!movieDetails.tagline && (
        <p className="font-bold text-sm">{movieDetails.tagline}</p>
      )}

      <p>
        {year}{" "}
        {!!movieDetails.runtime && <span>- {movieDetails.runtime}m</span>}
      </p>
    </>
  );
};

function getLogo(images: MovieImages) {
  if (images.logos.length === 0) return;

  return images.logos.reduce((acc, movie) =>
    movie.vote_count > acc.vote_count ? movie : acc
  );
}
