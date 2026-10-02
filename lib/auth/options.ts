import type { BetterAuthOptions } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import * as schema from "@/lib/db/schema";

// Shared by the runtime instance and the schema generator, so the two never disagree.

export function isOwnerEmail(email: string | null | undefined): boolean {
  const owner = process.env.OWNER_EMAIL?.trim().toLowerCase();
  return Boolean(owner) && email?.trim().toLowerCase() === owner;
}

// Each deployment trusts only its own hosts.
const allowedHosts = [
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  process.env.VERCEL_BRANCH_URL,
  process.env.VERCEL_URL,
  "127.0.0.1:3000",
].filter((host): host is string => Boolean(host));

export const authOptions = {
  baseURL: {
    allowedHosts,
    // auth.api calls without a request (the Spotify token read) fail without it; in exchange an unknown host gets this URL instead of an error.
    fallback: process.env.BETTER_AUTH_URL,
  },
  socialProviders: {
    // The provider's default scopes include user:email, so a hidden profile email still arrives.
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    },
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID ?? "",
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? "",
      // The default user-read-email buys nothing: development-mode apps no longer get the email.
      disableDefaultScope: true,
      scope: ["user-top-read"],
      disableSignUp: true,
    },
  },
  account: {
    // A new BETTER_AUTH_SECRET cannot read the stored tokens, so changing it means reconnecting Spotify.
    encryptOAuthTokens: true,
    accountLinking: {
      // Spotify never reports a verified email, and in development mode no email at all.
      trustedProviders: ["spotify"],
      allowDifferentEmails: true,
      // Otherwise a Spotify sign-in with the owner's email would link itself to the owner and get a session.
      disableImplicitLinking: true,
    },
  },
  user: {
    validateUserInfo: ({ user, source }) => {
      // Spotify only feeds the Music page: the signed-in owner links it, and it never creates a user or signs in.
      if (source.oauth?.providerId === "spotify") {
        return source.action === "link-account"
          ? undefined
          : { error: "spotify_link_only" };
      }
      // Runs on every GitHub sign-in; GitHub also reports addresses an account never confirmed, so those fail too.
      if (!isOwnerEmail(user.email) || user.emailVerified !== true) {
        return { error: "owner_only" };
      }
    },
  },
  session: {
    // A cached session cookie would outlive a revoked session.
    cookieCache: { enabled: false },
  },
  rateLimit: {
    // Memory storage is per instance, so it would not limit anything across Vercel functions.
    storage: "database",
  },
  // OAuth errors that come before Better Auth knows where to return (an expired or reused state) land here, not on its own error page.
  onAPIError: { errorURL: "/admin/login" },
  // nextCookies() must stay last: it forwards cookies that other plugins set.
  plugins: [nextCookies()],
} satisfies BetterAuthOptions;

export const adapterOptions = {
  provider: "pg",
  schema,
  // Sign-up writes `user` and then `account`; a transaction stops a half-created owner.
  transaction: true,
} as const;
