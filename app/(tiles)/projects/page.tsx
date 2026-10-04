import { PanelLinks } from "@/components/tiles/panel-links";
import { PanelText } from "@/components/tiles/panel-text";
import { pages, projects } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(pages.projects);

export default function ProjectsPage() {
  return (
    <PanelText>
      {projects.intro} <PanelLinks links={projects.sideProjects} />.
    </PanelText>
  );
}
