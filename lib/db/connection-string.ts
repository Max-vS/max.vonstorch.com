// No `server-only`: drizzle-kit and the seed script import this outside Next.js.

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

/** Neon URLs say `sslmode=require`, which pg v9 will stop treating as full certificate verification. */
export function withVerifiedTls(url: string): string {
  // Local PGlite speaks no TLS.
  if (LOCAL_HOSTS.has(new URL(url).hostname)) return url;
  // Appended so a preview's own URL stays intact; pg reads the last `sslmode`.
  return `${url}${url.includes("?") ? "&" : "?"}sslmode=verify-full`;
}
