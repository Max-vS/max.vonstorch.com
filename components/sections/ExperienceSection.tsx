import { Section, SectionContent, SectionHeader } from "@/components/Section";

interface ExperienceItem {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description?: string;
  url: string;
}

export default function ExperienceSection() {
  const experienceItems: ExperienceItem[] = [
    {
      company: "Dryft",
      role: "Full-Stack Engineer",
      startDate: "2025",
      endDate: "present",
      description:
        "Combining AI agents with mathematical optimization & simulation to automate complex human decisions in manufacturing operations.",
      url: "https://dryft.ai",
    },
    {
      company: "Avelios Medical",
      role: "Frontend Developer",
      startDate: "2025",
      url: "https://www.avelios.com",
    },
    {
      company: "Stealth Startup @ Picus Capital",
      role: "Tech Lead",
      startDate: "2025",
      description:
        "Built full system architecture, backend, and frontend for an automated medical encoding system.",
      url: "https://www.picuscap.com/",
    },
    {
      company: "Kühne+Nagel",
      role: "Data Science Intern",
      startDate: "2021",
      url: "https://www.kuehne-nagel.com",
    },
  ];

  return (
    <Section>
      <SectionHeader>
        <h2 className="font-medium">Experience</h2>
      </SectionHeader>
      {experienceItems.map((item) => (
        <SectionContent key={item.company}>
          <div className="flex flex-row gap-2 justify-between items-end">
            <div className="flex flex-row gap-2">
              <div className="group">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium leading-tight underline-animate cursor-pointer"
                >
                  {item.company}
                </a>
              </div>
              <p>{item.role}</p>
            </div>
            <p className="text-xs italic">
              {item.startDate} {item.endDate ? `- ${item.endDate}` : ""}
            </p>
          </div>
          {item.description && <p className="mt-2">{item.description}</p>}
        </SectionContent>
      ))}
    </Section>
  );
}
