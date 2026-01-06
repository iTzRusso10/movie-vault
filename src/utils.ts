import { IMAGE_URL_ORIGINAL } from "./routes/-const";

export function getFilmImage(src: string | null): string {
  return src ? `${IMAGE_URL_ORIGINAL}${src}` : "/placeholder.jpg";
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
