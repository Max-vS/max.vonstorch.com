"use server";

import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function incrementViews() {
  try {
    const views = await redis.incr("site:views");
    return views;
  } catch (error) {
    console.error("Failed to increment views:", error);
    return 0;
  }
}

export async function getViews() {
  try {
    const views = await redis.get<number>("site:views");
    return views || 0;
  } catch (error) {
    console.error("Failed to get views:", error);
    return 0;
  }
}
