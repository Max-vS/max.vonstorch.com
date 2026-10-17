import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth";
import { drizzle } from "drizzle-orm/node-postgres";
import { adapterOptions, authOptions } from "./options";

export const auth = betterAuth({
  ...authOptions,
  database: drizzleAdapter(drizzle.mock(), adapterOptions),
});
