import { IMAGE_URL_ORIGINAL } from "@/routes/-const";
import type { MovieImages } from "@/types/movie";

interface HeroTitleProps {
  images: MovieImages;
  headline: string;
  year: number;
  tagline?: string | null;
  runtimeMinutes?: number | null;
  /** Serie TV: durata tipica episodio (primo valore TMDB). */
  episodeRuntimeMinutes?: number | null;
  numberOfSeasons?: number | null;
}

export const HeroTitle = ({
  images,
  headline,
  year,
  tagline,
  runtimeMinutes,
  episodeRuntimeMinutes,
  numberOfSeasons,
}: HeroTitleProps) => {
  return (
    <header className="w-full space-y-3">
      {!getLogo(images) ? (
        <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-mv-cream md:text-5xl lg:text-6xl">
          <span className="mv-text-gradient">{headline}</span>
        </h1>
      ) : (
        <img
          alt={`Logo ${headline}`}
          width={getLogo(images)?.width}
          height={getLogo(images)?.height}
          src={`${IMAGE_URL_ORIGINAL}` + getLogo(images)?.file_path}
          className="h-auto max-h-[52px] w-auto max-w-[240px] object-contain object-left drop-shadow-lg md:max-h-[76px] md:max-w-[400px]"
        />
      )}
      {!!tagline?.trim() && (
        <p className="max-w-xl font-display text-base italic text-mv-gold/90 md:text-lg">
          {tagline}
        </p>
      )}

      <p className="flex flex-wrap items-center gap-2 font-sans text-sm text-mv-cream-muted">
        <span className="rounded border border-mv-gold/20 bg-mv-panel/60 px-2 py-0.5 font-semibold tracking-wide text-mv-gold-bright">
          {Number.isFinite(year) ? year : "—"}
        </span>
        {!!runtimeMinutes && (
          <>
            <span className="text-mv-cream-muted/40">·</span>
            <span>{runtimeMinutes} min</span>
          </>
        )}
        {numberOfSeasons != null && numberOfSeasons > 0 && (
          <>
            <span className="text-mv-cream-muted/40">·</span>
            <span>
              {numberOfSeasons}{" "}
              {numberOfSeasons === 1 ? "stagione" : "stagioni"}
            </span>
          </>
        )}
        {episodeRuntimeMinutes != null && episodeRuntimeMinutes > 0 && (
          <>
            <span className="text-mv-cream-muted/40">·</span>
            <span>~{episodeRuntimeMinutes} min/ep</span>
          </>
        )}
      </p>
    </header>
  );
};

function getLogo(images: MovieImages) {
  if (images.logos.length === 0) return;

  return images.logos.reduce((acc, movie) =>
    movie.vote_count > acc.vote_count ? movie : acc,
  );
}
