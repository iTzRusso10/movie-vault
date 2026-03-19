import { Link } from "@tanstack/react-router";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-mv-gold/70">
        404
      </p>
      <h1 className="max-w-md font-display text-4xl font-semibold tracking-tight text-mv-cream md:text-5xl">
        Questa inquadratura non esiste
      </h1>
      <p className="max-w-sm font-sans text-sm text-mv-cream-muted">
        La pagina che cerchi è fuori campo. Torna alla home e continua la
        proiezione.
      </p>
      <Link
        to="/"
        className="rounded-xl border border-mv-gold/35 bg-mv-gold/10 px-8 py-3 font-sans text-sm font-semibold text-mv-gold-bright transition-all hover:bg-mv-gold/20"
      >
        Torna alla home
      </Link>
    </div>
  );
}
