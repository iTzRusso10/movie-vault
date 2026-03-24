import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useMemo } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { useAuth } from "@/lib/auth-context";
import {
  wishlistAddFn,
  wishlistListFn,
  wishlistRemoveFn,
} from "@/server/auth/wishlist.server-fns";

type Props = {
  movieId: number;
  title: string;
  posterPath: string | null;
  /** Hero: full pill; inline: compact for detail rows */
  variant?: "hero" | "inline";
  className?: string;
};

export function WishlistButton({
  movieId,
  title,
  posterPath,
  variant = "hero",
  className = "",
}: Props) {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  const listFn = useServerFn(wishlistListFn);
  const addFn = useServerFn(wishlistAddFn);
  const removeFn = useServerFn(wishlistRemoveFn);

  const wishlistKey = ["wishlist", user?.id] as const;

  const { data: listRes, isFetching } = useQuery({
    queryKey: wishlistKey,
    queryFn: async () => {
      const res = await listFn({
        headers: { Authorization: `Bearer ${token}` },
      });
      return res;
    },
    enabled: Boolean(user && token),
    staleTime: 15_000,
  });

  const inList = useMemo(() => {
    if (!listRes || listRes.ok !== true) return false;
    return listRes.items.some((i) => i.movieId === movieId);
  }, [listRes, movieId]);

  const invalidate = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: wishlistKey });
  }, [queryClient, wishlistKey]);

  const addMut = useMutation({
    mutationFn: async () => {
      const res = await addFn({
        data: { movieId, title, posterPath },
        headers: { Authorization: `Bearer ${token}` },
      });
      return res;
    },
    onSuccess: () => invalidate(),
  });

  const removeMut = useMutation({
    mutationFn: async () => {
      const res = await removeFn({
        data: { movieId },
        headers: { Authorization: `Bearer ${token}` },
      });
      return res;
    },
    onSuccess: () => invalidate(),
  });

  const pending = addMut.isPending || removeMut.isPending;
  const baseHero =
    "inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-2.5 font-sans text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50";
  const baseInline =
    "inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-sans text-xs font-semibold uppercase tracking-wider transition-all active:scale-[0.98] disabled:opacity-50";

  if (!user || !token) {
    const guest =
      variant === "hero"
        ? `${baseHero} border-mv-gold/35 bg-mv-gold/10 text-mv-gold-bright hover:bg-mv-gold/20`
        : `${baseInline} border-mv-gold/30 bg-mv-gold/5 text-mv-gold-bright hover:bg-mv-gold/15`;
    return (
      <Link to="/account/login" className={`${guest} ${className}`}>
        {variant === "hero" ? (
          <FaRegBookmark className="opacity-90" size={16} />
        ) : null}
        Accedi per salvare
      </Link>
    );
  }

  const onClick = () => {
    if (pending) return;
    if (inList) removeMut.mutate();
    else addMut.mutate();
  };

  const heroIn =
    "border-mv-gold/50 bg-mv-gold/25 text-mv-void shadow-gold-glow hover:bg-mv-gold/35";
  const heroOut =
    "border-mv-gold/35 bg-mv-gold/10 text-mv-gold-bright hover:bg-mv-gold/20";

  if (variant === "hero") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={pending || isFetching}
        className={`${baseHero} ${inList ? heroIn : heroOut} ${className}`}
      >
        {inList ? (
          <FaBookmark size={16} className="text-mv-void" />
        ) : (
          <FaRegBookmark size={16} />
        )}
        {pending
          ? "…"
          : inList
            ? "Nella lista"
            : "Aggiungi alla lista"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending || isFetching}
      className={`${baseInline} ${
        inList
          ? "border-mv-gold/45 bg-mv-gold/20 text-mv-void"
          : "border-mv-gold/25 text-mv-gold-bright hover:bg-mv-gold/10"
      } ${className}`}
    >
      {inList ? <FaBookmark size={14} /> : <FaRegBookmark size={14} />}
      {pending ? "…" : inList ? "Salvato" : "Lista desideri"}
    </button>
  );
}
