import { pages, writing } from "@/content/site";
import { getPosts } from "@/content/writing";
import { SITE_URL } from "@/lib/metadata";

function escapeXml(text: string) {
  return text.replace(/[<>&'"]/g, (char) => `&#${char.charCodeAt(0)};`);
}

export function GET() {
  const items = getPosts().map((post) => {
    const link = post.url ?? `${SITE_URL}/writing/${post.slug}`;
    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid>${escapeXml(link)}</guid>
      <description>${escapeXml(post.summary)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`;
  });

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(writing.feedTitle)}</title>
    <link>${SITE_URL}${pages.writing.path}</link>
    <description>${escapeXml(pages.writing.description)}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/writing/feed.xml" rel="self" type="application/rss+xml"/>${items.join("")}
  </channel>
</rss>
`;

  return new Response(rss, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
