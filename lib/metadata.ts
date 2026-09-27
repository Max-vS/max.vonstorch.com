import type { Metadata, Route } from "next";

export const SITE_URL = "https://max.vonstorch.com";

// Each page sets its own canonical, because one in a layout would be inherited by every page below it.
export function pageMetadata<T extends string>({
  title,
  description,
  path,
  feed = false,
}: {
  title: string | { absolute: string };
  description: string;
  path: Route<T>;
  feed?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
      types: feed ? { "application/rss+xml": "/writing/feed.xml" } : undefined,
    },
  };
}
