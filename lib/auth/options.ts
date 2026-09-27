import type { BetterAuthOptions } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import * as schema from "@/lib/db/schema";

// Shared by the runtime instance, the schema generator and the seed script, so the three never disagree.

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
  emailAndPassword: {
    enabled: true,
    // Also blocks server-side sign-up; scripts/seed-owner.ts creates the owner.
    disableSignUp: true,
    minPasswordLength: 12,
  },
  user: {
    validateUserInfo: ({ user }) => {
      if (!isOwnerEmail(user.email)) return { error: "owner_only" };
    },
  },
  session: {
    // A cached session cookie would outlive a revoked session.
    cookieCache: { enabled: false },
  },
  rateLimit: {
    // Memory storage is per instance, so it would not limit anything across Vercel functions.
    storage: "database",
    customRules: { "/sign-in/email": { window: 15 * 60, max: 5 } },
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
