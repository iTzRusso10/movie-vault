import { useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import logoApp from "../../../public/movie-app-logo.jpeg";
import { NavbarAuthLinks } from "./auth-links";

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
    <div className="flex w-full max-w-3xl justify-center px-2">
      {!openInput ? (
        <div className="flex w-full max-w-2xl animate-compress items-center gap-3 rounded-lg border border-mv-gold/15 bg-mv-deep/55 py-2 pl-2 pr-2 shadow-sm backdrop-blur-md transition-colors hover:bg-mv-deep/70 md:gap-5 md:px-4">
          <Link
            to="/"
            className="shrink-0 rounded-md transition-opacity hover:opacity-85"
            aria-label="Home"
          >
            <img
              className="rounded-md"
              width={32}
              height={32}
              alt=""
              src={logoApp}
            />
          </Link>

          <div className="hidden items-center gap-4 md:flex">
            <button
              type="button"
              className="font-sans text-sm font-medium text-mv-cream/90 transition-colors hover:text-mv-gold-bright"
            >
              Film
            </button>
            <button
              type="button"
              className="font-sans text-sm text-mv-cream-muted/50"
              disabled
            >
              Serie TV
            </button>
            <Link
              to="/lista-desideri"
              className="font-sans text-sm font-medium text-mv-cream/90 transition-colors hover:text-mv-gold-bright"
            >
              Lista desideri
            </Link>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <NavbarAuthLinks />
            <button
              type="button"
              onClick={() => setOpenInput(true)}
              className="rounded-lg border border-mv-gold/25 bg-mv-gold/15 p-2 text-mv-gold-bright transition-colors hover:bg-mv-gold/25 active:scale-95"
              aria-label="Apri ricerca"
            >
              <FaSearch size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex w-full max-w-2xl items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <FaSearch
              className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-mv-gold/60"
              size={14}
            />
            <input
              ref={inputRef}
              placeholder="Cerca un film…"
              type="search"
              className="h-11 w-full rounded-lg border border-mv-gold/20 bg-mv-void/92 py-2 pl-10 pr-3 font-sans text-sm text-mv-cream outline-none transition-all placeholder:text-mv-cream-muted/55 focus:border-mv-gold/40"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {search.trim() ? (
            <button
              type="button"
              onClick={handleSearch}
              className="shrink-0 rounded-lg border border-mv-gold/35 bg-mv-gold/15 px-4 py-2 font-sans text-sm font-semibold text-mv-gold-bright transition-colors hover:bg-mv-gold/25"
            >
              Cerca
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-mv-cream/10 bg-mv-panel text-mv-cream-muted transition-colors hover:bg-mv-ink"
            aria-label="Chiudi ricerca"
          >
            <FaTimes size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
