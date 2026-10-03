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
    "Max von Storch — founding engineer at Dryft, building AI for manufacturing. Based in San Francisco.",
  // Pages set no twitter object, so each page's og:image also becomes its large card image.
  twitter: { card: "summary_large_image" },
};

// Sets the grid variables before the first paint, so the title block and panel never jump.
const gridScript = `(${setGridVariables})((${measureGrid})(innerWidth, innerHeight))`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The grid script gives <html> a style attribute that the server HTML does not have.
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("bg-ground text-ink antialiased", fontVariables)}
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: the script is our own code, not user input */}
        <script dangerouslySetInnerHTML={{ __html: gridScript }} />
      </head>
      <body className="font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
