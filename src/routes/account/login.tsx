import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/account/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/" });
  }, [loading, user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await login(email, password);
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
        Accedi
      </h1>
      <p className="mb-8 font-sans text-sm text-mv-cream-muted">
        Accedi con l’email e la password del tuo account MovieVault.
      </p>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
          Password
          <input
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {pending ? "Accesso…" : "Entra"}
        </button>
      </form>
      <p className="mt-6 text-center font-sans text-sm text-mv-cream-muted">
        Non hai un account?{" "}
        <Link
          to="/account/register"
          className="text-mv-gold-bright underline decoration-mv-gold/40 underline-offset-2"
        >
          Registrati
        </Link>
      </p>
    </div>
  );
}
