// Creates the owner account once per database from OWNER_EMAIL and OWNER_PASSWORD.
//   bun run seed:owner                                              local (.env.development.local)
//   vercel env run -e production -- bun scripts/seed-owner.ts      production; pass OWNER_PASSWORD from the shell

import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { adapterOptions, authOptions } from "@/lib/auth/options";
import { withVerifiedTls } from "@/lib/db/connection-string";
import { user } from "@/lib/db/schema";

const email = process.env.OWNER_EMAIL?.trim().toLowerCase();
const password = process.env.OWNER_PASSWORD;
const url = process.env.DATABASE_URL;
if (!email || !password || !url) {
  throw new Error("Set OWNER_EMAIL, OWNER_PASSWORD and DATABASE_URL");
}

// lib/db cannot be imported here: its `server-only` import throws outside Next.js.
const pool = new Pool({ connectionString: withVerifiedTls(url) });
const db = drizzle({ client: pool });

try {
  const [existing] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (existing) {
    console.log(`Owner ${email} exists; nothing to do.`);
  } else {
    // The app instance has sign-up off, which also blocks server calls, so this one-off instance turns it on.
    const seedAuth = betterAuth({
      ...authOptions,
      // A request-less API call cannot resolve the dynamic base URL.
      baseURL: process.env.BETTER_AUTH_URL,
      database: drizzleAdapter(db, adapterOptions),
      emailAndPassword: {
        ...authOptions.emailAndPassword,
        disableSignUp: false,
        autoSignIn: false,
      },
    });
    await seedAuth.api.signUpEmail({
      body: { email, password, name: "Owner" },
    });
    console.log(`Created owner ${email}.`);
  }
} finally {
  await pool.end();
}
