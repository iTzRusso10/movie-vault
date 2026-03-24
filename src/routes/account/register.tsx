import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/account/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { register, user, loading } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/" });
  }, [loading, user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Le password non coincidono.");
      return;
    }
    setPending(true);
    try {
      const res = await register(email, password, firstName, lastName);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      navigate({ to: "/" });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="mb-2 font-display text-3xl font-semibold text-mv-cream">
        Registrati
      </h1>
      <p className="mb-8 font-sans text-sm text-mv-cream-muted">
        Account salvato su database Postgres (hosting gestito: es. Neon o Supabase).
      </p>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 font-sans text-xs uppercase tracking-wider text-mv-cream-muted">
            Nome
            <input
              type="text"
              autoComplete="given-name"
              required
              maxLength={80}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="rounded-lg border border-mv-gold/25 bg-mv-panel/80 px-3 py-2.5 font-sans text-sm normal-case tracking-normal text-mv-cream outline-none focus:border-mv-gold/50"
            />
          </label>
          <label className="flex flex-col gap-1 font-sans text-xs uppercase tracking-wider text-mv-cream-muted">
            Cognome
            <input
              type="text"
              autoComplete="family-name"
              required
              maxLength={80}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="rounded-lg border border-mv-gold/25 bg-mv-panel/80 px-3 py-2.5 font-sans text-sm normal-case tracking-normal text-mv-cream outline-none focus:border-mv-gold/50"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1 font-sans text-xs uppercase tracking-wider text-mv-cream-muted">
          Email
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-mv-gold/25 bg-mv-panel/80 px-3 py-2.5 font-sans text-sm normal-case tracking-normal text-mv-cream outline-none focus:border-mv-gold/50"
          />
        </label>
        <label className="flex flex-col gap-1 font-sans text-xs uppercase tracking-wider text-mv-cream-muted">
          Password (min. 8 caratteri)
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-mv-gold/25 bg-mv-panel/80 px-3 py-2.5 font-sans text-sm normal-case tracking-normal text-mv-cream outline-none focus:border-mv-gold/50"
          />
        </label>
        <label className="flex flex-col gap-1 font-sans text-xs uppercase tracking-wider text-mv-cream-muted">
          Conferma password
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="rounded-lg border border-mv-gold/25 bg-mv-panel/80 px-3 py-2.5 font-sans text-sm normal-case tracking-normal text-mv-cream outline-none focus:border-mv-gold/50"
          />
        </label>
        {error ? (
          <p className="font-sans text-sm text-mv-ember-glow">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg border border-mv-gold/35 bg-mv-gold/15 py-2.5 font-sans text-sm font-semibold text-mv-gold-bright transition-colors hover:bg-mv-gold/25 disabled:opacity-50"
        >
          {pending ? "Creazione…" : "Crea account"}
        </button>
      </form>
      <p className="mt-6 text-center font-sans text-sm text-mv-cream-muted">
        Hai già un account?{" "}
        <Link
          to="/account/login"
          className="text-mv-gold-bright underline decoration-mv-gold/40 underline-offset-2"
        >
          Accedi
        </Link>
      </p>
    </div>
  );
}
