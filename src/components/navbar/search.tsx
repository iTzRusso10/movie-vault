import { useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import logoApp from "../../../public/movie-app-logo.jpeg";

export default function Search() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [openInput, setOpenInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (openInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [openInput]);

  const handleSearch = () => {
    const value = search.trim();
    if (!value) return;

    navigate({
      to: "/film/search",
      search: { query: value },
      replace: false,
    });

    setSearch("");
    setOpenInput(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") handleClose();
  };

  const handleClose = () => {
    setOpenInput(false);
    setSearch("");
  };

  return (
    <div className="flex w-full justify-center px-3 py-2.5 md:px-5 md:py-3">
      {!openInput ? (
        <div className="flex w-full max-w-5xl items-center gap-4 md:gap-8">
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-3 rounded-xl pr-2 transition-opacity hover:opacity-90"
            aria-label="Home"
          >
            <span className="relative">
              <span className="absolute -inset-1 rounded-xl bg-mv-gold/20 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
              <img
                className="relative rounded-lg ring-1 ring-mv-gold/30"
                width={36}
                height={36}
                alt=""
                src={logoApp}
              />
            </span>
            <span className="hidden font-display text-lg font-semibold tracking-tight text-mv-cream sm:block">
              Movie<span className="text-mv-gold">Vault</span>
            </span>
          </Link>

          <nav
            className="hidden md:flex flex-1 items-center justify-center gap-10"
            aria-label="Principale"
          >
            <span className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-mv-cream-muted">
              Catalogo
            </span>
            <button
              type="button"
              className="font-sans text-sm font-medium text-mv-cream/90 transition-colors hover:text-mv-gold-bright"
            >
              Film
            </button>
            <button
              type="button"
              className="font-sans text-sm text-mv-cream-muted/60 cursor-not-allowed"
              disabled
            >
              Serie TV
            </button>
            <button
              type="button"
              className="font-sans text-sm text-mv-cream-muted/60 cursor-not-allowed"
              disabled
            >
              Lista desideri
            </button>
          </nav>

          <button
            onClick={() => setOpenInput(true)}
            className="ml-auto flex h-11 w-11 items-center justify-center rounded-xl border border-mv-gold/25 bg-mv-ink/80 text-mv-gold-bright shadow-gold-glow transition-all hover:border-mv-gold/50 hover:bg-mv-panel active:scale-[0.97]"
            aria-label="Apri ricerca"
          >
            <FaSearch size={17} />
          </button>
        </div>
      ) : (
        <div className="relative flex w-full max-w-3xl items-center gap-2 md:gap-3">
          <div className="relative flex-1">
            <FaSearch
              className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-mv-gold/70"
              size={16}
            />
            <input
              ref={inputRef}
              placeholder="Titolo, regista, parola chiave…"
              type="search"
              className="h-12 w-full rounded-xl border border-mv-gold/20 bg-mv-void/90 pl-12 pr-4 font-sans text-mv-cream outline-none ring-0 transition-all placeholder:text-mv-cream-muted/50 focus:border-mv-gold/45 focus:shadow-[0_0_0_3px_rgba(212,165,116,0.12)] md:h-14"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {search.trim() && (
            <button
              type="button"
              onClick={handleSearch}
              className="h-12 shrink-0 rounded-xl border border-mv-gold/35 bg-mv-gold/15 px-5 font-sans text-sm font-semibold text-mv-gold-bright transition-all hover:bg-mv-gold/25 active:scale-[0.98] md:h-14 md:px-7"
            >
              Cerca
            </button>
          )}

          <button
            type="button"
            onClick={handleClose}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-mv-cream/10 bg-mv-panel text-mv-cream-muted transition-all hover:border-mv-ember/40 hover:text-mv-cream md:h-14 md:w-14"
            aria-label="Chiudi ricerca"
          >
            <FaTimes size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
