import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";
import { withVerifiedTls } from "./lib/db/connection-string";

loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

const url = process.env.DATABASE_URL_UNPOOLED;

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  // drizzle-kit v1 manages every schema by default and would drop ones it did not create.
  schemaFilter: ["public"],
  strict: true,
  verbose: true,
  ...(url && { dbCredentials: { url: withVerifiedTls(url) } }),
});
