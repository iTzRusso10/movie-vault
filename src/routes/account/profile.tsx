import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/account/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, loading, updateProfile } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
    }
  }, [user]);

  if (!loading && !user) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-6 pb-16">
        <p className="font-sans text-mv-cream-muted">
          Accedi per vedere il profilo.
        </p>
        <Link
          to="/account/login"
          className="mt-4 inline-block font-sans text-sm text-mv-gold-bright underline decoration-mv-gold/40"
        >
          Vai al login
        </Link>
      </div>
    );
  }

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-6 pb-16 font-sans text-sm text-mv-cream-muted">
        Caricamento…
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setPending(true);
    try {
      const res = await updateProfile(firstName, lastName);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setSaved(true);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="relative overflow-hidden px-4 pt-6 pb-16 md:pt-8 md:pb-24">
      <div
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-mv-burgundy/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-mv-gold/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-xl">
        <p className="animate-mv-fade-up mb-2 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-mv-gold/75">
          Account
        </p>
        <h1 className="animate-mv-fade-up font-display text-4xl font-semibold tracking-tight text-mv-cream md:text-5xl [animation-delay:60ms]">
          Il tuo profilo
        </h1>
        <p className="animate-mv-fade-up mt-4 max-w-md font-sans text-sm leading-relaxed text-mv-cream-muted [animation-delay:120ms]">
          Nome e cognome sono visibili solo a te; l’email resta l’identificatore
          di accesso.
        </p>

        <div className="animate-mv-fade-up mt-10 rounded-2xl border border-mv-gold/20 bg-mv-panel/60 p-6 shadow-[0_0_0_1px_rgba(212,175,55,0.06)] backdrop-blur-md [animation-delay:180ms] md:p-8">
          <dl className="mb-8 space-y-4 border-b border-mv-gold/10 pb-8">
            <div>
              <dt className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-mv-gold/60">
                Email
              </dt>
              <dd className="mt-1 font-sans text-mv-cream/95">{user.email}</dd>
            </div>
          </dl>

          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 font-sans text-xs uppercase tracking-wider text-mv-cream-muted">
                Nome
                <input
                  type="text"
                  autoComplete="given-name"
                  required
                  maxLength={80}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="rounded-xl border border-mv-gold/25 bg-mv-deep/50 px-3 py-2.5 font-sans text-sm normal-case tracking-normal text-mv-cream outline-none transition-colors focus:border-mv-gold/50"
                />
              </label>
              <label className="flex flex-col gap-1.5 font-sans text-xs uppercase tracking-wider text-mv-cream-muted">
                Cognome
                <input
                  type="text"
                  autoComplete="family-name"
                  required
                  maxLength={80}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="rounded-xl border border-mv-gold/25 bg-mv-deep/50 px-3 py-2.5 font-sans text-sm normal-case tracking-normal text-mv-cream outline-none transition-colors focus:border-mv-gold/50"
                />
              </label>
            </div>
            {error ? (
              <p className="font-sans text-sm text-mv-ember-glow">{error}</p>
            ) : null}
            {saved ? (
              <p className="font-sans text-sm text-mv-gold-bright">
                Modifiche salvate.
              </p>
            ) : null}
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-xl border border-mv-gold/40 bg-mv-gold/15 py-3 font-sans text-sm font-semibold text-mv-gold-bright transition-colors hover:bg-mv-gold/25 disabled:opacity-50 sm:w-auto sm:px-10"
            >
              {pending ? "Salvataggio…" : "Salva modifiche"}
            </button>
          </form>
        </div>

        <p className="mt-8 font-sans text-sm text-mv-cream-muted">
          <Link
            to="/lista-desideri"
            className="text-mv-gold-bright underline decoration-mv-gold/35 underline-offset-2"
          >
            Lista desideri
          </Link>
          {" · "}
          <Link
            to="/"
            className="text-mv-gold-bright/90 underline decoration-mv-gold/30 underline-offset-2"
          >
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}
