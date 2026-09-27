import type { Metadata } from "next";
import { Familjen_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "cn";
import { measureGrid, setGridVariables } from "@/lib/tiles/grid";

const familjenGrotesk = Familjen_Grotesk({
  subsets: ["latin"],
  variable: "--font-familjen-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://max.vonstorch.com"),
  title: {
    default: "Max von Storch",
    template: "%s | Max von Storch",
  },
  description:
    "Max von Storch — founding engineer at Dryft, building AI for manufacturing. Based in San Francisco.",
};

// Sets the grid variables before the first paint, so the title block and panel never jump.
const gridScript = `(${setGridVariables})((${measureGrid})(innerWidth, innerHeight))`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The grid script gives <html> a style attribute that the server HTML does not have.
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "bg-ground text-ink antialiased",
        familjenGrotesk.variable,
        jetbrainsMono.variable,
      )}
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: the script is our own code, not user input */}
        <script dangerouslySetInnerHTML={{ __html: gridScript }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
