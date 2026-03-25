export const IMAGE_URL_ORIGINAL = "https://image.tmdb.org/t/p/original";
export const IMAGE_URL_AVATAR = "https://image.tmdb.org/t/p/w45";

/** Base URL player esterno (id = TMDB movie id). */
export const VIXSRC_MOVIE_BASE = "https://vixsrc.to/movie";

/** Player serie: TMDB show id + stagione + episodio. */
export const VIXSRC_TV_BASE = "https://vixsrc.to/tv";

/**
 * Catalogo film TMDB per lingua (`type`: movie | tv | episode). Serve trailing `/` (evita 301 → http).
 * @see https://vixsrc.to/api/list/movie/?lang=it
 */
export const vixsrcListUrl = (type: "movie" | "tv" | "episode", lang: string) =>
  `https://vixsrc.to/api/list/${type}/?lang=${encodeURIComponent(lang)}`;

/** Codice lingua richiesta al player (`?lang=…`). Dipende da cosa offre il sito. */
export const VIXSRC_PREFERRED_LANG = "it";

/** Se il titolo non è nel catalogo IT, il player usa questa lingua (tipic. originale/EN). */
export const VIXSRC_FALLBACK_LANG = "en";

/** Generi TMDB per `/discover/tv` (id diversi dai film). */
export const TV_GENRES = [
  { id: 10759, label: "Action & Adventure" },
  { id: 16, label: "Animazione" },
  { id: 35, label: "Commedia" },
  { id: 80, label: "Crime" },
  { id: 99, label: "Documentario" },
  { id: 18, label: "Dramma" },
  { id: 10751, label: "Famiglia" },
  { id: 9648, label: "Mistero" },
  { id: 10765, label: "Sci-Fi & Fantasy" },
  { id: 37, label: "Western" },
];

export const MOVIE_GENRES = [
  { id: 27, label: "Horror" },
  { id: 35, label: "Comedy" },
  { id: 28, label: "Action" },
  { id: 16, label: "Animation" },
  { id: 80, label: "Crime" },
  { id: 99, label: "Documentary" },
  { id: 18, label: "Drama" },
  { id: 10751, label: "Family" },
  { id: 14, label: "Fantasy" },
  { id: 36, label: "History" },
  { id: 10402, label: "Music" },
  { id: 9648, label: "Mystery" },
  { id: 10749, label: "Romance" },
  { id: 878, label: "Science Fiction" },
  { id: 10770, label: "TV Movie" },
  { id: 53, label: "Thriller" },
  { id: 10752, label: "War" },
  { id: 37, label: "Western" },
];
