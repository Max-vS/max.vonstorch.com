import { PanelLinks } from "@/components/tiles/panel-links";
import { PanelText } from "@/components/tiles/panel-text";
import { contact, pages } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(pages.contact);

export default function ContactPage() {
  return (
    <PanelText>
      <PanelLinks links={contact.links} />
    </PanelText>
  );
}
