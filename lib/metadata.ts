import type { Metadata, Route } from "next";

// Each page sets its own canonical, because one in a layout would be inherited by every page below it.
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string | { absolute: string };
  description: string;
  path: Route;
}): Metadata {
  return { title, description, alternates: { canonical: path } };
}
