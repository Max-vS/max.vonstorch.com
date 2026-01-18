import GrainEffect from "@/components/GrainEffect";
import ASCIIBirdSection from "@/components/sections/ASCIIBirdSection";
import ASCIIHeadshotSection from "@/components/sections/ASCIIHeadshotSection";
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
      <div className="hidden md:block">
        <Shader
          videoSrc="https://hhw23zoadoqdwjht.public.blob.vercel-storage.com/Untitled%20Jan%2017%202026.mp4"
          adaptiveQuality
        />
      </div>
      <div className="relative flex flex-col">
        <PersonalSection />
        <ASCIIHeadshotSection />
        <ExperienceSection />
        <ASCIIBirdSection />
        <ProjectSection />
        <ContactSection />
      </div>
    </div>
  );
}
