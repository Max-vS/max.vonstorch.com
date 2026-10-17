import type { BetterAuthOptions } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import * as schema from "@/lib/db/schema";

export function isOwnerEmail(email: string | null | undefined): boolean {
  const owner = process.env.OWNER_EMAIL?.trim().toLowerCase();
  return Boolean(owner) && email?.trim().toLowerCase() === owner;
}

const allowedHosts = [
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  process.env.VERCEL_BRANCH_URL,
  process.env.VERCEL_URL,
  "127.0.0.1:3000",
].filter((host): host is string => Boolean(host));

export const authOptions = {
  baseURL: {
    allowedHosts,
    fallback: process.env.BETTER_AUTH_URL,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    },
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID ?? "",
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? "",
      disableDefaultScope: true,
      scope: ["user-top-read"],
      disableSignUp: true,
    },
  },
  account: {
    encryptOAuthTokens: true,
    accountLinking: {
      trustedProviders: ["spotify"],
      allowDifferentEmails: true,
      // Otherwise a Spotify sign-in with the owner's email would link itself to the owner and get a session.
      disableImplicitLinking: true,
    },
  },
  user: {
    validateUserInfo: ({ user, source }) => {
      if (source.oauth?.providerId === "spotify") {
        return source.action === "link-account"
          ? undefined
          : { error: "spotify_link_only" };
      }
      if (!isOwnerEmail(user.email) || user.emailVerified !== true) {
        return { error: "owner_only" };
      }
    },
  },
  session: { cookieCache: { enabled: false } },
  rateLimit: {
    // Memory storage is per function instance and would limit nothing on Vercel.
    storage: "database",
  },
  onAPIError: { errorURL: "/admin/login" },
  // nextCookies() must stay last: it forwards cookies that other plugins set.
  plugins: [nextCookies()],
} satisfies BetterAuthOptions;

export const adapterOptions = {
  provider: "pg",
  schema,
  transaction: true,
} as const;
