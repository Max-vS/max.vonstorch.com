import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth";
import { getDb } from "@/lib/db";
import { adapterOptions, authOptions } from "./options";

function createAuth() {
  return betterAuth({
    ...authOptions,
    database: drizzleAdapter(getDb(), adapterOptions),
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
