import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSessionUserFromRequest } from "./http";
import {
  listWishlistForUser,
  removeWishlistItem,
  upsertWishlistItem,
} from "./wishlist";

type ServerCtx = {
  data: unknown;
  context: unknown;
  signal: AbortSignal;
  request: Request;
};

function asCtx(ctx: unknown): ServerCtx {
  return ctx as ServerCtx;
}

const moviePayloadSchema = z.object({
  movieId: z.number().int().positive(),
  title: z.string().trim().min(1).max(500),
  posterPath: z.string().nullable(),
});

const movieIdSchema = z.object({
  movieId: z.number().int().positive(),
});

export const wishlistListFn = createServerFn({ method: "GET" }).handler(
  async (ctx) => {
    const { request } = asCtx(ctx);
    const user = await getSessionUserFromRequest(request);
    if (!user) return { ok: false as const, error: "Non autenticato." };
    const items = await listWishlistForUser(user.id);
    return { ok: true as const, items };
  }
);

export const wishlistAddFn = createServerFn({ method: "POST" })
  .inputValidator(moviePayloadSchema)
  .handler(async (ctx) => {
    const { data, request } = asCtx(ctx);
    const user = await getSessionUserFromRequest(request);
    if (!user) return { ok: false as const, error: "Accedi per salvare in lista." };
    const { movieId, title, posterPath } = data;
    await upsertWishlistItem(user.id, movieId, title, posterPath);
    return { ok: true as const };
  });

export const wishlistRemoveFn = createServerFn({ method: "POST" })
  .inputValidator(movieIdSchema)
  .handler(async (ctx) => {
    const { data, request } = asCtx(ctx);
    const user = await getSessionUserFromRequest(request);
    if (!user) return { ok: false as const, error: "Non autenticato." };
    await removeWishlistItem(user.id, data.movieId);
    return { ok: true as const };
  });
