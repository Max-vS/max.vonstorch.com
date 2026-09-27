import "server-only";

import { desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import * as z from "zod";
import { getAuth } from "@/lib/auth/auth";
import { isOwnerEmail } from "@/lib/auth/options";
import { getDb } from "@/lib/db";
import { account, user } from "@/lib/db/schema";

export type SpotifyStatus = "connected" | "not-connected" | "reconnect-needed";

const TOP_TRACKS_URL =
  "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=3";

const topTracksSchema = z.object({
  items: z.array(
    z.object({
      name: z.string(),
      artists: z.array(z.object({ name: z.string() })).min(1),
      // The URL becomes a link on the page, so only https passes.
      external_urls: z.object({ spotify: z.url({ protocol: /^https$/ }) }),
    }),
  ),
});

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

/** Null when Spotify is not linked. */
async function fetchTopTracks() {
  const link = await findOwnerSpotifyLink();
  if (!link) return null;
  const res = await fetch(TOP_TRACKS_URL, {
    headers: { Authorization: `Bearer ${await getSpotifyAccessToken(link)}` },
    // A request that hangs inside `use cache` fails the build after 50 seconds.
    signal: AbortSignal.timeout(10_000),
  });
  if (res.status === 429) {
    throw new Error(
      `Spotify rate limit, retry after ${res.headers.get("retry-after")} s`,
    );
  }
  if (!res.ok) throw new Error(`Spotify answered ${res.status}`);
  const { items } = topTracksSchema.parse(await res.json());
  return items.map((item) => ({
    title: item.name,
    artist: item.artists[0].name,
    url: item.external_urls.spotify,
  }));
}

export async function getTopTracks() {
  "use cache";
  cacheTag("spotify");
  const tracks = await fetchTopTracks().catch((error: unknown) => {
    console.error("[spotify] top tracks cannot load", error);
    return null;
  });
  if (!tracks) {
    // A throw would fail the prerender even where the page catches it; the empty list lasts minutes, so a fix or a new link shows soon.
    cacheLife("minutes");
    return [];
  }
  cacheLife("hours");
  return tracks;
}
