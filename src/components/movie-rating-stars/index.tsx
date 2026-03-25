import { FaStar } from "react-icons/fa6";

type Size = "sm" | "md" | "lg";

const STAR_SIZES: Record<Size, number> = { sm: 14, md: 18, lg: 22 };

/**
 * Voto TMDB 0–10 come riempimento su 5 stelle + numero voti tra parentesi.
 */
export function MovieRatingStars({
  voteAverage,
  voteCount,
  size = "md",
  className = "",
}: {
  voteAverage: number;
  voteCount: number;
  size?: Size;
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, (voteAverage / 10) * 100));
  const starPx = STAR_SIZES[size];
  const votesLabel = voteCount.toLocaleString("it-IT");

  return (
    <div
      className={`flex min-w-0 flex-nowrap items-center gap-2 ${className}`}
      role="img"
      aria-label={`Valutazione ${voteAverage.toFixed(1)} su 10, ${votesLabel} voti`}
    >
      <div className="relative inline-flex shrink-0 overflow-hidden rounded-[2px]">
        <div className="flex shrink-0 gap-0.5 text-mv-gold/28" aria-hidden>
          {Array.from({ length: 5 }, (_, i) => (
            <FaStar key={`bg-${i}`} size={starPx} className="shrink-0" />
          ))}
        </div>
        <div
          className="absolute left-0 top-0 flex shrink-0 gap-0.5 overflow-hidden text-mv-gold-bright"
          style={{ width: `${pct}%` }}
          aria-hidden
        >
          {Array.from({ length: 5 }, (_, i) => (
            <FaStar key={`fg-${i}`} size={starPx} className="shrink-0" />
          ))}
        </div>
      </div>
      <span className="min-w-0 truncate font-sans text-xs font-medium tabular-nums text-mv-cream/80 md:text-sm">
        ({votesLabel})
      </span>
    </div>
  );
}
