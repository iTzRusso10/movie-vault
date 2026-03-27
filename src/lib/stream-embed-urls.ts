/**
 * Costruzione URL per player embed di terze parti (TMDB).
 * I domini cambiano spesso: aggiorna le costanti qui se un provider smette di rispondere.
 *
 * Solo VidSrc supporta `?lang=`; gli altri provider non hanno parametri lingua.
 */
import {
  VIXSRC_FALLBACK_LANG,
  VIXSRC_MOVIE_BASE,
  VIXSRC_PREFERRED_LANG,
  VIXSRC_TV_BASE,
} from "@/routes/-const";

export type StreamEmbedProviderId =
  | "vidsrc"
  | "autoembed"
  | "multiembed"
  | "twoembed";

/** https://autoembed.co — film e serie TMDB */
export const AUTOEMBED_MOVIE_BASE = "https://autoembed.co/movie/tmdb";
/** Segmento: `{tmdbId}-{season}-{episode}` */
export const AUTOEMBED_TV_TMDB_PATH = "https://autoembed.co/tv/tmdb";

/** https://multiembed.mov — TMDB via query */
export const MULTIEMBED_BASE = "https://multiembed.mov/";

/** https://www.2embed.cc — documentazione ufficiale in home */
export const TWOEMBED_MOVIE_EMBED = "https://www.2embed.cc/embed";
export const TWOEMBED_TV_EMBED = "https://www.2embed.cc/embedtv";

export function buildVidsrcMovieUrl(
  movieId: number,
  lang: string,
): string {
  const u = new URL(`${VIXSRC_MOVIE_BASE}/${movieId}`);
  u.searchParams.set("lang", lang);
  return u.toString();
}

export function buildVidsrcTvUrl(
  tvId: number,
  season: number,
  episode: number,
  lang: string,
): string {
  const u = new URL(`${VIXSRC_TV_BASE}/${tvId}/${season}/${episode}`);
  u.searchParams.set("lang", lang);
  return u.toString();
}

function buildAutoembedMovieUrl(movieId: number): string {
  return `${AUTOEMBED_MOVIE_BASE}/${movieId}`;
}

function buildAutoembedTvUrl(
  tvId: number,
  season: number,
  episode: number,
): string {
  return `${AUTOEMBED_TV_TMDB_PATH}/${tvId}-${season}-${episode}`;
}

function buildMultiembedMovieUrl(movieId: number): string {
  const u = new URL(MULTIEMBED_BASE);
  u.searchParams.set("video_id", String(movieId));
  u.searchParams.set("tmdb", "1");
  return u.toString();
}

function buildMultiembedTvUrl(
  tvId: number,
  season: number,
  episode: number,
): string {
  const u = new URL(MULTIEMBED_BASE);
  u.searchParams.set("video_id", String(tvId));
  u.searchParams.set("tmdb", "1");
  u.searchParams.set("s", String(season));
  u.searchParams.set("e", String(episode));
  return u.toString();
}

function buildTwoembedMovieUrl(movieId: number): string {
  return `${TWOEMBED_MOVIE_EMBED}/${movieId}`;
}

/** 2embed documenta `embedtv/{tmdbId}&s=1&e=1`; qui usiamo query string valida. */
export function buildTwoembedTvUrlNormalized(
  tvId: number,
  season: number,
  episode: number,
): string {
  const path = `${TWOEMBED_TV_EMBED}/${tvId}`;
  const qs = new URLSearchParams({
    s: String(season),
    e: String(episode),
  });
  return `${path}?${qs.toString()}`;
}

export function buildProviderMovieUrl(
  provider: StreamEmbedProviderId,
  movieId: number,
  preferItalian: boolean,
): string {
  switch (provider) {
    case "vidsrc":
      return buildVidsrcMovieUrl(
        movieId,
        preferItalian ? VIXSRC_PREFERRED_LANG : VIXSRC_FALLBACK_LANG,
      );
    case "autoembed":
      return buildAutoembedMovieUrl(movieId);
    case "multiembed":
      return buildMultiembedMovieUrl(movieId);
    case "twoembed":
      return buildTwoembedMovieUrl(movieId);
    default: {
      const _exhaustive: never = provider;
      return _exhaustive;
    }
  }
}

export function buildProviderTvUrl(
  provider: StreamEmbedProviderId,
  tvId: number,
  season: number,
  episode: number,
  preferItalian: boolean,
): string {
  switch (provider) {
    case "vidsrc":
      return buildVidsrcTvUrl(
        tvId,
        season,
        episode,
        preferItalian ? VIXSRC_PREFERRED_LANG : VIXSRC_FALLBACK_LANG,
      );
    case "autoembed":
      return buildAutoembedTvUrl(tvId, season, episode);
    case "multiembed":
      return buildMultiembedTvUrl(tvId, season, episode);
    case "twoembed":
      return buildTwoembedTvUrlNormalized(tvId, season, episode);
    default: {
      const _exhaustive: never = provider;
      return _exhaustive;
    }
  }
}

/** Ordine fallback dopo VidSrc (preferenza italiana). */
export const SECONDARY_PROVIDER_ORDER: StreamEmbedProviderId[] = [
  "autoembed",
  "multiembed",
  "twoembed",
];
