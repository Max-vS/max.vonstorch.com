import type { BetterAuthOptions } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import * as schema from "@/lib/db/schema";

// Shared by the runtime instance and the schema generator, so the two never disagree.

export function isOwnerEmail(email: string | null | undefined): boolean {
  const owner = process.env.OWNER_EMAIL?.trim().toLowerCase();
  return Boolean(owner) && email?.trim().toLowerCase() === owner;
}

// Each deployment trusts only its own hosts; unknown hosts are rejected, not redirected to a fallback.
const allowedHosts = [
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  process.env.VERCEL_BRANCH_URL,
  process.env.VERCEL_URL,
  "localhost:3000",
  "127.0.0.1:3000",
].filter((host): host is string => Boolean(host));

export const authOptions = {
  baseURL: { allowedHosts },
  // The provider's default scopes include user:email, so a hidden profile email still arrives.
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    },
  },
  user: {
    // Runs on every GitHub sign-in; GitHub also reports addresses an account never confirmed, so those fail too.
    validateUserInfo: ({ user }) => {
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
  // nextCookies() must stay last: it forwards cookies that other plugins set.
  plugins: [nextCookies()],
} satisfies BetterAuthOptions;

export const adapterOptions = {
  provider: "pg",
  schema,
  // Sign-up writes `user` and then `account`; a transaction stops a half-created owner.
  transaction: true,
} as const;
