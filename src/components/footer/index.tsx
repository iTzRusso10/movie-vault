import { Link } from "@tanstack/react-router";

export const Footer = () => {
  return (
    <footer className="relative z-10 mt-auto border-t border-mv-gold/10 bg-mv-deep/90">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <div className="mb-10 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <Link
            to="/"
            className="group flex items-center gap-4"
            aria-label="MovieVault home"
          >
            <img
              src="/movie-app-logo.jpeg"
              width={48}
              height={48}
              className="h-10 w-10 rounded-lg ring-1 ring-mv-gold/25 transition-shadow group-hover:shadow-gold-glow"
              alt=""
            />
            <div>
              <p className="font-display text-2xl font-semibold tracking-tight text-mv-cream">
                Movie<span className="text-mv-gold">Vault</span>
              </p>
              <p className="mt-1 max-w-xs font-sans text-xs leading-relaxed text-mv-cream-muted">
                La tua sala privata: scopri, cerca e segna ciò che vuoi
                vedere.
              </p>
            </div>
          </Link>

          <nav
            className="flex flex-wrap gap-x-8 gap-y-3 font-sans text-sm text-mv-cream-muted"
            aria-label="Footer"
          >
            <a
              href="#"
              className="transition-colors hover:text-mv-gold-bright"
            >
              Chi siamo
            </a>
            <a
              href="#"
              className="transition-colors hover:text-mv-gold-bright"
            >
              Privacy
            </a>
            <a
              href="#"
              className="transition-colors hover:text-mv-gold-bright"
            >
              Licenze
            </a>
            <a
              href="#"
              className="transition-colors hover:text-mv-gold-bright"
            >
              Contatti
            </a>
          </nav>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-mv-gold/25 to-transparent" />

        <p className="mt-8 text-center font-sans text-xs text-mv-cream-muted/70">
          © {new Date().getFullYear()}{" "}
          <span className="text-mv-cream/90">MovieVault</span>. Dati film e serie da{" "}
          <a
            href="https://www.themoviedb.org/"
            className="underline decoration-mv-gold/40 underline-offset-2 transition-colors hover:text-mv-gold-bright"
            target="_blank"
            rel="noreferrer"
          >
            TMDB
          </a>
          .
        </p>
      </div>
    </footer>
  );
};
