import { PanelLinks } from "@/components/tiles/panel-links";
import { PanelText } from "@/components/tiles/panel-text";
import { education, pages } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(pages.education);

export default function EducationPage() {
  return (
    <>
      <PanelText>{education.body}</PanelText>
      <PanelLinks links={education.initiatives} />
    </>
  );
}
