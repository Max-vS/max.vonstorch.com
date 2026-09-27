import type { MetadataRoute } from "next";
import { pages } from "@/content/site";
import { getLocalPosts } from "@/content/writing";
import { SITE_URL } from "@/lib/metadata";

// Google ignores priority and changefreq and trusts lastmod only when it is accurate, so only posts carry a date.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...Object.values(pages).map(({ path }) => ({ url: `${SITE_URL}${path}` })),
    { url: `${SITE_URL}/writing/archive` },
    ...getLocalPosts().map((post) => ({
      url: `${SITE_URL}/writing/${post.slug}`,
      lastModified: post.updated ?? post.date,
    })),
  ];
}
