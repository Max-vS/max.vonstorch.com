import "server-only";

import { createHmac } from "node:crypto";

/** HMAC of the IP and the UTC day: no raw IP is stored, and the hash cannot link a visitor across days. */
export function hashIp(ip: string, now = new Date()): string {
  const secret = process.env.IP_HASH_SECRET;
  if (!secret) throw new Error("IP_HASH_SECRET is not set");
  const utcDay = now.toISOString().slice(0, 10);
  return createHmac("sha256", secret)
    .update(`${ip}|${utcDay}`)
    .digest("base64url");
}
