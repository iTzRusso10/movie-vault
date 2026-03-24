import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";

export function NavbarAuthLinks() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <span className="hidden text-xs text-mv-cream-muted sm:inline">…</span>
    );
  }

  if (user) {
    const label = `${user.firstName} ${user.lastName}`.trim() || user.email;
    return (
      <div className="flex max-w-[200px] items-center gap-2 sm:max-w-[280px]">
        <Link
          to="/account/profile"
          className="min-w-0 truncate font-sans text-xs text-mv-cream/90 transition-colors hover:text-mv-gold-bright"
          title={user.email}
        >
          {label}
        </Link>
        <button
          type="button"
          onClick={() => void logout()}
          className="shrink-0 rounded-md border border-mv-gold/20 px-2 py-1 font-sans text-[0.65rem] font-semibold uppercase tracking-wide text-mv-gold-bright hover:bg-mv-gold/10"
        >
          Esci
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        to="/account/login"
        className="font-sans text-xs font-medium text-mv-cream/90 hover:text-mv-gold-bright"
      >
        Accedi
      </Link>
      <Link
        to="/account/register"
        className="hidden rounded-md border border-mv-gold/25 px-2 py-1 font-sans text-xs font-semibold text-mv-gold-bright hover:bg-mv-gold/10 sm:inline"
      >
        Registrati
      </Link>
    </div>
  );
}
