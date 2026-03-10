import type { Metadata } from "next";
import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import Footer from "@/components/Footer";
import { helveticaNeue } from "@/lib/fonts";

export const metadata: Metadata = {
  title: {
    default: "MvS",
    template: "%s | MvS",
  },
  description:
    "Max von Storch - Full-Stack Engineer, Designer, and Founder based in San Francisco. Passionate about building products people actually love to use.",
  metadataBase: new URL("https://max.vonstorch.com"),
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  icons: {
    shortcut: "/favicon.svg",
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={helveticaNeue.variable}>
      <head />
      <body className={helveticaNeue.className}>
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
