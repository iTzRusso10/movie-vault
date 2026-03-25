import { useInfiniteTVByGenreQuery } from "@/api/tv/use-tv-query";
import type { TVDiscoverSort } from "@/api/tv/tv-per-genres";
import { TvCard } from "@/components/tv-card";
import { Skeleton } from "@/components/skeleton";
import { useIntersectionObserver } from "crustack/hooks";

export default function TvList({
  genre_id,
  yearMin,
  yearMax,
  sort = "popularity",
}: {
  genre_id: number;
  yearMin?: number;
  yearMax?: number;
  sort?: TVDiscoverSort;
}) {
  const { data, hasNextPage, fetchNextPage, isLoading } =
    useInfiniteTVByGenreQuery({
      genreId: genre_id,
      yearMin,
      yearMax,
      sort,
    });

  const { ref } = useIntersectionObserver((entry) => {
    if (!entry.isIntersecting) return;
    if (!hasNextPage) return;
    fetchNextPage();
  });

  const filteredData = Array.from(
    new Map(
      data?.pages
        .flatMap((page) => page.results)
        .map((tv) => [tv.id, tv]),
    ).values(),
  );

  const [, ...rest] = filteredData;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {rest.map((tv) => (
          <TvCard key={tv.id} tv={tv} />
        ))}
        {!!isLoading &&
          Array.from({ length: 20 }).map((_, i) => (
            <Skeleton.Text
              key={i}
              className="aspect-[2/3] min-h-[400px] rounded-xl bg-mv-panel ring-1 ring-mv-gold/10"
            />
          ))}
      </div>
      <div ref={ref} />
    </div>
  );
}
