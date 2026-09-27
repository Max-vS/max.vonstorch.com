import { PanelText } from "@/components/tiles/panel-text";
import { index, pages } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: { absolute: "Max von Storch — Founding engineer at Dryft" },
  description: pages.index.description,
  path: pages.index.path,
});

export default function IndexPage() {
  return <PanelText>{index.body}</PanelText>;
}
