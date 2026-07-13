import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Skills } from "@/components/skills";
import { Projects } from "@/components/project-card";
import { Writeups } from "@/components/writeups";
import { Contact } from "@/components/contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Currently />
      <StatsStrip />
      <Skills />
      <Projects />
      <Writeups />
      <Contact />
    </>
  );
}