import { findUserBySessionToken, type SessionUser } from "./session-token";

export function getBearerToken(request: Request | undefined): string | null {
  if (!request) return null;
  const raw = request.headers.get("authorization");
  if (!raw?.toLowerCase().startsWith("bearer ")) return null;
  return raw.slice(7).trim() || null;
}

export async function getSessionUserFromRequest(
  request: Request | undefined
): Promise<SessionUser | null> {
  return findUserBySessionToken(getBearerToken(request));
}
