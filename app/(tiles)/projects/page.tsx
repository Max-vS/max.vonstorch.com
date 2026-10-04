import { PanelLinks } from "@/components/tiles/panel-links";
import { PanelText } from "@/components/tiles/panel-text";
import { TextLink } from "@/components/ui/text-link";
import { pages, projects } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(pages.projects);

export default function ProjectsPage() {
  return (
    <PanelText>
      {projects.role}{" "}
      <TextLink href={projects.dryft.href}>{projects.dryft.label}</TextLink>,{" "}
      {projects.work} <PanelLinks links={projects.sideProjects} />.
    </PanelText>
  );
}
