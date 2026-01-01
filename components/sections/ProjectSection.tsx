import { Section, SectionContent, SectionHeader } from "@/components/Section";

interface ProjectItem {
  name: string;
  description: string;
  url: string;
}

export default function ProjectSection() {
  const projectItems: ProjectItem[] = [
    {
      name: "Rémi.fr Website",
      description:
        "A retro-trash inspired website for my friend and artist Rémi.",
      url: "https://www.xn--rmi-bma.fr/",
    },
    {
      name: "OpenEU",
      description: "The Transparency Backbone for the European Union.",
      url: "https://openeu.csee.tech/",
    },
    {
      name: "curava",
      description:
        "Winning Project at CDTM Hacks 2025. A platform for digitizing, managing, and effortlessly sharing medical records with maximum simplicity.",
      url: "https://www.curava.eu/",
    },
  ];

  return (
    <Section>
      <SectionHeader>
        <h2 className="font-medium">Projects</h2>
      </SectionHeader>
      {projectItems.map((item) => (
        <SectionContent key={item.name}>
          <div className="group w-fit">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium leading-tight underline-animate cursor-pointer"
            >
              {item.name}
            </a>
          </div>
          <p>{item.description}</p>
        </SectionContent>
      ))}
    </Section>
  );
}
