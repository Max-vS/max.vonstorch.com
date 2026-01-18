import { AsciiArt } from "@/components/AsciiArt";
import { Section, SectionContent } from "@/components/Section";
import { ASCII_HEADSHOT } from "@/lib/ascii-art";

export default function ASCIIHeadshotSection() {
  return (
    <Section noHeader>
      <SectionContent className="p-0 md:p-0">
        <AsciiArt art={ASCII_HEADSHOT} className="text-[5px] leading-[5px]" />
      </SectionContent>
    </Section>
  );
}
