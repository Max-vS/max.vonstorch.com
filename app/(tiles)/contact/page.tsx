import { PanelLinks } from "@/components/tiles/panel-links";
import { contact, pages } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(pages.contact);

export default function ContactPage() {
  return <PanelLinks links={contact.links} />;
}
