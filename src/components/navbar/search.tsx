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
    navigate({ to: "/film/search", search: { query: value }, replace: false });
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
        <div
          className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/8 shadow-[0_8px_48px_rgba(109,40,217,0.25),0_2px_8px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-300 hover:border-white/14 hover:shadow-[0_12px_64px_rgba(139,92,246,0.3),0_4px_16px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)]"
          style={{
            backdropFilter: "blur(32px) saturate(180%)",
            WebkitBackdropFilter: "blur(32px) saturate(180%)",
            backgroundColor: "rgba(9, 6, 20, 0.58)",
          }}
        >
          <div className="flex w-full animate-compress items-center gap-2 py-2.5 pl-2.5 pr-2.5 md:gap-5 md:px-4">
            <Link
              to="/"
              className="shrink-0 transition-all duration-200 hover:scale-95 hover:opacity-80 focus-visible:outline-none"
              aria-label="Home"
            >
              <img
                className="rounded-xl shadow-[0_0_0_1px_rgba(192,132,252,0.25),0_0_16px_rgba(139,92,246,0.2)]"
                width={32}
                height={32}
                alt=""
                src={logoApp}
              />
            </Link>

            <div className="hidden min-w-0 flex-1 items-center gap-6 md:flex">
              <NavLink to="/">Film</NavLink>
              <NavLink to="/serie">Serie TV</NavLink>
              <NavLink to="/lista-desideri">Lista desideri</NavLink>
            </div>

            <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
              <div className="min-w-0">
                <NavbarAuthLinks />
              </div>
              <button
                type="button"
                onClick={() => setOpenInput(true)}
                className="shrink-0 rounded-xl border border-mv-gold/25 bg-mv-gold/8 p-2 text-mv-gold-bright transition-all duration-200 hover:border-mv-gold/45 hover:bg-mv-gold/16 hover:shadow-[0_0_20px_rgba(192,132,252,0.3)] active:scale-90"
                aria-label="Apri ricerca"
              >
                <FaSearch size={15} />
              </button>
            </div>
          </div>

          <div
            className="border-t border-white/5 px-3 py-2 md:hidden"
            role="navigation"
            aria-label="Navigazione rapida"
          >
            <div className="flex items-center justify-center gap-6">
              <MobileNavLink to="/">Film</MobileNavLink>
              <span className="h-3 w-px bg-white/10" aria-hidden />
              <MobileNavLink to="/lista-desideri">Lista</MobileNavLink>
              <span className="h-3 w-px bg-white/10" aria-hidden />
              <MobileNavLink to="/serie">Serie TV</MobileNavLink>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full max-w-2xl items-center gap-2 animate-mv-spring-in">
          <div className="relative min-w-0 flex-1">
            <FaSearch
              className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-mv-gold/50"
              size={14}
            />
            <input
              ref={inputRef}
              placeholder="Cerca film o serie TV…"
              type="search"
              className="h-11 w-full rounded-xl border border-white/8 py-2 pl-10 pr-3 font-sans text-sm text-mv-cream outline-none transition-all placeholder:text-mv-cream-muted/40 focus:border-mv-gold/40 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]"
              style={{
                backdropFilter: "blur(32px) saturate(180%)",
                WebkitBackdropFilter: "blur(32px) saturate(180%)",
                backgroundColor: "rgba(9, 6, 20, 0.65)",
              }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {search.trim() ? (
            <button
              type="button"
              onClick={handleSearch}
              className="mv-btn-gradient shrink-0 rounded-xl px-4 py-2 font-sans text-sm font-semibold text-white"
            >
              Cerca
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/8 text-mv-cream-muted transition-all duration-200 hover:border-white/16 hover:text-mv-cream active:scale-90"
            style={{
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              backgroundColor: "rgba(9, 6, 20, 0.58)",
            }}
            aria-label="Chiudi ricerca"
          >
            <FaTimes size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="relative font-sans text-sm font-semibold text-mv-cream/70 transition-all duration-200 hover:text-mv-cream [&.active]:text-mv-gold-bright"
      activeProps={{ className: "text-mv-gold-bright" }}
    >
      {children}
      <span className="absolute -bottom-1 left-0 h-px w-full scale-x-0 rounded-full bg-linear-to-r from-mv-gold via-mv-gold-bright to-mv-amber transition-transform duration-300 [a.active_&]:scale-x-100" />
    </Link>
  );
}

function MobileNavLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.22em] text-mv-cream/65 transition-all duration-200 hover:text-mv-gold-bright [&.active]:text-mv-gold-bright"
      activeProps={{ className: "text-mv-gold-bright" }}
    >
      {children}
    </Link>
  );
}
