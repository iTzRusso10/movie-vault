import { getTVSeason } from "@/api/tv/tv-season";
import StreamEmbedTv from "@/components/stream-embed-tv";
import { vixsrcSeasonEpisodesInCatalogFn } from "@/server/stream/vixsrc-catalog.server-fns";
import type { TVEpisode } from "@/types/tv";
import { getFilmImage } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { FaPlay } from "react-icons/fa6";

type PlayTarget = {
  season: number;
  episode: number;
  episodeTitle: string;
  streamLang: "it" | "en";
};

export function TvEpisodesSection({
  tvId,
  seriesTitle,
  numberOfSeasons,
}: {
  tvId: number;
  seriesTitle: string;
  numberOfSeasons: number;
}) {
  const [season, setSeason] = useState(1);
  const [play, setPlay] = useState<PlayTarget | null>(null);

  const seasonFn = useServerFn(vixsrcSeasonEpisodesInCatalogFn);

  const { data: seasonData, isLoading: seasonLoading } = useQuery({
    queryKey: ["tv-season", tvId, season],
    queryFn: () => getTVSeason(tvId, season),
    enabled: numberOfSeasons > 0 && season >= 1 && season <= numberOfSeasons,
  });

  const { data: vixEp, isPending: vixPending } = useQuery({
    queryKey: ["vixsrc-season-eps", tvId, season],
    queryFn: () => seasonFn({ data: { tvId, season } }),
    enabled: numberOfSeasons > 0 && season >= 1 && season <= numberOfSeasons,
    staleTime: 1000 * 60 * 15,
  });

  const availableSet = useMemo(() => {
    if (!vixEp?.episodes) return null;
    return new Set(vixEp.episodes);
  }, [vixEp?.episodes]);

  const episodes = seasonData?.episodes ?? [];

  if (numberOfSeasons < 1) {
    return (
      <p className="font-sans text-sm text-mv-cream-muted">
        Nessun dato sulle stagioni per questa serie.
      </p>
    );
  }

  return (
    <div className="animate-slide-left-md mt-12 border-t border-mv-gold/10 pt-12 md:mt-16 md:pt-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-mv-cream md:text-4xl">
          Episodi
        </h2>
        <label className="flex min-w-[200px] flex-col gap-1.5 font-sans text-xs font-medium uppercase tracking-wider text-mv-cream-muted">
          Stagione
          <select
            className="rounded-xl border border-mv-gold/25 bg-mv-panel/90 px-4 py-2.5 font-sans text-sm font-normal normal-case tracking-normal text-mv-cream outline-none transition-all focus:border-mv-gold/50"
            value={season}
            onChange={(e) => setSeason(Number(e.target.value))}
          >
            {Array.from({ length: numberOfSeasons }, (_, i) => i + 1).map(
              (n) => (
                <option key={n} value={n}>
                  Stagione {n}
                </option>
              ),
            )}
          </select>
        </label>
      </div>

      {seasonLoading ? (
        <p className="font-sans text-sm text-mv-cream-muted">Caricamento…</p>
      ) : episodes.length === 0 ? (
        <p className="font-sans text-sm text-mv-cream-muted">
          Nessun episodio in elenco per questa stagione.
        </p>
      ) : (
        <ul className="flex list-none flex-col gap-3 pl-0" role="list">
          {episodes.map((ep) => (
            <EpisodeRow
              key={ep.id}
              ep={ep}
              catalogPending={vixPending}
              onPlay={(streamLang) =>
                setPlay({
                  season: ep.season_number,
                  episode: ep.episode_number,
                  episodeTitle: ep.name,
                  streamLang,
                })
              }
            />
          ))}
        </ul>
      )}

      {play ? (
        <StreamEmbedTv
          tvId={tvId}
          season={play.season}
          episode={play.episode}
          seriesTitle={seriesTitle}
          episodeTitle={play.episodeTitle}
          preferItalian={play.streamLang === "it"}
          episodeInItalianCatalog={
            vixEp?.episodes === null
              ? null
              : Boolean(availableSet?.has(play.episode))
          }
          onClose={() => setPlay(null)}
        />
      ) : null}
    </div>
  );
}

function EpisodeRow({
  ep,
  catalogPending,
  onPlay,
}: {
  ep: TVEpisode;
  catalogPending: boolean;
  onPlay: (streamLang: "it" | "en") => void;
}) {
  const air = ep.air_date
    ? new Date(ep.air_date).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <li className="flex min-w-0 gap-3 rounded-2xl border border-mv-gold/10 bg-mv-panel/50 p-3 shadow-marquee backdrop-blur-sm sm:gap-4 sm:p-4">
      <div className="relative aspect-video w-[120px] shrink-0 overflow-hidden rounded-lg bg-mv-ink ring-1 ring-mv-gold/15 sm:w-[160px]">
        {ep.still_path ? (
          <img
            src={getFilmImage(ep.still_path, "w300")}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-sans text-[0.65rem] uppercase tracking-wider text-mv-cream-muted">
            S{ep.season_number}E{ep.episode_number}
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="shrink-0 rounded border border-mv-gold/25 bg-mv-ink/80 px-2 py-0.5 font-sans text-[0.65rem] font-semibold tabular-nums uppercase tracking-wider text-mv-gold-bright">
            E{ep.episode_number}
          </span>
          <h3 className="min-w-0 font-display text-base font-semibold leading-snug text-mv-cream sm:text-lg">
            {ep.name}
          </h3>
        </div>
        {air ? (
          <p className="font-sans text-xs text-mv-cream-muted">{air}</p>
        ) : null}
        {ep.overview?.trim() ? (
          <p className="line-clamp-2 font-sans text-sm leading-relaxed text-mv-cream/80">
            {ep.overview}
          </p>
        ) : null}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          {catalogPending ? (
            <span className="font-sans text-[0.65rem] uppercase tracking-wider text-mv-cream-muted/80">
              Verifica catalogo…
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onPlay("it")}
              className="inline-flex items-center gap-2 rounded-lg border border-mv-ember/40 bg-mv-ember/15 px-4 py-2 font-sans text-xs font-semibold text-mv-cream transition-all hover:border-mv-ember-glow/55 hover:bg-mv-ember/25 sm:text-sm"
            >
              <FaPlay className="shrink-0 text-mv-gold-bright" size={12} />
              Riproduci
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
