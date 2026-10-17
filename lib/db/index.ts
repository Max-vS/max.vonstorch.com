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
    idleTimeoutMillis: 5_000,
    connectionTimeoutMillis: 15_000,
  });
  pool.on("error", (error) => {
    console.error("[db] idle client error", error);
  });
  attachDatabasePool(pool);

  return drizzle({ client: pool });
}

type Database = ReturnType<typeof createDb>;

const globalForDb = globalThis as typeof globalThis & { __db?: Database };
let db: Database | undefined;

export function getDb(): Database {
  if (process.env.NODE_ENV === "production") {
    db ??= createDb();
    return db;
  }
  globalForDb.__db ??= createDb();
  return globalForDb.__db;
}
