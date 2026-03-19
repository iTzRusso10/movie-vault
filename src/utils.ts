import { IMAGE_URL_ORIGINAL } from "./routes/-const";

const TMDB_IMG_BASE = "https://image.tmdb.org/t/p";

/** Tag TMDB per bilanciare qualità e peso (evita /original ovunque). */
export type TmdbImageSize =
  | "w342"
  | "w500"
  | "w780"
  | "w1280"
  | "original";

export function getTmdbImage(
  path: string | null,
  size: TmdbImageSize = "original"
): string {
  if (!path) return "/placeholder.jpg";
  if (size === "original") return `${IMAGE_URL_ORIGINAL}${path}`;
  return `${TMDB_IMG_BASE}/${size}${path}`;
}

/** Locandine e backdrop: passa una size per prestazioni migliori. */
export function getFilmImage(
  src: string | null,
  size: TmdbImageSize = "original"
): string {
  return getTmdbImage(src, size);
}

export function cn(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function toPx(input: number | string): string;
export function toPx(input: undefined): undefined;
export function toPx(input: string | number | undefined): string | undefined;
export function toPx(input: string | number | undefined): string | undefined {
  return typeof input === "number" ? `${input}px` : input;
}

export const getMovieAverage = (voteAverage: number): number => {
  return Math.round(voteAverage * 10);
};
