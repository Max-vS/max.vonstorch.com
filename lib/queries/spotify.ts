import "server-only";

import { desc, eq } from "drizzle-orm";
import { getAuth } from "@/lib/auth/auth";
import { isOwnerEmail } from "@/lib/auth/options";
import { getDb } from "@/lib/db";
import { account, user } from "@/lib/db/schema";

export type SpotifyStatus = "connected" | "not-connected" | "reconnect-needed";

/** The owner's newest Spotify link in the exact shape getAccessToken accepts (it rejects extra keys); null when there is none. */
async function findOwnerSpotifyLink() {
  const links = await getDb()
    .select({
      accountId: account.id,
      userId: account.userId,
      email: user.email,
    })
    .from(account)
    .innerJoin(user, eq(account.userId, user.id))
    .where(eq(account.providerId, "spotify"))
    .orderBy(desc(account.createdAt));
  const link = links.find(({ email }) => isOwnerEmail(email));
  return link ? { accountId: link.accountId, userId: link.userId } : null;
}

/** Better Auth refreshes an expired token and stores the new pair; it throws when Spotify refuses the refresh. */
async function getSpotifyAccessToken(link: {
  accountId: string;
  userId: string;
}) {
  const { accessToken } = await getAuth().api.getAccessToken({ body: link });
  return accessToken;
}

export async function getSpotifyStatus(): Promise<SpotifyStatus> {
  const link = await findOwnerSpotifyLink();
  if (!link) return "not-connected";
  try {
    await getSpotifyAccessToken(link);
    return "connected";
  } catch (error) {
    console.error("[spotify] no access token", error);
    return "reconnect-needed";
  }
}
