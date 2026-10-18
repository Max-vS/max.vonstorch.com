import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import "./globals.css";
import { cn } from "cn";
import { SITE_NAME, SITE_URL } from "@/lib/metadata";
import { measureGrid, setGridVariables } from "@/lib/tiles/grid";
import { fontVariables } from "./fonts";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Max von Storch is a full-stack engineer, designer and founder. Founding engineer at Dryft in San Francisco, building the autonomous factory.",
  twitter: { card: "summary_large_image" },
};

const gridScript = `(${setGridVariables})((${measureGrid})(innerWidth, innerHeight))`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("bg-ground text-ink antialiased", fontVariables)}
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: our own code, not user input */}
        <script dangerouslySetInnerHTML={{ __html: gridScript }} />
      </head>
      <body className="font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
