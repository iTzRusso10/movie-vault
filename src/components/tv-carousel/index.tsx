import { TvCard } from "../tv-card";
import type { TV } from "@/types/tv";
import {
  ShadcnCarousel,
  ShadcnCarouselContent,
  ShadcnCarouselItem,
} from "../shadcn-carousel";

export function TvCarousel({ shows }: { shows: TV[] }) {
  return (
    <ShadcnCarousel
      opts={{
        align: "center",
        skipSnaps: true,
      }}
      gap={14}
    >
      <ShadcnCarouselContent className="h-auto">
        {shows.map((tv) => (
          <ShadcnCarouselItem
            key={tv.id}
            className={
              "!basis-[45%] sm:!basis-[30%] md:!basis-[23%] lg:!basis-[19%] xl:!basis-[14%]"
            }
          >
            <div className="relative h-full w-full">
              <TvCard tv={tv} />
            </div>
          </ShadcnCarouselItem>
        ))}
      </ShadcnCarouselContent>
    </ShadcnCarousel>
  );
}
