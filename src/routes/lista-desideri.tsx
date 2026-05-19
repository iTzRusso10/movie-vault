import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/lib/auth-context";
import {
  wishlistListFn,
  wishlistRemoveFn,
} from "@/server/auth/wishlist.server-fns";
import { getFilmImage } from "@/utils";

export const Route = createFileRoute("/lista-desideri")({
  component: ListaDesideriPage,
});

function ListaDesideriPage() {
  const { user, token, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const listFn = useServerFn(wishlistListFn);
  const removeFn = useServerFn(wishlistRemoveFn);
  const wishlistKey = ["wishlist", user?.id] as const;

  const { data, isFetching } = useQuery({
    queryKey: wishlistKey,
    queryFn: () => listFn({ headers: { Authorization: `Bearer ${token}` } }),
    enabled: Boolean(user && token),
  });

  const removeMut = useMutation({
    mutationFn: (movieId: number) =>
      removeFn({
        data: { movieId },
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: wishlistKey });
    },
  });

  if (authLoading) {
    return (
      <div className="px-4 pt-6 pb-16 text-center font-sans text-mv-cream-muted">
        Caricamento…
      </div>
    );
  }

  if (!user || !token) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-8 pb-20">
        <h1 className="font-display text-3xl text-mv-cream">Lista desideri</h1>
        <p className="mt-4 font-sans text-sm text-mv-cream-muted">
          Accedi per vedere e salvare i film che vuoi recuperare.
        </p>
        <Link
          to="/account/login"
          className="mt-8 inline-flex rounded-xl border border-mv-gold/35 bg-mv-gold/15 px-6 py-3 font-sans text-sm font-semibold text-mv-gold-bright hover:bg-mv-gold/25"
        >
          Accedi
        </Link>
      </div>
    );
  }

  const items = data?.ok === true ? data.items : [];
  const empty = !isFetching && items.length === 0;

  return (
    <div className="relative min-h-[70vh] overflow-hidden px-4 pt-6 pb-14 md:px-10 md:pt-8 md:pb-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -18deg,
            transparent,
            transparent 48px,
            rgba(212, 175, 55, 0.12) 48px,
            rgba(212, 175, 55, 0.12) 49px
          )`,
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="animate-mv-fade-up font-sans text-[0.65rem] font-bold uppercase tracking-[0.4em] text-mv-gold/70">
              Collezione personale
            </p>
            <h1 className="animate-mv-fade-up mt-2 font-display text-4xl font-semibold tracking-tight md:text-5xl [animation-delay:80ms]">
              <span className="mv-text-gradient">Lista desideri</span>
            </h1>
            <p className="animate-mv-fade-up mt-3 max-w-md font-sans text-sm text-mv-cream-muted [animation-delay:140ms]">
              {empty
                ? "Aggiungi film dall’hero o dalla scheda: restano qui finché non li rimuovi."
                : `${items.length} titol${items.length === 1 ? "o" : "i"} salvat${items.length === 1 ? "o" : "i"}.`}
            </p>
          </div>
          <Link
            to="/account/profile"
            className="animate-mv-fade-up shrink-0 font-sans text-xs font-semibold uppercase tracking-wider text-mv-gold-bright/90 underline decoration-mv-gold/35 underline-offset-4 [animation-delay:200ms] hover:text-mv-gold-bright"
          >
            Profilo
          </Link>
        </div>

        {isFetching && items.length === 0 ? (
          <p className="mt-16 font-sans text-sm text-mv-cream-muted">
            Carico la lista…
          </p>
        ) : null}

        {empty ? (
          <div
            className="animate-slide-up-md mt-16 rounded-3xl border border-white/8 px-8 py-16 text-center"
            style={{
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              backgroundColor: "rgba(9,6,22,0.5)",
            }}
          >
            <p className="font-display text-2xl text-mv-cream/90">
              Ancora vuota
            </p>
            <p className="mx-auto mt-3 max-w-sm font-sans text-sm text-mv-cream-muted">
              Torna alla home, apri un film e tocca{" "}
              <span className="text-mv-gold-bright">Aggiungi alla lista</span>.
            </p>
            <Link
              to="/"
              className="mv-btn-gradient mt-8 inline-flex rounded-xl px-6 py-2.5 font-sans text-sm font-bold text-white"
            >
              Esplora film
            </Link>
          </div>
        ) : (
          <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-6">
            {items.map((item, i) => (
              <li
                key={item.movieId}
                className="animate-mv-fade-up group relative"
                style={{ animationDelay: `${Math.min(i, 8) * 55}ms` }}
              >
                <Link
                  to="/film/$id_and_title"
                  params={{
                    id_and_title: `${item.movieId}-${item.title}`,
                  }}
                  className="block overflow-hidden rounded-2xl ring-1 ring-white/8 transition-all duration-500 hover:ring-mv-gold/38 hover:shadow-[0_0_36px_-4px_rgba(192,132,252,0.35),0_20px_60px_-8px_rgba(0,0,0,0.65)]"
                >
                  <div className="relative aspect-[2/3]">
                    <img
                      loading="lazy"
                      width={500}
                      height={750}
                      src={getFilmImage(item.posterPath, "w500")}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-mv-void via-transparent to-transparent opacity-70" />
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => removeMut.mutate(item.movieId)}
                  disabled={removeMut.isPending}
                  className="absolute right-2 top-2 rounded-xl border border-mv-ember/35 bg-mv-void/80 px-2.5 py-1 font-sans text-[0.62rem] font-semibold uppercase tracking-wide text-mv-ember-glow opacity-0 shadow-md backdrop-blur-sm transition-all hover:bg-mv-ember/15 group-hover:opacity-100"
                >
                  Rimuovi
                </button>
                <p className="mt-2 line-clamp-2 font-display text-sm font-medium text-mv-cream/95">
                  {item.title}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
