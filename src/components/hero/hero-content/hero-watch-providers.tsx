import { IMAGE_URL_ORIGINAL } from "@/app/const";
import { MovieWatchProviders } from "@/types/movie";
import Image from "next/image";
import Link from "next/link";

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

  console.log(uniqueProviders);

  if (!uniqueProviders.length) return;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <p className="text-xs font-bold">Watch on:</p>
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
            href={validWatchProviders.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-wrap gap-2 items-center hover:opacity-80 transition-opacity"
            title="Vedi dove guardare su TMDB"
          >
            <Image
              src={`${IMAGE_URL_ORIGINAL}${provider?.logo_path}`}
              alt={provider?.provider_name ?? ""}
              width={30}
              height={30}
              className="rounded-lg object-contain"
            />
          </Link>
        ))}
    </div>
  );
};
