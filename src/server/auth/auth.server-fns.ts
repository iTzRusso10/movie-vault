import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getBearerToken } from "./http";
import {
  createSession,
  deleteSessionByToken,
  findUserBySessionToken,
} from "./session-token";
import {
  createUser,
  findUserWithHashByEmail,
  hashPassword,
  updateUserNames,
  verifyPassword,
} from "./users";

const credentialsSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
});

const registerSchema = credentialsSchema.extend({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
});

const profileSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
});

type ServerCtx = {
  data: unknown;
  context: unknown;
  signal: AbortSignal;
  request: Request;
};

function asCtx(ctx: unknown): ServerCtx {
  return ctx as ServerCtx;
}

function sessionUserFromRow(row: {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}) {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
  };
}

export const authRegisterFn = createServerFn({ method: "POST" })
  .inputValidator(registerSchema)
  .handler(async (ctx) => {
    const { data } = asCtx(ctx);
    const { email, password, firstName, lastName } = data;

    if (await findUserWithHashByEmail(email)) {
      return {
        ok: false as const,
        error: "Esiste già un account con questa email.",
      };
    }

    const id = await createUser(
      email,
      hashPassword(password),
      firstName,
      lastName
    );
    const token = await createSession(id);

    return {
      ok: true as const,
      token,
      user: {
        id,
        email: email.toLowerCase().trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      },
    };
  });

export const authLoginFn = createServerFn({ method: "POST" })
  .inputValidator(credentialsSchema)
  .handler(async (ctx) => {
    const { data } = asCtx(ctx);
    const { email, password } = data;

    const row = await findUserWithHashByEmail(email);
    if (!row || !verifyPassword(password, row.password_hash)) {
      return {
        ok: false as const,
        error: "Email o password non validi.",
      };
    }

    const token = await createSession(row.id);
    return {
      ok: true as const,
      token,
      user: sessionUserFromRow(row),
    };
  });

export const authLogoutFn = createServerFn({ method: "POST" }).handler(
  async (ctx) => {
    const { request } = asCtx(ctx);
    const token = getBearerToken(request);
    if (token) await deleteSessionByToken(token);
    return { ok: true as const };
  }
);

export const authMeFn = createServerFn({ method: "GET" }).handler(async (ctx) => {
  const { request } = asCtx(ctx);
  const token = getBearerToken(request);
  const user = await findUserBySessionToken(token);
  return { user };
});

export const authUpdateProfileFn = createServerFn({ method: "POST" })
  .inputValidator(profileSchema)
  .handler(async (ctx) => {
    const { data, request } = asCtx(ctx);
    const user = await findUserBySessionToken(getBearerToken(request));
    if (!user) {
      return { ok: false as const, error: "Non autenticato." };
    }
    await updateUserNames(user.id, data.firstName, data.lastName);
    return {
      ok: true as const,
      user: {
        ...user,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
      },
    };
  });
