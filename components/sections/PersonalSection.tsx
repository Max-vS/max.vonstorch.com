import Image from "next/image";
import { Section, SectionContent, SectionHeader } from "@/components/Section";
import { SpotifyTopTrack } from "@/components/SpotifyTopTrack";

export default function PersonalSection() {
  return (
    <Section>
      <SectionHeader className="hidden md:pt-12 md:flex">
        <Image
          src="/logo-molten.svg"
          alt="Stork Logo"
          width={30}
          height={30}
          priority
        />
      </SectionHeader>
      <SectionContent className="flex flex-col gap-6 md:pt-10 text-sm">
        <div className="flex flex-col">
          <h1 className="text-xl text-charcoal font-medium">Max von Storch</h1>
          <p className="font-normal">Full-Stack Engineer, Designer, Founder</p>
        </div>
        <p>
          Passionate about music, film, design, philosophy and building
          something people actually love to use.
        </p>
        <SpotifyTopTrack />
      </SectionContent>
    </Section>
  );
}
