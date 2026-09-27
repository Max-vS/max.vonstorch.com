import "server-only";

import { attachDatabasePool } from "@vercel/functions";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { withVerifiedTls } from "./connection-string";

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const pool = new Pool({
    connectionString: withVerifiedTls(url),
    // Vercel: a short idle timeout lets attachDatabasePool release the function soon after a response.
    idleTimeoutMillis: 5_000,
    // Neon: a compute that scaled to zero needs a few seconds to wake.
    connectionTimeoutMillis: 15_000,
  });
  // An idle client dies when Neon suspends, and an unhandled pool error would crash the process.
  pool.on("error", (error) => {
    console.error("[db] idle client error", error);
  });
  attachDatabasePool(pool);

  return drizzle({ client: pool });
}

type Database = ReturnType<typeof createDb>;

// `next dev` re-runs this module on every edit; the global keeps one pool instead of one per edit.
const globalForDb = globalThis as typeof globalThis & { __db?: Database };
let db: Database | undefined;

// Lazy, so importing this module never needs DATABASE_URL (for example during `next build`).
export function getDb(): Database {
  if (process.env.NODE_ENV === "production") {
    db ??= createDb();
    return db;
  }
  globalForDb.__db ??= createDb();
  return globalForDb.__db;
}
