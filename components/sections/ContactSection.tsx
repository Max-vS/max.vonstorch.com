import { Github, Linkedin, type LucideIcon, Mail } from "lucide-react";
import { Section, SectionContent, SectionHeader } from "@/components/Section";

interface ContactItem {
  icon: LucideIcon;
  name: string;
  handle: string;
  url: string;
}

export default function ContactSection() {
  const contactItems: ContactItem[] = [
    {
      icon: Mail,
      name: "Email",
      handle: "maxvonstorch@gmail.com",
      url: "mailto:maxvonstorch@gmail.com",
    },
    {
      icon: Linkedin,
      name: "LinkedIn",
      handle: "Max von Storch",
      url: "https://www.linkedin.com/in/maxvonstorch/",
    },
    {
      icon: Github,
      name: "GitHub",
      handle: "Max-vS",
      url: "https://github.com/Max-vS",
    },
  ];

  return (
    <Section>
      <SectionHeader>
        <h2 className="font-medium">Contact</h2>
      </SectionHeader>
      <SectionContent>
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: "auto auto 1fr" }}
        >
          {contactItems.map((item) => (
            <>
              <item.icon key={`${item.name}-icon`} className="w-4 h-4" />
              <p key={`${item.name}-name`} className="font-medium">
                {item.name}
              </p>
              <div key={`${item.name}-link`} className="group w-fit">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="leading-tight underline-animate cursor-pointer"
                >
                  {item.handle}
                </a>
              </div>
            </>
          ))}
        </div>
      </SectionContent>
    </Section>
  );
}
