import GrainEffect from "@/components/GrainEffect";
import ASCIISection from "@/components/sections/ASCIISection";
import ContactSection from "@/components/sections/ContactSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import PersonalSection from "@/components/sections/PersonalSection";
import ProjectSection from "@/components/sections/ProjectSection";
import Shader from "@/components/shader";
import ViewCounter from "@/components/ViewCounter";

export default function Home() {
  return (
    <div className="relative">
      <ViewCounter />
      <GrainEffect />
      <Shader
        videoSrc="https://hhw23zoadoqdwjht.public.blob.vercel-storage.com/american-spirit-2.mp4"
        adaptiveQuality
      />
      <div className="relative flex flex-col">
        <PersonalSection />
        <ASCIISection />
        <ExperienceSection />
        <ProjectSection />
        <ContactSection />
      </div>
    </div>
  );
}
