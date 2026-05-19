import { Link } from "@tanstack/react-router";
import {
  FaArrowRightFromBracket,
  FaRegBookmark,
  FaUser,
} from "react-icons/fa6";
import { useAuth } from "@/lib/auth-context";

export function NavbarAuthLinks() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <span
        className="inline-flex h-8 items-center"
        aria-live="polite"
        aria-label="Caricamento account"
      >
        <span className="h-1 w-12 animate-pulse rounded-full bg-mv-gold/35 shadow-[0_0_12px_rgba(212,175,55,0.25)]" />
      </span>
    );
  }

  if (user) {
    const label = `${user.firstName} ${user.lastName}`.trim() || user.email;
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Link
          to="/lista-desideri"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-mv-gold/18 bg-mv-gold/6 text-mv-gold-bright transition-all duration-200 hover:border-mv-gold/35 hover:bg-mv-gold/14 hover:shadow-[0_0_16px_rgba(192,132,252,0.25)] active:scale-90 md:hidden"
          aria-label="Lista desideri"
          title="Lista desideri"
        >
          <FaRegBookmark size={16} />
        </Link>
        <Link
          to="/account/profile"
          className="hidden h-9 max-w-40 items-center truncate rounded-xl border border-white/8 bg-white/3 px-2.5 font-sans text-xs text-mv-cream/85 transition-all duration-200 hover:border-mv-gold/30 hover:bg-mv-gold/6 hover:text-mv-gold-bright sm:flex"
          title={user.email}
        >
          {label}
        </Link>
        <Link
          to="/account/profile"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-mv-gold/18 bg-mv-gold/6 text-mv-gold-bright transition-all duration-200 hover:border-mv-gold/35 hover:bg-mv-gold/14 hover:shadow-[0_0_16px_rgba(192,132,252,0.25)] active:scale-90 sm:hidden"
          aria-label={`Profilo: ${label}`}
          title={user.email}
        >
          <FaUser size={15} />
        </Link>

        <button
          type="button"
          onClick={() => void logout()}
          className="flex h-9 shrink-0 items-center justify-center rounded-xl border border-mv-gold/18 px-2 font-sans text-[0.65rem] font-semibold uppercase tracking-wide text-mv-gold-bright transition-all duration-200 hover:border-mv-gold/32 hover:bg-mv-gold/10 hover:shadow-[0_0_14px_rgba(192,132,252,0.2)] active:scale-90 sm:px-2.5"
          aria-label="Esci"
        >
          <FaArrowRightFromBracket className="sm:hidden" size={14} />
          <span className="hidden sm:inline">Esci</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Link
        to="/account/login"
        className="whitespace-nowrap rounded-xl px-1.5 py-1.5 font-sans text-[0.7rem] font-semibold text-mv-cream/70 transition-all duration-200 hover:text-mv-cream sm:px-2 sm:text-xs"
      >
        Accedi
      </Link>
      <Link
        to="/account/register"
        className="mv-btn-gradient whitespace-nowrap rounded-xl px-2.5 py-1.5 font-sans text-[0.65rem] font-semibold uppercase tracking-wide text-white active:scale-90 sm:px-3 sm:text-xs sm:normal-case sm:tracking-normal"
      >
        Registrati
      </Link>
    </div>
  );
}
