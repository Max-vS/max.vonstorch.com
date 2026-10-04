import createMDX from "@next/mdx";
import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typedRoutes: true,
  // `use cache` + cacheLife/cacheTag replace the route segment configs.
  cacheComponents: true,
  images: {
    // Spotify's album covers on the Music page.
    remotePatterns: [{ protocol: "https", hostname: "i.scdn.co" }],
  },
  // OAuth and Spotify accept only 127.0.0.1 locally, so a localhost tab would sign in against an unknown callback.
  async redirects() {
    if (process.env.NODE_ENV !== "development") return [];
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "localhost" }],
        destination: "http://127.0.0.1:3000/:path*",
        permanent: false,
      },
    ];
  },
};

// Turbopack takes plugins only as package names with JSON options, because functions cannot cross into Rust.
const withMDX = createMDX({
  options: {
    remarkPlugins: [
      "remark-gfm",
      "remark-frontmatter",
      "remark-mdx-frontmatter",
      // Exports `readingTime` from each post; the second plugin must follow the first.
      "remark-reading-time",
      "remark-reading-time/mdx",
    ],
    rehypePlugins: [
      [
        "@shikijs/rehype",
        {
          theme: "github-light",
          // The design's sage code background in place of the theme's white; the site has no dark mode.
          colorReplacements: { "#fff": "#dce4d6" },
          // Without a language a block would skip Shiki and get the page colors instead of the theme.
          defaultLanguage: "text",
        },
      ],
      // Last, because the elements it turns into imports are hidden from later rehype plugins.
      "rehype-mdx-import-media",
    ],
  },
});

export default withBotId(withMDX(nextConfig));
