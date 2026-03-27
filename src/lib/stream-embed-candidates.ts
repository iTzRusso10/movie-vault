import {
  SECONDARY_PROVIDER_ORDER,
  buildProviderMovieUrl,
  buildProviderTvUrl,
  type StreamEmbedProviderId,
} from "@/lib/stream-embed-urls";

/** `true` / `false` dal catalogo VixSRC; `null` se richiesta fallita. */
export type VixsrcItalianCatalog = boolean | null;

export type StreamEmbedCandidate = {
  url: string;
  /** Nome visibile nell'UI (es. "AutoEmbed", "VidSrc EN"). */
  label: string;
  /** Attesa massima su questo src prima del prossimo fallback */
  settleMs: number;
  /** Alcuni provider (VidSrc, MultiEmbed) rifiutano `sandbox`; gli altri lo richiedono per evitare redirect top-level. */
  sandboxed: boolean;
};

const VIDSRC_IT_CONFIRMED_MS = 14_000;
const VIDSRC_IT_UNKNOWN_MS = 5_500;
const ALT_PROVIDER_MS = 13_000;
const VIDSRC_FALLBACK_MS = 16_000;

const PROVIDER_LABELS: Record<StreamEmbedProviderId, string> = {
  vidsrc: "VidSrc",
  autoembed: "AutoEmbed",
  multiembed: "MultiEmbed",
  twoembed: "2Embed",
};

/** Provider che rifiutano l'attributo `sandbox` sull'iframe. */
const SANDBOX_BLOCKED: Set<StreamEmbedProviderId> = new Set([
  "vidsrc",
  "multiembed",
]);

/**
 * Logica catena film:
 *
 * - `vixsrcInItalian === true`  → VidSrc IT (confermato dal catalogo), poi alt come resilienza, poi VidSrc EN.
 * - `vixsrcInItalian === false` → salta VidSrc IT (catalogo conferma assenza ITA) → alternatives IT → VidSrc EN.
 * - `vixsrcInItalian === null`  → VidSrc IT (timeout breve) → alternatives IT → VidSrc EN.
 *
 * `preferItalian === false` → solo VidSrc EN (lingua originale diretta).
 */
export function buildMovieStreamCandidates(options: {
  movieId: number;
  preferItalian: boolean;
  vixsrcInItalian: VixsrcItalianCatalog;
}): StreamEmbedCandidate[] {
  const { movieId, preferItalian, vixsrcInItalian } = options;

  if (!preferItalian) {
    return [
      {
        url: buildProviderMovieUrl("vidsrc", movieId, false),
        label: "VidSrc EN",
        settleMs: VIDSRC_FALLBACK_MS,
        sandboxed: false,
      },
    ];
  }

  const altProviders: StreamEmbedCandidate[] = SECONDARY_PROVIDER_ORDER.map(
    (p) => ({
      url: buildProviderMovieUrl(p, movieId, true),
      label: PROVIDER_LABELS[p],
      settleMs: ALT_PROVIDER_MS,
      sandboxed: !SANDBOX_BLOCKED.has(p),
    }),
  );

  const vidsrcEnFallback: StreamEmbedCandidate = {
    url: buildProviderMovieUrl("vidsrc", movieId, false),
    label: "VidSrc EN",
    settleMs: VIDSRC_FALLBACK_MS,
    sandboxed: false,
  };

  if (vixsrcInItalian === false) {
    return [...altProviders, vidsrcEnFallback];
  }

  return [
    {
      url: buildProviderMovieUrl("vidsrc", movieId, true),
      label: "VidSrc IT",
      settleMs:
        vixsrcInItalian === true
          ? VIDSRC_IT_CONFIRMED_MS
          : VIDSRC_IT_UNKNOWN_MS,
      sandboxed: false,
    },
    ...altProviders,
    vidsrcEnFallback,
  ];
}

/**
 * Logica catena TV: identica a film, parametrizzata su tvId/season/episode.
 */
export function buildTvStreamCandidates(options: {
  tvId: number;
  season: number;
  episode: number;
  preferItalian: boolean;
  episodeInItalianCatalog: VixsrcItalianCatalog;
}): StreamEmbedCandidate[] {
  const {
    tvId,
    season,
    episode,
    preferItalian,
    episodeInItalianCatalog,
  } = options;

  if (!preferItalian) {
    return [
      {
        url: buildProviderTvUrl("vidsrc", tvId, season, episode, false),
        label: "VidSrc EN",
        settleMs: VIDSRC_FALLBACK_MS,
        sandboxed: false,
      },
    ];
  }

  const altProviders: StreamEmbedCandidate[] = SECONDARY_PROVIDER_ORDER.map(
    (p) => ({
      url: buildProviderTvUrl(p, tvId, season, episode, true),
      label: PROVIDER_LABELS[p],
      settleMs: ALT_PROVIDER_MS,
      sandboxed: !SANDBOX_BLOCKED.has(p),
    }),
  );

  const vidsrcEnFallback: StreamEmbedCandidate = {
    url: buildProviderTvUrl("vidsrc", tvId, season, episode, false),
    label: "VidSrc EN",
    settleMs: VIDSRC_FALLBACK_MS,
    sandboxed: false,
  };

  if (episodeInItalianCatalog === false) {
    return [...altProviders, vidsrcEnFallback];
  }

  return [
    {
      url: buildProviderTvUrl("vidsrc", tvId, season, episode, true),
      label: "VidSrc IT",
      settleMs:
        episodeInItalianCatalog === true
          ? VIDSRC_IT_CONFIRMED_MS
          : VIDSRC_IT_UNKNOWN_MS,
      sandboxed: false,
    },
    ...altProviders,
    vidsrcEnFallback,
  ];
}
