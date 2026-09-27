import type { Metadata } from "next";
import { Familjen_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "cn";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-ground text-ink antialiased",
        familjenGrotesk.variable,
        jetbrainsMono.variable,
      )}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
