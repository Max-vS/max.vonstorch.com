import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";
import { withVerifiedTls } from "./lib/db/connection-string";

// drizzle-kit reads no env files; this loads them in the same order as `next dev`.
loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

// Direct (non-pooler) URL, as Neon recommends for migrations.
const url = process.env.DATABASE_URL_UNPOOLED;

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  // drizzle-kit v1 manages every schema by default and would try to drop ones it did not create.
  schemaFilter: ["public"],
  strict: true,
  verbose: true,
  // `generate` needs no database, so only `migrate` fails without a URL.
  ...(url && { dbCredentials: { url: withVerifiedTls(url) } }),
});
