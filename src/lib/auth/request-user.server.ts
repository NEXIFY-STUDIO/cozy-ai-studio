/**
 * Resolve verified user from a raw Request (API route handlers).
 */

import { auth, authConfigured as betterAuthConfigured } from "./server";
import { DEV_USER_ID, UnauthorizedError } from "./verify.server";
import { resolveAuthProvider } from "./mode";
import {
  getSupabaseUserFromRequest,
  isSupabaseServerConfigured,
} from "./supabase.server";

const databaseConfigured = Boolean(process.env.DATABASE_URL?.trim());

export async function getUserIdFromRequest(
  request: Request,
): Promise<string | null> {
  const provider = resolveAuthProvider("server");

  if (provider === "none") {
    if (databaseConfigured) return null;
    return DEV_USER_ID;
  }

  if (provider === "supabase") {
    if (!isSupabaseServerConfigured()) return null;
    const u = await getSupabaseUserFromRequest(request);
    return u?.id ?? null;
  }

  if (!betterAuthConfigured) return null;
  const headers = new Headers(request.headers);
  const session = await auth.api.getSession({ headers });
  return session?.user?.id ?? null;
}

export async function requireUserIdFromRequest(
  request: Request,
): Promise<string> {
  const provider = resolveAuthProvider("server");
  if (provider === "none") {
    if (databaseConfigured) throw new UnauthorizedError();
    return DEV_USER_ID;
  }
  const id = await getUserIdFromRequest(request);
  if (!id) throw new UnauthorizedError();
  return id;
}
