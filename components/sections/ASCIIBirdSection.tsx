import { AsciiArt } from "@/components/AsciiArt";
import { Section, SectionContent } from "@/components/Section";
import { ASCII_BIRDS } from "@/lib/ascii-art";

export default function ASCIIProfileSection() {
  return (
    <Section noHeader>
      <SectionContent className="p-0 md:p-0">
        <AsciiArt art={ASCII_BIRDS} className="text-[4px] leading-1" />
      </SectionContent>
    </Section>
  );
}
