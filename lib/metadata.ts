import type { Metadata, Route } from "next";

export const SITE_URL = "https://max.vonstorch.com";
export const SITE_NAME = "Max von Storch";

export function pageMetadata<T extends string>({
  title,
  description,
  path,
  feed = false,
  article,
}: {
  title: string | { absolute: string };
  description: string;
  path: Route<T>;
  feed?: boolean;
  article?: { publishedTime: string; modifiedTime: string };
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
      types: feed ? { "application/rss+xml": "/writing/feed.xml" } : undefined,
    },
    openGraph: article
      ? { type: "article", url: path, siteName: SITE_NAME, ...article }
      : { type: "website", url: path, siteName: SITE_NAME },
  };
}
