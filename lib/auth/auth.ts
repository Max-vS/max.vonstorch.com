import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth";
import { revalidateTag } from "next/cache";
import { getDb } from "@/lib/db";
import { adapterOptions, authOptions } from "./options";

/** Linking and relinking Spotify end in the OAuth callback; a token refresh also updates the account, but inside a render or `use cache`, where revalidateTag throws. */
async function expireTopTracks(
  { providerId }: { providerId: string },
  context: { path: string } | null,
) {
  if (providerId === "spotify" && context?.path === "/callback/:id") {
    revalidateTag("spotify", { expire: 0 });
  }
}

function createAuth() {
  return betterAuth({
    ...authOptions,
    database: drizzleAdapter(getDb(), adapterOptions),
    // Not in options.ts: the schema generator loads that file outside Next.js.
    databaseHooks: {
      account: {
        create: { after: expireTopTracks },
        update: { after: expireTopTracks },
      },
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
export type Session = Auth["$Infer"]["Session"];

let auth: Auth | undefined;

// Built on first use, so `next build` can load this module without DATABASE_URL or BETTER_AUTH_SECRET.
export function getAuth(): Auth {
  auth ??= createAuth();
  return auth;
}
