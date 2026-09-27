import { PanelLinks } from "@/components/tiles/panel-links";
import { PanelText } from "@/components/tiles/panel-text";
import { TextLink } from "@/components/ui/text-link";
import { pages, projects } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(pages.projects);

export default function ProjectsPage() {
  return (
    <>
      <PanelText>
        {projects.body} <PanelLinks links={projects.sideProjects} />.
      </PanelText>
      <TextLink
        href={projects.dryft.href}
        className="self-start font-mono text-[length:--spacing(11)] tracking-[0.02em] sm:text-[length:--spacing(13)]"
      >
        {projects.dryft.label}
      </TextLink>
    </>
  );
}
