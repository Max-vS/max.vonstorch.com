import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getAuth, type Session } from "./auth";
import { isOwnerEmail } from "./options";

// React cache(), not 'use cache': a cached scope cannot read headers().
export const getSession = cache(async (): Promise<Session | null> => {
  // headers() first: the prerender stops here, before getAuth() needs DATABASE_URL at build time.
  const requestHeaders = await headers();
  const session = await getAuth().api.getSession({ headers: requestHeaders });
  return session && isOwnerEmail(session.user.email) ? session : null;
});

export async function requireOwner(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export type OwnerCheck =
  | { ok: true; session: Session }
  | { ok: false; error: "unauthorized" };

export async function checkOwner(): Promise<OwnerCheck> {
  const session = await getSession();
  return session ? { ok: true, session } : { ok: false, error: "unauthorized" };
}
