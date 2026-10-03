// No `server-only`: drizzle-kit and the seed script import this outside Next.js.

/** Neon URLs say `sslmode=require`, which pg v9 will stop treating as full certificate verification. */
export function withVerifiedTls(url: string): string {
  // Appended so a preview's own URL stays intact; pg reads the last `sslmode`.
  return `${url}${url.includes("?") ? "&" : "?"}sslmode=verify-full`;
}
