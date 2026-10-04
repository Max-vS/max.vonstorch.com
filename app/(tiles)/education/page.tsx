import { PanelText } from "@/components/tiles/panel-text";
import { RichText } from "@/components/tiles/rich-text";
import { education, pages } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(pages.education);

export default function EducationPage() {
  return (
    <PanelText>
      <RichText parts={education.body} />
    </PanelText>
  );
}
