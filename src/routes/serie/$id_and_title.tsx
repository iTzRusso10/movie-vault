import { getTVById } from "@/api/tv/find-tv-by-id";
import { getSimilarTV } from "@/api/tv/similar-tv";
import { getTVWatchProviders } from "@/api/tv/tv-watch-providers";
import { Hero } from "@/components/hero";
import { TvCard } from "@/components/tv-card";
import { createFileRoute } from "@tanstack/react-router";
import { TvEpisodesSection } from "./-components/tv-episodes-section";

export const Route = createFileRoute("/serie/$id_and_title")({
  component: SingleSeriePage,
  loader: async ({ params }) => {
    const { id_and_title } = params;
    const tvId = +id_and_title.split("-")[0];
    const similar = await getSimilarTV(tvId);
    const tv = await getTVById(tvId);
    const watchProviders = await getTVWatchProviders(tvId);
    return { tv, watchProviders, similar };
  },
});

function SingleSeriePage() {
  const { watchProviders, tv, similar } = Route.useLoaderData();

  return (
    <div className="flex flex-col">
      <Hero kind="tv" movie={tv} watchProviders={watchProviders.results} />
      <section className="border-t border-mv-gold/10 bg-mv-deep/40 px-4 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="animate-slide-left-md">
            <h2 className="mb-3 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-mv-gold/70 md:hidden">
              Trama
            </h2>
            <p className="font-sans text-base leading-relaxed text-mv-cream/90 md:hidden">
              {tv.overview}
            </p>
          </div>
          <TvEpisodesSection
            tvId={tv.id}
            seriesTitle={tv.name}
            numberOfSeasons={tv.number_of_seasons}
          />
          {similar.length > 0 ? (
            <div className="animate-slide-left-md mt-14 md:mt-20">
              <h2 className="mb-8 font-display text-3xl font-semibold tracking-tight text-mv-cream md:text-4xl">
                Serie simili
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6 lg:gap-6">
                {similar.slice(0, 6).map((s) => (
                  <TvCard key={s.id} tv={s} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
