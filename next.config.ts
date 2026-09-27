import createMDX from "@next/mdx";
import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typedRoutes: true,
  // `use cache` + cacheLife/cacheTag replace the route segment configs.
  cacheComponents: true,
};

// Turbopack takes plugins only as package names with JSON options, because functions cannot cross into Rust.
const withMDX = createMDX({
  options: {
    remarkPlugins: [
      "remark-gfm",
      "remark-frontmatter",
      "remark-mdx-frontmatter",
    ],
    rehypePlugins: [
      [
        "@shikijs/rehype",
        {
          themes: { light: "github-light", dark: "github-dark" },
          defaultColor: "light-dark()",
          // Without a language a block would skip Shiki and get the prose colors instead of the theme.
          defaultLanguage: "text",
        },
      ],
      // Last, because the elements it turns into imports are hidden from later rehype plugins.
      "rehype-mdx-import-media",
    ],
  },
});

export default withBotId(withMDX(nextConfig));
