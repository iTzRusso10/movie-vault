import { IMAGE_URL_ORIGINAL } from "@/routes/-const";
import { MovieWatchProviders } from "@/types/movie";
import { Link } from "@tanstack/react-router";

export const HeroWatchProviders = ({
  watchProviders,
}: {
  watchProviders: MovieWatchProviders["results"];
}) => {
  const validWatchProviders = watchProviders["IT"]
    ? watchProviders["IT"]
    : watchProviders["US"];

  if (!validWatchProviders || !validWatchProviders.link) return;

  const flatrateProviders = validWatchProviders.flatrate;
  const rentProviders = validWatchProviders.rent;
  const buyProviders = validWatchProviders.buy;

  const allProviders = [flatrateProviders, rentProviders, buyProviders].flat();

  const uniqueProviders = [
    ...new Map(
      allProviders.map((provider) => [provider?.provider_name, provider])
    ).values(),
  ].filter(Boolean);

  if (!uniqueProviders.length) return;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-mv-cream-muted">
        Dove guardare
      </p>
      {uniqueProviders
        .sort((a, b) => {
          const aPriority =
            typeof a?.display_priority === "number"
              ? a.display_priority
              : Number.POSITIVE_INFINITY;
          const bPriority =
            typeof b?.display_priority === "number"
              ? b.display_priority
              : Number.POSITIVE_INFINITY;
          return aPriority - bPriority;
        })
        .map((provider) => (
          <Link
            key={provider?.provider_id}
            to={validWatchProviders.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-wrap items-center gap-2 rounded-lg ring-1 ring-transparent transition-all hover:opacity-90 hover:ring-mv-gold/25"
            title="Apri su TMDB"
          >
            <img
              src={`${IMAGE_URL_ORIGINAL}${provider?.logo_path}`}
              alt={provider?.provider_name ?? ""}
              width={30}
              height={30}
              className="rounded-md object-contain"
            />
          </Link>
        ))}
    </div>
  );
};
