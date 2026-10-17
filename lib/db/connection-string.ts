// No `server-only`: drizzle-kit imports this outside Next.js.

// pg reads the last `sslmode`; Neon's `require` will stop meaning full verification in pg v9.
export function withVerifiedTls(url: string): string {
  return `${url}${url.includes("?") ? "&" : "?"}sslmode=verify-full`;
}
