import { Hero } from "@/components/hero";
import { Currently } from "@/components/currently";
import { StatsStrip } from "@/components/stats-strip";
import { Skills } from "@/components/skills";
import { Projects } from "@/components/project-card";
import { Writeups } from "@/components/writeups";
import { Contact } from "@/components/contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Currently />
      <StatsStrip />
      <Skills />
      <Projects />
      <Writeups />
      <Contact />
    </>
  );
}