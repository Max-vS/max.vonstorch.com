import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getAuth, type Session } from "./auth";
import { isOwnerEmail } from "./options";

// React cache(), not 'use cache': a cached scope cannot read headers(), and this still dedupes within one request.
export const getSession = cache(async (): Promise<Session | null> => {
  // headers() first: the prerender stops there, before getAuth() needs DATABASE_URL at build time.
  const requestHeaders = await headers();
  const session = await getAuth().api.getSession({ headers: requestHeaders });
  // Second gate after validateUserInfo, in case a non-owner user ever reaches the database.
  return session && isOwnerEmail(session.user.email) ? session : null;
});

/** For pages and layouts. */
export async function requireOwner(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export type OwnerCheck =
  | { ok: true; session: Session }
  | { ok: false; error: "unauthorized" };

/** For Server Actions: a redirect answers a POST with nothing the form can show. */
export async function checkOwner(): Promise<OwnerCheck> {
  const session = await getSession();
  return session ? { ok: true, session } : { ok: false, error: "unauthorized" };
}
