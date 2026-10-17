import createMDX from "@next/mdx";
import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";

const securityHeaders = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  typedRoutes: true,
  cacheComponents: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "i.scdn.co" }],
  },
  headers: async () => [{ source: "/:path*", headers: securityHeaders }],
  redirects: async () =>
    process.env.NODE_ENV === "development"
      ? [
          {
            source: "/:path*",
            has: [{ type: "host", value: "localhost" }],
            destination: "http://127.0.0.1:3000/:path*",
            permanent: false,
          },
        ]
      : [],
};

// Turbopack takes plugins only as package names with JSON options.
const withMDX = createMDX({
  options: {
    remarkPlugins: [
      "remark-gfm",
      "remark-frontmatter",
      "remark-mdx-frontmatter",
      "remark-reading-time",
      "remark-reading-time/mdx",
    ],
    rehypePlugins: [
      [
        "@shikijs/rehype",
        {
          theme: "github-light",
          colorReplacements: { "#fff": "#dce4d6" },
          defaultLanguage: "text",
        },
      ],
      // Last: the elements it turns into imports are hidden from later rehype plugins.
      "rehype-mdx-import-media",
    ],
  },
});

export default withBotId(withMDX(nextConfig));
