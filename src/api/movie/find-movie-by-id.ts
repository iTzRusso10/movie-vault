import { MovieDetails } from "@/types/movie";
import { upfetch } from "../_upfetch";

function needsFallbackText(value: string | null | undefined): boolean {
  return value == null || !String(value).trim();
}

/**
 * Dettaglio film in italiano (`language` da `_upfetch`).
 * Se trama o tagline mancano in IT, seconda richiesta in EN e merge solo di quei campi.
 */
export const getMovieById = async (movieId: number): Promise<MovieDetails> => {
  const it = await upfetch<MovieDetails>(`movie/${movieId}`);
  const needOverview = needsFallbackText(it.overview);
  const needTagline = needsFallbackText(it.tagline);
  if (!needOverview && !needTagline) return it;

  const en = await upfetch<MovieDetails>(`movie/${movieId}`, {
    params: { language: "en-US" },
  });

  return {
    ...it,
    overview:
      needOverview && en.overview?.trim()
        ? en.overview
        : it.overview,
    tagline:
      needTagline && en.tagline?.trim()
        ? en.tagline
        : it.tagline,
  };
};
