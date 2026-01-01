import { AsciiArt } from "@/components/AsciiArt";
import { Section, SectionContent } from "@/components/Section";
import { ASCII_HEADSHOT } from "@/lib/ascii-art";

export default function ASCIISection() {
  return (
    <Section>
      <SectionContent className="p-0">
        <AsciiArt
          art={ASCII_HEADSHOT}
          className="text-[5px] leading-[5px] w-full block overflow-hidden"
        />
      </SectionContent>
    </Section>
  );
}
