import { IMAGE_URL_ORIGINAL } from "@/app/const";
import { MovieImages } from "@/types/movie";
import Image from "next/image";

interface HeroTitleProps {
  title: string;
  year: number;
  duration: number | null;
  images: MovieImages;
}

export const HeroTitle = ({
  title,
  year,
  duration,
  images,
}: HeroTitleProps) => {
  return (
    <>
      {!getLogo(images) ? (
        <h1 className="truncate !leading-normal text-wrap w-full text-3xl line-clamp-2 md:text-5xl font-extrabold">
          {title}
        </h1>
      ) : (
        <Image
          priority
          alt="film-logo"
          width={getLogo(images)?.width}
          height={getLogo(images)?.height}
          src={`${IMAGE_URL_ORIGINAL}` + getLogo(images)?.file_path}
          className="w-auto h-auto md:max-w-[400px] md:max-h-[75px] max-w-[220px] max-h-[50px]"
        />
      )}

      <p>
        {year} {!!duration && <span>- {duration}m</span>}
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
