"use client";

import "./globals.css";
import { cn } from "cn";
import { errors } from "@/content/site";
import { SITE_NAME } from "@/lib/metadata";
import ErrorPage from "./error";
import { fontVariables } from "./fonts";

// It replaces the root layout, so it brings its own document, styles and fonts; metadata exports do not work here.
export default function GlobalError({ retry }: { retry: () => void }) {
  return (
    <html
      lang="en"
      className={cn("bg-ground text-ink antialiased", fontVariables)}
    >
      <body className="font-sans">
        <title>{`${errors.failed.kicker} | ${SITE_NAME}`}</title>
        <ErrorPage retry={retry} />
      </body>
    </html>
  );
}
