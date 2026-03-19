import { cn } from "crustack/utils";

type Props = {
  delayMs?: number;
  className?: string;
};

export function LoadingUI({ className }: Props) {
  return (
    <div
      className={cn(
        className,
        "flex h-screen max-h-[90vh] flex-col items-center justify-center gap-4"
      )}
    >
      <div className="animate-pulse-sm flex items-center gap-3">
        <img
          src="/movie-app-logo.jpeg"
          width={48}
          height={48}
          className="h-10 w-10 rounded-lg ring-1 ring-mv-gold/30"
          alt=""
        />
        <span className="font-display text-2xl font-semibold tracking-tight text-mv-cream">
          Movie<span className="text-mv-gold">Vault</span>
        </span>
      </div>
      <p className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.35em] text-mv-cream-muted">
        Caricamento…
      </p>
    </div>
  );
}
