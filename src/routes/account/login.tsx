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
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div
        className="w-full max-w-md rounded-3xl border border-white/8 p-8 shadow-[0_32px_80px_rgba(109,40,217,0.3),0_8px_32px_rgba(0,0,0,0.6)] md:p-10"
        style={{
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          backgroundColor: "rgba(9, 6, 22, 0.65)",
        }}
      >
        <div className="mb-8">
          <p className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.3em] text-mv-gold/70">
            MovieVault
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            <span className="mv-text-gradient">Bentornato</span>
          </h1>
          <p className="mt-2 font-sans text-sm text-mv-cream-muted">
            Accedi con email e password del tuo account.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.25em] text-mv-cream-muted">
              Email
            </span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-white/8 bg-white/4 px-4 py-3 font-sans text-sm text-mv-cream outline-none transition-all placeholder:text-mv-cream-muted/40 focus:border-mv-gold/40 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.18)] focus:bg-white/6"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.25em] text-mv-cream-muted">
              Password
            </span>
            <input
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-white/8 bg-white/4 px-4 py-3 font-sans text-sm text-mv-cream outline-none transition-all placeholder:text-mv-cream-muted/40 focus:border-mv-gold/40 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.18)] focus:bg-white/6"
            />
          </label>

          {error ? (
            <p className="rounded-xl border border-mv-ember/30 bg-mv-ember/10 px-4 py-2.5 font-sans text-sm text-mv-ember-glow">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="mv-btn-gradient mt-1 w-full rounded-xl py-3 font-sans text-sm font-bold text-white disabled:opacity-50"
          >
            {pending ? "Accesso…" : "Entra"}
          </button>
        </form>

        <p className="mt-6 text-center font-sans text-sm text-mv-cream-muted">
          Non hai un account?{" "}
          <Link
            to="/account/register"
            className="font-semibold text-mv-gold-bright transition-colors hover:text-mv-cream"
          >
            Registrati
          </Link>
        </p>
      </div>
    </div>
  );
}
