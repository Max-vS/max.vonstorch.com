import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth";
import { drizzle } from "drizzle-orm/node-postgres";
import { adapterOptions, authOptions } from "./options";

// Entry point for `bun run auth:gen` only: the generator never queries, and lib/db's `server-only` import cannot load in the CLI.
export const auth = betterAuth({
  ...authOptions,
  database: drizzleAdapter(drizzle.mock(), adapterOptions),
});
