import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

function GlassField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.25em] text-mv-cream-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

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
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-16">
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
            <span className="mv-text-gradient">Crea account</span>
          </h1>
          <p className="mt-2 font-sans text-sm text-mv-cream-muted">
            Salvato su database Postgres.
          </p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <GlassField label="Nome">
              <input
                type="text"
                autoComplete="given-name"
                required
                maxLength={80}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-xl border border-white/8 bg-white/4 px-4 py-3 font-sans text-sm text-mv-cream outline-none transition-all focus:border-mv-gold/40 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.18)] focus:bg-white/6"
              />
            </GlassField>
            <GlassField label="Cognome">
              <input
                type="text"
                autoComplete="family-name"
                required
                maxLength={80}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-xl border border-white/8 bg-white/4 px-4 py-3 font-sans text-sm text-mv-cream outline-none transition-all focus:border-mv-gold/40 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.18)] focus:bg-white/6"
              />
            </GlassField>
          </div>
          <GlassField label="Email">
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-white/8 bg-white/4 px-4 py-3 font-sans text-sm text-mv-cream outline-none transition-all focus:border-mv-gold/40 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.18)] focus:bg-white/6"
            />
          </GlassField>
          <GlassField label="Password (min. 8 caratteri)">
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-white/8 bg-white/4 px-4 py-3 font-sans text-sm text-mv-cream outline-none transition-all focus:border-mv-gold/40 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.18)] focus:bg-white/6"
            />
          </GlassField>
          <GlassField label="Conferma password">
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="rounded-xl border border-white/8 bg-white/4 px-4 py-3 font-sans text-sm text-mv-cream outline-none transition-all focus:border-mv-gold/40 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.18)] focus:bg-white/6"
            />
          </GlassField>

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
            {pending ? "Creazione…" : "Crea account"}
          </button>
        </form>

        <p className="mt-6 text-center font-sans text-sm text-mv-cream-muted">
          Hai già un account?{" "}
          <Link
            to="/account/login"
            className="font-semibold text-mv-gold-bright transition-colors hover:text-mv-cream"
          >
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
}
